import { ThemeProvider } from "@emotion/react";
import { AppProps } from "next/app";
import { SkeletonTheme } from "react-loading-skeleton";
import Head from "next/head";
import theme from "../src/theme";

import "react-loading-skeleton/dist/skeleton.css";

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
				<SkeletonTheme
					duration={1.5}
					baseColor={theme.colors.background[700]}
					highlightColor={theme.colors.background[800]}
				>
					<Component {...pageProps} />
				</SkeletonTheme>
			</ThemeProvider>
		</>
	);
}

export default App;
