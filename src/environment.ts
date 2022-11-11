import dotenv from "dotenv";

interface Environment {
	readonly NODE_ENV: string;
	readonly SESSION_SECRET: string;
	readonly DB_URI: string;
}

const envVarNames: (keyof Environment)[] = [
	"NODE_ENV",
	"SESSION_SECRET",
	"DB_URI"
];

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface ProcessEnv extends Environment {}
	}
}

function initEnv() {
	dotenv.config();
	for (const varName of envVarNames) {
		if (!process.env[varName])
			throw new Error(`Missing environment variable: ${varName}`);
	}
}

export { initEnv };
