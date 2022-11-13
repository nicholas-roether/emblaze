import { Component, JSX } from "solid-js";
import { cls } from "~/utils/jsx";

import styles from "./icon_button.module.scss";

interface IconButtonProps {
	large?: boolean;
	children?: JSX.Element;
}

const IconButton: Component<IconButtonProps> = (props) => {
	return (
		<button
			class={cls(styles.iconButton, [styles.large, props.large ?? false])}
		>
			{props.children}
		</button>
	);
};

export default IconButton;

export type { IconButtonProps };
