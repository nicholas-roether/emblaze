import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";
import { User, userValidator } from "./models";
import schema, { Validator } from "./utils/schema";

const ENDPOINT = "/api/reddit";

class NetworkError extends Error {}

class ReturedError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

class DataHookResponse<T> {
	readonly error?: Error;
	readonly data?: T;

	constructor(data?: T, error?: Error) {
		this.data = data;
		this.error = error;
	}

	assert(): T | undefined {
		if (this.error) throw this.error;
		return this.data;
	}
}

interface FetcherResponse {
	status: number;
	value: unknown;
}

const fetcher = async (
	config: AxiosRequestConfig
): Promise<FetcherResponse> => {
	const res = await axios.request({
		baseURL: ENDPOINT,
		validateStatus(status) {
			return true;
		},
		...config
	});
	return { status: res.status, value: res.data };
};

type APIResponse = { data: unknown } | { error: string };

const apiResponseValidator: Validator<APIResponse> = schema.union<APIResponse>(
	[
		schema.object({
			data: schema.any()
		}),
		schema.object({
			error: schema.string()
		})
	],
	"apiResponse"
);

function useAPIResponse<T>(
	config: AxiosRequestConfig,
	validator: Validator<T>
): DataHookResponse<T> {
	const { data, error } = useSWR(config, fetcher);
	if (error) return new DataHookResponse<T>(undefined, error);
	if (data) {
		const { value, status } = data;
		apiResponseValidator.assert(value);
		if ("error" in value) {
			return new DataHookResponse<T>(
				undefined,
				new ReturedError(value.error, status)
			);
		}
		validator.assert(value.data);
		return new DataHookResponse(value.data);
	}
	return new DataHookResponse();
}

const dataHooks = {
	useMe(): DataHookResponse<User> {
		return useAPIResponse({ url: "me" }, userValidator);
	}
};

export default dataHooks;

export { NetworkError, ReturedError };

export type { DataHookResponse };
