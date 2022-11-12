import crypto from "crypto";
import { Session } from "solid-start/session/sessions";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import schema, { Validator } from "~/utils/schema";
import DB from "./database";

interface RedditAccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	refresh_token?: string;
}

const redditAccessTokenResponseValidator: Validator<RedditAccessTokenResponse> =
	schema.object(
		{
			access_token: schema.string(),
			token_type: schema.string(),
			expires_in: schema.number().integer(),
			scope: schema.string(),
			refresh_token: schema.optional(schema.string())
		},
		"AccessTokenResponse"
	);

interface Login {
	accessToken: string;
	expiresAt: Date;
}

interface NewLogin extends Login {
	refreshToken: string;
}

interface AccessTokenData {
	accessToken: string;
	expiresAt: Date;
	refreshToken?: string;
}

const REDDIT_AUTH_ENDPOINT = "https://www.reddit.com/api/v1";
const REDDIT_ENDPOINT = "https://oauth.reddit.com/api/v1";

class RedditAuth {
	private static readonly ENDPOINT = this.getEndpoint();
	private static readonly USER_ID_ENDPOINT = this.getUserIdEndpoint();
	private static readonly RETURN_URI = process.env.ORIGIN + "/auth/return";
	private static readonly SUCCESS_URI = process.env.ORIGIN;
	private static readonly OAUTH_SCOPES = [
		"account",
		"edit",
		"flair",
		"history",
		"identity",
		"mysubreddits",
		"read",
		"report",
		"save",
		"submit",
		"subscribe",
		"vote",
		"wikiread"
	];

	private readonly db: DB;

	constructor(db: DB) {
		this.db = db;
	}

	public static createAuthConfig(accessToken: string): AxiosRequestConfig {
		return {
			headers: {
				Authorization: `bearer ${accessToken}`
			}
		};
	}

	public async createLoginRedirect(session: Session): Promise<string> {
		if (await this.getOrRefreshLogin(session)) return RedditAuth.SUCCESS_URI;

		const sessionIdentifer = RedditAuth.generateSessionIdentifier();
		session.set("identifier", sessionIdentifer);

		const loginRedirect = new URL(RedditAuth.ENDPOINT + "/authorize");
		loginRedirect.searchParams.set("client_id", process.env.REDDIT_CLIENT_ID);
		loginRedirect.searchParams.set("response_type", "code");
		loginRedirect.searchParams.set("state", sessionIdentifer);
		loginRedirect.searchParams.set("redirect_uri", RedditAuth.RETURN_URI);
		loginRedirect.searchParams.set("duration", "permanent");
		loginRedirect.searchParams.set("scope", RedditAuth.OAUTH_SCOPES.join(" "));
		return loginRedirect.toString();
	}

	public async authorizeUser(
		session: Session,
		sessionIdentifier: string,
		accessCode: string
	): Promise<boolean> {
		const currentSessionIdentifier = session.get("identifier");
		if (typeof currentSessionIdentifier !== "string") return false;
		if (currentSessionIdentifier !== sessionIdentifier) return false;

		const newLogin = await this.getAccessToken(accessCode);
		if (!newLogin) return false;
		const redditId = await this.getRedditId(newLogin.accessToken);

		const userId = await this.db.createOrReplaceUser({
			redditId,
			refreshToken: newLogin.refreshToken,
			scope: RedditAuth.OAUTH_SCOPES
		});
		await this.saveLogin(session, newLogin, userId);

		return true;
	}

	public async getOrRefreshLogin(session: Session): Promise<string | null> {
		return this.getLogin(session) ?? (await this.attemptLoginRefresh(session));
	}

	public getLogin(session: Session): string | null {
		const accessToken = session.get("accessToken");
		const accessExpiresAt = session.get("accessExpiresAt");
		if (typeof accessToken !== "string" || !(accessExpiresAt instanceof Date))
			return null;
		if (accessExpiresAt.getTime() < Date.now()) return null;
		return accessToken;
	}

	public async attemptLoginRefresh(session: Session): Promise<string | null> {
		const userId = this.getLoggedInUser(session);
		if (!userId) return null;

		const user = await this.db.getUser(userId);
		if (!user || !RedditAuth.scopesMatch(user.scope)) return null;

		const login = await this.refreshAccessToken(user.refreshToken);
		if (!login) return null;

		this.saveLogin(session, login, userId);
		return login.accessToken;
	}

	private async getRedditId(accessToken: string): Promise<string> {
		const res = await axios.get(
			RedditAuth.USER_ID_ENDPOINT,
			RedditAuth.createAuthConfig(accessToken)
		);
		const userId = res.data.data.id;
		if (typeof userId !== "string") {
			throw new Error("Failed to get userId!");
		}
		return userId;
	}

	private async getAccessToken(accessCode: string): Promise<NewLogin | null> {
		const accessTokenData = await this.requestAccessToken(
			"authorization_code",
			"code",
			accessCode
		);
		if (!accessTokenData || !accessTokenData.refreshToken) return null;
		return {
			accessToken: accessTokenData.accessToken,
			expiresAt: accessTokenData.expiresAt,
			refreshToken: accessTokenData.refreshToken
		};
	}

	private async refreshAccessToken(
		refreshToken: string
	): Promise<Login | null> {
		return await this.requestAccessToken(
			"refresh_token",
			"refresh_token",
			refreshToken
		);
	}

	private async requestAccessToken(
		grantType: string,
		tokenName: string,
		token: string
	): Promise<AccessTokenData | null> {
		try {
			const params = new URLSearchParams();
			params.set("grant_type", grantType);
			params.set(tokenName, token);

			const res = await axios.post(
				RedditAuth.ENDPOINT + "/access_token",
				params.toString(),
				{
					auth: {
						username: process.env.REDDIT_CLIENT_ID,
						password: process.env.REDDIT_CLIENT_SECRET
					}
				}
			);
			redditAccessTokenResponseValidator.assert(res.data);

			if (!RedditAuth.scopesMatch(res.data.scope.split(" "))) return null;
			return {
				accessToken: res.data.access_token,
				expiresAt: new Date(Date.now() + res.data.expires_in * 1000),
				refreshToken: res.data.refresh_token
			};
		} catch (err) {
			if (err instanceof AxiosError && err.status === 401) {
				return null;
			}
			console.error(
				`Unexpected error occurred while attempting to get access token: ${err}`
			);
		}
		return null;
	}

	private getLoggedInUser(session: Session): string | null {
		const userId = session.get("userId");
		if (typeof userId !== "string") return null;
		return userId;
	}

	private saveLogin(session: Session, login: Login, userId: string) {
		session.set("userId", userId);
		session.set("accessToken", login.accessToken);
		session.set("accessExpiresAt", login.expiresAt);
	}

	private static generateSessionIdentifier() {
		return crypto.randomUUID();
	}

	private static scopesMatch(scopes: string[]) {
		return this.OAUTH_SCOPES.every((scope) => scopes.includes(scope));
	}

	private static getEndpoint(): string {
		if (
			process.env.NODE_ENV === "development" &&
			process.env.DEBUG_REDDIT_AUTH_ENDPOINT
		) {
			return process.env.DEBUG_REDDIT_AUTH_ENDPOINT;
		}
		return REDDIT_AUTH_ENDPOINT;
	}

	private static getUserIdEndpoint(): string {
		if (
			process.env.NODE_ENV === "development" &&
			process.env.DEBUG_REDDIT_ENDPOINT
		) {
			return process.env.DEBUG_REDDIT_ENDPOINT + "/me";
		}
		return REDDIT_ENDPOINT + "/me";
	}
}

export default RedditAuth;
