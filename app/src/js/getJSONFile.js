// Small tool that retrieves JSON data from a file and turns it into objects for use in the demo app.
// NOTE: Synchronous for now.
const fs = require('fs');
const path = require('path');

function readJsonFileSync(filepath, encoding) {
  if (typeof encoding === 'undefined') {
    encoding = 'utf8';
  }

  const file = fs.readFileSync(filepath, encoding);
  return JSON.parse(file);
}

function getJSONFile(file) {
  const filepath = path.resolve(__dirname, file);
  return readJsonFileSync(filepath);
}

module.exports = getJSONFile;
