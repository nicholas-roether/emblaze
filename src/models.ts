import schema from "./utils/schema";

interface User {
	name: string;
	displayName: string;
	profilePicture: string;
	created: number;
	karma: {
		post: number;
		comment: number;
		awardee: number;
		awarder: number;
	};
}

const userSchema = schema.object({
	name: schema.string(),
	displayName: schema.string(),
	profilePicture: schema.string(),
	created: schema.number().integer(),
	karma: schema.object({
		post: schema.number().integer(),
		comment: schema.number().integer(),
		awardee: schema.number().integer(),
		awarder: schema.number().integer()
	})
});

export {};
