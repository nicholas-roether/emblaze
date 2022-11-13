import { Component, JSX, Match, Switch } from "solid-js";
import { cls } from "~/utils/jsx";
import styles from "./button.module.scss";

interface ButtonProps {
	variant?: "surface" | "primary" | "secondary";
	large?: boolean;
	children?: JSX.Element;
	href?: string;
}

const Button: Component<ButtonProps> = (props) => {
	const className = () =>
		cls(
			styles.button,
			[styles.secondary, props.variant == "secondary"],
			[styles.surface, props.variant == "surface"],
			[styles.large, props.large ?? false]
		);
	return (
		<Switch>
			<Match when={props.href}>
				<a href={props.href} class={className()}>
					{props.children}
				</a>
			</Match>
			<Match when={!props.href}>
				<button class={className()}>{props.children}</button>
			</Match>
		</Switch>
	);
};

export default Button;

export type { ButtonProps };
