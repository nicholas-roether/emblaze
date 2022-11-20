import jss, { SheetsRegistry, Styles } from "jss";
import preset from "jss-preset-default";
import theme from "~/theme";
import { Theme } from "./theming";

jss.setup(preset());

const styleSheets = new SheetsRegistry();

type RawStylesDef<K extends string> = Partial<Styles<K, unknown, undefined>>;

type StylesDef<K extends string> =
	| RawStylesDef<K>
	| ((theme: Theme) => RawStylesDef<K>);

function applyTheme<K extends string, D extends RawStylesDef<K>>(
	stylesDef: D | ((theme: Theme) => D)
): D {
	return stylesDef instanceof Function ? stylesDef(theme) : stylesDef;
}

function css<K extends string>(stylesDef: StylesDef<K>): Record<K, string> {
	const styles = applyTheme(stylesDef);
	const sheet = jss.createStyleSheet(styles);
	styleSheets.add(sheet);
	console.log(sheet.classes);
	return sheet.classes;
}

function renderStyleSheets(): string {
	const styles = styleSheets.toString();
	return styles;
}

function hydrateStyleSheets() {
	const insertionPoint = document.head.querySelector("style#jss");
	if (!insertionPoint || !(insertionPoint instanceof HTMLElement)) {
		throw new Error(
			"Style hydration failed: could not find jss insertion point!"
		);
	}
	console.log(styleSheets.toString());
	insertionPoint.innerHTML = styleSheets.toString();
}

type ClassSpecifier = string | Record<string, boolean> | null | undefined;

function cls(...specifiers: ClassSpecifier[]) {
	const classes: string[] = [];
	specifiers.forEach((specifier) => {
		if (!specifier) return;
		if (typeof specifier === "string") classes.push(specifier);
		else {
			Object.entries(specifier).forEach(([className, shouldRender]) => {
				if (shouldRender) classes.push(className);
			});
		}
	});
	return classes.join(" ");
}

export { css, cls, renderStyleSheets, hydrateStyleSheets };

export type { StylesDef, ClassSpecifier };
