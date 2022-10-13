import { useTheme } from "@emotion/react";
import { Size } from "../theme";

class MediaQuery {
	private breakpoints: Record<Size, number>;

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

function useMediaQuery(): MediaQuery {
	const theme = useTheme();
	return new MediaQuery(theme.breakpoints);
}

export { MediaQuery, useMediaQuery };
