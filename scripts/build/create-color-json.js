/** @fileoverview
 * This module takes the ids colors and extracts out properties used in the ids code for use.
 * In the future this could be expanded to extract more token information as needed.
 */

// Libs
const del = require('del');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const slash = require('slash');

// Local Libs
const logger = require('../logger');

const IdsMetadata = require('../helpers/ids-metadata');

const IDS_THEMES = new IdsMetadata().getThemes();

const NL = process.platform === 'win32' ? '\r\n' : '\n';
const ROOT_DIR = slash(process.cwd());
const PATHS = {
  dest: `${ROOT_DIR}/src/components/theme`
};

let IS_VERBOSE = false;

/**
 * Remove any previously "built" directories/files
 */
async function cleanFiles() {
  if (IS_VERBOSE) {
    logger('info', `Cleaning Color JSON files...${NL}`);
  }

  const files = glob.sync(`${PATHS.dest}/*.json`);
  try {
    await del(files);
  } catch (err) {
    logger('error', err);
  }
}

/**
 * Only get properties we need
 * @param {object} obj The original object
 * @returns {object} The new color object
 */
function createNewCustomObj(obj) {
  const newObj = {};
  if (obj.hasOwnProperty('primary') && obj.primary.hasOwnProperty('base')) { //eslint-disable-line
    newObj.primary = {};
    newObj.primary.name = obj.primary.base.name;
    newObj.primary.value = obj.primary.base.value;
  }

  // Loop for color names: 'amber', 'azure'...
  Object.keys(obj).forEach(colorName => { //eslint-disable-line
    newObj[colorName] = {};
    if (obj[colorName].hasOwnProperty('name')) { //eslint-disable-line
      // For colors w/o variants: black, white...
      newObj[colorName].name = obj[colorName].name;
      newObj[colorName].value = obj[colorName].value;
      newObj[colorName].paletteName = obj[colorName].original.value;
    } else {
      // Loop for color variants: 10, 20, 30...
      Object.keys(obj[colorName]).forEach(colorNum => { //eslint-disable-line
        newObj[colorName][colorNum] = {
          name: obj[colorName][colorNum].name,
          value: obj[colorName][colorNum].value
        };
      });
    }
  });

  return newObj;
}

/**
 * Create a json meta data file of token colors
 * @param  {string} filePath The file path
 * @returns {Promise} Resolve array of icons
 */
const createJSONfile = filePath => new Promise((resolve) => {
  const themeObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const themeColorPaletteObj = createNewCustomObj(themeObj.ids.color.palette);
  const themeColorStatusObj = createNewCustomObj(themeObj.ids.color.status);
  const themeColorBrandObj = createNewCustomObj(themeObj.ids.color.brand);

  // Get properties for individual components
  const themeBodyObj = createNewCustomObj(themeObj.body.color);

  // Get the theme's name for file path/property generation
  const themeName = path.basename(filePath, '.json');

  const colorsOnlyObj = {
    color: {
      themeName,
      palette: themeColorPaletteObj,
      status: themeColorStatusObj,
      brand: themeColorBrandObj,
      components: {
        body: themeBodyObj
      }
    }
  };
  const fileName = `${themeName}-colors.json`;
  fs.writeFileSync(`${PATHS.dest}/${fileName}`, JSON.stringify(colorsOnlyObj), 'utf-8');
  resolve(fileName);
});

/**
 * Create JSON file of color palette and status tokens
 * @returns {Promise} Resolve the created file name
 */
function createColorJsonFiles() {
  if (IS_VERBOSE) {
    logger('info', `Running build process create JSON Color files...${NL}`);
  }

  const themeFiles = [];

  const createPath = (themeName, FileName) => {
    const dist = `${ROOT_DIR}/node_modules/ids-identity/dist`;
    return `${dist}/theme-${themeName}/tokens/web/theme-${FileName}.json`;
  };

  IDS_THEMES.forEach((theme) => {
    // A theme's base does not have a variant "modifier"
    // i.e. "soho-light" is just "soho"
    themeFiles.push(createPath(theme.name, theme.name));

    theme.variants.forEach((variant) => {
      themeFiles.push(createPath(theme.name, `${theme.name}-${variant.name}`));
    });
  });

  return Promise.all(themeFiles.map(createJSONfile))
    .then(filesCreated => { //eslint-disable-line
      if (IS_VERBOSE) {
        logger('success', `${filesCreated.length} JSON Token Files generated into "${PATHS.dest.replace(process.cwd(), '')}"`);
      }
    })
    .catch(err => logger('error', err));
}

/**
 * Main Build function
 * @param  {string} verbose Will generate more error messages.
 * @returns {Promise} A promise
 */
function createColorJson(verbose) {
  IS_VERBOSE = verbose;
  return cleanFiles().then(createColorJsonFiles);
}

module.exports = createColorJson;
