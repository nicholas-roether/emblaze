import { Theme } from "./utils/theming";

const theme = new Theme({
	fonts: {
		heading: "'Crimson Text', serif",
		copy: "'Work Sans', sans-serif"
	},
	colors: {
		background: "#1e1e24",
		surface: ["#2e2e38", "#40404f"],
		primary: {
			[100]: "#652b06",
			[200]: "#652b06",
			[300]: "#98400a",
			[400]: "#ca560d",
			[500]: "#fd6b10",
			[600]: "#fd8940",
			[700]: "#fea670",
			[800]: "#fec49f",
			[900]: "#ffe1cf"
		},
		secondary: {
			[100]: "#332d1b",
			[200]: "#665a35",
			[300]: "#998850",
			[400]: "#ccb56a",
			[500]: "#ffe285",
			[600]: "#ffe89d",
			[700]: "#ffeeb6",
			[800]: "#fff3ce",
			[900]: "#fff9e7"
		},
		shadow: "#00000050",

		text: {
			onBackground: "#fff",
			onSurface: "#fff",
			onPrimary: "#fff",
			onSecondary: "#000"
		}
	}
});

export default theme;
