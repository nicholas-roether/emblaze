import { useTheme } from "@emotion/react";
import Icon from "../../assets/Icon";
import Heading from "../typography/Heading";
import { FiSearch as SearchIcon } from "react-icons/fi";

function Logo(): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				display: "inline-flex"
			}}
		>
			<Icon css={{ width: "48px", height: "48px" }} />
			<Heading size="l" gutter={false} css={{ marginLeft: theme.spacing * 2 }}>
				emblaze
			</Heading>
		</span>
	);
}

function SearchBar(): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				position: "relative",
				top: 0,
				left: 0,
				flex: 1,
				display: "flex",
				alignItems: "center",
				maxWidth: theme.spacing * 200
			}}
		>
			<input
				type="text"
				placeholder="Search reddit..."
				css={{
					backgroundColor: theme.colors.background[600],
					padding: `${theme.spacing * 3}px ${theme.spacing * 12}px ${
						theme.spacing * 3
					}px ${theme.spacing * 6}px`,
					width: "100%",
					fontSize: theme.textSize.paragraph.m,
					border: "none",
					borderRadius: `1000000px`,
					color: theme.colors.onBackground
				}}
			/>
			<SearchIcon
				css={{
					position: "absolute",
					stroke: theme.colors.background[900],
					right: theme.spacing * 6,
					width: 20,
					height: 20
				}}
			/>
		</span>
	);
}

function TopBarMenu(): JSX.Element {
	const theme = useTheme();
	return <span css={{ width: theme.spacing * 60 }} />;
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
				columnGap: theme.spacing * 4,
				padding: `${theme.spacing}px ${theme.spacing * 8}px`
			}}
		>
			<Logo />
			<SearchBar />
			<TopBarMenu />
		</section>
	);
}

export default TopBar;
