import { Theme } from "@emotion/react";
import { ColorShades, shades } from "./utils/color";

declare module "@emotion/react" {
	interface Theme {
		colors: {
			primary: ColorShades;
			secondary: ColorShades;
			background: ColorShades;
		};
	}
}

const theme: Theme = {
	colors: {
		primary: shades("#fd6b10"),
		secondary: shades("#ffe285"),
		background: shades("#1e1e24")
	}
};

export default theme;
