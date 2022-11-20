import { Component } from "solid-js";
import { css } from "~/utils/css";

const styles = css({
	profile: {
		borderRadius: "1000000px"
	}
});

interface ProfileProps {
	src?: string;
	alt?: string;
}

const Profile: Component<ProfileProps> = (props) => {
	return <img class={styles.profile} src={props.src} alt={props.alt} />;
};

export default Profile;
