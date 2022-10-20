import { useTheme } from "@emotion/react";
import { FiUser } from "react-icons/fi";
import dataHooks, { ReturedError } from "../../data_hooks";
import { User } from "../../models";
import Avatar from "../lib/avatar";
import Button from "../lib/button";
import Icon from "../lib/Icon";
import Text from "../lib/typography/Text";
import Skeleton from "react-loading-skeleton";

function Login(): JSX.Element {
	return (
		<Button href="/api/auth/login">
			Log in <Icon css={{ verticalAlign: "bottom" }}>{FiUser}</Icon>
		</Button>
	);
}

interface UserProfileProps {
	user?: User;
}

function UserProfile({ user }: UserProfileProps): JSX.Element {
	const theme = useTheme();

	const userProfileContent = (
		<span css={{ display: "flex", alignItems: "center" }}>
			<Text css={{ marginRight: theme.spacing(3) }}>
				{user ? user.name : <Skeleton width="80px" />}
			</Text>
			{user ? (
				<Avatar size="36px" src={user.profilePicture} />
			) : (
				<Skeleton circle width="36px" height="36px" />
			)}
		</span>
	);

	if (!user)
		return (
			<div css={{ padding: theme.spacing(1, 3) }}>{userProfileContent}</div>
		);

	return (
		<Button variant="text" padding="s">
			{userProfileContent}
		</Button>
	);
}

function UserSection(): JSX.Element {
	const { data: user, error } = dataHooks.useMe();

	if (error) {
		if (!(error instanceof ReturedError)) throw error;
		return <Login />;
	}

	return <UserProfile user={user} />;
}

export default UserSection;
