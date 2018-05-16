// Wraps the logger from the `/scripts` folder with an optional
// demoapp flag.
const logger = require('../../../scripts/logger');
const yargs = require('yargs').argv;

function appLogger(type, msg) {
  if (!yargs.verbose) {
    return;
  }
  logger(type, msg);
}

module.exports = appLogger;
