import CONSTANTS from "./constants";

export const registerSettings = function () {
	game.settings.register(CONSTANTS.MODULE_NAME, "replacement-policy", {
		name: `${CONSTANTS.MODULE_NAME}.replacement-policy.name`,
		hint: `${CONSTANTS.MODULE_NAME}.replacement-policy.hint`,
		scope: "world",
		config: true,
		type: Number,
		default: 0,
		choices: <any>{
			0: `${CONSTANTS.MODULE_NAME}.replacement-policy.0`,
			1: `${CONSTANTS.MODULE_NAME}.replacement-policy.1`,
			2: `${CONSTANTS.MODULE_NAME}.replacement-policy.2`,
		},
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "icon-database-policy", {
		name: `${CONSTANTS.MODULE_NAME}.icon-database-policy.name`,
		hint: `${CONSTANTS.MODULE_NAME}.icon-database-policy.hint`,
		scope: "world",
		config: true,
		type: Number,
		default: 0,
		choices: <any>{
			0: `${CONSTANTS.MODULE_NAME}.icon-database-policy.0`,
			1: `${CONSTANTS.MODULE_NAME}.icon-database-policy.1`,
			2: `${CONSTANTS.MODULE_NAME}.icon-database-policy.2`,
		},
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "base-dictionary", {
		name: `${CONSTANTS.MODULE_NAME}.base-dictionary.name`,
		hint: `${CONSTANTS.MODULE_NAME}.base-dictionary.hint`,
		scope: "world",
		config: true,
		type: String,
		choices: <any>{
			"foundry-icons.json": `Foundry Icons`,
			"wow-icons.json": `World of Warcraft icons (offline, local icons)`,
			"wowhead-icons.json": `World of Warcraft icons (online, wowhead.com)`,
		},
		default: "foundry-icons.json",
	});

	// Relabeling "icon directory" to "icon prefix" setting
	game.settings.register(CONSTANTS.MODULE_NAME, "icon-directory", {
		name: `${CONSTANTS.MODULE_NAME}.icon-prefix.name`,
		hint: `${CONSTANTS.MODULE_NAME}.icon-prefix.hint`,
		scope: "world",
		config: true,
		type: String,
		default: "iconizer",
	});

	// Submitting icons is a todo
	// game.settings.register("vtta-iconizer", "share-missing-icons", {
	//   name: "vtta-iconizer.share-missing-icons.name",
	//   hint: "vtta-iconizer.share-missing-icons.hint",
	//   scope: "world",
	//   config: true,
	//   type: Boolean,
	//   default: false,
	// });

	game.settings.register(CONSTANTS.MODULE_NAME, "customDictionaryPath", {
		name: "Custom Icon Dictionary",
		hint: "If specified, this dictionary will be searched for item icons prior to searching default locations. Takes effect after the next page refresh. See ReadMe on GitHub for more information.",
		scope: "world",
		config: true,
		default: "",
		type: String, // Generic file pickers in the settings are not yet supported, and the custom settings-extender.js by @Azzurite currently only supports image, video, audio, or directory.
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "forceUpdate", {
		name: "Force Update Icons",
		hint: "If enabled, icons will be updated even if an icon is already set for an Item.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});
};
