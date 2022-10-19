interface User {
	id: string;
	name: string;
	displayName: string;
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

export type { User };
