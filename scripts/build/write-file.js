// Libs
const chalk = require('chalk');
const fs = require('fs');
const commandLineArgs = require('yargs').argv;

// Internal
const logger = require('../logger');

/**
 * @private
 * @param {string} targetFilePath the path of the file that will be written
 * @param {string} targetFile the contents of the file to be written
 * @returns {void}
 */
function logFileResults(targetFilePath, targetFile) {
  if (!commandLineArgs.verbose) {
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
function writeFile(targetFilePath, targetFile) {
  return new Promise((resolve, reject) => {
    if (targetFile) {
      fs.writeFile(targetFilePath, targetFile, (err) => {
        if (err) {
          logger('error', `${err}`);
          reject(err);
        }
        logFileResults(targetFilePath, targetFile);
        resolve();
      });
    }
  });
}

module.exports = writeFile;
