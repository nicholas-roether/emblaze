import { useTheme } from "@emotion/react";
import { Size } from "../../theme";
import { BasePropsWithChilren } from "../../utils/types";

interface ParagraphProps extends BasePropsWithChilren<HTMLParagraphElement> {
	size?: Size;
}

function Paragraph({
	size = "m",
	css,
	children,
	...props
}: ParagraphProps): JSX.Element {
	const theme = useTheme();
	return (
		<p
			css={{
				fontFamily: theme.fonts.paragraph,
				fontSize: theme.textSize.paragraph[size],
				color: theme.colors.onBackground,
				marginBottom: theme.spacing(6),
				...css
			}}
			{...props}
		>
			{children}
		</p>
	);
}

export default Paragraph;

export type { ParagraphProps };
