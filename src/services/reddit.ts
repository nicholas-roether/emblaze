import axios from "axios";
import { IronSession } from "iron-session";
import OAuth from "./oauth";

class Reddit {
	static readonly ENDPOINT = "https://oauth.reddit.com/api/v1";

	static async test(session: IronSession, href: string): Promise<unknown> {
		const url = new URL(href, this.ENDPOINT);
		url.searchParams.set("raw_json", "1");
		const res = await axios.get(
			url.toString(),
			await OAuth.authenticateRequest(session)
		);
		return res.data;
	}
}

export default Reddit;
