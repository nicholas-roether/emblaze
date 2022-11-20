import env from "~/environment";

class Endpoints {
	private static readonly REDDIT_DEFAULT = "https://oauth.reddit.com/api";
	private static readonly REDDIT_AUTH_DEFAULT = "https://www.reddit.com/api";

	public static readonly REDDIT = this.getEndpoint(
		this.REDDIT_DEFAULT,
		env().DEBUG_REDDIT_ENDPOINT
	);
	public static readonly REDDIT_AUTH = this.getEndpoint(
		this.REDDIT_AUTH_DEFAULT,
		env().DEBUG_REDDIT_AUTH_ENDPOINT
	);

	private static getEndpoint(
		defaultEndpoint: string,
		debugEndpoint?: string
	): string {
		if (env().NODE_ENV !== "production" && debugEndpoint) return debugEndpoint;
		return defaultEndpoint;
	}
}

export default Endpoints;
