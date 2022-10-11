import { ThemeProvider } from "@emotion/react";
import Logo from "./assets/Logo";
import Heading from "./components/typography/Heading";
import Paragraph from "./components/typography/Paragraph";
import theme from "./theme";

function App(): JSX.Element {
	return (
		<ThemeProvider theme={theme}>
			<Logo />
			<Heading size="xl">XL Heading</Heading>
			<Heading size="l">L Heading</Heading>
			<Heading size="m">M Heading</Heading>
			<Heading size="s">S Heading</Heading>
			<Heading size="xs">XS Heading</Heading>

			<Paragraph size="xl">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="l">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="m">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="s">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
			<Paragraph size="xs">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
				esse odit minima impedit quaerat dicta aspernatur, cum eligendi
				temporibus debitis quia nemo. Temporibus deleniti inventore
				necessitatibus, nisi quia dolore fuga!
			</Paragraph>
		</ThemeProvider>
	);
}

export default App;
