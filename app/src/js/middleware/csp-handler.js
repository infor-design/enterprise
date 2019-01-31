const browser = require('browser-detect');

// Adds a stored "nonce" attribute to all script tags to conform with security policy.
function addNonceToScript(html, nonce) {
  if (!html || !html.length) {
    return '';
  }
  return html.replace(/<script/ig, `<script nonce="${nonce}"`);
}

function addNonceToStyle(html, nonce) {
  if (!html || !html.length) {
    return '';
  }
  return html.replace(/<style/ig, `<style nonce="${nonce}"`);
}

// Appends "nonce" attributes to script tags inside the response body that match the demoapp's
// Content Security Policy (CSP).
module.exports = function () {
  return function cspHandler(req, res, next) {
    if (!res.opts.csp) {
      next();
      return;
    }

    if (!res.opts.nonce) {
      res.opts.nonce = Math.random().toString(12).replace(/[^a-z0-9]+/g, '').substr(0, 8);
    }

    const bs = browser(req.headers['user-agent']);
    let includeUnsafe = false;

    if (bs.name === 'safari' && bs.versionNumber <= 9) {
      includeUnsafe = true;
    }
    const scriptSrc = ['self',
      `nonce-${res.opts.nonce}`,
      'http://squizlabs.github.io',
      'http://myserver.com'
    ];

    if (includeUnsafe) {
      scriptSrc.push('unsafe-inline');
    }

    res.setPolicy({
      policy: {
        directives: {
          'default-src': ['self',
            'https://*.infor.com'
          ],
          'script-src': scriptSrc,
          'connect-src': [
            'self',
            'http://myserver.com',
            'ws://localhost:35729',
            'ws://10.0.2.2:35729'
          ],
          'object-src': ['none'],
          // Ultimately we want this (see SECURITY.MD)
          // 'style-src': [
          //   'self',
          //   `nonce-${res.opts.nonce}`
          // ],
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
        args[0] = addNonceToScript(args[0], res.opts.nonce);
        args[0] = addNonceToStyle(args[0], res.opts.nonce);
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
