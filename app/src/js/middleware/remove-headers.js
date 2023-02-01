/*
 * Simple middleware for removing identifying application headers
 * See https://github.com/infor-design/enterprise/issues/959
 */
export default function (app) {
  app.disable('x-powered-by');

  return function removeHeaders(req, res, next) {
    delete req.headers['x-powered-by'];
    delete req.headers.server;
    next();
  };
}
