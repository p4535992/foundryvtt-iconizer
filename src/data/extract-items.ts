import * as fs from 'fs';
import * as path from 'path';
import { VTTAIconizerItem } from '../module/iconizer-models';

const packDirectory = path.resolve(__dirname, '../../../systems/dnd5e/packs');
const packNames = ['items.db', 'spells.db', 'classfeatures.db', 'classes.db'];

const items: any[] = [];
for (const packName of packNames) {
  const existingEntries = items.length;
  const entries: any[] = fs
    .readFileSync(path.resolve(packDirectory, packName), 'utf-8')
    .split('\n')
    .map((line) => (line.trim() !== '' ? JSON.parse(line) : undefined))
    .filter((contents) => contents !== undefined)
    .map((json) => ({
      name: json.name,
      type: json.type,
      icon: json.img[0] !== '/' ? `/${json.img}` : json.img,
    })) as any[];

  for (const item of entries) {
    if (item.icon) {
      const filtered = items.filter(
        (i: any) => i.name === item.name && i.type === item.type,
        // Foundry does not know about subTypes
      );
      if (filtered.length === 0) {
        items.push(item);
      }
    }
  }
  console.log(
    `Pack ${packName}: ${entries.length} items processed successfully, added ${items.length - existingEntries} items.`,
  );
  //items = items.concat(items, entries);
}

fs.writeFileSync(path.resolve(__dirname + '/json', 'foundry-icons.json'), JSON.stringify(items));

let icons = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/temp', 'wow-icons.json'), 'utf-8')); //require("./wow-icons.json");
icons = icons.map((icon) => ({
  name: icon.name,
  icon: icon.icon.toLowerCase().replace(/png$/, 'jpg'),
}));
fs.writeFileSync(path.resolve(__dirname + '/temp', 'wowhead-icons.json'), JSON.stringify(icons));
