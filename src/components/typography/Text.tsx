import { useTheme } from "@emotion/react";
import { TextSize } from "../../theme";
import { BasePropsWithChilren } from "../../utils/types";

interface TextProps extends BasePropsWithChilren<HTMLSpanElement> {
	size?: TextSize;
}

function Text({
	size = "m",
	css,
	children,
	ref,
	...props
}: TextProps): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				fontFamily: theme.fonts.paragraph,
				fontSize: theme.textSize.paragraph[size],
				color: theme.colors.onBackground,
				...css
			}}
			ref={ref}
			{...props}
		>
			{children}
		</span>
	);
}

export default Text;

export type { TextProps };
