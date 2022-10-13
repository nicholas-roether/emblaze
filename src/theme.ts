import { Theme } from "@emotion/react";
import { ColorShades, shades } from "./utils/color";

type Size = "xs" | "s" | "m" | "l" | "xl";

declare module "@emotion/react" {
	interface Theme {
		colors: {
			primary: ColorShades;
			secondary: ColorShades;
			background: ColorShades;
			onPrimary: string;
			onSecondary: string;
			onBackground: string;
		};
		fonts: {
			heading: string;
			paragraph: string;
		};
		spacing: number;
		textSize: {
			heading: Record<Size, string>;
			paragraph: Record<Size, string>;
		};
		breakpoints: Record<Size, number>;
	}
}

const theme: Theme = {
	colors: {
		primary: shades("#fd6b10"),
		secondary: shades("#ffe285"),
		background: shades("#1e1e24"),
		onPrimary: "#000",
		onSecondary: "#000",
		onBackground: "#fff"
	},
	fonts: {
		heading: "'Crimson Text', serif",
		paragraph: "'Work Sans', serif"
	},
	spacing: 4,
	textSize: {
		heading: {
			xs: "1.2em",
			s: "1.5em",
			m: "1.8em",
			l: "2.5em",
			xl: "4em"
		},
		paragraph: {
			xs: "0.7em",
			s: "0.85em",
			m: "1em",
			l: "1.3em",
			xl: "1.6em"
		}
	},
	breakpoints: {
		xs: 0,
		s: 576,
		m: 768,
		l: 992,
		xl: 1200
	}
};

export default theme;

export type { Size };
