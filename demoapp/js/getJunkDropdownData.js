// Small tool that retrieves JSON data from a file and turns it into objects for use in the demo app.
// NOTE: Synchronous for now.

const fs = require('fs'),
      path = require('path'),
      getJSONFile = require(path.resolve('demoapp', 'js', 'getJSONFile'));

const NUMBER_OF_DROPDOWNS = 1000;
var data = [];

function addDropdown(count) {
  data.push({
    id: 'dropdown-' + count,
    name: 'States Selector #' + count,
    data: getJSONFile(path.resolve('demoapp', 'data', 'states.json'))
  });
}

for (var i = 0; i < NUMBER_OF_DROPDOWNS; i++) {
  addDropdown(i);
}

module.exports = data;
