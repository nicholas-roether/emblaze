import { BasePropsWithChildren } from "../../utils/types";

interface AvatarProps extends BasePropsWithChildren<HTMLDivElement> {
	size: string;
}

function Avatar({ size, children, css, ...props }: AvatarProps): JSX.Element {
	return (
		<div
			css={{
				display: "inline-block",
				width: size,
				height: size,
				borderRadius: "100%",
				...css
			}}
			{...props}
		>
			{children}
		</div>
	);
}

export default Avatar;
