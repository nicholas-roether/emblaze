import axios from "axios";
import { User } from "~/models";
import schema, { Validator } from "~/utils/schema";
import RedditAuth from "./reddit_auth";

interface RedditAPIUser {
	id: string;
	name: string;
	icon_img: string;
	created_utc: number;
	total_karma: number;
	link_karma: number;
	comment_karma: number;
	awarder_karma: number;
	awardee_karma: number;
}

const redditAPIUserValidator: Validator<RedditAPIUser> = schema.object(
	{
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
	},
	"RedditApiUser"
);

const REDDIT_ENDPOINT = "https://oauth.reddit.com/api";

class Reddit {
	static readonly ENDPOINT = this.getEndpoint();
	private static readonly api = axios.create({
		baseURL: this.ENDPOINT,
		params: { raw_json: "1" }
	});

	public static async me(login: string): Promise<User> {
		const res = await this.api.get(
			"/v1/me",
			RedditAuth.createAuthConfig(login)
		);
		return this.createUser(res.data);
	}

	private static createUser(body: unknown): User {
		redditAPIUserValidator.assert(body);
		return {
			id: `t2_${body.id}`,
			name: body.name,
			profilePicture: body.icon_img,
			created: body.created_utc,
			karma: {
				total: body.total_karma,
				post: body.link_karma,
				comment: body.comment_karma,
				awardee: body.awardee_karma,
				awarder: body.awarder_karma
			}
		};
	}

	private static getEndpoint(): string {
		if (
			process.env.NODE_ENV !== "production" &&
			process.env.DEBUG_REDDIT_ENDPOINT
		) {
			return process.env.DEBUG_REDDIT_ENDPOINT;
		}
		return REDDIT_ENDPOINT;
	}
}

export default Reddit;
