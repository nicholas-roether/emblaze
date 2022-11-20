import { Component, ComponentProps, Match, Switch } from "solid-js";
import { cls, css } from "~/utils/css";

const styles = css((theme) => ({
	copy1: {
		fontSize: theme.fontSizes.copy1
	},
	copy2: {
		fontSize: theme.fontSizes.copy2
	},
	copy3: {
		fontSize: theme.fontSizes.copy3
	},
	paragraph: {
		marginBottom: theme.spacing(2)
	}
}));

interface TextBaseProps {
	size?: `copy${1 | 2 | 3}`;
}
interface TextParagraphProps extends TextBaseProps, ComponentProps<"p"> {
	paragraph: true;
}

interface TextSpanProps extends TextBaseProps, ComponentProps<"span"> {
	paragraph?: false;
}

type TextProps = TextParagraphProps | TextSpanProps;

const Text: Component<TextProps> = (props) => {
	return (
		<Switch>
			<Match when={props.paragraph}>
				<p
					{...(props as TextParagraphProps)}
					class={cls(
						styles.paragraph,
						styles[props.size ?? "copy1"],
						props.class
					)}
				/>
			</Match>
			<Match when={!props.paragraph}>
				<span
					{...(props as TextSpanProps)}
					class={cls(styles[props.size ?? "copy1"], props.class)}
				/>
			</Match>
		</Switch>
	);
};

export default Text;

export type { TextProps };
