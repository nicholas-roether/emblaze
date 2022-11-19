import Heading from "~/components/basic/heading";
import Page from "~/components/page";
import { useRouteData } from "solid-start";
import UserContext from "~/components/context/user_context";
import { createServerData$ } from "solid-start/server";
import Login from "~/services/login";
import Reddit from "~/services/reddit";
import { userValidator } from "~/models";

export default function Home() {
	const user = useRouteData<typeof routeData>();

	return (
		<UserContext.Provider value={user}>
			<Page title="Home">
				<Heading size="xl">Home</Heading>
			</Page>
		</UserContext.Provider>
	);
}

export function routeData() {
	return createServerData$(async (_, { request }) => {
		const login = await Login.from(request);
		if (!login) return undefined;
		const me = await Reddit.me(login);
		userValidator.assert(me);
		return me;
	});
}
