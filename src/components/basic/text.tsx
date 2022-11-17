import { Component, JSX, Match, Switch } from "solid-js";
import { cls } from "~/utils/jsx";

import styles from "./text.module.scss";

interface TextProps {
	size?: "xs" | "s" | "m" | "l" | "xl";
	paragraph?: boolean;
	children?: JSX.Element;
}

const Text: Component<TextProps> = (props) => {
	const textClass = () => styles[`text${(props.size || "m").toUpperCase()}`];
	return (
		<Switch>
			<Match when={props.paragraph}>
				<p class={cls(styles.paragraph, textClass())}>{props.children}</p>
			</Match>
			<Match when={!props.paragraph}>
				<span class={textClass()}>{props.children}</span>
			</Match>
		</Switch>
	);
};

export default Text;

export type { TextProps };
