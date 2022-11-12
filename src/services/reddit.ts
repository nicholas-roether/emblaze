import axios from "axios";
import { User } from "~/models";
import schema, { Validator } from "~/utils/schema";
import RedditAuth from "./reddit_auth";

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
	"RedditApiUser"
);

const REDDIT_ENDPOINT = "https://oauth.reddit.com/api/v1";

class Reddit {
	static readonly ENDPOINT = this.getEndpoint();

	public async me(login: string): Promise<User> {
		const res = await axios.get(
			Reddit.ENDPOINT + "/me",
			RedditAuth.createAuthConfig(login)
		);
		return this.createUser(res.data);
	}

	private createUser(body: unknown): User {
		redditAPIUserValidator.assert(body);
		return {
			id: `t2_${body.data.id}`,
			name: body.data.name,
			profilePicture: body.data.icon_img,
			created: body.data.created_utc,
			karma: {
				total: body.data.total_karma,
				post: body.data.link_karma,
				comment: body.data.comment_karma,
				awardee: body.data.awardee_karma,
				awarder: body.data.awarder_karma
			}
		};
	}

	private static getEndpoint(): string {
		if (
			process.env.NODE_ENV !== "production" &&
			process.env.DEBUG_REDDIT_ENDPOINT
		) {
			return process.env.DEBUG_REDDIT_ENDPOINT + "/me";
		}
		return REDDIT_ENDPOINT + "/me";
	}
}

export default Reddit;
