// -------------------------------------
// Requirements
// -------------------------------------
const path = require('path');
const sass = require('node-sass');
const getDirName = require('path').dirname;

const logger = require('../logger');
const createDirs = require('./create-dirs');
const writeFile = require('./write-file');

// -------------------------------------
// Functions
// -------------------------------------

/**
 * Compiles the result of an SCSS library and writes the resulting CSS and Map to disk
 * @param {object} [options={}] "node-sass" library options
 * @returns {array<Promise>} containing file write promises
 */
function compileSass(options = {}) {
  // set default options
  options = Object.assign({
    style: 'expanded'
  }, options);

  // Render the CSS/Map result
  const result = sass.renderSync(options);
  const fileWritePromises = [];

  // Build directories
  createDirs([getDirName(options.outFile)]);

  // Write the result to file
  fileWritePromises.push(writeFile(options.outFile, result.css).then((err) => {
    if (err) {
      logger('error', `Error: ${err}`);
    }
    logger('success', `${options.outFile} built.`);
  }));

  // Write a sourcemap file, if applicable
  if (result.map) {
    const sourcemapFileName = `${options.outFile}.map`;
    fileWritePromises.push(writeFile(sourcemapFileName, result.map).then((err) => {
      if (err) {
        logger('error', `Error: ${err}`);
      }
      logger('success', `${sourcemapFileName} built.`);
    }));
  }

  return fileWritePromises;
}

// -------------------------------------
// Main
// -------------------------------------

/**
 * @param {object} config object containing file paths and other "node-sass" settings.
 * @returns {Array<Promises>} resolved at the end of each "node-sass" run
 */
module.exports = function buildSass(config) {
  if (!config || !config.files) {
    throw new Error('Configuration object with a "files" sub-object must be provided.');
  }

  const files = Object.keys(config.files);
  const renderPromises = [];

  files.forEach((file) => {
    let options = {
      file: path.resolve(config.files[file]),
      outFile: path.resolve(file)
    };

    if (config.options) {
      options = Object.assign(config.options, options);
    }

    renderPromises.concat(compileSass(options));
  });

  return renderPromises;
};
