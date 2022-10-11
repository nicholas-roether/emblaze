import { useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import Page from "./components/Page";
import theme from "./theme";

function App(): JSX.Element {
	useEffect(() => {
		const rootElement = document.querySelector(":root");
		if (!rootElement || !(rootElement instanceof HTMLHtmlElement))
			throw new Error("Could not find root element!");
		rootElement.style.backgroundColor = theme.colors.background[500];
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Page></Page>
		</ThemeProvider>
	);
}

export default App;
