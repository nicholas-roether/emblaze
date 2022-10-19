import { useTheme } from "@emotion/react";
import { FiUser } from "react-icons/fi";
import dataHooks, { ReturedError } from "../../data_hooks";
import { User } from "../../models";
import Avatar from "../lib/avatar";
import Button from "../lib/button";
import Icon from "../lib/Icon";
import Text from "../lib/typography/Text";

function Login(): JSX.Element {
	return (
		<Button href="/api/auth/login">
			Log in <Icon css={{ verticalAlign: "bottom" }}>{FiUser}</Icon>
		</Button>
	);
}

interface UserProfileProps {
	user: User;
}

function UserProfile({ user }: UserProfileProps) {
	const theme = useTheme();
	return (
		<Button variant="text" padding="s">
			<div css={{ display: "flex", alignItems: "center" }}>
				<Text css={{ marginRight: theme.spacing(3) }}>{user.name}</Text>
				<Avatar width={theme.spacing(8)} src={user.profilePicture} />
			</div>
		</Button>
	);
}

function UserSection(): JSX.Element {
	const { data: user, error } = dataHooks.useMe();

	if (error) {
		if (!(error instanceof ReturedError)) throw error;
		return <Login />;
	}

	if (user) {
		return <UserProfile user={user} />;
	}

	return <Text>Loading...</Text>;
}

export default UserSection;
