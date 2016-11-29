// Small tool that retrieves JSON data from a file and turns it into objects for use in the demo app.
// NOTE: Synchronous for now.
const fs = require('fs'),
      path = require('path');

function readJsonFileSync(filepath, encoding) {
  if (typeof encoding === 'undefined'){
    encoding = 'utf8';
  }

  let file = fs.readFileSync(filepath, encoding);
  return JSON.parse(file);
}

function getJSONFile(file) {
  let filepath = path.resolve( __dirname, file );
  return readJsonFileSync(filepath);
}

module.exports = getJSONFile;
