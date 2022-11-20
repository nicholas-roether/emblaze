import { Component, ComponentProps } from "solid-js";
import { css, cls } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css((theme) => ({
	iconButton: {
		width: "2.4em",
		height: "2.4em",
		fontSize: "1em",
		borderRadius: "1000000em",
		border: "none",
		backgroundColor: theme.colors.background,
		transition: "background-color",
		transitionDuration: theme.durations.medium,
		color: theme.colors.text.onBackground,
		verticalAlign: "middle",
		cursor: "pointer",

		"&:hover": {
			backgroundColor: theme.colors.surface[0],
			color: theme.colors.text.onSurface
		}
	},
	large: {
		width: "2.6em",
		height: "2.6em",
		fontSize: "1.3em"
	}
}));

interface IconButtonProps extends ComponentProps<"button"> {
	large?: boolean;
}

const IconButton: Component<IconButtonProps> = (props) => {
	return (
		<button
			class={cls(
				styles.iconButton,
				{ [styles.large]: props.large ?? false },
				props.class
			)}
			{...omitProps(props, "class", "large")}
		/>
	);
};

export default IconButton;

export type { IconButtonProps };
