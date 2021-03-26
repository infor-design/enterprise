// -------------------------------------
// Requirements
// -------------------------------------
const path = require('path');
const sass = require('sass');
const onceImporter = require('node-sass-once-importer');

const logger = require('../logger');
const createDirs = require('./create-dirs');
const writeFile = require('./write-file');

const dirs = [
  'dist',
  'dist/css',
  'app/dist',
  'app/dist/css'
];

// -------------------------------------
// Functions
// -------------------------------------

/**
 * Compiles the result of an SCSS library and writes the resulting CSS and Map to disk
 * @param {object} [options={}] "sass" library options
 * @returns {array<Promise>} containing file write promises
 */
function compileSass(options = {}) {
  // set default options
  /* eslint-disable-next-line */
  options = Object.assign({
    importer: onceImporter(),
    style: 'expanded'
  }, options);

  // Render the CSS/Map result
  const result = sass.renderSync(options);
  const fileWritePromises = [];

  const originalOutFile = `${options.outFile}`;
  options.file = path.resolve(options.file);
  options.outFile = path.resolve(options.outFile);

  // Build directories
  createDirs(dirs);

  // Write the result to file
  fileWritePromises.push(writeFile(options.outFile, result.css).then((err) => {
    if (err) {
      logger('error', `Error: ${err}`);
    }
    logger('success', `Built "${originalOutFile}"`);
  }));

  // Write a sourcemap file, if applicable
  if (result.map) {
    const sourcemapFileName = `${options.outFile}.map`;
    fileWritePromises.push(writeFile(sourcemapFileName, result.map).then((err) => {
      if (err) {
        logger('error', `Error: ${err}`);
      }
      logger('success', `Built "${originalOutFile}.map"`);
    }));
  }

  return fileWritePromises;
}

// -------------------------------------
// Main
// -------------------------------------

/**
 * @param {object} config object containing file paths and other "sass" settings.
 * @returns {Array<Promises>} resolved at the end of each "sass" run
 */
module.exports = function buildSass(config) {
  if (!config || !config.files) {
    throw new Error('Configuration object with a "files" sub-object must be provided.');
  }

  const files = Object.keys(config.files);
  const renderPromises = [];

  files.forEach((file) => {
    let options = {
      file: config.files[file],
      outFile: file
    };

    if (config.options) {
      /* eslint-disable-next-line */
      options = Object.assign(config.options, options);
    }

    renderPromises.concat(compileSass(options));
  });

  return renderPromises;
};
