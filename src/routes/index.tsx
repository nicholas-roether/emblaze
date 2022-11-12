import { useRouteData, useServerContext } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { User } from "~/models";
import Reddit from "~/services/reddit";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";

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
		const ctx = useServerContext();
		const login = await usingSession(
			request.headers,
			ctx.responseHeaders,
			(session) => RedditAuth.getOrRefreshLogin(session)
		);
		if (!login) return null;
		return await Reddit.me(login);
	});
}
