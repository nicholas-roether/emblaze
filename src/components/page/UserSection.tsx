import { FiUser } from "react-icons/fi";
import dataHooks from "../../data_hooks";
import Button from "../lib/button";
import Icon from "../lib/Icon";

function UserSection(): JSX.Element {
	const { data: user, error } = dataHooks.useMe();

	if (error) throw error;

	return (
		<>
			{JSON.stringify(user)}
			<Button href="/api/auth/login">
				Log in <Icon css={{ verticalAlign: "bottom" }}>{FiUser}</Icon>
			</Button>
		</>
	);
}

export default UserSection;
