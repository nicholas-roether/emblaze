import { mount, StartClient } from "solid-start/entry-client";
import { hydrateStyleSheets } from "./utils/css";

mount(() => <StartClient />, document);

window.addEventListener("load", () => {
	hydrateStyleSheets();
});
