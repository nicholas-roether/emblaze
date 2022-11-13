import { redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";
import { handler } from "~/utils/api";

export const GET = handler(async ({ request }) => {
	const responseHeaders = new Headers();
	await usingSession(request.headers, responseHeaders, (session) =>
		RedditAuth.logout(session)
	);
	return redirect(RedditAuth.SUCCESS_URI, { headers: responseHeaders });
});
