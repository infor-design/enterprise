import { Locale } from '../locale/locale';

export const MODULE_NAV_DISPLAY_MODES = [false, 'collapsed', 'expanded'];

// Icon for "24/Financial and Supply Management/Amethyst" from Figma designs
// @TODO Remove and replace with built-in or custom setting
export const SWITCHER_ICON_HTML = `<svg
  class="icon-custom"
  focusable="false"
  aria-hidden="true"
  width="32"
  height="32"
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#1C86EF"/>
  <path d="M7.8315 20V11.2727H13.5076V12.598H9.41246V14.9673H13.2136V16.2926H9.41246V18.6747H13.5417V20H7.8315ZM15.0524 20V13.4545H16.5268V14.5668H16.6035C16.7399 14.1918 16.9657 13.8991 17.2811 13.6889C17.5964 13.4759 17.9728 13.3693 18.4103 13.3693C18.8535 13.3693 19.2271 13.4773 19.5311 13.6932C19.8379 13.9062 20.0538 14.1974 20.1788 14.5668H20.247C20.3919 14.2031 20.6362 13.9134 20.9799 13.6974C21.3265 13.4787 21.737 13.3693 22.2115 13.3693C22.8137 13.3693 23.3052 13.5597 23.6859 13.9403C24.0666 14.321 24.2569 14.8764 24.2569 15.6065V20H22.7101V15.8452C22.7101 15.4389 22.6021 15.142 22.3862 14.9545C22.1703 14.7642 21.9061 14.669 21.5936 14.669C21.2214 14.669 20.9302 14.7855 20.72 15.0185C20.5126 15.2486 20.4089 15.5483 20.4089 15.9176V20H18.8961V15.7812C18.8961 15.4432 18.7939 15.1733 18.5893 14.9716C18.3876 14.7699 18.1234 14.669 17.7967 14.669C17.5751 14.669 17.3734 14.7259 17.1916 14.8395C17.0098 14.9503 16.8649 15.108 16.7569 15.3125C16.649 15.5142 16.595 15.75 16.595 16.0199V20H15.0524Z" fill="white"/>
</svg>`;

/**
 * Default function used for generating the Module Button Icon
 * @returns {string} referencing Icon HTML
 */
export const defaultIconGenerator = () => SWITCHER_ICON_HTML;

/**
 * @param {string} [buttonText] provides the template with descriptive button text, if applicable
 * @returns {string} IdsButton component HTML template used to define Module Nav Switcher Button
 */
export const buttonTemplate = buttonText => `<div class="module-nav-section module-btn">
  <button id="module-nav-homepage-btn" class="btn-icon btn-tertiary">
    ${SWITCHER_ICON_HTML}
    <span>${buttonText || (Locale ? Locale.translate('ModuleSwitch') : 'Switch Modules')}</span>
  </button>
</div>`;

/**
 * @param {string} [labelText] provides the template with descriptive label text, if applicable
 * @returns {string} IdsDropdown component HTML template used to define Module Nav Switcher Dropdown
 */
export const dropdownTemplate = labelText => `<div class="module-nav-section role-dropdown">
  <label for="module-nav-role-switcher" class="label audible">${labelText || 'Roles'}</label>
  <select id="module-nav-role-switcher" name="module-nav-role-switcher" class="dropdown"></select>
</div>`;

/**
 * @returns {string} IdsIcon component HTML used to define Module Nav icons (Module Nav Switcher/Accordion Header)
 * @param {string} type the icon name/type
 */
export const iconTemplate = type => `<svg class="icon" focusable="false" aria-hidden="true" role="presentation">
  <use href="#icon-${type}"></use>
</svg>`;

/**
 * IdsIcon component HTML for using an `<img>` tag instead of raw SVG (used for populating icons via external URL)
 * @param {string} url the URL string
 * @param {string} [alt] optional alt text
 * @returns {string} template for an image tag
 */
export const imageTemplate = (url, alt) => `<img src="${url}" alt="${alt || 'Module Button Icon'}" aria-hidden="true" role="presentation" />`;

/**
 * @returns {string} Module Nav Separator element template
 */
export const separatorTemplate = () => '<div class="module-nav-separator">&nbsp;</div>';

/**
 * @param {string} val desired display mode
 * @returns {boolean} true if the display mode exists
 */
export const isValidDisplayMode = val => MODULE_NAV_DISPLAY_MODES.includes(val);

/**
 * @param {string} value defines the HTMLOptionElement value
 * @param {string} [text] optionally defines the HTMLOptionElement textContent
 * @param {string} [icon] optionally defines the HTMLOptionElement icon
 * @param {string} [iconColor] optionally defines the HTMLOptionElement icon's display color
 * @returns {string} HTMLOption HTML template used to define Module Nav Switcher Dropdown used to define Role
 */
export const roleTemplate = (value, text, icon, iconColor) => `<option
  value="${value}"
  ${icon ? ` data-icon="{icon: '${icon}'${iconColor ? `, colorOver: '${iconColor}'` : ''}` : ''}}">${text}</option>`;

/**
 * Configures an element's Module Switcher display mode.
 * @param {string} val desired display mode
 * @param {HTMLElement} el target element for CSS classes
 * @returns {void}
 */
export const setDisplayMode = (val, el) => {
  el.classList.remove('mode-collapsed', 'mode-expanded');
  if (isValidDisplayMode(val) && val) el.classList.add(`mode-${val}`);
};

/**
 * Establishes/destroys a Tooltip attached to a Module Nav Item
 * @param {HTMLElement} el target element to receive the tooltip
 * @param {string} displayMode current display mode
 * @param {HTMLElement} textContentEl target element to use for detection of Tooltip text
 */
export const configureNavItemTooltip = (el, displayMode, textContentEl) => {
  if (displayMode === 'collapsed') {
    $(el).tooltip({
      placementOpts: { x: 16 },
      placement: 'right',
      title: (textContentEl || el).textContent.trim()
    });
  } else {
    $(el).data('tooltip')?.destroy();
  }
};
