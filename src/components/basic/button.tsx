import { Component, ComponentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { A } from "solid-start";
import { cls, css } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css((theme) => ({
	button: {
		backgroundColor: theme.colors.primary[500],
		fontFamily: theme.fonts.copy,
		fontSize: theme.fontSizes.copy1,
		color: theme.colors.text.onPrimary,
		textDecoration: "none",
		border: "none",
		display: "inline-block",
		cursor: "pointer",
		transition: "background-color",
		transitionDuration: theme.durations.medium,
		fontWeight: 600,
		padding: theme.spacing(1, 2),
		borderRadius: theme.borderRadius,
		boxShadow: theme.boxShadow(1),

		"&:hover": {
			backgroundColor: theme.colors.primary[700]
		}
	},
	secondary: {
		backgroundColor: theme.colors.secondary[500],
		color: theme.colors.text.onSecondary,

		"&:hover": {
			backgroundColor: theme.colors.secondary[700]
		}
	},
	large: {
		padding: theme.spacing(2, 4)
	}
}));
interface ButtonBaseProps {
	variant?: "primary" | "secondary";
	large?: boolean;
}

interface NonLinkButtonProps extends ButtonBaseProps, ComponentProps<"button"> {
	href?: undefined;
}

interface LinkButtonProps extends ButtonBaseProps, ComponentProps<typeof A> {
	href: string;
}

type ButtonProps = NonLinkButtonProps | LinkButtonProps;

const Button: Component<ButtonProps> = (props) => {
	const element = () => (props.href ? "a" : "button");
	const restProps = () => omitProps(props, "variant", "large", "href", "class");

	return (
		<Dynamic
			component={element()}
			class={cls(
				styles.button,
				{
					[styles.secondary]: props.variant == "secondary",
					[styles.large]: props.large ?? false
				},
				props.class
			)}
			{...(restProps() as ComponentProps<"a"> & ComponentProps<"button">)}
		/>
	);
};

export default Button;

export type { ButtonProps };
