import jss, { SheetsRegistry, Styles } from "jss";
import md5 from "md5";
import preset from "jss-preset-default";
import { isServer } from "solid-js/web";
import theme from "~/theme";
import { Theme } from "./theming";
import { Component, Show } from "solid-js";
import { Style } from "solid-start";

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

function loadClassNamesFromMap<K extends string>(
	stylesHash: string,
	styles: Partial<Styles<K, unknown, undefined>>
): Record<K, string> | null {
	const classNames = classNameMap[stylesHash];
	if (!classNames) return null;
	for (const className in styles) {
		if (!(className in classNames)) return null;
	}
	return classNames as Record<K, string>;
}

function insertDynamicStyles<K extends string>(
	stylesHash: string,
	styles: Partial<Styles<K, unknown, undefined>>
): Record<K, string> {
	const id = `dynamic-styles-${stylesHash}`;
	const previous = document.getElementById(id);
	if (previous) previous.remove();

	const elem = document.createElement("style");
	const sheet = jss.createStyleSheet(styles);
	const css = sheet.toString({ format: false });
	elem.id = id;
	elem.innerHTML = css;
	document.head.appendChild(elem);
	return sheet.classes;
}

function css<K extends string>(stylesDef: StylesDef<K>): Record<K, string> {
	const styles = applyTheme(stylesDef);
	const stylesHash = md5(JSON.stringify(styles));

	if (!isServer) {
		const classNames = loadClassNamesFromMap(stylesHash, styles);
		if (classNames) return classNames as Record<K, string>;
		else return insertDynamicStyles(stylesHash, styles);
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
			<Style
				id="component-styles"
				data-class-name-map={JSON.stringify(classNameMap).replaceAll(
					'"',
					"&quot;"
				)}
			>
				{styleSheets.toString({ format: false })}
			</Style>
		</Show>
	);
};

export { css, cls, ComponentStyles };

export type { StylesDef, ClassSpecifier };
