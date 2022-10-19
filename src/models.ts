interface User {
	id: string;
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

export type { User };
