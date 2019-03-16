/** @fileoverview This module converts a dir of svg
 * icon files into an html file of svg icons
 */

// Libs
const fs = require('fs');
const glob = require('glob');
const logger = require('../logger');
const path = require('path');
const del = require('del');
const slash = require('slash');

const ROOT_DIR = slash(process.cwd());
const NL = process.platform === 'win32' ? '\r\n' : '\n';
let IS_VERBOSE = false;

const ICON_SETS = [
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-soho/icons/standard/svg/*.svg`,
    dest: `${ROOT_DIR}/src/components/icons/svg.html`,
    class: 'svg-icons'
  },
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-uplift/icons/standard/svg/*.svg`,
    dest: `${ROOT_DIR}/src/components/icons/theme-uplift-svg.html`,
    class: 'svg-icons'
  },
  {
    src: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-soho/icons/empty/svg/*.svg`,
    dest: `${ROOT_DIR}/src/components/emptymessage/svg-empty.html`,
    class: 'svg-icons-empty'
  }
];

/**
 * Remove any "built" directories/files
 * @async
 * @returns {Promise} - A promise
 */
async function cleanFiles() {
  if (IS_VERBOSE) {
    logger('info', `Cleaning SVG icon html files...${NL}`);
  }

  const filesToDel = ICON_SETS.map(n => {
    return n.dest;
  });

  try {
    await del(filesToDel);
  } catch (err) {
    logger('error', err);
  }
}

/**
 * Convert a filename to an id string
 * @param {string} fileName
 */
const cleanStr = fileName => {
  return fileName.toLowerCase().replace(' ', '');
}

/**
 * Customize the svg markup
 * @param {string} contents
 * @param {string} id
 */
const convertSvgMarkup = (id, contents) => {
  let changed = contents.replace(/\<svg/, `<symbol id="icon-${id}"`);
  changed = changed.replace('</svg>', '</symbol>');
  changed = changed.replace(/\sxmlns=\"(.*?)\"/, '');
  return changed;
}

/**
 * Create an html file containing svgs as symbols
 * @param {array} files - Array of svg file paths
 * @param {Object} iconObj - The icon data object
 * @return {Promise} - Resolve array of icons
 */
const createHTMLfile = (files, iconObj) => {
  let htmlIcons = [];
  const promises = files.map(f => {
    return new Promise((resolve, reject) => {
      fs.readFile(f, (err, data) => {
        if (err) {
          reject(err);
        }
        const id = cleanStr(path.basename(f, '.svg'));
        htmlIcons.push(convertSvgMarkup(id, data.toString()));
        resolve();
      });
    })
  });

  return Promise.all(promises)
    .then(() => {
      const html = iconObj.header + htmlIcons.join('\n') + iconObj.footer;
      fs.writeFileSync(iconObj.dest, html, 'utf-8');
      return htmlIcons;
    })
    .catch(err => {
      logger('error', err);
    });
};

/**
 * Create html files of icon sets
 * @param {Object[]} ICON_SETS - An array of objects for the svg icons
 * @return {Promise}
 */
function createHtmlFiles() {
  if (IS_VERBOSE) {
    logger('info', `Running build process create SVG html files...${NL}`);
  }

  return Promise.all(ICON_SETS.map(iconSet => {
    Object.assign(iconSet, {
      header: `<div class="${iconSet.class}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-icons">`,
      footer: '</svg></div>'
    });

    const files = glob.sync(iconSet.src);

    return createHTMLfile(files, iconSet)
      .then(data => {
        if (IS_VERBOSE) {
          logger('success', `${data.length} SVG icons compiled into "${iconSet.dest.replace(process.cwd(), '')}"`);
        }
      })
      .catch(err => {
        logger('error', err);
      });
  }));
}

/**
 * Build
 * @param {boolean} verbose - Log messages
 * @return {Promise}
 */
function createSvgHtml(verbose) {
  IS_VERBOSE = verbose;
  cleanFiles();
  return createHtmlFiles();
}

module.exports = createSvgHtml;
