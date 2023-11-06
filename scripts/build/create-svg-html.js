/**
 * @fileoverview This module converts a dir of svg
 * icon files into an html file of svg icons
 */

// Libs
import * as fs from 'fs';
import glob from 'glob';
import * as path from 'path';
import slash from 'slash';

import logger from '../logger.js';

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
  let iconSets = [
    {
      src: `${PATHS.idsIdentity}/dist/theme-new/icons/default/svg/*.svg`,
      dest: `${PATHS.iconComponent}/theme-new-default-svg.html`,
      class: 'svg-icons'
    },
    {
      src: `${PATHS.idsIdentity}/dist/theme-new/icons/old/svg/*.svg`,
      dest: `${PATHS.iconComponent}/theme-new-old-svg.html`,
      class: 'svg-icons'
    },
    {
      src: `${PATHS.idsIdentity}/dist/theme-classic/icons/standard/svg/*.svg`,
      dest: `${PATHS.iconComponent}/theme-classic-svg.html`,
      class: 'svg-icons'
    }
  ];

  // Addition for classic "empty" icons
  const emptyIconSets = [
    {
      src: `${PATHS.idsIdentity}/dist/theme-new/icons/old/empty/svg/*.svg`,
      dest: `${ROOT_DIR}/src/components/emptymessage/theme-new-svg-empty.html`,
      class: 'svg-icons-empty'
    },
    {
      src: `${PATHS.idsIdentity}/dist/theme-classic/icons/empty/svg/*.svg`,
      dest: `${ROOT_DIR}/src/components/emptymessage/theme-classic-svg-empty.html`,
      class: 'svg-icons-empty'
    }
  ];

  iconSets = iconSets.concat(emptyIconSets);

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
    // eslint-disable-next-line no-restricted-syntax
    for (const file of filesToDel) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
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

  changed = changed.replace(' style="color: #28282A; fill: transparent;"', '');
  changed = changed.replace(' style="color: #28282A; fill: transparent"', '');
  changed = changed.replace(' style="color: transparent; fill: #28282A;"', '');
  changed = changed.replace(' color="transparent" fill="#28282a" stroke="none"', '');
  changed = changed.replaceAll('#000', 'currentColor');

  if (changed.indexOf('stroke=') === -1) {
    changed = changed.replaceAll('fill-rule="evenodd"', 'fill="currentColor" fill-rule="evenodd"');
  }

  if (changed.indexOf('stroke=') === -1) {
    changed = changed.replaceAll('<path d="', '<path fill="currentColor" d="');
  }
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
export default function createSvgHtml(verbose) {
  IS_VERBOSE = verbose;
  const iconSets = getIconSetPaths();

  cleanFiles(iconSets).then(() => {
    createHtmlFiles(iconSets);
  });
}
