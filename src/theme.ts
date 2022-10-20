import { Theme } from "@emotion/react";
import { shades } from "./utils/color";
import { createTheme } from "./utils/theming";

type Size = "xs" | "s" | "m" | "l" | "xl";

const theme: Theme = createTheme({
	colors: {
		primary: shades("#fd6b10"),
		secondary: shades("#ffe285"),
		background: shades("#1e1e24"),
		gray: shades("#7f7f7f"),
		onPrimary: "#000",
		onSecondary: "#000",
		onBackground: "#fff"
	},
	fonts: {
		heading: "'Crimson Text', serif",
		paragraph: "'Work Sans', serif"
	},
	spacingFactor: 4,
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
	},
	iconSizes: {
		xs: "0.84em",
		s: "1.02em",
		m: "1.2em",
		l: "1.56em",
		xl: "1.92em"
	},
	borderRadius: "7px",
	durations: {
		veryShort: "50ms",
		short: "125ms",
		medium: "200ms",
		long: "350ms",
		veryLong: "500ms"
	},
	boxShadow: "0 0 24px #000"
});

export default theme;

export type { Size };
