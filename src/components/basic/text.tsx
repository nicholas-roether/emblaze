import { Component, ComponentProps, Match, Switch } from "solid-js";
import { cls, css } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css((theme) => ({
	copy: {
		fontFamily: theme.fonts.copy
	},
	size1: { fontSize: theme.fontSizes.copy1 },
	size2: { fontSize: theme.fontSizes.copy2 },
	size3: { fontSize: theme.fontSizes.copy3 },
	paragraph: {
		marginBottom: theme.spacing(2)
	}
}));

interface TextBaseProps {
	size?: 1 | 2 | 3;
}
interface TextParagraphProps extends TextBaseProps, ComponentProps<"p"> {
	paragraph: true;
}

interface TextSpanProps extends TextBaseProps, ComponentProps<"span"> {
	paragraph?: false;
}

type TextProps = TextParagraphProps | TextSpanProps;

const Text: Component<TextProps> = (props) => {
	const restProps = () => omitProps(props, "size", "paragraph");
	const size = () => props.size ?? 1;
	const sizeClassName = () =>
		`size${size()}` as `size${ReturnType<typeof size>}`;
	return (
		<Switch>
			<Match when={props.paragraph}>
				<p
					class={cls(
						styles.copy,
						styles.paragraph,
						styles[sizeClassName()],
						props.class
					)}
					{...(restProps() as TextParagraphProps)}
				/>
			</Match>
			<Match when={!props.paragraph}>
				<span
					{...(restProps() as TextSpanProps)}
					class={cls(styles.copy, styles[sizeClassName()], props.class)}
				/>
			</Match>
		</Switch>
	);
};

export default Text;

export type { TextProps };
