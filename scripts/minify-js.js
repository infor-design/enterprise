#!/usr/bin/env node
/* eslint-disable no-underscore-dangle */

/**
 * IDS Enterprise Minify Process (Terser Wrapper)
 */

import glob from 'glob';
import * as path from 'path';
import extend from 'extend';
import { minify } from 'terser';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fileURLToPath } from 'url';

import logger from './logger.js';
import config from './configs/terser.js';
import getFileContents from './build/get-file-contents.js';
import writeFile from './build/write-file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv = _yargs(hideBin(process.argv)).argv;

const paths = {
  ids: {
    input: {
      js: path.resolve(__dirname, '..', config.inputFileName),
      sourceMap: path.resolve(__dirname, '..', config.inputSourceMapFileName)
    },
    output: {
      js: path.resolve(__dirname, '..', config.outputFileName),
      sourceMap: path.resolve(__dirname, '..', config.outputSourceMapFileName)
    }
  },
  cultures: path.resolve(__dirname, '..', config.culturesFolder)
};

let compressedFileCount = 0;

// -------------------------------------
// Functions
// -------------------------------------
function openUncompressedFile(name, filePath) {
  const uncompressedFile = getFileContents(filePath);

  if (argv.verbose) {
    if (!uncompressedFile) {
      logger('alert', `WARNING: No ${name} was available at "${filePath}"`);
    } else {
      logger('info', `Opened ${name}...`);
    }
  }

  return uncompressedFile;
}

// =============================
// Each of the following functions returns a promise.
// When the promise resolves successfully, the resulting object looks like:
// @param {string} result.code the minified code from Terser.
// @param {string} [result.map] if applcable, a sourcemap from Terser.
// @param {string} result.inputFile the original filename for the source code.
// @param {string} [result.inputSourceMapFileName] if applicable, the filename for the uncompressed sourcemap.
// @param {string} result.outputFile the target filename for the compressed code.
// @param {stirng} [result.outputSourceMapFile] if applicable, the target filename for the compressed sourcemap.
// =============================

/**
 * Minifies the main IDS JS library.
 * Wraps the execution of Terser CLI and returns the result when resolved.
 * @returns {Promise} resovled once the CLI process completes.
 */
function minifyIdsJs() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const code = openUncompressedFile('Uncompressed "sohoxi.js" library', paths.ids.input.js);
    // config.terser.sourceMap.content = openUncompressedFile('Uncompressed "sohoxi.js" sourceMap', paths.ids.input.sourceMap);

    // const result = minify(code, config.terser);
    const result = await minify(code, config.terser);

    if (result.error) {
      reject(new Error(`Error running Terser: ${result.error}`));
      return;
    }
    if (argv.verbose) {
      logger('success', `Compressed library file "${'sohoxi.js'}" with sourcemap successfully.`);
    }
    compressedFileCount++;

    resolve(extend({}, result, {
      inputFile: paths.ids.input.js,
      inputSourceMapFileName: paths.ids.input.sourceMap,
      outputFile: paths.ids.output.js,
      outputSourceMapFile: paths.ids.output.sourceMap,
      code: result.code
    }));
  });
}

/**
 * Minifies a Locale Culture file with no sourcemap.
 * Wraps the execution of Terser CLI and returns the result when resolved.
 * @param {string} inputFileName the filename of the culture file.
 * @returns {Promise} resolves when the Terser process completes or throws an error.
 */
function minifyCulture(inputFileName) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const culture = inputFileName.substring(inputFileName.lastIndexOf(path.sep) + 1, inputFileName.lastIndexOf('.'));
    const code = openUncompressedFile(`Uncompressed culture "${culture}"`, path.resolve(paths.cultures, inputFileName));

    const result = await minify(code);
    if (result.error) {
      reject(new Error(`Error running Terser: ${result.error}`));
      return;
    }
    if (argv.verbose) {
      logger('success', `Compressed culture file "${inputFileName}" successfully.`);
    }
    compressedFileCount++;
    resolve(extend({}, result, {
      inputFile: inputFileName,
      outputFile: path.resolve(paths.cultures, `${culture}.min.js`),
      code: result.code
    }));
  });
}

// -------------------------------------
// Main
// -------------------------------------

function minifyJS() {
  return new Promise((resolve, reject) => {
    let cultureFiles = glob.sync(`${paths.cultures}${path.sep}*.js`);
    cultureFiles = cultureFiles.filter(culture => !culture.includes('.min.js'));

    // First result is the main `sohoxi.js` minification.
    // All subsequent results are culture files.
    const minifyResults = [minifyIdsJs()];
    cultureFiles.forEach((culture) => {
      minifyResults.push(minifyCulture(culture));
    });

    Promise.all(minifyResults).then((results) => {
      const fileWrites = [];
      results.forEach((result) => {
        fileWrites.push(writeFile(result.outputFile, result.code));

        // The result at index '0' is the minified `sohoxi.js`,
        // which includes a sourcemap.
        if (result.outputSourceMapFile && result.map) {
          fileWrites.push(writeFile(result.outputSourceMapFile, result.map));
        }
      });

      // After all file writing is complete, successfully exit.
      Promise.all(fileWrites).then((values) => {
        logger('beer', `Terser successfully compressed ${`(${compressedFileCount})`} JS files!`);
        resolve(values);
        process.exit(0);
      });
    }).catch((e) => {
      logger('error', e);
      reject(e);
      process.exit(1);
    });
  });
}

minifyJS();
/// export default minifyJS;
