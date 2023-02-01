/* eslint-disable no-underscore-dangle */
// Small tool that retrieves JSON data from a file and turns it into objects for use in the demo app.
// NOTE: Synchronous for now.
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJsonFileSync(filepath, encoding) {
  if (typeof encoding === 'undefined') {
    encoding = 'utf8';
  }

  const file = fs.readFileSync(filepath, encoding);
  return JSON.parse(file);
}

export default function getJSONFile(file) {
  const filepath = path.resolve(__dirname, file);
  return readJsonFileSync(filepath);
}
