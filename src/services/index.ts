import { SessionStorage } from "solid-start";
import DB from "./database";
import Reddit from "./reddit";
import RedditAuth from "./reddit_auth";
import { createSessionStorageInDB } from "./session_storage";

interface Services {
	sessionStorage: SessionStorage;
	auth: RedditAuth;
	reddit: Reddit;
}

let _services: Promise<Services> | null = null;

async function getServices(): Promise<Services> {
	if (!_services)
		throw new Error(
			"Tried to get services, but startServices() was not yet called!"
		);
	return await _services;
}

function startServices() {
	_services = new Promise((res, rej) => {
		DB.connect(process.env.DB_URI)
			.then((db) => {
				const sessionStorage = createSessionStorageInDB(db);
				const auth = new RedditAuth(db);
				const reddit = new Reddit();
				res({ sessionStorage, auth, reddit });
			})
			.catch(rej);
	});
}

export { getServices, startServices };
