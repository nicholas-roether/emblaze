import { CSSObject, useTheme } from "@emotion/react";
import { Size } from "../../../theme";
import { BasePropsWithChildren } from "../../../utils/types";

interface BreakpointProps extends BasePropsWithChildren<HTMLDivElement> {
	above?: Size;
	below?: Size;
}

function Breakpoint({
	above,
	below,
	css,
	children,
	...props
}: BreakpointProps): JSX.Element {
	const theme = useTheme();
	const styles: CSSObject = {};
	if (above) styles[theme.media.below(above)] = { display: "none" };
	if (below) styles[theme.media.above(below)] = { display: "none" };
	return (
		<div
			css={{
				...styles,
				...css
			}}
			{...props}
		>
			{children}
		</div>
	);
}

export default Breakpoint;
