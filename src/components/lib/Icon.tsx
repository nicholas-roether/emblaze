import { useTheme } from "@emotion/react";
import { IconType } from "react-icons/lib";
import { Size } from "../../theme";
import { BaseProps } from "../../utils/types";

interface IconProps extends BaseProps<HTMLSpanElement> {
	size?: Size;
	color?: string;
	children: IconType;
}

function Icon({
	size = "m",
	color,
	css,
	children: IconElem,
	...props
}: IconProps): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				display: "inline-block",
				color: color,
				width: theme.iconSizes[size],
				height: theme.iconSizes[size],
				css
			}}
			{...props}
		>
			<IconElem css={{ width: "100%", height: "100%" }} />
		</span>
	);
}

export default Icon;

export type { IconProps };
