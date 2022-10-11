import { useTheme } from "@emotion/react";
import { TextSize } from "../../theme";
import { BasePropsWithChilren } from "../../utils/types";

interface ParagraphProps extends BasePropsWithChilren<HTMLHeadingElement> {
	size?: TextSize;
	gutter?: boolean;
}

function Heading({
	size = "m",
	gutter = true,
	css,
	children,
	ref,
	...props
}: ParagraphProps): JSX.Element {
	const theme = useTheme();
	return (
		<h1
			css={{
				fontFamily: theme.fonts.heading,
				fontSize: theme.textSize.heading[size],
				color: theme.colors.onBackground,
				marginBottom: gutter ? theme.spacing * 2 : 0,
				...css
			}}
			ref={ref}
			{...props}
		>
			{children}
		</h1>
	);
}

export default Heading;

export type { ParagraphProps };
