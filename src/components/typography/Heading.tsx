import { useTheme } from "@emotion/react";
import { Size } from "../../theme";
import { BasePropsWithChilren } from "../../utils/types";

interface ParagraphProps extends BasePropsWithChilren<HTMLHeadingElement> {
	size?: Size;
	gutter?: boolean;
}

function Heading({
	size = "m",
	gutter = true,
	css,
	children,
	...props
}: ParagraphProps): JSX.Element {
	const theme = useTheme();
	return (
		<h1
			css={{
				fontFamily: theme.fonts.heading,
				fontSize: theme.textSize.heading[size],
				color: theme.colors.onBackground,
				marginBottom: gutter ? theme.spacing(2) : 0,
				...css
			}}
			{...props}
		>
			{children}
		</h1>
	);
}

export default Heading;

export type { ParagraphProps };
