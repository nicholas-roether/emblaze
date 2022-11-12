import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { User } from "~/models";
import { getServices } from "~/services";

export default function Home() {
	const user = useRouteData<typeof routeData>();

	function userText() {
		const userVal = user();
		if (!userVal) return "Not logged in";
		else return `Logged in as ${userVal.name}`;
	}

	return (
		<main>
			<h1>Emblaze</h1>
			<p>{userText()}</p>
		</main>
	);
}

export function routeData() {
	return createServerData$(async (_, { request }): Promise<User | null> => {
		const { reddit, auth, sessionStorage } = await getServices();
		const session = await sessionStorage.getSession(
			request.headers.get("Cookie")
		);
		const login = await auth.getOrRefreshLogin(session);
		if (!login) return null;
		return reddit.me(login);
	});
}
