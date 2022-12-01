import { getIronSession, IronSession, IronSessionOptions } from "iron-session";
import env from "~/environment";

declare module "iron-session" {
	interface IronSessionData {
		identifier?: string;
		userId?: string;
	}
}

const SESSION_LIFETIME = 60 * 60 * 24 * 30;

const SESSION_OPTIONS: IronSessionOptions = {
	password: env().SESSION_SECRET,
	cookieName: "emblaze-session",
	ttl: SESSION_LIFETIME,
	cookieOptions: {
		secure: env().NODE_ENV === "production"
	}
};

async function getSession(
	req: Request,
	responseHeaders: Headers
): Promise<IronSession> {
	const res = new Response();
	const session = await getIronSession(req, res, SESSION_OPTIONS);
	res.headers.forEach(([name, value]) => responseHeaders.set(name, value));
	return session;
}

export { getSession, SESSION_LIFETIME };
