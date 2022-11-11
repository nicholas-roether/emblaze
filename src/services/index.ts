import { SessionStorage } from "solid-start";
import DB from "./database";
import { createSessionStorageInDB } from "./session_storage";

interface Services {
	db: DB;
	session: SessionStorage;
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
				const session = createSessionStorageInDB(db);
				res({ db, session });
			})
			.catch(rej);
	});
}

export { getServices, startServices };
