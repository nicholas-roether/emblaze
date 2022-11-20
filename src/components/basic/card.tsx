import { Component, ComponentProps } from "solid-js";
import { cls, css } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css((theme) => ({
	card: {
		padding: theme.spacing(1),
		borderRadius: theme.borderRadius,
		backgroundColor: theme.colors.surface[0],
		boxShadow: theme.boxShadow(1)
	}
}));

type CardProps = ComponentProps<"div">;

const Card: Component<CardProps> = (props) => (
	<div class={cls(styles.card, props.class)} {...omitProps(props, "class")} />
);

export default Card;
export type { CardProps };
