import { useRouteData, useServerContext } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { User } from "~/models";
import Reddit from "~/services/reddit";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";

export default function Home() {
	const user = useRouteData<typeof routeData>();

	function userProfile() {
		const userVal = user();
		if (!userVal) {
			return (
				<>
					<p>Not logged in</p>
					<a href="/auth/login">Log in</a>
				</>
			);
		} else {
			return (
				<>
					<p>Logged in as {userVal.name}</p>
					<a href="/auth/logout">Log out</a>
				</>
			);
		}
	}

	return (
		<main>
			<h1>Emblaze</h1>
			{userProfile()}
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
