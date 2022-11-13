import { APIEvent } from "solid-start";
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
	cb: (event: APIEvent) => Response | Promise<Response>
): (event: APIEvent) => Promise<Response> {
	return async (event) => {
		try {
			return await cb(event);
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
