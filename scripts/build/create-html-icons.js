/** @fileoverview This module converts a dir of svg
 * icon files into an html file of svg icons
 */

// Libs
const fs = require('fs');
const glob = require('glob');
const logger = require('../logger');
const path = require('path');

const NL = process.platform === 'win32' ? '\r\n' : '\n';


/**
 * Cutomize the svgs into proper markup
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
 * Convert a filename to an id
 * @param {string} fileName
 */
const cleanStr = fileName => {
  return fileName.toLowerCase().replace(' ', '');
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
 * Create an html files of icon sets
 * @param {Object[]} iconSets - An array of objects for the svg icons
 * @param {string} iconsSets[].src - Glob path of the svg icon files
 * @param {string} iconsSets[].dest - The destination path
 * @param {boolean} verbose - Whether to write out logs
 * @return {Promise}
 */
function createHtmlIcons(iconSets, verbose) {
  if (verbose) {
    logger('info', `Running build processes create-htmlicons...${NL}`);
  }

  return Promise.all(iconSets.map(iconSet => {
    Object.assign(iconSet, {
      header: `<div class="${iconSet.class}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-icons">`,
      footer: '</svg></div>'
    });

    const files = glob.sync(iconSet.src);

    return createHTMLfile(files, iconSet)
      .then(data => {
        if (verbose) {
          logger('success', `${data.length} SVG icons compiled into "${iconSet.dest.replace(process.cwd(), '')}"`);
        }
      })
      .catch(err => {
        logger('error', err);
      });
  }));
}

module.exports = createHtmlIcons;
