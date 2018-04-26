const logger = require('../../../../scripts/logger');

// Simple Middleware for handling errors
module.exports = function (app) {
  return function errorHandler(err, req, res, next) {
    if (!err) {
      next();
      return;
    }

    logger('error', err.stack);

    if (res.headersSent) {
      next(err);
      return;
    }

    res.status(500).send(`<h2>Internal Server Error</h2><p>${err.stack}</p>`);
  };
};
