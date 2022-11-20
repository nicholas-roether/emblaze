import { Component, ComponentProps, Match, Switch } from "solid-js";
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
	external?: false;
}

interface LinkButtonProps extends ButtonBaseProps, ComponentProps<typeof A> {
	href: string;
	external?: false;
}

interface ExternalLinkButtonProps extends ButtonBaseProps, ComponentProps<"a"> {
	href: string;
	external: true;
}

type ButtonProps =
	| NonLinkButtonProps
	| LinkButtonProps
	| ExternalLinkButtonProps;

const Button: Component<ButtonProps> = (props) => {
	const restProps = () =>
		omitProps(props, "variant", "large", "class", "children");
	const classes = () =>
		cls(
			styles.button,
			{
				[styles.secondary]: props.variant == "secondary",
				[styles.large]: props.large ?? false
			},
			props.class
		);

	return (
		<Switch>
			<Match when={props.href && props.external}>
				<a class={classes()} {...(restProps() as ComponentProps<"a">)}>
					{props.children}
				</a>
			</Match>
			<Match when={props.href}>
				<A class={classes()} {...(restProps() as ComponentProps<typeof A>)}>
					{props.children}
				</A>
			</Match>
			<Match when={true}>
				<button
					class={classes()}
					{...(restProps() as ComponentProps<"button">)}
				>
					{props.children}
				</button>
			</Match>
		</Switch>
	);
};

export default Button;

export type { ButtonProps };
