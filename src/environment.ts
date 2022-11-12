import dotenv from "dotenv";

interface Environment {
	readonly NODE_ENV: string;
	readonly SESSION_SECRET: string;
	readonly DB_URI: string;
	readonly REDDIT_CLIENT_ID: string;
	readonly REDDIT_CLIENT_SECRET: string;
	readonly ORIGIN: string;
	readonly DEBUG_REDDIT_AUTH_ENDPOINT?: string;
	readonly DEBUG_REDDIT_ENDPOINT?: string;
}

const requiredVariables: (keyof Environment)[] = [
	"NODE_ENV",
	"SESSION_SECRET",
	"DB_URI",
	"REDDIT_CLIENT_ID",
	"REDDIT_CLIENT_SECRET",
	"ORIGIN"
];

let loaded = false;

function env(): Environment {
	if (!loaded) {
		dotenv.config();
		loaded = true;
		for (const varName of requiredVariables) {
			if (!process.env[varName])
				throw new Error(`Missing environment variable: ${varName}`);
		}
	}
	return process.env as unknown as Environment;
}

export default env;
