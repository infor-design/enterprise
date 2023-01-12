// Libs
import * as fs from 'fs';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Internal
import logger from '../logger.js';

const argv = _yargs(hideBin(process.argv)).argv;

/**
 * @private
 * @param {string} targetFilePath the path of the file that will be written
 * @param {string} targetFile the contents of the file to be written
 * @returns {void}
 */
function logFileResults(targetFilePath, targetFile) {
  if (!argv.verbose) {
    return;
  }
  const kbLength = (Buffer.byteLength(targetFile, 'utf8') / 1024).toFixed(2);
  logger('success', `File "${targetFilePath}\n" generated (${kbLength} KB)`);
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

