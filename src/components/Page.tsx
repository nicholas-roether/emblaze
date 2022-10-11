import { useTheme } from "@emotion/react";
import { ColorShade } from "../utils/color";
import { ChildrenProps } from "../utils/types";

function ColorTest({
	color,
	shade
}: {
	color: "primary" | "secondary";
	shade: ColorShade;
}): JSX.Element {
	const theme = useTheme();
	return (
		<div
			css={{
				display: "inline-block",
				width: "10px",
				height: "10px",
				verticalAlign: "center",
				backgroundColor: theme.colors[color][shade]
			}}
		/>
	);
}

function Page({ children }: ChildrenProps): JSX.Element {
	const shades: ColorShade[] = [
		"50",
		"100",
		"200",
		"300",
		"400",
		"500",
		"600",
		"700",
		"800",
		"900"
	];
	return (
		<ul>
			{shades.map((shade) => (
				<li>
					<span>{shade}</span>
					<ColorTest color="primary" shade={shade} />
					{children}
				</li>
			))}
		</ul>
	);
}

export default Page;
