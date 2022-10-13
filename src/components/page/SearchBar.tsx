import { useTheme } from "@emotion/react";
import { FiSearch as SearchIcon } from "react-icons/fi";

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

export default SearchBar;
