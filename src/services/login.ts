import { useServerContext } from "solid-start";
import RedditAuth from "./reddit_auth";
import { getSession } from "./session";

class Login {
	static async get(): Promise<string | null> {
		const serverCtx = useServerContext();
		const session = await getSession(
			serverCtx.request,
			serverCtx.responseHeaders
		);
		return await RedditAuth.getOrRefreshLogin(session);
	}
}

export default Login;
