import mongoose from "mongoose";

for (const modelName in mongoose.models) delete mongoose.models[modelName];

interface UserSchema {
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope: string;
}
interface SessionSchema {
	user?: mongoose.Types.ObjectId | string;
	secret: string;
	expiresAt: Date;
}

const userSchema = new mongoose.Schema<UserSchema>({
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	expiresAt: { type: Date, required: true },
	scope: { type: String, required: true }
});

const UserModel = mongoose.model("user", userSchema);

const sessionSchema = new mongoose.Schema<SessionSchema>({
	user: { type: mongoose.SchemaTypes.ObjectId, ref: UserModel },
	secret: { type: String, required: true },
	expiresAt: {
		type: Date,
		required: true,
		expires: 0
	}
});

const SessionModel = mongoose.model("session", sessionSchema);

mongoose.connect(process.env.MONGODB_URI!);

interface User {
	id: string;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope: string;
}

interface Session {
	id: string;
	user?: User;
	secret: string;
}

class DB {
	static async createUser(doc: UserSchema): Promise<string> {
		const user = new UserModel(doc);
		await user.save();
		return user._id.toHexString();
	}

	static async getUser(id: string): Promise<User | null> {
		const user = await UserModel.findById(id);
		if (!user) return null;
		return {
			id: user._id.toHexString(),
			accessToken: user.accessToken,
			refreshToken: user.refreshToken,
			expiresAt: user.expiresAt,
			scope: user.scope
		};
	}

	static async createSession(doc: SessionSchema): Promise<string> {
		const session = new SessionModel(doc);
		await session.save();
		return session._id.toHexString();
	}

	static async getSession(id: string): Promise<Session | null> {
		const session = await SessionModel.findById(id).populate<{
			user: UserSchema & { _id: mongoose.Types.ObjectId };
		}>("user");
		if (!session) return null;
		return {
			id: session._id.toHexString(),
			user: session.user
				? {
						id: session.user._id.toHexString(),
						accessToken: session.user.accessToken,
						refreshToken: session.user.refreshToken,
						expiresAt: session.user.expiresAt,
						scope: session.user.scope
				  }
				: undefined,
			secret: session.secret
		};
	}

	static async deleteSession(id: string): Promise<void> {
		await SessionModel.deleteOne({ _id: id });
	}

	static async updateUserLogin(
		userId: string,
		accessToken: string,
		expiresAt: Date
	) {
		await UserModel.updateOne(
			{ _id: userId },
			{
				$set: {
					"login.accessToken": accessToken,
					"login.expiresAt": expiresAt
				}
			}
		);
	}
}

export default DB;

export type { User, Session };
