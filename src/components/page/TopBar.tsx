import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import Icon from "../../assets/Icon";
import Heading from "../lib/typography/Heading";
import Breakpoint from "../lib/utils/Breakpoint";
import SearchBar from "./SearchBar";
import UserSection from "./UserSection";

function Logo(): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				display: "inline-flex",
				alignItems: "center"
			}}
		>
			<Icon
				css={{
					width: "36px",
					height: "36px",

					[theme.media.above("s")]: {
						width: "48px",
						height: "48px"
					}
				}}
			/>
			<Breakpoint above="l">
				<Heading size="l" gutter={false} css={{ marginLeft: theme.spacing(2) }}>
					emblaze
				</Heading>
			</Breakpoint>
		</span>
	);
}

function TopBar(): JSX.Element {
	const theme = useTheme();
	const [floating, setFloating] = useState(false);

	useEffect(() => {
		window.addEventListener("scroll", () => {
			setFloating(window.scrollY > 0);
		});
	}, []);

	return (
		<section
			role="banner"
			css={{
				position: "sticky",
				top: 0,
				height: "54px",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				columnGap: theme.spacing(6),
				padding: theme.spacing(1, 3),
				background: theme.colors.background[500],
				boxShadow: floating ? theme.boxShadow : "none",
				transition: "box-shadow",
				transitionDuration: theme.durations.long,
				zIndex: 10,

				[theme.media.above("s")]: {
					height: "64px",
					padding: theme.spacing(2, 3)
				},

				[theme.media.above("l")]: {
					padding: theme.spacing(2, 8)
				}
			}}
		>
			<Logo />
			<SearchBar />
			<UserSection />
		</section>
	);
}

export default TopBar;
