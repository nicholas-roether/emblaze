import { ThemeProvider } from "@emotion/react";
import { AppProps } from "next/app";
import Head from "next/head";
import theme from "../src/theme";

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="description"
					content="A minimal, fast and responsive reddit client"
				/>
				<title>emblaze</title>
			</Head>
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}

export default App;
