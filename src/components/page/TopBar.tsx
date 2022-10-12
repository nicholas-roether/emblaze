import { useTheme } from "@emotion/react";
import Icon from "../../assets/Icon";
import { CSSProps } from "../../utils/types";
import Heading from "../typography/Heading";

function Logo({ css }: CSSProps): JSX.Element {
	const theme = useTheme();
	return (
		<span
			css={{
				display: "inline-flex",
				...css
			}}
		>
			<Icon css={{ width: "50px", height: "50px" }} />
			<Heading size="l" gutter={false} css={{ marginLeft: theme.spacing * 2 }}>
				emblaze
			</Heading>
		</span>
	);
}

const topBarHeight = "62px";

function TopBar(): JSX.Element {
	const theme = useTheme();
	return (
		<section
			role="banner"
			css={{
				display: "flex",
				alignItems: "center",
				height: topBarHeight,
				paddingLeft: theme.spacing * 8,
				paddingRight: theme.spacing * 8
			}}
		>
			<Logo />
		</section>
	);
}

export default TopBar;
