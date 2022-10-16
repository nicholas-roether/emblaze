import { NextApiRequest, NextApiResponse } from "next/types";
import DB, { Session } from "./db";
import crypto from "crypto";
import axios from "axios";
import schema from "../utils/schema";

const accessTokenResSchema = schema.object({
	access_token: schema.string(),
	token_type: schema.string().exact("bearer"),
	expires_in: schema.number().integer(),
	scope: schema.string(),
	refresh_token: schema.string()
});

interface AccessTokenResponse {
	accessToken: string;
	expiresAt: Date;
	refreshToken: string;
}

class OAuth {
	private static readonly ENDPOINT = "https://www.reddit.com/api/v1";
	private static readonly CLIENT_ID = process.env.REDDIT_CLIENT_ID!;
	private static readonly REDIRECT_URL =
		process.env.HOST! + "/api/auth/redirect";
	private static readonly OAUTH_SCOPE =
		"account edit flair history identity mysubreddits read report save submit subscribe vote wikiread";
	private static readonly SESSION_LIFETIME = 3600000;

	static async login(req: NextApiRequest, res: NextApiResponse) {
		const session = await this.createSession(req, res);

		const authUrl = new URL(this.ENDPOINT + "/authorize");
		authUrl.searchParams.set("client_id", this.CLIENT_ID);
		authUrl.searchParams.set("response_type", "code");
		authUrl.searchParams.set("state", session.secret);
		authUrl.searchParams.set("redirect_uri", this.REDIRECT_URL);
		authUrl.searchParams.set("duration", "permanent");
		authUrl.searchParams.set("scope", this.OAUTH_SCOPE);

		res.redirect(authUrl.toString());
		res.end();
	}

	static async handleRedirect(req: NextApiRequest, res: NextApiResponse) {
		const { error, code, state } = req.query;
		if (error) {
			console.error(error);
			return res.status(400).end();
		}
		if (!code) return res.status(400).end();

		const session = await this.getSession(req);
		if (!session || state !== session.secret) return res.status(403).end();

		const { accessToken, refreshToken, expiresAt } = await this.getAccessToken(
			code.toString()
		);

		const userId = await DB.createUser({
			accessToken,
			refreshToken,
			expiresAt: expiresAt,
			scope: this.OAUTH_SCOPE
		});
		await this.createSession(req, res, userId);

		res.setHeader("Set-Cookie", `userId=${userId}; Path=/; HttpOnly; Secure`);
		res.end();
	}

	private static async getAccessToken(
		code: string
	): Promise<AccessTokenResponse> {
		const res = await axios.post(
			`${this.ENDPOINT}/access_token`,
			`grant_type=authorization_code&code=${code}&redirect_uri=${this.REDIRECT_URL}`
		);
		if (res.status !== 200) throw new Error("Failed to get access token");
		const data = JSON.parse(res.data);
		if (!accessTokenResSchema.check(data))
			throw new Error("Unexpected response to access token request");
		return {
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			expiresAt: new Date(data.expires_in * 1000)
		};
	}

	private static async getSession(
		req: NextApiRequest
	): Promise<Session | null> {
		const sessionId = req.cookies.sessionId;
		if (sessionId) {
			const session = await DB.getSession(sessionId);
			if (session) return session;
		}
		return null;
	}

	private static async createSession(
		req: NextApiRequest,
		res: NextApiResponse,
		userId?: string
	): Promise<Session> {
		const prevSession = await this.getSession(req);
		if (prevSession) {
			if (prevSession.user) userId ??= prevSession.user.id;
			await DB.deleteSession(prevSession.id);
		}
		userId ??= req.cookies.user;
		const sessionId = await DB.createSession({
			user: userId,
			secret: this.generateSessionSecret(),
			expiresAt: new Date(Date.now() + this.SESSION_LIFETIME)
		});
		res.setHeader(
			"Set-Cookie",
			`sessionId=${sessionId}; Path=/; HttpOnly; Secure`
		);
		return (await DB.getSession(sessionId))!;
	}

	private static generateSessionSecret(): string {
		return crypto.randomUUID();
	}
}

export default OAuth;
