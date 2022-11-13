import { redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";
import { handler } from "~/utils/api";

export const GET = handler(async ({ request }) => {
	const responseHeaders = new Headers();
	const redirectUrl = await usingSession(
		request.headers,
		responseHeaders,
		(session) => RedditAuth.createLoginRedirect(session)
	);
	return redirect(redirectUrl, { headers: responseHeaders });
});
