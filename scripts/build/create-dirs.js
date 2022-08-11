// Libs
import * as fs from 'fs';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));

// Internal
import logger from '../logger.js'

/**
 * @param {array} dirs an array of strings representing directories
 * @returns {void}
 */
export default function createDirs(dirs) {
  dirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      if (yargs.verbose) {
        logger('info', `Directory "${dir}" already exists`);
      }
      return;
    }

    fs.mkdirSync(dir);
    if (yargs.verbose) {
      logger('info', `Created directory "${dir}"`);
    }
  });
}
