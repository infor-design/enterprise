/**
 * Cleans up and removes the nodes picked up via the provided CSS selector
 * @param {HTMLElement|SVGElement|array|string} item a valid Element, Array or a CSS selector string
 * @returns {void}
 */
function cleanup() {
  Soho.modalManager.destroyAll();
  $('body').removeData();

  let collection = document.body.querySelectorAll('*:not(html):not(body):not(head):not(meta):not(link)');

  for (let i = 0; i < collection.length; i++) {
    collection[i].remove();
  }

  collection = document.querySelectorAll('script[nonce]');

  for (let i = 0; i < collection.length; i++) {
    collection[i].remove();
  }

  // Remove Empty Space
  document.body.innerHTML = document.body.innerHTML.replace(/(<(pre|script|style|textarea|{{)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, '$1$3');
  // Remove Comments
  const regex = /( )*<!--((.*)|[^<]*|[^!]*|[^-]*|[^>]*)-->\n*/g;
  document.body.innerHTML = document.body.innerHTML.replace(regex, '');
  const regex2 = /( )*{{((.*)|[^<]*|[^!]*|[^-]*|[^>]*)}}\n*/g;
  document.body.innerHTML = document.body.innerHTML.replace(regex2, '');
  document.body.innerHTML = document.body.innerHTML.replace('&lt;%==%&gt;', '');
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
