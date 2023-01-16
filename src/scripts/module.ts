import { setApi } from "../index";
import { log } from "./lib/lib";
import { utils } from "./iconizer-utils";
import { registerSocket } from "./socket";
import API from "./api";
import CONSTANTS from "./constants";

export const initHooks = () => {
	// warn("Init Hooks processing");
	// setup all the hooks
	Hooks.once("socketlib.ready", registerSocket);
	registerSocket();
};

export const setupHooks = () => {
	// warn("Setup Hooks processing");
	setApi(API);
};

export const readyHooks = async () => {
	// This code runs once core initialization is ready and game data is available.
	utils.updateDictionary();

	// // check for failed registered settings
	// let hasErrors = false;

	// for (const s of game.settings.settings.values()) {
	//   if (s.module !== CONSTANTS.MODULE_NAME) {
	//     continue;
	//   }
	//   try {
	//     game.settings.get(s.module, s.key);
	//   } catch (err) {
	//     hasErrors = true;
	//     ui.notifications?.info(`${s.module} | Erroneous module settings found, resetting to default.`);
	//     game.settings.set(s.module, s.key, s.default);
	//   }
	// }
	// if (hasErrors) {
	//   ui.notifications?.warn('Please review the module settings to re-adjust them to your desired configuration.');
	// }

	// const iconData = new Map();
	const iconDatabasePolicy = game.settings.get(CONSTANTS.MODULE_NAME, "icon-database-policy");

	// load the base dictionary
	if (iconDatabasePolicy === 0 || iconDatabasePolicy === 1) {
		const basePath = ROUTE_PREFIX ? `/${ROUTE_PREFIX}` : "";
		const path = `${basePath}/modules/${CONSTANTS.MODULE_NAME}/data/${game.settings.get(
			CONSTANTS.MODULE_NAME,
			"base-dictionary"
		)}`;

		const fileExists = await utils.serverFileExists(path);
		if (fileExists) {
			const response = await fetch(path, { method: "GET" });

			const json = await response.json();
			json.forEach((data) => {
				utils.iconData.set(data.name.toLowerCase(), data.icon);
			});
		}
	}

	// load the custom icon database (if there is any)
	if (iconDatabasePolicy === 1 || iconDatabasePolicy === 2) {
		const prefix = <string>game.settings.get(CONSTANTS.MODULE_NAME, "icon-directory");
		log("Prefix is: " + prefix);
		if (prefix.indexOf("http") === 0) {
			log("starting with http");
			const path = `${game.settings.get(CONSTANTS.MODULE_NAME, "icon-directory")}/icons.json`;
			try {
				const response = await fetch(path, { method: "GET" });
				const json = await response.json();
				json.forEach((data) => {
					utils.iconData.set(data.name.toLowerCase(), data.icon);
				});
			} catch (error) {
				log(error);
				log("Error loading custom dictionary from " + path);
			}
		} else {
			const path = `/${game.settings.get(CONSTANTS.MODULE_NAME, "icon-directory")}/icons.json`;
			const fileExists = await utils.serverFileExists(path);
			if (fileExists) {
				const response = await fetch(path, { method: "GET" });
				const json = await response.json();
				json.forEach((data) => {
					utils.iconData.set(data.name.toLowerCase(), data.icon);
				});
			}
		}
	}

	// Hook on the item create events to replace the icon
	Hooks.on("preCreateItem", (createData, options, userId) => {
		log("preCreateItem");
		let opts = {
			name: createData.name,
			img: createData.img,
		};
		opts = utils.replaceIcon(opts);

		createData.data._source.img = opts.img;
	});

	Hooks.on("preUpdateItem", (entity, updateData, options, userId) => {
		//Hooks.on("preUpdateItem", (createData, options) => {
		log("preUpdateItem");
		if (!updateData.img) {
			updateData.img = entity.img;
		}
		updateData = utils.replaceIcon(updateData);
	});

	Hooks.on("preCreateItem", (createData, options, userId) => {
		//Hooks.on("preCreateItem", (parent, createData, options) => {
		options = utils.replaceIcon(options);
		log("+++++++++++++++++++++++++++++++++++++++");
		log("preCreateItem almost finished, let's check if that item came from a Foundry import:");
		log(options);

		// log("Options.flags?" + options.flags);
		// if (
		//   options.flags &&
		//   options.flags.vtta &&
		//   options.flags.vtta.dndbeyond &&
		//   options.flags.vtta.dndbeyond.type &&
		//   (options.img === undefined ||
		//     options.img.toLowerCase() === "icons/svg/mystery-man.svg")
		// ) {
		//   submitItem(options.name, options.type, options.flags.vtta.dndbeyond.type);
		// }
		log("preCreateItem finshed");
	});

	Hooks.on("preUpdateItem", (entity, updateData, options, userId) => {
		//Hooks.on("preUpdateItem", (parent, createData, options) => {
		log("preUpdateItem");
		if (!options.img) {
			const item = entity.getEmbeddedEntity("Item", options._id);
			if (item) {
				options.img = item.img;
			}
		}
		options = utils.replaceIcon(options);
	});

	Hooks.on("updateItem", function (actor, item, updateData, options, userId) {
		if (updateData.name) {
			//		log("Update Item triggered.");
			utils.updateItem(actor, item);
		}
	});

	Hooks.on("createItem", function (actor, item) {
		//	log("Create Item triggered.");
		utils.updateItem(actor, item);
	});

	Hooks.on("createActor", function (actor) {
		//	log("Create Actor triggered.");
		utils.updateActor(actor);
	});

	document.addEventListener("queryIcon", (event: any) => {
		if (event.detail && event.detail.name) {
			const response = utils.replaceIcon({ name: event.detail.name });
			document.dispatchEvent(new CustomEvent("deliverIcon", response));
			log("queryIcon");
			log(response);
		}
	});

	document.addEventListener("queryIcons", (event: any) => {
		if (event.detail && event.detail.names && Array.isArray(event.detail.names)) {
			const response: any[] = [];
			for (const name of event.detail.names) {
				const result = utils.replaceIcon(name);
				response.push(utils.replaceIcon(name));
			}

			document.dispatchEvent(new CustomEvent("deliverIcon", { detail: response }));
		}
	});
};
