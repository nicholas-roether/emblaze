import { Theme } from "@emotion/react";
import { ColorShades } from "./color";

type Size = "xs" | "s" | "m" | "l" | "xl";
type Duration = "veryShort" | "short" | "medium" | "long" | "veryLong";

interface ThemeData {
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
	spacingFactor: number;
	textSize: {
		heading: Record<Size, string>;
		paragraph: Record<Size, string>;
	};
	breakpoints: Record<Size, number>;
	iconSizes: Record<Size, string>;
	borderRadius: string;
	durations: Record<Duration, string>;
}

class MediaQuery {
	private readonly breakpoints: Record<Size, number>;

	constructor(breakpoints: Record<Size, number>) {
		this.breakpoints = breakpoints;
	}

	above(size: Size) {
		return this.buildMediaQuery({
			"min-width": `${this.breakpoints[size]}px`
		});
	}

	below(size: Size) {
		return this.buildMediaQuery({
			"max-width": `${this.breakpoints[size]}px`
		});
	}

	private buildMediaQuery(params: Record<string, string>) {
		const queryString = Object.entries(params)
			.map(([key, val]) => `${key}: ${val}`)
			.join(", ");
		return `@media (${queryString})`;
	}
}

interface ThemeUtils {
	media: MediaQuery;
	spacing(...spacings: (number | string)[]): string;
}

function themeUtils(themeData: ThemeData): ThemeUtils {
	return {
		get media(): MediaQuery {
			return new MediaQuery(themeData.breakpoints);
		},

		spacing(...spacings: (number | string)[]) {
			if (spacings.length === 0) spacings = [1];
			return spacings
				.map((spacing) => {
					if (typeof spacing == "string") return spacing;
					return `${themeData.spacingFactor * spacing}px`;
				})
				.join(" ");
		}
	};
}

declare module "@emotion/react" {
	interface Theme extends ThemeData, ThemeUtils {}
}

function createTheme(themeData: ThemeData): Theme {
	return {
		...themeData,
		...themeUtils(themeData)
	};
}

export { createTheme, MediaQuery };
export type { ThemeData, ThemeUtils };
