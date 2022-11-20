import { Component, ComponentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cls, css } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css((theme) => ({
	heading: {
		fontFamily: theme.fonts.heading,
		marginBottom: theme.spacing(1)
	},
	size1: { fontSize: theme.fontSizes.heading1 },
	size2: { fontSize: theme.fontSizes.heading2 },
	size3: { fontSize: theme.fontSizes.heading3 },
	size4: { fontSize: theme.fontSizes.heading4 },
	size5: { fontSize: theme.fontSizes.heading5 },
	size6: { fontSize: theme.fontSizes.heading6 },
	noGutter: {
		marginBottom: 0
	}
}));

interface HeadingProps extends ComponentProps<`h${1 | 2 | 3 | 4 | 5 | 6}`> {
	size?: 1 | 2 | 3 | 4 | 5 | 6;
	noGutter?: boolean;
}

const Heading: Component<HeadingProps> = (props) => {
	const size = () => props.size ?? 1;
	const sizeClassName = () =>
		`size${size()}` as `size${ReturnType<typeof size>}`;
	const element = () => `h${size()}` as `h${ReturnType<typeof size>}`;
	return (
		<Dynamic
			component={element()}
			class={cls(
				styles.heading,
				styles[sizeClassName()],
				{ [styles.noGutter]: props.noGutter ?? false },
				props.class
			)}
			{...omitProps(props, "class", "size", "noGutter")}
		/>
	);
};

export default Heading;

export type { HeadingProps };
