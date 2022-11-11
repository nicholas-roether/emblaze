import mongoose from "mongoose";

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
	data: Record<string, unknown>;
}

const sessionSchema = new mongoose.Schema({
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

	constructor(connection: mongoose.Connection) {
		this.connection = connection;
		this.User = this.connection.model("user", userSchema);
		this.Session = this.connection.model(
			"session",
			sessionSchema
		) as unknown as mongoose.Model<Session>;
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
		const session = new this.Session({ data, expires });
		await session.save();
		return session._id.toHexString();
	}

	public async updateSession(
		id: string,
		data: Record<string, unknown>
	): Promise<void> {
		await this.Session.updateOne({ _id: id }, { $set: { data } });
	}

	public async deleteSession(id: string): Promise<void> {
		await this.Session.deleteOne({ _id: id });
	}

	public async readSession(id: string): Promise<Record<string, unknown>> {
		const session = await this.Session.findById(id);
		if (!session) {
			console.error(
				`ERROR: Tried to read session ${id}, which does not exist!`
			);
			return {};
		}
		return session.data;
	}

	public static async connect(uri: string): Promise<DB> {
		const connection = await mongoose.createConnection(uri);
		return new DB(connection);
	}
}

export default DB;

export type { User };
