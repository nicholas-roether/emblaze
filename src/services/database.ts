import {
	Collection,
	ObjectId,
	MongoClient,
	UpdateResult,
	InsertOneResult
} from "mongodb";

import env from "~/environment";
import schema, { Validator } from "~/utils/schema";

interface User {
	redditId: string;
	refreshToken: string;
	scope: string[];
}

const userValidator: Validator<User> = schema.object(
	{
		redditId: schema.string(),
		refreshToken: schema.string(),
		scope: schema.array(schema.string())
	},
	"User"
);

interface Session {
	expires?: Date;
	data: Record<string, unknown>;
}
const sessionValidator: Validator<Session> = schema.object({
	expires: schema.instanceOf(Date),
	data: schema.record(schema.string(), schema.unknown())
});

class DB {
	private readonly users: Collection;
	private readonly sessions: Collection;
	private static readonly instance: Promise<DB> = DB.connect();

	private constructor(users: Collection, sessions: Collection) {
		this.users = users;
		this.sessions = sessions;
	}

	public static open(): Promise<DB> {
		return this.instance;
	}

	public async createOrReplaceUser(user: User): Promise<string> {
		await this.users.deleteMany({ redditId: user.redditId });
		const res = await this.users.insertOne(user);
		if (!res.acknowledged) throw new Error("Failed to save user to database");
		return res.insertedId.toHexString();
	}

	public async getUser(id: string): Promise<User | null> {
		const userDoc = await this.users.findOne({ _id: new ObjectId(id) });
		if (!userDoc || !userValidator.check(userDoc)) return null;
		return {
			redditId: userDoc.redditId,
			refreshToken: userDoc.refreshToken,
			scope: userDoc.scope
		};
	}

	public async deleteUser(id: string): Promise<void> {
		await this.users.deleteOne({ _id: new ObjectId(id) });
	}

	public async createSession(
		data: Record<string, unknown>,
		expires?: Date
	): Promise<string> {
		const res = await this.sessions.insertOne({ data, expires });
		if (!res.acknowledged) throw new Error("Failed to create session");
		return res.insertedId.toHexString();
	}

	public async updateSession(
		id: string,
		data: Record<string, unknown>,
		expires?: Date
	): Promise<void> {
		let res: UpdateResult | InsertOneResult;
		if (await this.sessions.findOne({ _id: new ObjectId(id) })) {
			res = await this.sessions.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { data, expires } }
			);
		} else {
			res = await this.sessions.insertOne({
				_id: new ObjectId(id),
				data,
				expires
			});
		}
		if (!res.acknowledged) throw new Error("Failed to update session");
	}

	public async deleteSession(id: string): Promise<void> {
		const res = await this.sessions.deleteOne({ _id: new ObjectId(id) });
		if (!res.acknowledged) throw new Error("Failed to delete session");
	}

	public async readSession(id: string): Promise<Record<string, unknown>> {
		const session = await this.sessions.findOne({ _id: new ObjectId(id) });
		if (!session || !sessionValidator.check(session)) return {};
		return session.data;
	}

	private static async connect(): Promise<DB> {
		const client = new MongoClient(env().DB_URI);
		try {
			await client.connect();
			const db = client.db();
			await db.command({ ping: 1 });
			console.log("Successfully connected to database");

			const users = db.collection("users");
			const sessions = db.collection("sessions");

			await users.createIndex({ redditId: 1 }, { unique: true });
			await sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

			return new DB(users, sessions);
		} catch (err) {
			await client.close();
			throw err;
		}
	}
}

export default DB;

export type { User };
