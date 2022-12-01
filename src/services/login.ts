import { useServerContext } from "solid-start";
import RedditAuth from "./reddit_auth";
import { usingSession } from "./session_storage";

class Login {
	static async get(): Promise<string | null> {
		const serverCtx = useServerContext();
		return await usingSession(
			serverCtx.request.headers,
			serverCtx.responseHeaders,
			(session) => RedditAuth.getOrRefreshLogin(session)
		);
	}
}

export default Login;
