import { Component, ComponentProps } from "solid-js";
import { A } from "solid-start";
import { css, cls } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css((theme) => ({
	link: {
		color: theme.colors.secondary[500],
		textDecoration: "underline",
		fontWeight: "bold",

		"&:hover": {
			color: theme.colors.secondary[700]
		}
	}
}));

type LinkProps = ComponentProps<typeof A>;

const Link: Component<LinkProps> = (props) => (
	<A
		class={cls(styles.link, props.class)}
		href={props.href}
		{...omitProps(props, "class", "href")}
	/>
);

export default Link;
export type { LinkProps };
