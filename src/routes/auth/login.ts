import { redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { handler } from "~/utils/api";

export const GET = handler(async (_event, session) => {
	const redirectUrl = await RedditAuth.createLoginRedirect(session);
	return redirect(redirectUrl);
});
