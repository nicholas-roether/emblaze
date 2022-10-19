class AssertionError extends Error {}

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
			if (err instanceof AssertionError) return false;
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
		this.base.assert(val);
		if (!this.condition(val, name)) {
			throw new AssertionError(
				`Unexpected value for ${name} (${val}): ${this.message}`
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

	assert(val: unknown): asserts val is unknown {}
}

class TypeSchema<T> extends SchemaCondition<unknown, T> {
	constructor(type: string | null, name = "value") {
		super(new BaseValidator(), `Expected type ${type}`, type, name);
	}

	protected condition(val: unknown, name: string): val is T {
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

class UnionSchema<T> extends TypeSchema<T> {
	private readonly options: Validator<T>[];

	constructor(options: Validator<T>[], name = "union") {
		super(null, name);
		this.options = options;
	}

	protected condition(val: T): val is T {
		for (const option of this.options) {
			if (option.check(val)) return true;
		}
		return false;
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
		for (let key in this.fieldValidators) {
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

class UndefinedSchema extends TypeSchema<undefined> {
	constructor() {
		super("undefined");
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

	union<T>(options: Validator<T>[], name?: string) {
		return new UnionSchema(options, name);
	},

	optional<T>(validator: Validator<T>): UnionSchema<T | undefined> {
		return schema.union([schema.undefined(), validator]);
	},

	array<T>(values: Validator<T>, name?: string): ArraySchema<T[]> {
		return new ArraySchema(values, name);
	}
};

export default schema;

export type { Validator };
