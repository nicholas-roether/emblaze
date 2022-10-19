import Image from "next/image";
import { BaseProps } from "../../utils/types";

interface AvatarProps extends BaseProps<HTMLDivElement> {
	width: string;
	src: string;
}

function Avatar({ width, src, css, ...props }: AvatarProps): JSX.Element {
	return (
		<div
			css={{
				display: "inline-block",
				borderRadius: "100%",
				...css
			}}
			{...props}
		>
			<Image src={src} width={width} />
		</div>
	);
}

export default Avatar;
