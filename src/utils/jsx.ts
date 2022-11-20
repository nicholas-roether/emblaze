function omitProps<T, K extends keyof T>(props: T, ...omit: K[]): Omit<T, K> {
	const result: Record<string, unknown> = {};
	for (const name in props) {
		if ((omit as string[]).includes(name)) continue;
		result[name] = props[name];
	}
	return result as Omit<T, K>;
}

export { omitProps };
