#!/usr/bin/env node

/**
 * IDS Enterprise Minify Process (Uglify-ES Wrapper)
 */

// -------------------------------------
// Requirements
// -------------------------------------
const path = require('path');
const UglifyJS = require('uglify-es');
const commandLineArgs = require('yargs').argv;

const logger = require('./logger');
const config = require('./configs/uglify');
const getFileContents = require('./build/get-file-contents');
const writeFile = require('./build/write-file');

const paths = {
  input: {
    js: path.resolve(__dirname, '..', config.inputFileName),
    sourceMap: path.resolve(__dirname, '..', config.inputSourceMapFileName)
  },
  output: {
    js: path.resolve(__dirname, '..', config.outputFileName),
    sourceMap: path.resolve(__dirname, '..', config.outputSourceMapFileName)
  }
};

// -------------------------------------
// Functions
// -------------------------------------
function openUncompressedFile(name, filePath) {
  const uncompressedFile = getFileContents(filePath);

  if (commandLineArgs.verbose) {
    if (!uncompressedFile) {
      logger('alert', `WARNING: No ${name} was available at "${filePath}"`);
    } else {
      logger('info', `Opened ${name}...`);
    }
  }

  return uncompressedFile;
}

/**
 * Wraps the run of Uglify-ES and returns the result when resolved.
 * @returns {Promise} resovled once the Uglify process completes.
 */
function minify() {
  const code = openUncompressedFile('Uncompressed JS Code', paths.input.js);
  config.uglify.sourceMap.content = openUncompressedFile('Uncompressed JS SourceMap', paths.input.sourceMap);

  return new Promise((resolve, reject) => {
    const result = UglifyJS.minify(code, config.uglify);
    if (result.error) {
      reject(new Error(`Error running Uglify-ES: ${result.error}`));
      return;
    }
    if (commandLineArgs.verbose) {
      logger('info', 'Finished UglifyJS process...');
    }
    resolve(result);
  });
}

// -------------------------------------
// Main
// -------------------------------------

function minifyJS() {
  return new Promise((resolve, reject) => {
    minify().then((result) => {
      const fileWrites = [
        writeFile(paths.output.js, result.code),
        writeFile(paths.output.sourceMap, result.map)
      ];

      Promise.all(fileWrites).then((values) => {
        logger('success', 'Compressed JS files written. JS minifying complete!');
        resolve(values);
        process.exit(0);
      });
    }).catch((e) => {
      reject(e);
      process.exit(1);
    });
  });
}

module.exports = minifyJS();
