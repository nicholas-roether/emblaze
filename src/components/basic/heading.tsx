import { Component, JSX, Match, Switch } from "solid-js";
import { cls } from "~/utils/jsx";

import styles from "./heading.module.scss";

interface HeadingProps {
	size?: "xs" | "s" | "m" | "l" | "xl";
	noGutter?: boolean;
	children?: JSX.Element;
}

const Heading: Component<HeadingProps> = (props) => {
	return (
		<Switch>
			<Match when={props.size == "xl"}>
				<h1 class={cls(styles.headingXL, [styles.gutter, !props.noGutter])}>
					{props.children}
				</h1>
			</Match>
			<Match when={props.size == "l"}>
				<h2 class={cls(styles.headingL, [styles.gutter, !props.noGutter])}>
					{props.children}
				</h2>
			</Match>
			<Match when={props.size == "m"}>
				<h3 class={cls(styles.headingM, [styles.gutter, !props.noGutter])}>
					{props.children}
				</h3>
			</Match>
			<Match when={props.size == "s"}>
				<h4 class={cls(styles.headingS, [styles.gutter, !props.noGutter])}>
					{props.children}
				</h4>
			</Match>
			<Match when={props.size == "xs"}>
				<h5 class={cls(styles.headingXS, [styles.gutter, !props.noGutter])}>
					{props.children}
				</h5>
			</Match>
		</Switch>
	);
};

export default Heading;

export type { HeadingProps };
