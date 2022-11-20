import { Component, ComponentProps } from "solid-js";
import { cls, css } from "~/utils/css";
import { omitProps } from "~/utils/jsx";

const styles = css({
	profile: {
		borderRadius: "1000000px"
	}
});

interface ProfileProps extends ComponentProps<"img"> {
	alt: string;
}

const Profile: Component<ProfileProps> = (props) => {
	return (
		<img
			class={cls(styles.profile, props.class)}
			alt={props.alt}
			{...omitProps(props, "class", "alt")}
		/>
	);
};

export default Profile;

export type { ProfileProps };
