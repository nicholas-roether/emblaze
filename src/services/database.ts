import mongoose from "mongoose";
import env from "~/environment";

interface User {
	redditId: string;
	refreshToken: string;
	scope: string[];
}

const userSchema = new mongoose.Schema({
	redditId: { type: String, required: true, unique: true },
	refreshToken: { type: String, required: true },
	scope: { type: [String], required: true }
});

interface Session {
	expires?: Date;
	data: Map<string, unknown>;
}

const sessionSchema = new mongoose.Schema<Session>({
	expires: { type: Date, index: { expires: 0 } },
	data: {
		type: mongoose.SchemaTypes.Map,
		of: mongoose.SchemaTypes.Mixed,
		required: true
	}
});

class DB {
	private readonly connection: mongoose.Connection;
	private readonly User: mongoose.Model<User>;
	private readonly Session: mongoose.Model<Session>;
	private static readonly instance: Promise<DB> = DB.connect();

	private constructor(connection: mongoose.Connection) {
		this.connection = connection;
		this.User = this.connection.model("user", userSchema);
		this.Session = this.connection.model("session", sessionSchema);
	}

	public static open(): Promise<DB> {
		return this.instance;
	}

	public async createOrReplaceUser(user: User): Promise<string> {
		await this.User.deleteMany({ redditId: user.redditId });
		const userDoc = new this.User(user);
		await userDoc.save();
		if (!userDoc.id) throw new Error("Failed to save user to database");
		return userDoc._id.toHexString();
	}

	public async getUser(id: string): Promise<User | null> {
		const userDoc = await this.User.findById(id);
		if (!userDoc) return null;
		return {
			redditId: userDoc.redditId,
			refreshToken: userDoc.refreshToken,
			scope: userDoc.scope
		};
	}

	public async deleteUser(id: string): Promise<void> {
		await this.User.deleteOne({ _id: id });
	}

	public async createSession(
		data: Record<string, unknown>,
		expires?: Date
	): Promise<string> {
		console.log("creating session:", data);
		const session = new this.Session({ data, expires });
		await session.save();
		console.log("sesion id is", session._id);
		return session._id.toHexString();
	}

	public async updateSession(
		id: string,
		data: Record<string, unknown>,
		expires?: Date
	): Promise<void> {
		if (!(await this.Session.exists({ _id: id })))
			await this.Session.create({ _id: id, data, expires });
		await this.Session.updateOne({ _id: id }, { $set: { data, expires } });
	}

	public async deleteSession(id: string): Promise<void> {
		await this.Session.deleteOne({ _id: id });
	}

	public async readSession(id: string): Promise<Record<string, unknown>> {
		const session = await this.Session.findById(id);
		if (!session) return {};
		return Object.fromEntries(session.data.entries());
	}

	private static async connect(): Promise<DB> {
		const connection = await mongoose.createConnection(env().DB_URI);
		return new DB(connection);
	}
}

export default DB;

export type { User };
