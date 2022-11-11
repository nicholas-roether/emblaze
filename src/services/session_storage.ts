import { createSessionStorage } from "solid-start";
import DB from "./database";

function createSessionStorageInDB(db: DB) {
	return createSessionStorage({
		cookie: {
			name: "session",
			secure: process.env.NODE_ENV !== "development",
			secrets: [process.env.SESSION_SECRET],
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 30,
			httpOnly: true
		},
		createData: db.createSession,
		updateData: db.updateSession,
		deleteData: db.deleteSession,
		readData: db.readSession
	});
}

export { createSessionStorageInDB };
