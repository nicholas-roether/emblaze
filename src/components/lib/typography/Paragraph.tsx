import { useTheme } from "@emotion/react";
import { Size } from "../../../theme";
import { BasePropsWithChildren } from "../../../utils/types";

interface ParagraphProps extends BasePropsWithChildren<HTMLParagraphElement> {
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
				marginBottom: theme.spacing(4),

				"&:last-child": {
					marginBottom: 0
				},

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
