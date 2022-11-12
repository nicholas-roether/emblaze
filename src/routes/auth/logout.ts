import { APIEvent, redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";

export async function GET({ request }: APIEvent) {
	const responseHeaders = new Headers();
	await usingSession(request.headers, responseHeaders, (session) =>
		RedditAuth.logout(session)
	);
	return redirect(RedditAuth.SUCCESS_URI, { headers: responseHeaders });
}
