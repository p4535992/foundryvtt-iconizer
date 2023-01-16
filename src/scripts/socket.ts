import CONSTANTS from "./constants";
import API from "./api";
import { debug } from "./lib/lib";
import { setSocket } from "../index";

export let iconizerSocket;

export function registerSocket() {
	debug("Registered iconizerSocket");
	if (iconizerSocket) {
		return iconizerSocket;
	}
	//@ts-ignore
	iconizerSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

	// iconizerSocket.register("XXX", (...args) => API.XXXArr(...args));

	setSocket(iconizerSocket);
	return iconizerSocket;
}
