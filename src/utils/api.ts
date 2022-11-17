import { APIEvent } from "solid-start";
import { Session } from "solid-start/session/sessions";
import { usingSession } from "~/services/session_storage";
import { ValidationError } from "./schema";

class APIError extends Error {
	public readonly status: number;
	public readonly message: string;

	constructor(status: number, message: string) {
		super(`HTTP ${status}: ${message}`);
		this.status = status;
		this.message = message;
	}
}

function handler(
	cb: (event: APIEvent, session: Session) => Response | Promise<Response>
): (event: APIEvent) => Promise<Response> {
	return async (event) => {
		try {
			const responseHeaders = new Headers();
			const res = await usingSession(
				event.request.headers,
				responseHeaders,
				async (session) => await cb(event, session)
			);
			responseHeaders.forEach((value, name) => res.headers.append(name, value));
			return res;
		} catch (err) {
			if (err instanceof APIError) {
				return new Response(err.message, { status: err.status });
			}
			console.error(`${err}`);
			if (err instanceof ValidationError) {
				console.error(
					"Actual value was:\n" + JSON.stringify(err.actual, undefined, 3)
				);
			}
			return new Response("Internal server error", { status: 500 });
		}
	};
}

export { APIError, handler };
