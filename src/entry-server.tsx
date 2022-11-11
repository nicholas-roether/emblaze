import {
	createHandler,
	renderAsync,
	StartServer
} from "solid-start/entry-server";
import { initEnv } from "./environment";
import { startServices } from "./services";

initEnv();
startServices();

export default createHandler(
	renderAsync((event) => <StartServer event={event} />)
);
