import axios, { AxiosRequestConfig } from "axios";
import useSWR from "swr";
import { User, userValidator } from "./models";
import schema, { Validator } from "./utils/schema";

const ENDPOINT = "/api/reddit";

class NetworkError extends Error {
	readonly status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.status = status;
	}
}

class ReturedError extends Error {}

interface DataHookResponse<T> {
	error?: Error;
	data?: T;
}

const fetcher = async (config: AxiosRequestConfig): Promise<unknown> => {
	const res = await axios.request({
		baseURL: ENDPOINT,
		validateStatus(status) {
			return true;
		},
		...config
	});
	return res.data;
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
	if (error) return { error };
	if (data) {
		console.log(data);
		apiResponseValidator.assert(data);
		if ("error" in data) {
			return { error: new ReturedError(data.error) };
		}
		validator.assert(data.data);
		return { data: data.data };
	}
	return {};
}

const dataHooks = {
	useMe(): DataHookResponse<User> {
		return useAPIResponse({ url: "me" }, userValidator);
	}
};

export default dataHooks;

export { NetworkError, ReturedError };

export type { DataHookResponse };
