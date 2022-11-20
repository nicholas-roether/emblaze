type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type FontSize =
	| `heading${1 | 2 | 3 | 4 | 5 | 6}`
	| `title${1 | 2}`
	| `copy${1 | 2 | 3}`;
type Shade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type Swatch = Record<Shade, string>;

interface Theme {
	fonts: {
		heading: string;
		copy: string;
	};
	fontSizes: Record<FontSize, string>;
	borderRadius: string;
	durations: {
		short: string;
		medium: string;
		long: string;
	};
	breakpoints: Record<Breakpoint, string>;
	spacingFactor: number;
	shadowFactor: number;
	colors: {
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
	};
}

export type { Theme };
