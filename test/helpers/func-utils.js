/**
 * Cleans up and removes the nodes picked up via the provided CSS selector
 * @param {HTMLElement|SVGElement|array|string} item a valid Element, Array or a CSS selector string
 * @returns {void}
 */
function cleanup(item) {
  if (!item) {
    return;
  }
  if (item instanceof HTMLElement || item instanceof SVGElement) {
    item.parentNode.removeChild(item);
    return;
  }

  // Iterate through an array of selectors|elements
  if (Array.isArray(item)) {
    item.forEach(i => cleanup(i));
    return;
  }

  // Handle a single CSS selector
  const els = Array.from(document.querySelectorAll(item)); // eslint-disable-line compat/compat
  if (els && els.length) {
    els.forEach((el) => {
      el.parentNode.removeChild(el);
    });
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
