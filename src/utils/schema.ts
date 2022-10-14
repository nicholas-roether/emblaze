interface Validator<T> {
	type: string | null;
	check(val: unknown): val is T;
}

abstract class SchemaCondition<C, R extends C> implements Validator<R> {
	private base: Validator<C>;
	type: string | null;

	constructor(base: Validator<C>, type: string | null = null) {
		this.base = base;
		this.type = type ?? base.type;
	}

	check(val: unknown): val is R {
		if (!this.base.check(val)) return false;
		return this.condition(val);
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
	private options: O[];

	constructor(base: Validator<C>, options: O[]) {
		super(base);
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
	private value: T;

	constructor(base: Validator<C>, value: T) {
		super(base);
		this.value = value;
	}

	protected condition(val: C): val is T {
		return val === this.value;
	}
}

class IntegerCondition<C extends number> extends SchemaCondition<C, C> {
	protected condition(val: C): val is C {
		return Number.isInteger(val);
	}
}

class TypeSchema<T> extends SchemaCondition<T, T> {
	constructor(type: string | null) {
		super({ type, check: (val): val is T => !type || typeof val === type });
	}

	protected condition(val: T): val is T {
		return true;
	}
}

class StringSchema extends TypeSchema<string> {
	constructor() {
		super("string");
	}
}

class NumberSchema extends TypeSchema<number> {
	constructor() {
		super("number");
	}
}

class UnionSchema<T> extends TypeSchema<T> {
	private options: Validator<T>[];

	constructor(options: Validator<T>[]) {
		super(null);
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
	private fieldValidators: ObjectFieldValidators<T>;

	constructor(fields: ObjectFieldValidators<T>) {
		super("object");
		this.fieldValidators = fields;
	}

	protected condition(val: T): val is T {
		if (val == null) return false;
		for (let key in val) {
			if (!this.fieldValidators[key].check(val[key])) return false;
		}
		return true;
	}
}

const schema = {
	string(): StringSchema {
		return new StringSchema();
	},

	number(): NumberSchema {
		return new NumberSchema();
	},

	object<T extends Record<string, unknown>>(
		fields: ObjectFieldValidators<T>
	): ObjectSchema<T> {
		return new ObjectSchema(fields);
	},

	union<T>(...options: Validator<T>[]) {
		return new UnionSchema(options);
	}
};

export default schema;

export type { Validator };
