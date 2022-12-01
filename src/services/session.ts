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

async function getSession(req: Request, res: Response): Promise<IronSession> {
	return getIronSession(req, res, SESSION_OPTIONS);
}

export { getSession, SESSION_LIFETIME };
