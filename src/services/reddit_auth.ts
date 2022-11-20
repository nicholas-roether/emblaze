import crypto from "crypto";
import { Session } from "solid-start/session/sessions";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import schema, { Validator } from "~/utils/schema";
import DB from "./database";
import env from "~/environment";
import { APIError } from "~/utils/api";
import Endpoints from "./endpoints";

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
class RedditAuth {
	public static readonly SUCCESS_URI = env().ORIGIN;
	private static readonly ENDPOINT = Endpoints.REDDIT_AUTH;
	private static readonly USER_ID_ENDPOINT = Endpoints.REDDIT + "/v1/me";
	private static readonly RETURN_URI = env().ORIGIN + "/auth/return";
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

	public static createAuthConfig(accessToken: string): AxiosRequestConfig {
		return {
			headers: {
				Authorization: `bearer ${accessToken}`
			}
		};
	}

	public static async createLoginRedirect(session: Session): Promise<string> {
		if (await this.getOrRefreshLogin(session)) return this.SUCCESS_URI;

		const sessionIdentifer = this.generateSessionIdentifier();
		session.set("identifier", sessionIdentifer);

		const loginRedirect = new URL(this.ENDPOINT + "/v1/authorize");
		loginRedirect.searchParams.set("client_id", env().REDDIT_CLIENT_ID);
		loginRedirect.searchParams.set("response_type", "code");
		loginRedirect.searchParams.set("state", sessionIdentifer);
		loginRedirect.searchParams.set("redirect_uri", this.RETURN_URI);
		loginRedirect.searchParams.set("duration", "permanent");
		loginRedirect.searchParams.set("scope", this.OAUTH_SCOPES.join(" "));
		return loginRedirect.toString();
	}

	public static async authorizeUser(
		session: Session,
		sessionIdentifier: string,
		accessCode: string
	): Promise<void> {
		const db = await DB.open();

		const currentSessionIdentifier = session.get("identifier");
		if (typeof currentSessionIdentifier !== "string")
			throw new APIError(400, "Malformed session identifier");
		if (currentSessionIdentifier !== sessionIdentifier)
			throw new APIError(403, "Incorrect session identifier");

		const newLogin = await this.getAccessToken(accessCode);
		const redditId = await this.getRedditId(newLogin.accessToken);

		const userId = await db.createOrReplaceUser({
			redditId,
			accessToken: newLogin.accessToken,
			expiresAt: newLogin.expiresAt,
			refreshToken: newLogin.refreshToken,
			scope: this.OAUTH_SCOPES
		});
		this.saveLogin(session, userId);
	}

	public static async logout(session: Session): Promise<void> {
		const db = await DB.open();
		const userId = this.getLoggedInUser(session);
		this.deleteLogin(session);
		if (userId) await db.deleteUser(userId);
	}

	public static async getOrRefreshLogin(
		session: Session
	): Promise<string | null> {
		return this.getLogin(session) ?? (await this.attemptLoginRefresh(session));
	}

	public static async getLogin(session: Session): Promise<string | null> {
		const db = await DB.open();

		const userId = this.getLoggedInUser(session);
		if (!userId) return null;

		const user = await db.getUser(userId);
		if (!user) return null;

		if (user.expiresAt.getTime() < Date.now()) return null;
		return user.accessToken;
	}

	public static async attemptLoginRefresh(
		session: Session
	): Promise<string | null> {
		const db = await DB.open();

		const userId = this.getLoggedInUser(session);
		if (!userId) return null;

		const user = await db.getUser(userId);
		if (!user || !this.scopesMatch(user.scope)) return null;

		const login = await this.refreshAccessToken(user.refreshToken);
		if (!login) return null;

		await db.replaceUserAccessToken(userId, login.accessToken, login.expiresAt);
		this.saveLogin(session, userId);

		return login.accessToken;
	}

	private static async getRedditId(accessToken: string): Promise<string> {
		const res = await axios.get(
			this.USER_ID_ENDPOINT,
			this.createAuthConfig(accessToken)
		);
		const userId = res.data.id;
		if (typeof userId !== "string") {
			throw new Error("Failed to get userId");
		}
		return userId;
	}

	private static async getAccessToken(accessCode: string): Promise<NewLogin> {
		const accessTokenData = await this.requestAccessToken(
			"authorization_code",
			"code",
			accessCode
		);
		if (!accessTokenData.refreshToken)
			throw new Error("Missing refresh token in access token response");
		return {
			accessToken: accessTokenData.accessToken,
			expiresAt: accessTokenData.expiresAt,
			refreshToken: accessTokenData.refreshToken
		};
	}

	private static async refreshAccessToken(
		refreshToken: string
	): Promise<Login | null> {
		return await this.requestAccessToken(
			"refresh_token",
			"refresh_token",
			refreshToken
		);
	}

	private static async requestAccessToken(
		grantType: string,
		tokenName: string,
		token: string
	): Promise<AccessTokenData> {
		try {
			const params = new URLSearchParams();
			params.set("grant_type", grantType);
			params.set(tokenName, token);
			params.set("redirect_uri", this.RETURN_URI);

			const res = await axios.post(
				this.ENDPOINT + "/v1/access_token",
				params.toString(),
				{
					auth: {
						username: env().REDDIT_CLIENT_ID,
						password: env().REDDIT_CLIENT_SECRET
					}
				}
			);
			redditAccessTokenResponseValidator.assert(res.data);

			if (!this.scopesMatch(res.data.scope.split(" ")))
				throw new Error("Access token scope did not match");
			return {
				accessToken: res.data.access_token,
				expiresAt: new Date(Date.now() + res.data.expires_in * 1000),
				refreshToken: res.data.refresh_token
			};
		} catch (err) {
			if (err instanceof AxiosError && err.status === 401) {
				throw new Error("Got 401 when requesting access token");
			}
			throw err;
		}
	}

	private static getLoggedInUser(session: Session): string | null {
		const userId = session.get("userId");
		if (typeof userId !== "string") return null;
		return userId;
	}

	private static saveLogin(session: Session, userId: string) {
		session.set("userId", userId);
	}

	private static deleteLogin(session: Session) {
		session.unset("userId");
	}

	private static generateSessionIdentifier() {
		return crypto.randomUUID();
	}

	private static scopesMatch(scopes: string[]) {
		return this.OAUTH_SCOPES.every((scope) => scopes.includes(scope));
	}
}

export default RedditAuth;
