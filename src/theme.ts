import { Theme } from "./utils/theming";

const theme: Theme = {
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
	},
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
	borderRadius: "5px",
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
	shadowFactor: 1.5
};

export default theme;
