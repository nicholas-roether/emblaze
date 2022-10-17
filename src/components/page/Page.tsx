import Head from "next/head";
import { ChildrenProps } from "../../utils/types";
import TopBar from "./TopBar";

interface PageProps extends ChildrenProps {
	title: string;
}

function Page({ children, title }: PageProps): JSX.Element {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<TopBar />
			<main>{children}</main>
		</>
	);
}

export default Page;
