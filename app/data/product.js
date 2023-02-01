/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import * as path from 'path';
import getJSONFile from '../src/js/get-json-file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample Product Data
export default function product(req, res) {
  let products = getJSONFile(path.resolve(__dirname, 'products.json'));

  if (req.query.limit) {
    products = products.slice(0, req.query.limit);
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(products);
}
