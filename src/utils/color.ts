type ColorShade =
	| "50"
	| "100"
	| "200"
	| "300"
	| "400"
	| "500"
	| "600"
	| "700"
	| "800"
	| "900";

type ColorShades = Record<ColorShade, string>;

const shadeMap: Record<ColorShade, number> = {
	"50": -0.9,
	"100": -0.8,
	"200": -0.6,
	"300": -0.4,
	"400": -0.2,
	"500": 0.0,
	"600": 0.2,
	"700": 0.4,
	"800": 0.6,
	"900": 0.8
};

function hexToRGB(hex: string): [r: number, g: number, b: number] {
	hex = hex.replace(/^#/, "");
	if (hex.length !== 6) throw new Error("Only RGB hex colors are supported!");
	const colorAsInt = Number.parseInt(hex, 16);
	return [colorAsInt >> 16, (colorAsInt >> 8) % 256, colorAsInt % 256];
}

function rgbToHex(r: number, g: number, b: number) {
	const colorAsInt = (r << 16) | (g << 8) | b;
	let hexString = colorAsInt.toString(16);
	while (hexString.length < 6) hexString = "0" + hexString;
	return "#" + hexString;
}

const INTER_MAX_RANGE = 90;

function interpolateColorPart(factor: number, part: number) {
	let range: number;
	if (factor > 0) {
		range = Math.min(255 - part, INTER_MAX_RANGE);
	} else {
		range = Math.max(part, -INTER_MAX_RANGE);
	}
	return part + Math.round(factor * range);
}

function getColorShade(
	r: number,
	g: number,
	b: number,
	factor: number
): [r: number, g: number, b: number] {
	return [
		interpolateColorPart(factor, r),
		interpolateColorPart(factor, g),
		interpolateColorPart(factor, b)
	];
}

function shades(hex: string): ColorShades {
	const rgb = hexToRGB(hex);
	const shades: Partial<ColorShades> = {};
	for (const shade in shadeMap) {
		const factor = shadeMap[shade as ColorShade];
		shades[shade as ColorShade] = rgbToHex(...getColorShade(...rgb, factor));
	}
	return shades as ColorShades;
}

export { shades };
export type { ColorShade, ColorShades };
