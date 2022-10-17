import OAuth from "../../../src/services/oauth";
import { Api } from "../../../src/utils/api";

const Login = Api.get(async (ctx) => {
	const loginUri = await OAuth.createLoginUri(ctx.session);
	ctx.res.redirect(loginUri);
});

export default Login;
