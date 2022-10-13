import { useTheme } from "@emotion/react";
import { Size } from "../../../theme";
import { BasePropsWithChildren } from "../../../utils/types";

interface TextProps extends BasePropsWithChildren<HTMLSpanElement> {
	size?: Size;
}

function Text({ size = "m", css, children, ...props }: TextProps): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				fontFamily: theme.fonts.paragraph,
				fontSize: theme.textSize.paragraph[size],
				color: theme.colors.onBackground,
				...css
			}}
			{...props}
		>
			{children}
		</span>
	);
}

export default Text;

export type { TextProps };
