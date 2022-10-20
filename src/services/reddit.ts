import axios from "axios";
import { IronSession } from "iron-session";
import { User } from "../models";
import { ApiError } from "../utils/api";
import schema, { Validator } from "../utils/schema";
import OAuth from "./oauth";

interface RedditAPIUser {
	kind: "t2";
	data: {
		id: string;
		name: string;
		icon_img: string;
		created_utc: number;
		total_karma: number;
		link_karma: number;
		comment_karma: number;
		awarder_karma: number;
		awardee_karma: number;
		subreddit: {
			title: string;
			public_description: string;
		};
	};
}

const redditAPIUserValidator: Validator<RedditAPIUser> = schema.object(
	{
		kind: schema.string().exact("t2"),
		data: schema.object({
			id: schema.string(),
			name: schema.string(),
			icon_img: schema.string(),
			created_utc: schema.number().integer(),
			total_karma: schema.number().integer(),
			link_karma: schema.number().integer(),
			comment_karma: schema.number().integer(),
			awarder_karma: schema.number().integer(),
			awardee_karma: schema.number().integer(),
			subreddit: schema.object({
				title: schema.string(),
				public_description: schema.string()
			})
		})
	},
	"redditApiUser"
);

class Reddit {
	static readonly ENDPOINT = process.env.REDDIT_API;

	static async test(session: IronSession, path: string): Promise<unknown> {
		const res = await axios.get(
			this.getRequestURL(path).toString(),
			await OAuth.authenticateRequest(session)
		);
		return res.data;
	}

	static async me(session: IronSession): Promise<User> {
		const res = await axios.get(
			this.getRequestURL("/me").toString(),
			await OAuth.authenticateRequest(session)
		);
		return this.createUser(res.data);
	}

	private static createUser(body: unknown): User {
		redditAPIUserValidator.assertOr(
			body,
			new ApiError(500, "Reddit user response interpretation failed")
		);
		return {
			id: `t2_${body.data.id}`,
			name: body.data.name,
			displayName: body.data.subreddit.title,
			profilePicture: body.data.icon_img,
			created: body.data.created_utc * 1000,
			karma: {
				total: body.data.total_karma,
				post: body.data.link_karma,
				comment: body.data.comment_karma,
				awardee: body.data.awardee_karma,
				awarder: body.data.awarder_karma
			}
		};
	}

	private static getRequestURL(path: string): URL {
		const url = new URL(this.ENDPOINT + path);
		url.searchParams.set("raw_json", "1");
		return url;
	}
}

export default Reddit;
