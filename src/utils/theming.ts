import { MakeOptional } from "./types";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type FontSize =
	| `heading${1 | 2 | 3 | 4 | 5 | 6}`
	| `title${1 | 2}`
	| `copy${1 | 2 | 3}`;
type Shade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type Swatch = Record<Shade, string>;

interface Fonts {
	heading: string;
	copy: string;
}

interface Durations {
	short: string;
	medium: string;
	long: string;
}

interface Colors {
	background: string;
	surface: string[];
	primary: Swatch;
	secondary: Swatch;
	shadow: string;
	text: {
		onBackground: string;
		onSurface: string;
		onPrimary: string;
		onSecondary: string;
	};
}

interface ThemeData {
	fonts: Fonts;
	fontSizes: Record<FontSize, string>;
	borderRadius: string;
	durations: Durations;
	breakpoints: Record<Breakpoint, string>;
	spacingFactor: number;
	shadowFactor: number;
	colors: Colors;
}

const themeDataDefaults = {
	durations: {
		short: "50ms",
		medium: "200ms",
		long: "500ms"
	},
	breakpoints: {
		xs: "0",
		sm: "576px",
		md: "768px",
		lg: "992px",
		xl: "1200px",
		xxl: "1400px"
	},
	spacingFactor: 8,
	shadowFactor: 1.5,
	fontSizes: {
		title1: "4em",
		title2: "2.5em",

		heading1: "2em",
		heading2: "1.8em",
		heading3: "1.65em",
		heading4: "1.5em",
		heading5: "1.35em",
		heading6: "1.2em",

		copy1: "1em",
		copy2: "0.85em",
		copy3: "0.7em"
	},
	borderRadius: "5px"
};

class Theme implements ThemeData {
	public readonly fonts: Fonts;
	public readonly fontSizes: Record<FontSize, string>;
	public readonly borderRadius: string;
	public readonly durations: Durations;
	public readonly breakpoints: Record<Breakpoint, string>;
	public readonly spacingFactor: number;
	public readonly shadowFactor: number;
	public readonly colors: Colors;

	constructor(
		themeInit: MakeOptional<ThemeData, keyof typeof themeDataDefaults>
	) {
		const themeData: ThemeData = { ...themeDataDefaults, ...themeInit };
		this.fonts = themeData.fonts;
		this.fontSizes = themeData.fontSizes;
		this.borderRadius = themeData.borderRadius;
		this.durations = themeData.durations;
		this.breakpoints = themeData.breakpoints;
		this.spacingFactor = themeData.spacingFactor;
		this.shadowFactor = themeData.shadowFactor;
		this.colors = themeData.colors;
	}

	public spacing(...args: (number | string)[]): string {
		return args
			.map((arg) => {
				if (typeof arg === "string") return arg;
				return `${this.spacingFactor * arg}px`;
			})
			.join(" ");
	}

	public boxShadow(strength: number): string {
		return `${2 * strength}px ${2 * strength}px ${5 * strength}px ${
			this.colors.shadow
		}`;
	}

	public above(breakpoint: Breakpoint): string {
		return `@media (min-width: ${this.breakpoints[breakpoint]})`;
	}
}

export { Theme };

export type {
	ThemeData,
	Breakpoint,
	FontSize,
	Shade,
	Swatch,
	Fonts,
	Durations,
	Colors
};
