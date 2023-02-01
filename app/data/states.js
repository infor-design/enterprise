/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import * as path from 'path';
import getJSONFile from '../src/js/get-json-file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function data(req, res) {
  const allStates = getJSONFile(path.resolve(__dirname, 'states-all.json'));

  function done(results) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
  }

  if (!req || !req.query || !req.query.term) {
    done(allStates);
    return;
  }

  // Filter specific states for a search term
  const filtered = [];
  for (let i = 0; i < allStates.length; i++) {
    if (allStates[i].label.toLowerCase().indexOf(req.query.term.toLowerCase()) > -1) {
      filtered.push(allStates[i]);
    }
  }

  done(filtered);
}
