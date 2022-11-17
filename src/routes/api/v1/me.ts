import { json } from "solid-start";
import Reddit from "~/services/reddit";
import RedditAuth from "~/services/reddit_auth";
import { handler } from "~/utils/api";

export const GET = handler(async (_event, session) => {
	const login = await RedditAuth.getOrRefreshLogin(session);
	if (!login) return new Response("Not logged in", { status: 401 });

	const loggedInUser = await Reddit.me(login);
	return json(loggedInUser);
});
