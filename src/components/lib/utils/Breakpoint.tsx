import { useTheme } from "@emotion/react";
import { Size } from "../../../theme";
import { BaseProps } from "../../../utils/types";

interface BreakpointProps extends BaseProps<HTMLDivElement> {
	above: Size;
	below: Size;
}

function Breakpoint({
	above,
	below,
	css,
	children,
	...props
}: BreakpointProps): JSX.Element {
	const theme = useTheme();
	return (
		<div
			css={{
				[theme.media.below(above)]: {
					display: "none"
				},
				[theme.media.above(below)]: {
					display: "none"
				},
				...css
			}}
			{...props}
		>
			{children}
		</div>
	);
}

export default Breakpoint;
