import schema, { Validator } from "./utils/schema";

interface User {
	id: string;
	name: string;
	profilePicture: string;
	created: number;
	karma: {
		total: number;
		post: number;
		comment: number;
		awardee: number;
		awarder: number;
	};
}

const userValidator: Validator<User> = schema.object({
	id: schema.string(),
	name: schema.string(),
	profilePicture: schema.string(),
	created: schema.number().integer(),
	karma: schema.object({
		total: schema.number().integer(),
		post: schema.number().integer(),
		comment: schema.number().integer(),
		awardee: schema.number().integer(),
		awarder: schema.number().integer()
	})
});

export { userValidator };

export type { User };
