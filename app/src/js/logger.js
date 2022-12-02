// Wraps the logger from the `/scripts` folder with an optional
// demoapp flag.
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from '../../../scripts/logger.js';

const argv = _yargs(hideBin(process.argv)).argv;

function appLogger(type, msg) {
  if (!argv.verbose) {
    return;
  }
  logger(type, msg);
}

export default appLogger;
