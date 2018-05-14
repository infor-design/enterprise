const chalk = require('chalk');
const logger = require('../logger');

// Makes a simple timestamp log of each request in the console
module.exports = function () {
  return function requestLogger(req, res, next) {
    const type = `${chalk.yellow((req.method).toUpperCase())}`;
    const url = `${req.originalUrl}`;

    logger('timestamp', `${type}: ${url}`);
    next();
  };
};
