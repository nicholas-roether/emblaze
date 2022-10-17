import { NextApiHandler, NextApiRequest, NextApiResponse } from "next/types";
import Cookies from "cookies";

class ApiContext {
	readonly req: NextApiRequest;
	readonly res: NextApiResponse;
	readonly cookies: Cookies;

	constructor(req: NextApiRequest, res: NextApiResponse) {
		this.req = req;
		this.res = res;
		this.cookies = new Cookies(req, res);
	}
}

class ApiError extends Error {
	readonly status: number;
	readonly message: string;

	constructor(status: number, message: string) {
		super(`HTTP ${status}: ${message}`);
		this.status = status;
		this.message = message;
	}
}

type ResponseType = "html" | "json" | "raw";

interface ApiHandlerConfig {
	method: string;
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
		config: ApiHandlerConfig
	): NextApiHandler {
		config.responseType ??= "json";
		config.allowHead ??= true;
		return (req, res) => {
			const ctx = new ApiContext(req, res);
			try {
				const body = this.executeCallback(config, ctx, callback);
				this.handleBody(ctx, body, config.responseType!);
			} catch (err) {
				this.handleError(ctx, err, config.responseType!);
			}
		};
	}

	private static executeCallback(
		config: ApiHandlerConfig,
		ctx: ApiContext,
		callback: ApiHandlerCallback
	): unknown {
		if (
			ctx.req.method !== config.method &&
			(!config.allowHead || ctx.req.method !== "HEAD")
		) {
			throw new ApiError(
				405,
				`This resource can only be accessed via a ${config.method} request.`
			);
		}
		return callback(ctx);
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
		if (status >= 500) this.logError(ctx, error);

		ctx.res.status(status);
		switch (responseType) {
			case "html":
				ctx.res.redirect(
					this.ERROR_ENDPOINT + `?status=${status}&message=${message}`
				);
				break;
			case "json":
				ctx.res.json({ error: { message } });
				break;
			case "raw":
				ctx.res.send(message);
		}
	}

	private static logError(ctx: ApiContext, error: unknown) {
		const route = ctx.req.url!;
		console.error(`Api error in ${route}: ${error}`);
	}
}

export { ApiContext, ApiError, Api };
export type { ApiHandlerCallback, ApiHandlerConfig, ApiHandlerHelperConfig };
