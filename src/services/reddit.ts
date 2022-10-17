import axios from "axios";
import { IronSession } from "iron-session";
import OAuth from "./oauth";

class Reddit {
	static readonly ENDPOINT = "https://oauth.reddit.com/api/v1";

	static async me(session: IronSession): Promise<unknown> {
		const res = await axios.get(
			this.ENDPOINT + "/me",
			await OAuth.authenticateRequest(session)
		);
		return res.data;
	}
}

export default Reddit;
