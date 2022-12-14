class ValidationError extends Error {
	public actual: unknown;

	constructor(message: string, actual: unknown) {
		super(message);
		this.actual = actual;
	}
}

abstract class Validator<T> {
	readonly type: string | null;

	constructor(type: string | null) {
		this.type = type;
	}

	abstract assert(val: unknown, name?: string): asserts val is T;

	assertOr(val: unknown, error: Error): asserts val is T {
		try {
			this.assert(val);
		} catch (err) {
			error.cause = err;
			throw error;
		}
	}

	check(val: unknown): val is T {
		try {
			this.assert(val);
			return true;
		} catch (err) {
			if (err instanceof ValidationError) return false;
			throw err;
		}
	}
}

abstract class SchemaCondition<C, R extends C> extends Validator<R> {
	private readonly base: Validator<C>;
	readonly defaultName: string;
	readonly message: string;

	constructor(
		base: Validator<C>,
		message?: string,
		type: string | null = null,
		defaultName?: string
	) {
		super(type ?? base.type);
		this.base = base;
		this.defaultName =
			defaultName ??
			(this.base instanceof SchemaCondition ? this.base.defaultName : "value");
		this.message = message ?? `Expected ${type}`;
	}

	assert(val: unknown, name = this.defaultName): asserts val is R {
		this.base.assert(val, name);
		if (!this.condition(val, name)) {
			throw new ValidationError(
				`Unexpected value ${JSON.stringify(val)} for ${name}: ${this.message}`,
				val
			);
		}
	}

	protected abstract condition(val: C, name: string): val is R;

	oneOf<O extends R>(...options: O[]): OptionCondition<R, O> {
		return new OptionCondition(this, options);
	}

	exact<T extends R>(value: T): ExactCondition<R, T> {
		return new ExactCondition(this, value);
	}

	integer(): R extends number ? IntegerCondition<R> : never {
		if (this.type !== "number")
			throw new Error("integer() can only be used on number schemas!");
		return new IntegerCondition(this as Validator<number>) as R extends number
			? IntegerCondition<R>
			: never;
	}
}

class OptionCondition<C, O extends C> extends SchemaCondition<C, C & O> {
	private readonly options: O[];

	constructor(base: Validator<C>, options: O[]) {
		super(
			base,
			`Expected one of: ${options.map((o) => JSON.stringify(o)).join(", ")}`,
			"union"
		);
		this.options = options;
	}

	protected condition(val: C): val is C & O {
		for (const opt of this.options) {
			if (val === opt) return true;
		}
		return false;
	}
}

class ExactCondition<C, T extends C> extends SchemaCondition<C, T> {
	private readonly value: T;

	constructor(base: Validator<C>, value: T) {
		super(base, `Expected: ${JSON.stringify(value)}`);
		this.value = value;
	}

	protected condition(val: C): val is T {
		return val === this.value;
	}
}

class IntegerCondition<C extends number> extends SchemaCondition<C, C> {
	constructor(base: Validator<C>) {
		super(base, `Expected integer`);
	}

	protected condition(val: C): val is C {
		return Number.isInteger(val);
	}
}

class BaseValidator extends Validator<unknown> {
	constructor() {
		super(null);
	}

	assert(val: unknown): asserts val is unknown {
		return;
	}
}

class TypeSchema<T> extends SchemaCondition<unknown, T> {
	constructor(type: string | null, name = "value") {
		super(new BaseValidator(), `Expected type ${type}`, type, name);
	}

	protected condition(val: unknown): val is T {
		return typeof val === this.type;
	}
}

class StringSchema extends TypeSchema<string> {
	constructor(name = "string") {
		super("string", name);
	}
}

class NumberSchema extends TypeSchema<number> {
	constructor(name = "number") {
		super("number", name);
	}
}

class OneOfSchema<A, B> extends SchemaCondition<unknown, A | B> {
	private readonly option1: Validator<A>;
	private readonly option2: Validator<B>;

	constructor(option1: Validator<A>, option2: Validator<B>, name = "union") {
		super(new BaseValidator(), "No option was matched", null, name ?? "union");
		this.option1 = option1;
		this.option2 = option2;
	}

	protected condition(val: unknown, name?: string): val is A | B {
		const errors: ValidationError[] = [];

		for (const option of [this.option1, this.option2]) {
			try {
				option.assert(val, name);
				return true;
			} catch (err) {
				if (err instanceof ValidationError) errors.push(err);
				else throw err;
			}
		}
		let errMsg = "No option in union was matched.\n";
		errors.forEach((err, i) => {
			errMsg += `\tOption ${i}: ${err.message}\n`;
		});
		throw new ValidationError(errMsg, val);
	}
}

type ObjectFieldValidators<T> = { [K in keyof T]: Validator<T[K]> };

class ObjectSchema<T> extends SchemaCondition<unknown, T> {
	private readonly fieldValidators: ObjectFieldValidators<T>;

	constructor(fields: ObjectFieldValidators<T>, name?: string) {
		super(new BaseValidator(), "Expected object", "object", name ?? "object");
		this.fieldValidators = fields;
	}

	protected condition(val: unknown, name: string): val is T {
		if (typeof val != "object") return false;
		if (val == null) return false;
		for (const key in this.fieldValidators) {
			const fieldValidator = this.fieldValidators[key];
			fieldValidator.assert.call(
				fieldValidator,
				(val as Record<string, unknown>)[key],
				`${name}.${key}`
			);
		}
		return true;
	}
}

class ArraySchema<T extends unknown[]> extends SchemaCondition<unknown, T> {
	private readonly valueValidator: Validator<T[number]>;

	constructor(values: Validator<T[number]>, name?: string) {
		super(new BaseValidator(), "Expected array", "array", name ?? "array");
		this.valueValidator = values;
	}

	protected condition(val: unknown, name?: string): val is T {
		if (!Array.isArray(val)) return false;
		val.forEach((item, i) => {
			this.valueValidator.assert(item, `${name}[${i}]`);
		});
		return true;
	}
}

class RecordSchema<
	K extends string | number | symbol,
	V
> extends SchemaCondition<unknown, Record<K, V>> {
	private readonly keyValidator: Validator<K>;
	private readonly valueValidator: Validator<V>;

	constructor(keys: Validator<K>, values: Validator<V>, name?: string) {
		super(new BaseValidator(), "Expected record", "object", name ?? "record");
		this.keyValidator = keys;
		this.valueValidator = values;
	}

	protected condition(val: unknown, name?: string): val is Record<K, V> {
		if (typeof val != "object" || !val) return false;
		Object.entries(val).forEach(([key, value]) => {
			this.keyValidator.assert(key, `${name}::${key}`);
			this.valueValidator.assert(value, `${name}.${key}`);
		});
		return true;
	}
}

class NeverSchema extends SchemaCondition<unknown, never> {
	constructor(name?: string) {
		super(new BaseValidator(), "Expected nothing", null, name);
	}

	protected condition(val: unknown): val is never {
		return false;
	}
}

class InstanceOfSchema<T> extends SchemaCondition<unknown, T> {
	private readonly class: new (...args: unknown[]) => T;

	constructor(constructor: new (...args: unknown[]) => T, name?: string) {
		super(
			new BaseValidator(),
			`Expected instance of ${constructor.name}`,
			null,
			name
		);
		this.class = constructor;
	}

	protected condition(val: unknown): val is T {
		return val instanceof this.class;
	}
}

class UndefinedSchema extends TypeSchema<undefined> {
	constructor() {
		super("undefined");
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
class AnySchema extends SchemaCondition<unknown, {}> {
	constructor() {
		super(new BaseValidator(), "Expected a value");
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	protected condition(val: unknown): val is {} {
		return !!val;
	}
}

const schema = {
	string(name?: string): StringSchema {
		return new StringSchema(name);
	},

	number(name?: string): NumberSchema {
		return new NumberSchema(name);
	},

	object<T>(fields: ObjectFieldValidators<T>, name?: string): ObjectSchema<T> {
		return new ObjectSchema(fields, name);
	},

	undefined(): UndefinedSchema {
		return new UndefinedSchema();
	},

	oneOf<A, B>(
		option1: Validator<A>,
		option2: Validator<B>,
		name?: string
	): OneOfSchema<A, B> {
		return new OneOfSchema(option1, option2, name);
	},

	optional<T>(validator: Validator<T>): OneOfSchema<T, undefined> {
		return schema.oneOf(validator, schema.undefined());
	},

	// eslint-disable-next-line @typescript-eslint/ban-types
	any(): Validator<{}> {
		return new AnySchema();
	},

	unknown(): Validator<unknown> {
		return new BaseValidator();
	},

	never(): Validator<never> {
		return new NeverSchema();
	},

	array<T>(values: Validator<T>, name?: string): ArraySchema<T[]> {
		return new ArraySchema(values, name);
	},

	record<K extends string | number | symbol, V>(
		keys: Validator<K>,
		values: Validator<V>,
		name?: string
	): RecordSchema<K, V> {
		return new RecordSchema(keys, values, name);
	},

	instanceOf<T>(
		constructor: new (...args: unknown[]) => T,
		name?: string
	): InstanceOfSchema<T> {
		return new InstanceOfSchema(constructor, name);
	}
};

export default schema;

export { ValidationError };
export type { Validator };
