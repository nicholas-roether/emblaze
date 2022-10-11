import { ThemeProvider } from "@emotion/react";
import Page from "./components/Page";
import theme from "./theme";

function App(): JSX.Element {
	return (
		<ThemeProvider theme={theme}>
			<Page></Page>
		</ThemeProvider>
	);
}

export default App;
