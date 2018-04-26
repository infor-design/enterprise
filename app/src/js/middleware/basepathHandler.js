/*
 * Simple middleware for building a complete URL string containing an optional basepath
 */
module.exports = function (app) {
  return function basepathHandler(req, res, next) {
    res.opts.basepath = `${req.protocol}://${req.headers.host.replace('/', '')}${app.get('basepath')}`;
    next();
  };
};
