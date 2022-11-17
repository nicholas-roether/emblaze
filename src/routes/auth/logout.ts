import { redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { handler } from "~/utils/api";

export const GET = handler(async (_event, session) => {
	const responseHeaders = new Headers();
	await RedditAuth.logout(session);
	return redirect(RedditAuth.SUCCESS_URI, { headers: responseHeaders });
});
