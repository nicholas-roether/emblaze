import { Component, Suspense, useContext } from "solid-js";
import Profile from "./basic/profile";
import UserContext from "./context/user_context";

import styles from "./top_bar.module.scss";

const Logo: Component = () => (
	<img class={styles.logo} src="/images/emblaze-icon.svg" alt="emblaze" />
);

const UserMenu: Component = () => {
	const user = useContext(UserContext);

	return (
		<Suspense fallback="Loading...">
			<Profile src={user?.()?.profilePicture} alt={user?.()?.name} />
		</Suspense>
	);
};

const TopBar: Component = () => (
	<header class={styles.topBar}>
		<Logo />
		<div class={styles.spacer} />
		<UserMenu />
	</header>
);

export default TopBar;
