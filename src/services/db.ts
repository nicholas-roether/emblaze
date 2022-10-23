import mongoose from "mongoose";

for (const modelName in mongoose.models) delete mongoose.models[modelName];

interface UserSchema {
	redditUserId: string;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope: string;
}

const userSchema = new mongoose.Schema<UserSchema>({
	redditUserId: { type: String, required: true, unique: true },
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	expiresAt: { type: Date, required: true },
	scope: { type: String, required: true }
});

const UserModel = mongoose.model("user", userSchema);

interface User extends UserSchema {
	id: string;
}

type Doc<T> = mongoose.Document<unknown, any, T> &
	T & { _id: mongoose.Types.ObjectId };

class DB {
	static async connect(): Promise<void> {
		if (mongoose.connection.readyState === 0)
			await mongoose.connect(process.env.MONGODB_URI!);
	}

	static async createUser(doc: UserSchema): Promise<string> {
		const user = new UserModel(doc);
		await user.save();
		return user._id.toHexString();
	}

	static async getUser(id: string): Promise<User | null> {
		const doc = await UserModel.findById(id);
		if (!doc) return null;
		return this.createUserFromDoc(doc);
	}

	static async updateUserLogin(
		userId: string,
		accessToken: string,
		expiresAt: Date,
		refreshToken?: string
	) {
		const setQuery: Record<string, unknown> = {
			"login.accessToken": accessToken,
			"login.expiresAt": expiresAt
		};
		if (refreshToken) setQuery["login.refreshToken"] = refreshToken;
		await UserModel.updateOne(
			{ _id: userId },
			{
				$set: setQuery
			}
		);
	}

	static async getUserByRedditId(redditUserId: string): Promise<User | null> {
		const doc = await UserModel.findOne({ redditUserId });
		if (!doc) return null;
		return this.createUserFromDoc(doc);
	}

	private static createUserFromDoc(doc: Doc<UserSchema>): User {
		return {
			id: doc._id.toHexString(),
			redditUserId: doc.redditUserId,
			accessToken: doc.accessToken,
			refreshToken: doc.refreshToken,
			expiresAt: doc.expiresAt,
			scope: doc.scope
		};
	}
}

export default DB;

export type { User };
