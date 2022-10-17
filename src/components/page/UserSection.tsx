import { FiUser } from "react-icons/fi";
import Button from "../lib/button";
import Icon from "../lib/Icon";

function UserSection(): JSX.Element {
	return (
		<Button href="/api/auth/login">
			Log in <Icon css={{ verticalAlign: "bottom" }}>{FiUser}</Icon>
		</Button>
	);
}

export default UserSection;
