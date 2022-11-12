import { APIEvent, redirect } from "solid-start";
import { getServices } from "~/services";

export async function GET({ request }: APIEvent) {
	const { sessionStorage, auth } = await getServices();
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie")
	);
	const redirectUrl = await auth.createLoginRedirect(session);
	await sessionStorage.commitSession(session);
	return redirect(redirectUrl);
}
