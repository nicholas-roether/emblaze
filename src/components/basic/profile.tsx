import { Component } from "solid-js";

import styles from "./profile.module.scss";

interface ProfileProps {
	src?: string;
	alt?: string;
}

const Profile: Component<ProfileProps> = (props) => {
	return <img class={styles.profile} src={props.src} alt={props.alt} />;
};

export default Profile;
