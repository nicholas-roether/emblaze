import { useTheme } from "@emotion/react";
import Icon from "../../assets/Icon";
import Heading from "../lib/typography/Heading";
import SearchBar from "./SearchBar";
import UserSection from "./UserSection";

function Logo(): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				display: "inline-flex"
			}}
		>
			<Icon css={{ width: "48px", height: "48px" }} />
			<Heading size="l" gutter={false} css={{ marginLeft: theme.spacing(2) }}>
				emblaze
			</Heading>
		</span>
	);
}

function TopBar(): JSX.Element {
	const theme = useTheme();
	return (
		<section
			role="banner"
			css={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				columnGap: theme.spacing(4),
				padding: theme.spacing(1, 8)
			}}
		>
			<Logo />
			<SearchBar />
			<UserSection />
		</section>
	);
}

export default TopBar;
