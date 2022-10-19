import Reddit from "../../../src/services/reddit";
import { Api } from "../../../src/utils/api";

const Me = Api.get(async (ctx) => {
	return await Reddit.me(ctx.session);
});

export default Me;
