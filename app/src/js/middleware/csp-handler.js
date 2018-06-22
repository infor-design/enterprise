const logger = require('../logger');

// Adds a stored "nonce" attribute to all script tags to conform with security policy.
function addNonceToScript(html, nonce) {
  if (!html || !html.length) {
    return '';
  }
  return html.replace(/<script/ig, `<script nonce="${nonce}"`);
}

// Appends "nonce" attributes to script tags inside the response body that match the demoapp's
// Content Security Policy (CSP).
module.exports = function () {
  return function cspHandler(req, res, next) {
    if (!res.opts.csp) {
      next();
      return;
    }

    res.setPolicy({
      policy: {
        directives: {
          'default-src': ['self',
            'https://*.infor.com'
          ],
          'script-src': ['self',
            `nonce-${res.opts.nonce}`,
            'http://squizlabs.github.io',
            'http://myserver.com'
          ],
          'connect-src': [
            'self',
            'http://myserver.com',
            'ws://localhost:35729',
            'ws://10.0.2.2:35729'
          ],
          'object-src': ['none'],
          'style-src': ['* data: http://* \'unsafe-inline\''],
          'font-src': ['self',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
          ],
          'img-src': ['self',
            'https://randomuser.me',
            'http://placehold.it',
            'http://lorempixel.com',
            'https://imgplaceholder.com',
            'http://squizlabs.github.io'
          ]
        }
      }
    });

    // Modify `res.send()` to always patch the HTML contents with the `nonce` attribute.
    const oldSend = res.send;
    res.send = function (...args) {
      // arguments[0] (or `data`) contains the response body
      if (typeof args[0] === 'string') {
        logger('info', 'adding "nonce" attributes to script tags on this response.');
        args[0] = addNonceToScript(args[0], res.opts.nonce);
      }
      oldSend.apply(res, args);
    };

    // Modify `res.render()` to always use a callback, which calls `res.send()`
    const oldRender = res.render;
    res.render = function (view, options, fn) {
      oldRender.call(this, view, options, (err, html) => {
        if (typeof fn === 'function') {
          fn.call(fn, err, html);
        }
        res.send(html);
      });
    };

    next();
  };
};
