import { APIEvent, redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";

export async function GET({ request }: APIEvent) {
	const responseHeaders = new Headers();
	const redirectUrl = await usingSession(
		request.headers,
		responseHeaders,
		(session) => RedditAuth.createLoginRedirect(session)
	);
	return redirect(redirectUrl, { headers: responseHeaders });
}
