const path = require('path');
const logger = require('../../../../scripts/logger');

// Simple Middleware for handling errors
module.exports = function () {
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

    const viewsRoot = req.app.get('views');

    res.status(500);
    res.opts.error = err;
    res.render(path.join(viewsRoot, 'error.html'));
  };
};
