#!/usr/bin/env node

/**
 * IDS Enterprise Minify Process (Terser Wrapper)
 */

// -------------------------------------
// Requirements
// -------------------------------------
const path = require('path');
const Terser = require('terser');
const commandLineArgs = require('yargs').argv;

const logger = require('./logger');
const config = require('./configs/terser');
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
 * Wraps the execution of Terser CLI and returns the result when resolved.
 * @returns {Promise} resovled once the CLI process completes.
 */
function minify() {
  const code = openUncompressedFile('Uncompressed JS Code', paths.input.js);
  config.terser.sourceMap.content = openUncompressedFile('Uncompressed JS SourceMap', paths.input.sourceMap);

  return new Promise((resolve, reject) => {
    const result = Terser.minify(code, config.terser);
    if (result.error) {
      reject(new Error(`Error running Terser: ${result.error}`));
      return;
    }
    if (commandLineArgs.verbose) {
      logger('info', 'Finished Terser minification process...');
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
