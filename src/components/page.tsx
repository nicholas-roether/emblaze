import { Component, JSX } from "solid-js";
import { Title } from "solid-start";

interface PageProps {
	title: string;
	children: JSX.Element;
}

const Page: Component<PageProps> = (props) => (
	<>
		<Title>emblaze / {props.title}</Title>
		{props.children}
	</>
);

export default Page;

export type { PageProps };
