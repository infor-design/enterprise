// Libs
import chalk from 'chalk';
import * as fs from 'fs';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

// Internal
import logger from '../logger.js'

/**
 * @private
 * @param {string} targetFilePath the path of the file that will be written
 * @param {string} targetFile the contents of the file to be written
 * @returns {void}
 */
function logFileResults(targetFilePath, targetFile) {
  if (!yargs.verbose) {
    return;
  }
  const kbLength = (Buffer.byteLength(targetFile, 'utf8') / 1024).toFixed(2);
  logger('success', `File "${chalk.yellow(targetFilePath)}\n" generated (${kbLength} KB)`);
}

/**
 * Wraps `fs.writeFile()` with actual async
 * @param {string} targetFilePath the path of the file that will be written
 * @param {string} targetFile the contents of the file to be written
 * @returns {Promise} results of `fs.writeFile()`
 */
export default function writeFile(targetFilePath, targetFile) {
  return new Promise((resolve, reject) => {
    fs.writeFile(targetFilePath, targetFile, (err) => {
      if (err) {
        logger('error', `${err}`);
        reject(err);
      }
      logFileResults(targetFilePath, targetFile);
      resolve();
    });
  });
}

