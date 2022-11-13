type ClassSpecifier = string | [string, boolean] | [string[], boolean];

function cls(...specifiers: ClassSpecifier[]) {
	const classes: string[] = [];
	specifiers.forEach((specifier) => {
		if (typeof specifier === "string") classes.push(specifier);
		if (specifier[1]) {
			if (typeof specifier[0] === "string") classes.push(specifier[0]);
			else classes.push(specifier[0].join(" "));
		}
	});
	return classes.join(" ");
}

export { cls };

export type { ClassSpecifier };
