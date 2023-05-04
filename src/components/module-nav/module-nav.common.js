import { Locale } from '../locale/locale';

export const MODULE_NAV_DISPLAY_MODES = [false, 'collapsed', 'expanded'];

// Icon for "24/Financial and Supply Management/Amethyst" from Figma designs
// @TODO Remove and replace with built-in or custom setting
export const SWITCHER_ICON_HTML = `<svg
  width="28"
  height="28"
  viewBox="0 0 28 28"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_3652_49490)">
    <path d="M23.52 4.48L20.72 0L19.9033 1.30667C18.1067 0.466667 16.1117 0 14 0C6.265 0 0 6.265 0 14C0 16.4267 0.618333 18.7133 1.70333 20.6967L2.95167 19.4483C2.135 17.8033 1.68 15.96 1.68 14C1.68 7.19833 7.19833 1.68 14 1.68C15.785 1.68 17.4767 2.065 19.005 2.74167L17.92 4.48H23.52Z" fill="#591DA8" /><path d="M26.2966 7.30322L25.0483 8.55156C25.865 10.1966 26.32 12.0399 26.32 13.9999C26.32 20.8016 20.8016 26.3199 14 26.3199C12.215 26.3199 10.5233 25.9349 8.99498 25.2582L10.08 23.5199H4.47998L7.27998 27.9999L8.09665 26.6932C9.89331 27.5332 11.8883 27.9999 14 27.9999C21.735 27.9999 28 21.7349 28 13.9999C28 11.5732 27.3816 9.28656 26.2966 7.30322Z" fill="#7928E1" /><path d="M23.3332 16.1934V11.8067H21.7932L21.0465 10.0334L22.1315 8.96003L19.0632 5.90336L17.9782 6.9767L16.1932 6.23003V4.65503H11.8065V6.19503L10.0215 6.9417L8.9365 5.8567L5.86817 8.92503L6.95317 10.01L6.2065 11.795H4.6665V16.1817H6.2065L6.95317 17.955L5.86817 19.0284L8.9365 22.085L10.0215 21.0117L11.8065 21.7584V23.3334H16.1932V21.7934L17.9665 21.0467L19.0398 22.1317L22.0965 19.0634L21.0232 17.9784L21.7698 16.1934H23.3448H23.3332Z" fill="url(#paint0_linear_3652_49490)" /><path d="M11.6665 15.6099C11.6665 16.7182 12.7515 17.5232 13.9998 17.5232C15.3298 17.5232 16.3332 16.6482 16.3332 15.6099C16.3332 13.9999 13.9998 13.6966 13.9998 13.6966C13.9998 13.6966 12.0865 13.3232 12.0865 12.0866C12.0865 11.2116 12.9148 10.4766 13.9998 10.4766C15.0848 10.4766 15.9948 11.2116 15.9948 12.0866V12.8332" stroke="#F1EBFC" stroke-miterlimit="10" />
    <path d="M14.5835 17.5V19.8333" stroke="#F1EBFC" stroke-miterlimit="10" /><path d="M14.5835 8.16675V10.5001" stroke="#F1EBFC" stroke-miterlimit="10" />
  </g>
  <defs>
    <linearGradient id="paint0_linear_3652_49490" x1="4.7757" y1="4.72233" x2="23.3296" y2="23.3241" gradientUnits="userSpaceOnUse">
      <stop offset="0.00029463" stop-color="#8D4BE5" />
      <stop offset="1" stop-color="#591DA8" />
    </linearGradient>
    <clipPath id="clip0_3652_49490">
      <rect width="28" height="28" fill="white" />
    </clipPath>
  </defs>
</svg>`;

/**
 * @returns {string} IdsButton component HTML template used to define Module Nav Switcher Button
 */
export const buttonTemplate = () => `<div class="module-nav-section module-btn">
  <button id="module-nav-homepage-btn" class="btn-icon btn-tertiary">
    ${SWITCHER_ICON_HTML}
    <span>${Locale ? Locale.translate('ModuleSwitch') : 'Switch Modules'}</span>
  </button>
</div>`;

/**
 * @returns {string} IdsDropdown component HTML template used to define Module Nav Switcher Dropdown
 */
export const dropdownTemplate = () => `<div class="module-nav-section role-dropdown">
  <label for="module-nav-role-switcher" class="label audible">Roles</label>
  <select id="module-nav-role-switcher" name="module-nav-role-switcher" class="dropdown"></select>
</div>`;

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
  if (typeof val === 'string' && MODULE_NAV_DISPLAY_MODES.includes(val)) {
    el.classList.add(`mode-${val}`);
  }
};
