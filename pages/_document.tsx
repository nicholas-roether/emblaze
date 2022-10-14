import { Html, Head, Main, NextScript } from "next/document";

function Document() {
	return (
		<Html>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<link rel="favicon" href="/favicon.ico" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="stylesheet" href="/base.css" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Work+Sans:ital,wght@0,300;0,500;0,600;0,700;1,300;1,500;1,600;1,700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

export default Document;
