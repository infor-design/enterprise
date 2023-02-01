// Libs
import * as fs from 'fs';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = _yargs(hideBin(process.argv)).argv;

// Internal
import logger from '../logger.js'

/**
 * @param {array} dirs an array of strings representing directories
 * @returns {void}
 */
export default function createDirs(dirs) {
  dirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      if (argv.verbose) {
        logger('info', `Directory "${dir}" already exists`);
      }
      return;
    }

    fs.mkdirSync(dir);
    if (argv.verbose) {
      logger('info', `Created directory "${dir}"`);
    }
  });
}
