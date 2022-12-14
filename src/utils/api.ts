import { AxiosError } from "axios";
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

type HanderCallback = (
	event: APIEvent,
	session: Session
) => Response | Promise<Response>;

async function runHandlerCallback(
	cb: HanderCallback,
	event: APIEvent
): Promise<Response> {
	const responseHeaders = new Headers();
	const res = await usingSession(
		event.request.headers,
		responseHeaders,
		async (session) => await cb(event, session)
	);
	responseHeaders.forEach((value, name) => res.headers.append(name, value));
	return res;
}

function isAxiosError(error: unknown): error is AxiosError {
	if (!error) return false;
	return (error as { isAxiosError: unknown }).isAxiosError === true;
}

function createErrorLog(error: unknown): string {
	if (error instanceof Error && error.stack) return error.stack;
	return `${error}`;
}

function handleApiError(error: unknown) {
	if (error instanceof APIError) {
		return new Response(error.message, { status: error.status });
	}

	console.error(createErrorLog(error));
	if (error instanceof ValidationError) {
		console.error("Actual value was: " + JSON.stringify(error.actual));
	} else if (isAxiosError(error)) {
		if (error.config) {
			console.error(
				`Request config:\n${JSON.stringify(error.config, undefined, 3)}`
			);
		}
		const request = error.request ?? error.response?.request;
		if (request instanceof Request) {
			console.error(`Tried to request ${request.url}`);
			console.error(
				`Request headers:\n${JSON.stringify(request.headers, undefined, 3)}`
			);
		}
		if (error.response) {
			console.error(
				`Response headers:\n${JSON.stringify(
					error.response.headers,
					undefined,
					3
				)}`
			);
			console.error(`Response body:\n${error.response.data}`);
		}
	}
	return new Response("Internal server error", { status: 500 });
}

function handler(
	cb: (event: APIEvent, session: Session) => Response | Promise<Response>
): (event: APIEvent) => Promise<Response> {
	return async (event) => {
		try {
			return await runHandlerCallback(cb, event);
		} catch (error) {
			return handleApiError(error);
		}
	};
}

export { APIError, handler };
