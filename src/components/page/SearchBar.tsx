import { useTheme } from "@emotion/react";
import { FiSearch } from "react-icons/fi";
import Icon from "../lib/Icon";
import Text from "../lib/typography/Text";

function SearchBar(): JSX.Element {
	const theme = useTheme();
	return (
		<div
			css={{
				display: "flex",
				flex: 1,
				alignItems: "center",
				maxWidth: theme.spacing(200),
				padding: theme.spacing(3, 6),
				cursor: "text",
				userSelect: "none",
				backgroundColor: theme.colors.background[600],
				borderRadius: "100000px"
			}}
		>
			<Text
				css={{
					color: theme.colors.background[900],
					flex: 1
				}}
			>
				Search reddit...
			</Text>
			<Icon color={theme.colors.background[900]}>{FiSearch}</Icon>
		</div>
	);
}

export default SearchBar;
