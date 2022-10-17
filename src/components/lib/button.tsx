import { useTheme } from "@emotion/react";
import { ColorShades } from "../../utils/color";
import { BasePropsWithChildren } from "../../utils/types";
import Text from "./typography/Text";

interface ButtonProps extends BasePropsWithChildren<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "text";
}

function Button({ variant = "primary", children, css, ...props }: ButtonProps) {
	const theme = useTheme();
	let textColor: string;
	let bgColor: ColorShades | null = null;
	switch (variant) {
		case "primary":
			bgColor = theme.colors.primary;
			textColor = theme.colors.onPrimary;
			break;
		case "secondary":
			bgColor = theme.colors.secondary;
			textColor = theme.colors.onSecondary;
			break;
		case "text":
			textColor = theme.colors.onPrimary;
	}
	return (
		<button
			css={{
				appearance: "none",
				padding: theme.spacing(2, 6),
				cursor: "pointer",
				backgroundColor: bgColor?.[500] ?? "transparent",
				border: `2px ${bgColor?.[500] ?? "transparent"} solid`,
				transition: "border-color",
				transitionDuration: theme.durations.medium,
				color: textColor,
				borderRadius: theme.borderRadius,

				"&:hover": {
					borderColor: bgColor?.[800]
				},

				"&:active": {
					backgroundColor: bgColor?.[600]
				}
			}}
		>
			<Text
				size="l"
				css={{
					color: theme.colors.onPrimary
				}}
			>
				{children}
			</Text>
		</button>
	);
}

export default Button;

export type { ButtonProps };
