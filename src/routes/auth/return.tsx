import { redirect } from "solid-start";
import RedditAuth from "~/services/reddit_auth";
import { usingSession } from "~/services/session_storage";
import { handler } from "~/utils/api";

export const GET = handler(async ({ request }) => {
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
	await usingSession(request.headers, responseHeaders, (session) =>
		RedditAuth.authorizeUser(session, state, code)
	);

	return redirect(RedditAuth.SUCCESS_URI, { headers: responseHeaders });
});
