import { useTheme } from "@emotion/react";
import { BasePropsWithChildren } from "../../utils/types";
import Heading from "./typography/Heading";

interface CardProps extends BasePropsWithChildren<HTMLDivElement> {
	elevate?: boolean;
}

function Card({ elevate, css, children, ...props }: CardProps): JSX.Element {
	const theme = useTheme();
	return (
		<div
			css={{
				background: theme.colors.background[600],
				padding: theme.spacing(4, 0),
				borderRadius: theme.borderRadius,
				...css
			}}
			{...props}
		>
			{children}
		</div>
	);
}

function CardSection({
	css,
	children,
	...props
}: BasePropsWithChildren<HTMLDivElement>): JSX.Element {
	const theme = useTheme();
	return (
		<div
			css={{
				margin: theme.spacing(4, 0),
				"&:first-child": {
					marginTop: 0
				},
				"&:last-child": {
					marginBottom: 0
				},
				...css
			}}
			{...props}
		>
			{children}
		</div>
	);
}

function CardContent({
	css,
	children,
	...props
}: BasePropsWithChildren<HTMLDivElement>): JSX.Element {
	const theme = useTheme();
	return (
		<CardSection css={{ padding: theme.spacing(0, 6), ...css }} {...props}>
			{children}
		</CardSection>
	);
}

function CardHeading({
	children,
	...props
}: BasePropsWithChildren<HTMLDivElement>): JSX.Element {
	return (
		<CardContent {...props}>
			<Heading gutter={false}>{children}</Heading>
		</CardContent>
	);
}

function CardMedia({
	css,
	children,
	...props
}: BasePropsWithChildren<HTMLDivElement>): JSX.Element {
	return (
		<CardSection
			css={{
				position: "relative",
				zIndex: 0,
				overflow: "hidden"
			}}
			{...props}
		>
			{children}
		</CardSection>
	);
}

export default Card;

export { CardHeading, CardContent, CardMedia };
