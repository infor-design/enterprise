/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import * as path from 'path';
import getJSONFile from '../src/js/get-json-file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function orgStructure(req, res) {
  const orgData = getJSONFile(path.resolve(__dirname, 'orgstructure-original.json'));

  function setBasePath(imgPath) {
    return `${req.protocol}://${req.host}${imgPath}`;
  }

  function detectPictures(record) {
    if (typeof record.Picture === 'string') {
      record.Picture = setBasePath(record.Picture);
    }
    if (Array.isArray(record.children)) {
      record.children.forEach((childRecord) => {
        detectPictures(childRecord);
      });
    }
  }

  // For IDS demo sites, append the host to the image paths
  if (req.hostname.indexOf('demo.design.infor.com') > -1) {
    orgData.forEach((record) => {
      detectPictures(record);
    });
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(orgData));
}
