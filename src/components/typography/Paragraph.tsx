import { useTheme } from "@emotion/react";
import { TextSize } from "../../theme";
import { BasePropsWithChilren } from "../../utils/types";

interface ParagraphProps extends BasePropsWithChilren<HTMLParagraphElement> {
	size?: TextSize;
}

function Paragraph({
	size = "m",
	css,
	children,
	ref,
	...props
}: ParagraphProps): JSX.Element {
	const theme = useTheme();
	return (
		<p
			css={{
				fontFamily: theme.fonts.paragraph,
				fontSize: theme.textSize.paragraph[size],
				color: theme.colors.onBackground,
				marginBottom: theme.spacing * 6,
				...css
			}}
			ref={ref}
			{...props}
		>
			{children}
		</p>
	);
}

export default Paragraph;

export type { ParagraphProps };
