/** @fileoverview This module converts a dir of svg
 * icon files into an html file of svg icons
 */

// Libs
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const swlog = require(`../helpers/stopwatch-log`)

// Internal
const rootDir = slash(process.cwd());
const iconComponentDir = `${rootDir}/src/components/icons`;

const paths = {
  outputIconsBasic: `${iconComponentDir}/svg-generated.html`,
  outputIconsExtended: `${iconComponentDir}/svg-generated-extended.html`,
};

/**
 * Cutomize the svgs into proper markup
 * @param {string} contents
 * @param {string} id
 */
const convertSvgMarkup = (id, contents) => {
  let changed = contents.replace(/\<svg/, `<symbol id="icon-${id}"`);
  changed = changed.replace('</svg>', '</symbol>');
  changed = changed.replace(/width=\"(.*?)\"\s/, '');
  changed = changed.replace(/height=\"(.*?)\"\s/, '');
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
    .catch(swlog.error);
};

/**
 * Create an html files of icon sets
 * @param {Object[]} iconSets - An array of objects for the svg icons
 * @param {string} iconsSets[].src - Glob path of the svg icon files
 * @param {string} iconsSets[].dest - The destination path
 * @return {Promise}
 */
function createHtmlIcons(iconSets) {
  return Promise.all(iconSets.map(iconSet => {
    Object.assign(iconSet, {
      header: `<div class="${iconSet.class}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-icons">`,
      footer: '</svg></div>'
    });

    const files = glob.sync(iconSet.src);

    return createHTMLfile(files, iconSet)
      .then(data => {
        swlog.success(`${data.length} SVG icons compiled into "${iconSet.dest}"`);
      })
      .catch(swlog.error);
  }));
}

// module.exports = createHtmlIcons;
createHtmlIcons([
  {
    src: `${rootDir}/node_modules/ids-identity/dist/theme-soho/icons/standard/svg/*.svg`,
    dest: 'src/components/icons/svg.html',
    class: 'svg-icons'
  },
  {
    src: `${rootDir}/node_modules/ids-identity/dist/theme-soho/icons/extended/svg/*.svg`,
    dest: 'src/components/icons/svg-extended.html',
    class: 'svg-icons-extended'
  },
  {
    src: `${rootDir}/node_modules/ids-identity/dist/theme-soho/icons/empty/svg/*.svg`,
    dest: 'src/components/emptymessage/svg-empty.html',
    class: 'svg-icons-empty'
  }
]);
