type MakeOptional<T, O extends keyof T> = Partial<Pick<T, O>> &
	Pick<T, Exclude<keyof T, O>>;

export type { MakeOptional };
