import * as fs from "fs";
import * as path from "path";
import { log } from "../scripts/lib/lib";

const dbItems = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/temp", "worldofwarcraft-icons.json"), "utf-8"));

const modItems = JSON.parse(fs.readFileSync(path.resolve(__dirname + "/temp", "wow-icons.json"), "utf-8"));

let added: any[] = [];
const missing: any[] = [];

const defineType = (type) => {
	switch (type) {
		case "backpack":
		case "class":
		case "consumable":
		case "equipment":
		case "feat":
		case "loot":
		case "spell":
		case "tool":
		case "weapon":
			return type;

		case "ammunition":
		case "ring":
		case "rod":
		case "wondrous item":
			return "loot";

		case "scroll":
		case "potion":
		case "wand":
			return "consumable";
		default:
			log("DEFAULT CASE FOR " + type);
			//result.push('loot');
			return "loot";
	}
};

for (const modItem of modItems) {
	if (modItem.type === undefined) {
		log("Looking up " + modItem.name);
		const filtered = dbItems.filter((item) => item.name === modItem.name);

		log("Found " + filtered.length + " results in DB");
		log(filtered);
		if (filtered.length > 0) {
			if (filtered.length > 1) log("+++");

			const items = filtered.map((item) => {
				return {
					...modItem,
					type: defineType(item.type),
					subType: item.subType,
					icon: item.icon,
				};
			});
			log("Created " + items.length + " new items");
			log(items);
			added = added.concat(items);
		} else {
			missing.push(modItem);
		}
		log(`${modItem.name} => ${filtered.map((item) => item.type).join(", ")}`);
	} else {
		log(`Item ${modItem.name} has type ${modItem.type}, let's check for subtype`);
		// try adding a subType
		const dbItem = dbItems.find((i) => i.name === modItem.name);
		log(dbItem);
		if (dbItem) {
			modItem.subType = dbItem.subType;
		} else {
			modItem.subType = null;
		}
		added.push(modItem);
	}
}

fs.writeFileSync(__dirname + "/result.json", JSON.stringify(added));

log("Missing items: ");
log(missing);
