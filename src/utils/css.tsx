import jss, { SheetsRegistry, Styles } from "jss";
import md5 from "md5";
import preset from "jss-preset-default";
import { isServer } from "solid-js/web";
import theme from "~/theme";
import { Theme } from "./theming";
import { Component, Show } from "solid-js";

jss.setup(preset());

const styleSheets = new SheetsRegistry();
const classNameMap: Record<
	string,
	Record<string, string | undefined> | undefined
> = loadClassNameMap();

type RawStylesDef<K extends string> = Partial<Styles<K, unknown, undefined>>;

type StylesDef<K extends string> =
	| RawStylesDef<K>
	| ((theme: Theme) => RawStylesDef<K>);

function loadClassNameMap() {
	if (isServer) return {};
	const styleSheet = document.head.querySelector("style#component-styles");
	if (!styleSheet || !(styleSheet instanceof HTMLElement)) {
		throw new Error(
			"Could not find component styles stylesheet! Make sure to include <ComponentStyles /> in root.tsx."
		);
	}
	const classNameMapJSON = styleSheet.dataset.classNameMap;
	if (!classNameMapJSON)
		throw new Error("Missing component style class name map!");
	return JSON.parse(classNameMapJSON);
}

function applyTheme<K extends string, D extends RawStylesDef<K>>(
	stylesDef: D | ((theme: Theme) => D)
): D {
	return stylesDef instanceof Function ? stylesDef(theme) : stylesDef;
}

function css<K extends string>(stylesDef: StylesDef<K>): Record<K, string> {
	const styles = applyTheme(stylesDef);
	const stylesHash = md5(JSON.stringify(styles));

	if (!isServer) {
		const classNames = classNameMap[stylesHash];
		if (!classNames) {
			throw new Error(`client/server discrepancy: missing class name map`);
		}
		for (const className in styles) {
			if (!(className in classNames)) {
				throw new Error(
					`client/server discrepancy: missing class name '${className}'`
				);
			}
		}
		return classNames as Record<K, string>;
	}

	const sheet = jss.createStyleSheet(styles);
	styleSheets.add(sheet);
	classNameMap[stylesHash] = sheet.classes;
	return sheet.classes;
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

const ComponentStyles: Component = () => {
	return (
		<Show when={isServer}>
			<style
				id="component-styles"
				data-class-name-map={JSON.stringify(classNameMap)}
			>
				{styleSheets.toString()}
			</style>
		</Show>
	);
};

export { css, cls, ComponentStyles };

export type { StylesDef, ClassSpecifier };
