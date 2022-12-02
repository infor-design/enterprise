/*
 * Simple middleware for building a complete URL string containing an optional basepath
 */
export default function (app) {
  return function basepathHandler(req, res, next) {
    res.opts.basepath = `//${req.headers.host.replace('/', '')}${app.get('basepath')}`;
    next();
  };
}
