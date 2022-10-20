import Image from "next/image";
import { BaseProps } from "../../utils/types";

interface AvatarProps extends BaseProps<HTMLDivElement> {
	size: string;
	src: string;
}

function Avatar({ size, src, css, ...props }: AvatarProps): JSX.Element {
	return (
		<div
			css={{
				display: "inline-block",
				borderRadius: "100%",
				overflow: "hidden",
				width: size,
				height: size,
				zIndex: 0,
				position: "relative",
				...css
			}}
			{...props}
		>
			<Image src={src} layout="fill" objectFit="cover" />
		</div>
	);
}

export default Avatar;
