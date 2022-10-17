import OAuth from "../../../src/services/oauth";
import { Api, ApiContext, ApiError } from "../../../src/utils/api";
import schema from "../../../src/utils/schema";

const querySchema = schema.union<
	{ error: string } | { code: string; state: string }
>(
	schema.object({
		error: schema.string()
	}),
	schema.object({
		code: schema.string(),
		state: schema.string()
	})
);

function handleError(ctx: ApiContext, error: string) {
	if (error === "access_denied") ctx.res.redirect("/");
	else {
		throw new ApiError(500, `Authentication failed: ${error}`);
	}
}

const Return = Api.get(
	async (ctx) => {
		if (!querySchema.check(ctx.req.query))
			throw new ApiError(400, "Unexpected response format");
		if ("error" in ctx.req.query) handleError(ctx, ctx.req.query.error);
		else {
			await OAuth.authorize(
				{ accessCode: ctx.req.query.code, state: ctx.req.query.state },
				ctx.session
			);
			ctx.res.redirect("/");
		}
	},
	{ responseType: "html" }
);

export default Return;
