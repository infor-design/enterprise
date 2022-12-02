import * as path from 'path';
import logger from '../logger.js';
import setLayout from '../set-layout.js';
import utils from '../utils.js';

// Gets a URL to use where the "Try getting a fresh start" link appears on the error page.
// For some "virtual" (read: not file-system-based) routes, this needs manual intervention.
function getRedirectedURL(url, viewsRoot) {
  if (url.includes('/api')) {
    return '/';
  }
  return utils.getClosestValidDirectory(url, viewsRoot);
}

// Simple Middleware for handling errors
export default function () {
  return function errorHandler(err, req, res, next) {
    const viewsRoot = req.app.get('views');

    // Log to the console
    logger('error', err);

    // If we already sent HTTP headers, just tack the message on.
    if (res.headersSent) {
      next(err);
      return;
    }

    // Respond with an HTML page
    if (req.accepts('html')) {
      setLayout(req, res, 'layout-empty.html');
      res.opts.url = req.url;
      res.opts.prevUrl = getRedirectedURL(req.url, viewsRoot);
      res.opts.error = {
        code: res.statusCode || 500,
        message: err
      };
      res.render(path.join(viewsRoot, 'error.html'), res.opts);
      return;
    }

    // Respond with JSON
    if (req.accepts('json')) {
      res.send({ error: err });
      return;
    }

    // If all else fails, respond with plain text.
    res.type('txt').send(err.message);
  };
}
