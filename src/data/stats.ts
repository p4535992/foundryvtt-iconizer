import * as fs from 'fs';
import * as path from 'path';

import { log } from '../index';

const files = fs.readdirSync(__dirname, 'utf-8').filter((file) => file.indexOf('.json') !== -1);

let types = {};

files.forEach((file) => {
  types = {};
  log(file);
  const entries = JSON.parse(fs.readFileSync(path.resolve(__dirname, file), 'utf-8'));
  for (const item of entries) {
    if (!Object.prototype.hasOwnProperty.call(types, item.type)) {
      types[item.type] = 1;
    } else {
      types[item.type]++;
    }
  }
  log(`Dictionary ${file}: ${entries.length} items`);
  Object.keys(types)
    .sort()
    .forEach((type) => {
      log(`${type.padEnd(20, ' ')}: ${types[type]}`);
    });
  log('===================================================');
});
