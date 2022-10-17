import mongoose from "mongoose";

for (const modelName in mongoose.models) delete mongoose.models[modelName];

interface UserSchema {
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope: string;
}

const userSchema = new mongoose.Schema<UserSchema>({
	accessToken: { type: String, required: true },
	refreshToken: { type: String, required: true },
	expiresAt: { type: Date, required: true },
	scope: { type: String, required: true }
});

const UserModel = mongoose.model("user", userSchema);

interface User {
	id: string;
	accessToken: string;
	refreshToken: string;
	expiresAt: Date;
	scope: string;
}

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

export type { User };
