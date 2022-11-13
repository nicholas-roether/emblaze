import { createSessionStorage, SessionStorage } from "solid-start";
import { Session } from "solid-start/session/sessions";
import env from "~/environment";
import DB from "./database";

const SESSION_LIFETIME = 60 * 60 * 24 * 30;

let _sessionStorage: SessionStorage | null = null;

async function getSessionStorage() {
	const db = await DB.open();
	return (
		_sessionStorage ??
		(_sessionStorage = createSessionStorage({
			cookie: {
				name: "session",
				secure: process.env.NODE_ENV !== "development",
				secrets: [env().SESSION_SECRET],
				sameSite: "lax",
				path: "/",
				maxAge: SESSION_LIFETIME,
				httpOnly: true
			},
			createData: (data, expires) => db.createSession(data, expires),
			updateData: (id, data, expires) => db.updateSession(id, data, expires),
			deleteData: (id) => db.deleteSession(id),
			readData: (id) => db.readSession(id)
		}))
	);
}

async function usingSession<T>(
	requestHeaders: Headers,
	responseHeaders: Headers,
	callback: (session: Session) => T | Promise<T>
): Promise<T> {
	const sessionStorage = await getSessionStorage();
	const session = await sessionStorage.getSession(requestHeaders.get("Cookie"));
	const result = await callback(session);
	const setCookie = await sessionStorage.commitSession(session);
	responseHeaders.set("Set-Cookie", setCookie);
	return result;
}

export { getSessionStorage, usingSession };
