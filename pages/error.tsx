import { useTheme } from "@emotion/react";
import { NextPageContext } from "next/types";
import Heading from "../src/components/lib/typography/Heading";
import Paragraph from "../src/components/lib/typography/Paragraph";
import Page from "../src/components/page/Page";

interface ErrorProps {
	heading: string;
	message: string;
}

function Error({ heading, message }: ErrorProps): JSX.Element {
	const theme = useTheme();
	return (
		<Page title={heading}>
			<div css={{ textAlign: "center", marginTop: theme.spacing(8) }}>
				<Heading size="xl">{heading}</Heading>
				<Paragraph size="xl">{message}</Paragraph>
			</div>
		</Page>
	);
}

function getServerSideProps(context: NextPageContext) {
	let heading = "Error";
	if (context.query.status) heading += ` ${context.query.status}`;
	return {
		props: {
			heading,
			message: context.query.message ?? "An unknown error has occurred."
		}
	};
}

export default Error;

export { getServerSideProps };
