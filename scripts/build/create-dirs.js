// Libs
const fs = require('fs');
const commandLineArgs = require('yargs').argv;

// Internal
const logger = require('../logger');

/**
 * @param {array} dirs an array of strings representing directories
 * @returns {void}
 */
function createDirs(dirs) {
  dirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      if (commandLineArgs.verbose) {
        logger('info', `Directory "${dir}" already exists`);
      }
      return;
    }

    fs.mkdirSync(dir);
    if (commandLineArgs.verbose) {
      logger('info', `Created directory "${dir}"`);
    }
  });
}

module.exports = createDirs;
