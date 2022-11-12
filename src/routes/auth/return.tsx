import { APIEvent, redirect } from "solid-start";
import { getServices } from "~/services";
import RedditAuth from "~/services/reddit_auth";

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
	const { auth, sessionStorage } = await getServices();
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie")
	);
	const success = await auth.authorizeUser(session, state, code);
	await sessionStorage.commitSession(session);
	if (!success) return new Response("Authorization failed", { status: 401 });
	return redirect(RedditAuth.SUCCESS_URI);
}
