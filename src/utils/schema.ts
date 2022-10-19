class AssertionError extends Error {}

abstract class Validator<T> {
	name: string;
	readonly type: string | null;

	constructor(name = "schema", type: string | null) {
		this.name = name;
		this.type = type;
	}

	abstract assert(val: unknown): asserts val is T;

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
	readonly message: string;

	constructor(
		base: Validator<C>,
		message?: string,
		type: string | null = null,
		name = "schema"
	) {
		super(name ?? base.name, type ?? base.type);
		this.base = base;
		this.message = message ?? `Expected ${type}`;
	}

	assert(val: unknown): asserts val is R {
		this.base.assert(val);
		if (!this.condition(val)) {
			throw new AssertionError(this.message);
		}
	}

	protected abstract condition(val: C): val is R;

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
			`Expected one of: ${options.map((o) => JSON.stringify(o)).join(", ")}`
		);
		this.options = options;
	}

	protected condition(val: C): val is C & O {
		this.options.forEach((opt) => {
			if (val === opt) return true;
		});
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
		super("value", null);
	}

	assert(val: unknown): asserts val is unknown {}
}

class TypeSchema<T> extends SchemaCondition<unknown, T> {
	readonly name: string;

	constructor(type: string | null, name = "value") {
		super(new BaseValidator(), `Expected type ${type}`, type, name);
		this.name = name;
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

class ObjectSchema<T extends Record<string, unknown>> extends TypeSchema<T> {
	private readonly fieldValidators: ObjectFieldValidators<T>;

	constructor(fields: ObjectFieldValidators<T>, name?: string) {
		super("object", name);
		for (const key in fields) {
			fields[key].name = `${this.name}.${key}`;
		}
		this.fieldValidators = fields;
	}

	protected condition(val: unknown): val is T {
		if (typeof val != "object") return false;
		if (val == null) return false;
		for (let key in this.fieldValidators) {
			const fieldValidator = this.fieldValidators[key] as Validator<T[string]>;
			fieldValidator.assert.call(
				fieldValidator,
				(val as Record<string, unknown>)[key]
			);
		}
		return true;
	}
}

class ArraySchema<T extends unknown[]> extends TypeSchema<T> {
	private readonly valueValidator: Validator<T[number]>;

	constructor(values: Validator<T[number]>, name?: string) {
		super("array", name ?? `${values.name}[]`);
		this.valueValidator = values;
	}

	protected condition(val: unknown): val is T {
		if (!Array.isArray(val)) return false;
		for (const item in val) {
			this.valueValidator.assert(item);
		}
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

	object<T extends Record<string, unknown>>(
		fields: ObjectFieldValidators<T>,
		name?: string
	): ObjectSchema<T> {
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

	array<T extends unknown[]>(values: Validator<T[number]>, name?: string) {
		return new ArraySchema(values, name);
	}
};

export default schema;

export type { Validator };
