import { createCookieSessionStorage } from "solid-start";
import { Session } from "solid-start/session/sessions";
import env from "~/environment";

const SESSION_LIFETIME = 60 * 60 * 24 * 30;

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "session",
		secure: process.env.NODE_ENV !== "development",
		secrets: [env().SESSION_SECRET],
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_LIFETIME,
		httpOnly: true
	},
});


async function usingSession<T>(
	requestHeaders: Headers,
	responseHeaders: Headers,
	callback: (session: Session) => T | Promise<T>
): Promise<T> {
	const session = await sessionStorage.getSession(requestHeaders.get("Cookie"));
	const result = await callback(session);
	const setCookie = await sessionStorage.commitSession(session);
	responseHeaders.set("Set-Cookie", setCookie);
	return result;
}

export { usingSession };
