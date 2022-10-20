import { AxiosError } from "axios";
import Reddit from "../../../../src/services/reddit";
import { Api, ApiError } from "../../../../src/utils/api";

const TestReq = Api.handler(async (ctx) => {
	const { href } = ctx.req.query;
	if (!href) throw new ApiError(400, "No api href provided");
	const url = "/" + (typeof href == "string" ? href : href.join("/"));
	try {
		const data = await Reddit.test(ctx.session, url, ctx.req.query);
		return data;
	} catch (err) {
		if (err instanceof AxiosError) {
			throw new ApiError(
				err.status ?? 500,
				"Request failed; " + err.response?.data
					? JSON.stringify(err.response?.data)
					: "No response body",
				{ cause: err }
			);
		}
		throw err;
	}
});

export default TestReq;
