import crypto from "crypto";
import axios, { AxiosRequestConfig } from "axios";
import schema, { Validator } from "../utils/schema";
import { IronSession } from "iron-session";
import { ApiError } from "../utils/api";
import DB from "./db";

interface RedditAccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	refresh_token: string;
}

const redditAccessTokenResValidator: Validator<RedditAccessTokenResponse> =
	schema.object(
		{
			access_token: schema.string(),
			token_type: schema.string(),
			expires_in: schema.number().integer(),
			scope: schema.string(),
			refresh_token: schema.string()
		},
		"accessTokenResponse"
	);

interface AccessTokenResponse {
	accessToken: string;
	expiresAt: Date;
	refreshToken: string;
	tokenType: string;
	scope: string;
}

interface AuthorizationResponse {
	accessCode: string;
	state: string;
}

class OAuth {
	private static readonly ENDPOINT = process.env.REDDIT_AUTH_API!;
	private static readonly USER_ID_ENDPOINT = process.env.REDDIT_API! + "/me";
	private static readonly CLIENT_ID = process.env.REDDIT_CLIENT_ID!;
	private static readonly REDIRECT_URL = process.env.HOST! + "/api/auth/return";
	private static readonly OAUTH_SCOPE =
		"account edit flair history identity mysubreddits read report save submit subscribe vote wikiread";

	static async createLoginUri(session: IronSession): Promise<string> {
		await this.generateSessionSecret(session);

		const authUrl = this.getRequestURL("/authorize");
		authUrl.searchParams.set("client_id", this.CLIENT_ID);
		authUrl.searchParams.set("response_type", "code");
		authUrl.searchParams.set("state", session.secret!);
		authUrl.searchParams.set("redirect_uri", this.REDIRECT_URL);
		authUrl.searchParams.set("duration", "permanent");
		authUrl.searchParams.set("scope", this.OAUTH_SCOPE);
		return authUrl.toString();
	}

	static async authorize(
		response: AuthorizationResponse,
		session: IronSession
	) {
		if (!session.secret) throw new ApiError(403, "Unexpected login attempt");
		if (response.state !== session.secret)
			throw new ApiError(401, "Invalid OAuth state");

		const res = await this.getAccessToken(response.accessCode);
		if (res.tokenType !== "bearer") throw new Error("Unknown token type");
		if (!this.scopesMatch(res.scope, this.OAUTH_SCOPE)) {
			throw new Error("Missing required permissions");
		}

		const redditUserId = await this.getRedditUserId(res.accessToken);
		let userId = (await DB.getUserByRedditId(redditUserId))?.id;

		if (!userId) {
			userId = await DB.createUser({
				redditUserId,
				accessToken: res.accessToken,
				refreshToken: res.refreshToken,
				expiresAt: res.expiresAt,
				scope: res.scope
			});
		}

		if (!userId) {
			throw new Error("Failed to write user to database!");
		}

		session.user = userId;
		await session.save();
	}

	private static async getRedditUserId(accessToken: string) {
		const res = await axios.get(
			this.USER_ID_ENDPOINT,
			this.createAuthHeader(accessToken)
		);
		const userId = res.data.data.id;
		if (!userId) {
			throw new Error(
				"Failed to get userId; response was:\n" +
					JSON.stringify(res.data, undefined, 3)
			);
		}
		return userId;
	}

	static async authenticateRequest(
		session: IronSession
	): Promise<AxiosRequestConfig> {
		const userId = session.user;
		if (!userId) throw new ApiError(401, "Not logged in");
		const user = await DB.getUser(userId);
		if (!user || !this.scopesMatch(user.scope, this.OAUTH_SCOPE)) {
			session.destroy();
			throw new ApiError(401, "Not logged in");
		}
		if (user.expiresAt.getTime() < Date.now())
			return this.createAuthHeader(user.accessToken);
		return await this.refreshAuth(user.id, user.refreshToken);
	}

	private static async refreshAuth(
		userId: string,
		refreshToken: string
	): Promise<AxiosRequestConfig> {
		const res = await this.refreshAccessToken(refreshToken);
		if (res.tokenType !== "bearer") throw new Error("Unknown token type");
		if (!this.scopesMatch(res.scope, this.OAUTH_SCOPE))
			throw new Error("Missing required permissions");
		await DB.updateUserLogin(userId, res.accessToken, res.expiresAt);
		return this.createAuthHeader(res.accessToken);
	}

	private static createAuthHeader(accessToken: string): AxiosRequestConfig {
		return {
			headers: {
				Authorization: `bearer ${accessToken}`
			}
		};
	}

	private static async refreshAccessToken(
		refreshToken: string
	): Promise<AccessTokenResponse> {
		try {
			const res = await axios.post(
				this.getRequestURL("/access_token").toString(),
				`grant_type=refresh_token&refresh_token=${refreshToken}`,
				{
					auth: {
						username: process.env.REDDIT_CLIENT_ID!,
						password: process.env.REDDIT_CLIENT_SECRET!
					}
				}
			);
			redditAccessTokenResValidator.assertOr(
				res.data,
				new Error("Unexpected response to access token refresh request")
			);
			return {
				accessToken: res.data.access_token,
				expiresAt: new Date(Date.now() + res.data.expires_in * 1000),
				scope: res.data.scope,
				tokenType: res.data.token_type,
				refreshToken: res.data.refresh_token
			};
		} catch (err) {
			throw new Error("Failed to refresh access token", { cause: err });
		}
	}

	private static async getAccessToken(
		code: string
	): Promise<AccessTokenResponse> {
		try {
			const res = await axios.post(
				this.getRequestURL("/access_token").toString(),
				`grant_type=authorization_code&code=${code}&redirect_uri=${this.REDIRECT_URL}`,
				{
					auth: {
						username: process.env.REDDIT_CLIENT_ID!,
						password: process.env.REDDIT_CLIENT_SECRET!
					}
				}
			);
			redditAccessTokenResValidator.assertOr(
				res.data,
				new Error("Unexpected response to access token request")
			);
			return {
				accessToken: res.data.access_token,
				refreshToken: res.data.refresh_token,
				expiresAt: new Date(Date.now() + res.data.expires_in * 1000),
				scope: res.data.scope,
				tokenType: res.data.token_type
			};
		} catch (err) {
			throw new Error("Failed to get access token", { cause: err });
		}
	}

	private static async generateSessionSecret(session: IronSession) {
		const secret = crypto.randomUUID();
		session.secret = secret;
		await session.save();
	}

	private static getRequestURL(path: string): URL {
		return new URL(this.ENDPOINT + path);
	}

	private static scopesMatch(given: string, required: string) {
		const givenScopesArray = given.split(" ");
		const requiredScopesArray = required.split(" ");
		return requiredScopesArray.every((scope) =>
			givenScopesArray.includes(scope)
		);
	}
}

export default OAuth;
