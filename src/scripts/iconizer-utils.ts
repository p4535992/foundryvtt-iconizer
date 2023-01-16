import { log } from "./lib/lib";
import { iconDict } from "./iconizer-dictionary";
import CONSTANTS from "./constants";

export const utils = {
	iconData: new Map(),
	combinedDict: {},
	findByProperty: (arr, property, searchString) => {
		function levenshtein(a, b) {
			let tmp;
			if (a.length === 0) {
				return b.length;
			}
			if (b.length === 0) {
				return a.length;
			}
			if (a.length > b.length) {
				tmp = a;
				a = b;
				b = tmp;
			}

			let i, j, res;
			const alen = a.length,
				blen = b.length,
				row = Array(alen);
			for (i = 0; i <= alen; i++) {
				row[i] = i;
			}

			for (i = 1; i <= blen; i++) {
				res = i;
				for (j = 1; j <= alen; j++) {
					tmp = row[j - 1];
					row[j - 1] = res;
					res = b[i - 1] === a[j - 1] ? tmp : Math.min(tmp + 1, Math.min(res + 1, row[j] + 1));
				}
			}
			return res;
		}

		const maxDistance = 3;
		const minDistance = 100;
		let nearestHit = undefined;

		if (!Array.isArray(arr)) return undefined;
		arr.filter((entry: any) => Object.prototype.hasOwnProperty.call(entry, property)).forEach((entry) => {
			const distance = levenshtein(searchString, entry[property]);
			if (distance <= maxDistance && distance < minDistance) {
				nearestHit = entry;
			}
		});

		return nearestHit;
	},
	// Thanks, @Atropos!
	async serverFileExists(src) {
		return fetch(src, { method: "HEAD" })
			.then((resp) => {
				return resp.status < 400;
			})
			.catch((err) => false);
	},
	loadJSON: (path) => {
		return new Promise((resolve, reject) => {
			const http = new XMLHttpRequest();
			//http.setRequestHeader('Content-Type', 'application/json');
			http.onreadystatechange = function () {
				console.log("++++++++++++++++++');Download started");
				if (this.readyState == 4) {
					console.log("LOAD JSON ++++++++++++++++++");
					console.log(this.status);
					// parse the templates
					if (this.status === 200) {
						console.log(JSON.parse(this.responseText));
						resolve(JSON.parse(this.responseText));
					} else {
						reject(this.status);
					}
				}
			};
			http.open("GET", path, true);
			http.send();
		});
	},
	/**
	 * Replaces the icon if the name changed and if the game settings allow that
	 */
	replaceIcon(options: any) {
		log(options);
		// if there is no name change here, just continue
		if (!options || !options.name) {
			return options;
		}
		const REPLACEMENT_POLICY_REPLACE_ALL = 0;
		const REPLACEMENT_POLICY_REPLACE_DEFAULT = 1;
		const REPLACEMENT_POLICY_REPLACE_NONE = 2;

		const replacementPolicy = game.settings.get(CONSTANTS.MODULE_NAME, "replacement-policy");

		// stop right here if we should not replace anything
		if (replacementPolicy === REPLACEMENT_POLICY_REPLACE_NONE) return;

		if (
			replacementPolicy === REPLACEMENT_POLICY_REPLACE_ALL ||
			(replacementPolicy === REPLACEMENT_POLICY_REPLACE_DEFAULT &&
				(!options.img || options.img.toLowerCase().indexOf("mystery-man") !== -1))
		) {
			let name = options.name
				.toLowerCase()
				.replace(/\([^)]*\)/g, "")
				.trim();
			let newIcon = this.iconData.get(name);
			if (!newIcon) {
				// Issue https://github.com/VTTAssets/vtta-iconizer/issues/7
				name = name.replace("'", "’");
				newIcon = this.iconData.get(name);
			}

			if (newIcon !== undefined) {
				// accept absolute references to icons and do not prefix with the icon directory
				if (newIcon.startsWith("/") || newIcon.indexOf("://") === 0 || newIcon.indexOf("http") === 0) {
					options.img = newIcon;
				} else {
					// online references by wowhead-icons.json
					const baseDictionary = game.settings.get(CONSTANTS.MODULE_NAME, "base-dictionary");
					if (baseDictionary === "wowhead-icons.json") {
						options.img = "https://wow.zamimg.com/images/wow/icons/large" + "/" + newIcon;
					} else {
						options.img = game.settings.get(CONSTANTS.MODULE_NAME, "icon-directory") + "/" + newIcon;
					}
				}
			} else {
				if (replacementPolicy === 0) {
					//options.img = "icons/svg/mystery-man.svg";
				}
			}
			log("Post-processing");
			log(options);
		} else {
			log("Not replacing icon");
		}

		return options;
	},
	// log: (obj) => {
	//   const LOG_PREFIX = 'VTTA Iconizer';
	//   if (CONFIG && CONFIG.debug && CONFIG.debug.vtta && CONFIG.debug.vtta.iconizer)
	//     switch (typeof obj) {
	//       case 'object':
	//       case 'array':
	//         console.log(`${LOG_PREFIX} | ${typeof obj}`);
	//         console.log(obj);
	//         break;
	//       default:
	//         console.log(`${LOG_PREFIX} | ${obj}`);
	//     }
	// },
	// checks for a given file
	// serverFileExists: path => {
	//   return new Promise((resolve, reject) => {
	//     let http = new XMLHttpRequest();
	//     http.open("HEAD", path);
	//     http.onreadystatechange = function() {
	//       if (this.readyState == this.DONE) {
	//         if (this.status !== 404) {
	//           resolve(path);
	//         } else {
	//           reject(path);
	//         }
	//       }
	//     };
	//   });
	// }
	updateAllActors() {
		log("Update All Actors triggered.");
		for (let actorCount = 0; actorCount < <number>game.actors?.contents.length; actorCount++) {
			const actor = game.actors?.get(<string>(<Actor>game.actors?.contents[actorCount]).id);
			this.udateActor(actor);
		}
		log("Completed updating all actors.");
	},

	updateActor(actor) {
		//log("Updating " + actor.name);
		const updates: any[] = [];

		for (const key of actor.items.keys()) {
			const item = actor.items.get(key);

			const update = this.getImageUpdate(item);
			if (update !== null) {
				updates.push(update);
			}
		}
		this.executeUpdates(actor, updates);
		//	log("Completed updating " + actor.name);
	},

	updateItem(actor, item) {
		//	log("Updating " + item.name + " for " + actor.name);
		const updates: any[] = [];

		const update = this.getImageUpdate(item);
		if (update !== null) {
			updates.push(update);
		}

		this.executeUpdates(actor, updates);
		//	log("Completed updating " + item.name + " for " + actor.name);
	},

	getImageUpdate(item) {
		// TODO: There is currently a bug where class items cannot be updated. Skipping them for now.
		if (item.type == "class") {
			return null;
		}

		const imageName = this.getImageName(item);

		const forceUpdate = game.settings.get(CONSTANTS.MODULE_NAME, "forceUpdate");

		if (imageName == null || imageName == "mystery-man.svg" || forceUpdate) {
			const itemName = this.getCleanedItemName(item);
			const altItemName = this.getAlternateItemName(itemName);

			if (itemName in this.combinedDict) {
				return { _id: item._id, img: this.combinedDict[itemName] };
			} else if (altItemName in this.combinedDict) {
				return { _id: item._id, img: this.combinedDict[altItemName] };
			}
		}
		return null;
	},

	getImageName(item) {
		let imageArr = [];
		try {
			imageArr = item.img.split("/");
		} catch {
			return imageArr;
		}
		return imageArr[imageArr.length - 1];
	},

	getCleanedItemName(item) {
		// Splitting on parentheses and trimming white space handles cases such as "(Hybrid Form Only)" as well as D&D Beyond additions such as "(Costs 2 Actions)".
		// Also remove the three types of single quotes that can get mixed up.
		return item.name
			.replace(/(\\'|\\‘|\\’)/gm, "")
			.split("(")[0]
			.trim()
			.toLowerCase();
	},

	getAlternateItemName(itemName) {
		// Try parsing the name according to some common patterns that may be used by D&D Beyond or other item creation tools.

		// Remove any +x modifiers, following two different patterns (with or without comma)
		let newName = itemName.split(", +")[0];
		newName = newName.split(" +")[0];

		// Convert comma inverted names: "Crossbow, Light" to "Light Crossbow"
		const splitName = newName.split(", ");
		if (splitName.length == 2) {
			return splitName[1] + " " + splitName[0];
		}
		return newName;
	},

	executeUpdates(actor, updates) {
		if (updates.length > 0) {
			if (actor.can(game.user, "update")) {
				actor.updateEmbeddedEntity("Item", updates);
				log("Updated " + updates.length + " item icons for " + actor.name + ".");
			} else {
				log(
					"User lacks permission to update " +
						actor.name +
						". This message may display for a player when non-owned characters are being updated by others."
				);
			}
		}
	},

	async updateDictionary() {
		log("Building dictionary.");

		// Load Custom Dictionary
		const customDictPath = game.settings.get(CONSTANTS.MODULE_NAME, "customDictionaryPath");

		if (customDictPath) {
			log("Loading custom dictionary: " + customDictPath);
			try {
				//@ts-ignore
				const { customDict } = await import("/https://assets.forge-vtt.com/bazaar/systems/dnd5e/icon/");
				for (const key in customDict) {
					this.combinedDict[key.replace(/(\\'|\\‘|\\’)/gm, "").toLowerCase()] = customDict[key];
				}
			} catch (err: any) {
				log("Error loading custom dictionary. Defaults will be used. " + err.message);
			}
		}

		// Load Default Dictionary
		for (const key in iconDict) {
			this.combinedDict[key.replace(/(\\'|\\‘|\\’)/gm, "").toLowerCase()] = iconDict[key];
		}

		// Search all custom game items the user has access to.
		// TODO: This filter does not seem to work - players can update icons using item names they do not have access to.
		const gameItems: Item[] = <Item[]>game.items?.filter((i: any) => {
			return game.user?.isGM && i.type;
			//return (game.user?.isGM || !i.private) && i.type;
		});
		gameItems.forEach((item) => this.addItemToDictionary(item));

		// Search all Item compendiums the user has access to.
		// TODO: This filter does not seem to work - players can update icons using compendiums they do not have access to.
		const packs = game.packs.filter((p) => (game.user?.isGM || !p.private) && p.documentName === "Item");
		for (const pack of packs) {
			//log("Adding " + pack.metadata.label + " to dictionary.");
			const packContent = await pack.getDocuments();
			for (const item of packContent) {
				this.addItemToDictionary(item);
			}
		}
		this.updateAllActors();
	},

	addItemToDictionary(item) {
		const imageName = this.getImageName(item);
		if (imageName == "mystery-man.svg") {
			return;
		}

		const itemName = this.getCleanedItemName(item);
		if (!(itemName in this.combinedDict)) {
			this.combinedDict[itemName.replace(/(\\'|\\‘|\\’)/gm, "").toLowerCase()] = item.img;
		}
	},
};
