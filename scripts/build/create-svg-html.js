/**
 * @fileoverview This module converts a dir of svg
 * icon files into an html file of svg icons
 */

// Libs
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const del = require('del');
const slash = require('slash');
const logger = require('../logger');

const IdsMetadata = require('../helpers/ids-metadata');

const ROOT_DIR = slash(process.cwd());
const NL = process.platform === 'win32' ? '\r\n' : '\n';
let IS_VERBOSE = false;

const PATHS = {
  idsIdentity: `${ROOT_DIR}/node_modules/ids-identity`,
  iconComponent: `${ROOT_DIR}/src/components/icons`
};

/**
 * Get the paths to themes' icon sets
 * @returns {obj[]} Theme path objects
 */
function getIconSetPaths() {
  const themes = new IdsMetadata().getThemes();
  let iconSets = themes.map(theme => ({
    src: `${PATHS.idsIdentity}/dist/theme-${theme.name}/icons/standard/svg/*.svg`,
    dest: `${PATHS.iconComponent}/theme-${theme.name}-svg.html`,
    class: 'svg-icons'
  }));

  // Addition for soho "empty" icons
  const emptyIconSets = themes.map(theme => ({
    src: `${PATHS.idsIdentity}/dist/theme-${theme.name}/icons/empty/svg/*.svg`,
    dest: `${ROOT_DIR}/src/components/emptymessage/theme-${theme.name}-svg-empty.html`,
    class: 'svg-icons-empty'
  }));

  iconSets = iconSets.concat(emptyIconSets);

  // Legacy Icon Files - DEPRECATE soon
  iconSets.push({
    src: `${PATHS.idsIdentity}/dist/theme-soho/icons/standard/svg/*.svg`,
    dest: `${PATHS.iconComponent}/svg.html`,
    class: 'svg-icons',
    isDeprecated: true
  });

  iconSets.push({
    src: `${PATHS.idsIdentity}/dist/theme-soho/icons/empty/svg/*.svg`,
    dest: `${ROOT_DIR}/src/components/emptymessage/svg-empty.html`,
    class: 'svg-icons-empty',
    isDeprecated: true
  });

  return iconSets;
}

/**
 * Remove any "built" directories/files
 * @async
 * @param {Object[]} iconSets - An array of objects for the svg icons
 */
async function cleanFiles(iconSets) {
  if (IS_VERBOSE) {
    logger('info', `Cleaning SVG icon html files...${NL}`);
  }

  const filesToDel = iconSets.map(n => n.dest);

  try {
    await del(filesToDel);
  } catch (err) {
    logger('error', err);
  }
}

/**
 * Convert a filename to an id string
 * @param {string} fileName The name of the file
 * @returns {string} An ID string
 */
const cleanStr = fileName => fileName.toLowerCase().replace(' ', '');

/**
 * Customize the svg markup
 * @param {string} id The ID of the icon
 * @param {string} contents The svg html for the icon
 * @returns {string} The changed html
 */
const convertSvgMarkup = (id, contents) => {
  let changed = contents.replace(/<svg/, `<symbol id="icon-${id}"`);
  changed = changed.replace('</svg>', '</symbol>');
  changed = changed.replace(/\sxmlns="(.*?)"/, '');
  return changed;
};

/**
 * Create an html file containing svgs as symbols
 * @param {array} files - Array of svg file paths
 * @param {Object} iconObj - The icon data object
 * @returns {Promise} - Resolve array of icons
 */
const createHTMLfile = (files, iconObj) => {
  const htmlIcons = [];
  const promises = files.map(f => new Promise((resolve, reject) => {
    fs.readFile(f, (err, data) => {
      if (err) {
        reject(err);
      }
      const id = cleanStr(path.basename(f, '.svg'));
      htmlIcons.push(convertSvgMarkup(id, data.toString()));
      resolve();
    });
  }));

  return Promise.all(promises)
    .then(() => {
      const html = iconObj.header + htmlIcons.join('\n') + iconObj.footer;
      fs.writeFileSync(iconObj.dest, html, 'utf-8');
      return htmlIcons;
    })
    .catch((err) => {
      logger('error', err);
    });
};

/**
 * Create html files of icon sets
 * @param {Object[]} iconSets - An array of objects for the svg icons
 * @returns {Promise} A promise
 */
function createHtmlFiles(iconSets) {
  if (IS_VERBOSE) {
    logger('info', `Running build process create SVG html files...${NL}`);
  }

  return Promise.all(iconSets.map((iconSet) => {
    Object.assign(iconSet, {
      header: `<div class="${iconSet.class}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-icons">`,
      footer: '</svg></div>'
    });

    const files = glob.sync(iconSet.src);

    return createHTMLfile(files, iconSet)
      .then((data) => {
        if (IS_VERBOSE) {
          const thePath = iconSet.dest.replace(`${process.cwd()}/src/components`, '');
          let desc = `${data.length} SVG icons compiled into "${thePath}"`;
          if (thePath.includes('/svg.html')) {
            desc += ' [!! DEPRECATED !!]';
          }
          if (thePath.includes('/svg-empty.html')) {
            desc += ' [!! DEPRECATED !!]';
          }

          logger('success', desc);
        }
      })
      .catch((err) => {
        logger('error', err);
      });
  }));
}

/**
 * Build
 * @param {boolean} verbose - Log messages
 */
function createSvgHtml(verbose) {
  IS_VERBOSE = verbose;
  const iconSets = getIconSetPaths();

  cleanFiles(iconSets).then(() => {
    createHtmlFiles(iconSets);
  });
}

module.exports = createSvgHtml;
