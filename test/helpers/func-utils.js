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
  const els = Array.from(document.querySelectorAll(item));
  if (els && els.length) {
    els.forEach((el) => {
      el.parentNode.removeChild(el);
    });
  }
}

module.exports = {
  cleanup
};
