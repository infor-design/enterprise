// Small tool that retrieves JSON data from a file and turns it into objects for use in the demo app.
// NOTE: Synchronous for now.

const path = require('path');
const getJSONFile = require('./get-json-file');

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

module.exports = data;
