/* eslint-disable no-underscore-dangle */
// Small tool that retrieves JSON data from a file and turns it into objects for use in the demo app.
// NOTE: Synchronous for now.
import * as path from 'path';
import { fileURLToPath } from 'url';
import getJSONFile from './get-json-file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NUMBER_OF_DROPDOWNS = 1000;
const data = [];

function addDropdown(count) {
  data.push({
    id: `dropdown-${count}`,
    name: `States Selector #${count}`,
    data: getJSONFile(path.resolve(__dirname, '..', '..', 'data', 'states-all.json'))
  });
}

for (let i = 0; i < NUMBER_OF_DROPDOWNS; i++) {
  addDropdown(i);
}

export default data;
