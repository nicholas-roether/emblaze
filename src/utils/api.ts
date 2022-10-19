import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import Cookies from "cookies";
import { getIronSession, IronSession } from "iron-session";
import DB from "../services/db";

declare module "iron-session" {
	interface IronSessionData {
		secret?: string;
		user?: string;
	}
}

class ApiContext {
	readonly req: NextApiRequest;
	readonly res: NextApiResponse;
	readonly cookies: Cookies;
	private _session: IronSession | null = null;

	constructor(req: NextApiRequest, res: NextApiResponse) {
		this.req = req;
		this.res = res;
		this.cookies = new Cookies(req, res);
	}

	get session(): IronSession {
		if (!this._session)
			throw new Error("API context has not been initialized yet!");
		return this._session;
	}

	async init() {
		this._session = await getIronSession(this.req, this.res, {
			cookieName: "emblaze-session",
			password: process.env.COOKIE_PASSWORD!,
			cookieOptions: {
				secure: process.env.NODE_ENV === "production",
				domain: process.env.COOKIE_DOMAIN
			}
		});
		await DB.connect();
	}
}

class ApiError extends Error {
	readonly status: number;
	readonly message: string;

	constructor(status: number, message: string, options?: ErrorOptions) {
		super(`HTTP ${status}: ${message}`, options);
		this.status = status;
		this.message = message;
	}
}

type ResponseType = "html" | "json" | "raw";

interface ApiHandlerConfig {
	method?: string;
	responseType?: ResponseType;
	allowHead?: boolean;
}

type ApiHandlerHelperConfig = Omit<ApiHandlerConfig, "method">;

type ApiHandlerCallback = (ctx: ApiContext) => unknown;

class Api {
	static readonly ERROR_ENDPOINT = "/error";

	static get(
		callback: ApiHandlerCallback,
		config: ApiHandlerHelperConfig = {}
	) {
		return this.handler(callback, { method: "GET", ...config });
	}

	static post(
		callback: ApiHandlerCallback,
		config: ApiHandlerHelperConfig = {}
	) {
		return this.handler(callback, { method: "POST", ...config });
	}

	static handler(
		callback: ApiHandlerCallback,
		config: ApiHandlerConfig = {}
	): NextApiHandler {
		config.responseType ??= "json";
		config.allowHead ??= true;
		return async (req, res) => {
			const ctx = new ApiContext(req, res);
			try {
				await ctx.init();
				const body = await this.executeCallback(config, ctx, callback);
				this.handleBody(ctx, body, config.responseType!);
			} catch (err) {
				this.handleError(ctx, err, config.responseType!);
			}
		};
	}

	private static async executeCallback(
		config: ApiHandlerConfig,
		ctx: ApiContext,
		callback: ApiHandlerCallback
	): Promise<unknown> {
		if (
			config.method &&
			ctx.req.method !== config.method &&
			(!config.allowHead || ctx.req.method !== "HEAD")
		) {
			throw new ApiError(
				405,
				`This resource can only be accessed via a ${config.method} request.`
			);
		}
		return await callback(ctx);
	}

	private static handleBody(
		ctx: ApiContext,
		body: unknown,
		responseType: ResponseType
	) {
		if (body === null || body === undefined) return;
		if (ctx.res.closed) {
			throw new Error(
				"Api handler returned a value but response was already closed!"
			);
		}
		if (responseType === "json") ctx.res.json({ data: body });
		else ctx.res.send(body);
	}

	private static handleError(
		ctx: ApiContext,
		error: unknown,
		responseType: ResponseType
	) {
		let status = 500;
		let message = "Internal server error";
		if (error instanceof ApiError) {
			status = error.status;
			message = error.message;
		}
		this.logError(ctx, error);

		ctx.res.status(status);
		switch (responseType) {
			case "html":
				ctx.res.redirect(
					this.ERROR_ENDPOINT +
						`?status=${status}&message=${encodeURIComponent(message)}`
				);
				break;
			case "json":
				ctx.res.json({ error: message });
				break;
			case "raw":
				ctx.res.send(message);
		}
	}

	private static logError(ctx: ApiContext, error: unknown) {
		const route = ctx.req.url!;
		if (error instanceof Error) {
			console.log(`${error.name} in ${route}: ${error.message}`);
			console.error(error.stack);
			if (error.cause) this.logErrorCause(error.cause);
		} else {
			console.error(`Error in ${route}: ${error}`);
		}
	}

	private static logErrorCause(cause: unknown) {
		console.log(`Caused by: ${cause}`);
		if (cause instanceof Error) {
			console.error(cause.stack);
			if (cause.cause) this.logErrorCause(cause.cause);
		}
	}
}

export { ApiContext, ApiError, Api };
export type { ApiHandlerCallback, ApiHandlerConfig, ApiHandlerHelperConfig };
