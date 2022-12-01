import Heading from "~/components/basic/heading";
import Page from "~/components/page";
import { useRouteData } from "solid-start";
import UserContext from "~/components/context/user_context";
import { createServerData$, redirect } from "solid-start/server";
import Login from "~/services/login";
import Reddit from "~/services/reddit";
import { userValidator } from "~/models";

export default function Home() {
	const user = useRouteData<typeof routeData>();

	return (
		<UserContext.Provider value={user}>
			<Page title="Home">
				<Heading size={1}>Home</Heading>
			</Page>
		</UserContext.Provider>
	);
}

export function routeData() {
	return createServerData$(async () => {
		const login = await Login.get();
		if (!login) throw redirect("/welcome");
		const me = await Reddit.me(login);
		userValidator.assert(me);
		return me;
	});
}
