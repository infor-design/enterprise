const logger = require('../../../../scripts/logger');

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
    if (!res.opts.csp && !req.query.csp) {
      next();
      return;
    }

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
