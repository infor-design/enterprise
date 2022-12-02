import chalk from 'chalk';
import logger from '../logger.js';

// Makes a simple timestamp log of each request in the console
export default function () {
  return function requestLogger(req, res, next) {
    const type = `${chalk.yellow((req.method).toUpperCase())}`;
    const url = `${req.originalUrl}`;

    logger('timestamp', `${type}: ${url}`);
    next();
  };
}
