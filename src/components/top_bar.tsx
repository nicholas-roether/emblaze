import { Component, Show, Suspense, useContext } from "solid-js";
import { cls, css } from "~/utils/css";
import Profile from "./basic/profile";
import UserContext from "./context/user_context";

const styles = css((theme) => ({
	topBar: {
		backgroundColor: theme.colors.surface[0],
		color: theme.colors.text.onSurface,
		height: "3em",
		padding: theme.spacing(0.5),
		paddingRight: theme.spacing(1),
		display: "flex",
		alignItems: "center",
		position: "sticky",
		top: 0,
		width: "100%",
		boxShadow: theme.boxShadow(1),

		[theme.above("sm")]: {
			backgroundColor: "transparent",
			color: theme.colors.text.onBackground,
			boxShadow: "none",
			height: "3.5em",
			padding: theme.spacing(1),
			paddingRight: theme.spacing(2)
		}
	},
	topBarBehind: {
		zIndex: -1,
		position: "fixed",
		backgroundColor: "transparent",
		color: theme.colors.text.onBackground,
		boxShadow: "none"
	},

	image: {
		height: "100%"
	},
	spacer: {
		flex: 1
	}
}));

const Logo: Component = () => (
	<img class={styles.image} src="/images/emblaze-icon.svg" alt="emblaze" />
);

const UserMenu: Component = () => {
	const user = useContext(UserContext);

	return (
		<Suspense fallback="Loading...">
			<Profile
				class={styles.image}
				src={user?.()?.profilePicture}
				alt={user?.()?.name ?? "Loading..."}
			/>
		</Suspense>
	);
};

interface TopBarProps {
	noUserMenu?: boolean;
	behind?: boolean;
}

const TopBar: Component<TopBarProps> = (props) => (
	<header
		class={cls(styles.topBar, {
			[styles.topBarBehind]: props.behind ?? false
		})}
	>
		<Logo />
		<div class={styles.spacer} />
		<Show when={!props.noUserMenu}>
			<UserMenu />
		</Show>
	</header>
);

export default TopBar;
