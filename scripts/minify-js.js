#!/usr/bin/env node

/**
 * IDS Enterprise Minify Process (Uglify-ES Wrapper)
 */

// -------------------------------------
// Requirements
// -------------------------------------
const path = require('path');
const UglifyJS = require('uglify-es');

const logger = require('./logger');
const config = require('./configs/uglify');
const getFileContents = require('./build/get-file-contents');
const writeFile = require('./build/write-file');

const paths = {
  inputJSFile: path.resolve(__dirname, '..', config.inputFileName),
  inputSourceMapFile: path.resolve(__dirname, '..', config.inputSourceMapFileName),
};

// -------------------------------------
// Main
// -------------------------------------

// Get the uncompressed, transpiled `sohoxi.js` from Rollup.
const TRANSPILED_CODE = getFileContents(paths.inputJSFile);
if (TRANSPILED_CODE) {
  logger('info', 'Opened uncompressed JS code...');
} else {
  logger('alert', `WARNING: No JS file was available at "${paths.inputJSFile}"`);
}

// Get the contents of the uncompressed sourceMap file.
config.uglify.sourceMap.content = getFileContents(paths.inputSourceMapFile);
if (config.uglify.sourceMap.content) {
  logger('info', 'Opened uncompressed JS sourceMap...');
} else {
  logger('alert', `WARNING: No sourceMap file was available at "${paths.inputSourceMapFile}"`);
}

// Run Uglify-ES and get the result
const result = UglifyJS.minify(TRANSPILED_CODE, config.uglify);
if (result.error) {
  logger('error', `Error running Uglify-ES: ${result.error}`);
  process.exit(1);
}
logger('info', 'Finished UglifyJS process...');

// Save the minified code
const codeResultPath = path.resolve(__dirname, '..', config.outputFileName);
const sourceMapPath = path.resolve(__dirname, '..', config.outputSourceMapFileName);
const promises = [
  writeFile(codeResultPath, result.code),
  writeFile(sourceMapPath, result.map)
];

module.exports = Promise.all(promises).then(() => {
  logger('success', 'Compressed JS files written. JS minifying complete!');
  process.exit(0);
});
