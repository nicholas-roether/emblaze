import { APIEvent, redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";

export async function GET({ request }: APIEvent) {
	const url = new URL(request.url);
	const error = url.searchParams.get("error");
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (error || !code || !state) {
		return new Response(error ?? "Unexpected request format", {
			status: 400
		});
	}

	const responseHeaders = new Headers();
	const success = await usingSession(
		request.headers,
		responseHeaders,
		(session) => RedditAuth.authorizeUser(session, state, code)
	);

	if (!success) {
		return new Response("Authorization failed", {
			status: 401,
			headers: responseHeaders
		});
	}
	return redirect(RedditAuth.SUCCESS_URI, { headers: responseHeaders });
}
