import { Size } from "../../theme";
import { useMediaQuery } from "../../utils/media_query";
import { BaseProps } from "../../utils/types";

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
	const media = useMediaQuery();
	return (
		<div
			css={{
				[media.below(above)]: {
					display: "none"
				},
				[media.above(below)]: {
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
