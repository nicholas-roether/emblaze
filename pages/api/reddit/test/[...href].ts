import Reddit from "../../../../src/services/reddit";
import { Api, ApiError } from "../../../../src/utils/api";

const TestReq = Api.handler(async (ctx) => {
	const { href } = ctx.req.query;
	if (!href) throw new ApiError(400, "No api href provided");
	const url = typeof href == "string" ? href : href.join("/");
	const data = await Reddit.test(ctx.session, url);
	return data;
});

export default TestReq;
