export const MODULE_NAV_DISPLAY_MODES = [false, 'collapsed', 'expanded'];

/**
 * Configures an element's Module Switcher display mode.
 * @param {string} val desired display mode
 * @param {HTMLElement} el target element for CSS classes
 * @returns {void}
 */
export const setDisplayMode = (val, el) => {
  el.classList.remove('mode-collapsed', 'mode-expanded');
  if (typeof val === 'string' && MODULE_NAV_DISPLAY_MODES.includes(val)) {
    el.classList.add(`mode-${val}`);
  }
};
