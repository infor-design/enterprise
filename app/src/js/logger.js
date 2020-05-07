// Wraps the logger from the `/scripts` folder with an optional
// demoapp flag.
const yargs = require('yargs').argv;
const logger = require('../../../scripts/logger');

function appLogger(type, msg) {
  if (!yargs.verbose) {
    return;
  }
  logger(type, msg);
}

module.exports = appLogger;
