function removeButtonFromScript(html) {
  if (!html || !html.length) {
    return '';
  }
  if (html.indexOf('<div id="info-popup"') > -1) {
    return html;
  }
  return html.replace('id="info-btn" class="btn-icon ignore-in-menu"', 'id="info-btn" class="btn-icon ignore-in-menu invisible"');
}

export default function () {
  return function infoHandler(req, res, next) {
    // Modify `res.send()` to always remove the info button if there is no info to show.
    const oldSend = res.send;
    res.send = function (...args) {
      // arguments[0] (or `data`) contains the response body
      if (typeof args[0] === 'string') {
        args[0] = removeButtonFromScript(args[0], res.opts.nonce);
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
}
