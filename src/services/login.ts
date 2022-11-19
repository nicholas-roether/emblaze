import { useServerContext } from "solid-start";
import RedditAuth from "./reddit_auth";
import { usingSession } from "./session_storage";

class Login {
	static async from(request: Request): Promise<string | null> {
		const serverCtx = useServerContext();
		return await usingSession(
			request.headers,
			serverCtx.responseHeaders,
			(session) => RedditAuth.getOrRefreshLogin(session)
		);
	}
}

export default Login;
