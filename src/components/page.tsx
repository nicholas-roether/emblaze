import { Component, JSX } from "solid-js";
import { Title } from "solid-start";
import TopBar from "./top_bar";

interface PageProps {
	title: string;
	children: JSX.Element;
}

const Page: Component<PageProps> = (props) => (
	<>
		<Title>emblaze / {props.title}</Title>
		<TopBar />
		{props.children}
	</>
);

export default Page;

export type { PageProps };
