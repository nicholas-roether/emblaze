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

function getColorShade(
	r: number,
	g: number,
	b: number,
	factor: number
): [r: number, g: number, b: number] {
	if (factor > 0) {
		r += Math.round(factor * (255 - r));
		g += Math.round(factor * (255 - g));
		b += Math.round(factor * (255 - b));
	} else if (factor < 0) {
		r += Math.round(factor * r);
		g += Math.round(factor * g);
		b += Math.round(factor * b);
	}
	return [r, g, b];
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
