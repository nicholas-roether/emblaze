import { useTheme } from "@emotion/react";
import { FiSearch as SearchIcon } from "react-icons/fi";
import Text from "../typography/Text";

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
			<SearchIcon
				css={{
					width: 20,
					height: 20
				}}
			/>
		</div>
	);
}

export default SearchBar;
