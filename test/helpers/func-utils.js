/**
 * Cleans up and removes the nodes picked up via the provided CSS selector
 * @param {HTMLElement|SVGElement|array|string} item a valid Element, Array or a CSS selector string
 * @returns {void}
 */
function cleanup() {
  let collection = document.body.querySelectorAll('*:not(script):not(link):not(html):not(body):not(head):not(meta)');

  for (let i = 0; i < collection.length; i++) {
    collection[i].remove();
  }

  collection = document.querySelectorAll('script[nonce]');

  for (let i = 0; i < collection.length; i++) {
    collection[i].remove();
  }
}

/**
 * Trigger `contextmenu` on given element
 * @param {HTMLElement} el Element to trigger `contextmenu`
 * @returns {void}
 */
function triggerContextmenu(el) {
  if (el instanceof HTMLElement || el instanceof SVGElement) {
    if (window.CustomEvent) {
      el.dispatchEvent(new CustomEvent('contextmenu'));
    } else if (document.createEvent) {
      const e = document.createEvent('HTMLEvents');
      e.initEvent('contextmenu', true, false);
      element.dispatchEvent(e);
    } else { // Internet Explorer
      el.fireEvent('oncontextmenu');
    }
  }
}

module.exports = {
  cleanup,
  triggerContextmenu
};
