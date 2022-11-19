import { Component } from "solid-js";

import styles from "./top_bar.module.scss";

const Logo: Component = () => (
	<img class={styles.logo} src="/images/emblaze-icon.svg" alt="emblaze" />
);

const TopBar: Component = () => (
	<header class={styles.topBar}>
		<Logo />
		<div class="spacer" />
	</header>
);

export default TopBar;
