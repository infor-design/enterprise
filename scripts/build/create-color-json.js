/** @fileoverview
 * This module takes the ids colors and extracts out properties used in the ids code for use.
 * In the future this could be expanded to extract more token information as needed.
 */

// Libs
const fs = require('fs');
const glob = require('glob');
const logger = require('../logger');
const del = require('del');
const slash = require('slash');

const ROOT_DIR = slash(process.cwd());
const NL = process.platform === 'win32' ? '\r\n' : '\n';
let IS_VERBOSE = false;

const THEME_FILES = [
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-uplift/tokens/web/theme-uplift.json`,
    dest: `${ROOT_DIR}/src/components/theme/theme-uplift-colors.json`
  },
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-soho/tokens/web/theme-soho-contrast.json`,
    dest: `${ROOT_DIR}/src/components/theme/theme-soho-contrast-colors.json`
  },
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-soho/tokens/web/theme-soho-dark.json`,
    dest: `${ROOT_DIR}/src/components/theme/theme-soho-dark-colors.json`
  },
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-soho/tokens/web/theme-soho.json`,
    dest: `${ROOT_DIR}/src/components/theme/theme-soho-colors.json`
  }
];

/**
 * Remove any previously "built" directories/files
 */
async function cleanFiles() {
  if (IS_VERBOSE) {
    logger('info', `Cleaning Color JSON files...${NL}`);
  }

  const filesToDel = THEME_FILES.map(n => n.dest);

  try {
    await del(filesToDel);
  } catch (err) {
    logger('error', err);
  }
}

/**
 * Remove some unused props on the JSON
 * @param {object} object The JSON object
 */
function cleanObj(object) {
  Object.keys(object).forEach((key) => {
    delete object[key].original;
    delete object[key].attributes;
    delete object[key].path;
    Object.keys(object[key]).forEach((key2) => {
      delete object[key][key2].original;
      delete object[key][key2].path;
      delete object[key][key2].attributes;
    });
  });
}

/**
 * Create an html file containing svgs as symbols
 * @param  {array} files Array of svg file paths
 * @param  {Object} jsonObj The icon data object
 * @returns {Promise} Resolve array of icons
 */
const createJSONfile = (files, jsonObj) => {
  const htmlIcons = [];
  const promises = files.map(f => { // eslint-disable-line
    return new Promise((resolve, reject) => {
      fs.readFile(f, (err, data) => {
        if (err) {
          reject(err);
        }
        htmlIcons.push(data.toString());
        resolve();
      });
    });
  });

  return Promise.all(promises)
    .then(() => {
      const html = htmlIcons;
      const json = JSON.parse(html);
      const newObj = { color: {} };
      newObj.color.palette = json.theme.color.palette;
      newObj.color.status = json.theme.color.status;

      cleanObj(newObj.color.palette);
      cleanObj(newObj.color.status);

      fs.writeFileSync(jsonObj.dest, JSON.stringify(newObj), 'utf-8');
      return htmlIcons;
    })
    .catch(err => logger('error', err));
};

/**
 * Create JSON files with just the properties we want.
 * @returns {Promise} Resolve array of icons
 */
function createColorJsonFiles() {
  if (IS_VERBOSE) {
    logger('info', `Running build process create JSON Color files...${NL}`);
  }

  return Promise.all(THEME_FILES.map((themeSet) => {
    const files = glob.sync(themeSet.src);

    return createJSONfile(files, themeSet)
      .then((data) => {
        if (IS_VERBOSE) {
          logger('success', `${data.length} JSON Files generated into "${themeSet.dest.replace(process.cwd(), '')}"`);
        }
      })
      .catch(err => logger('error', err));
  }));
}

/**
 * Main Build function
 * @param  {string} verbose Will generate more error messages.
 * @returns {Promise} A promise
 */
function createColorJson(verbose) {
  IS_VERBOSE = verbose;
  cleanFiles();
  return createColorJsonFiles();
}

module.exports = createColorJson;
