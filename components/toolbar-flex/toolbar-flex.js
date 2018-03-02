import { utils } from '../utils/utils';
// import { breakpoints } from '../utils/breakpoints';

// Component Name
const COMPONENT_NAME = 'toolbar-flex';

// Toolbar Focusable Elem Selectors
const TOOLBAR_ELEMENT_SELECTORS = [
  'button',
  'a[href]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  '.searchfield'
];

/**
 * Component Default Settings
 * @namespace
 */
const TOOLBAR_FLEX_DEFAULTS = {};

/**
 * @constructor
 * @param {HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 */
function ToolbarFlex(element, settings) {
  this.element = element;
  this.settings = utils.mergeSettings(this.element, settings, TOOLBAR_FLEX_DEFAULTS);

  this.init();
}

ToolbarFlex.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.sections = this.element.querySelectorAll('.toolbar-section');
    this.items = this.getElements();

    this.handleEvents();
  },

  /**
   * @private
   * @returns {void}
   */
  handleEvents() {
    $('body').on(`resize.${COMPONENT_NAME}`, () => this.handleResize);
  },

  /**
   * Gets all the elements currently inside the Toolbar Markup.
   * @returns {array} of Toolbar Items
   */
  getElements() {
    const items = [];

    utils.forEach(this.sections, (section) => {
      const thisElems = section.querySelectorAll(TOOLBAR_ELEMENT_SELECTORS.join(', '));
      utils.forEach(thisElems, (elem) => {
        items.push(elem);
      }, this);
    }, this);

    return items;
  },

  /**
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (typeof settings === 'object') {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.teardown();
    this.init();
  },

  /**
   * @returns {void}
   */
  teardown() {
    $('body').off(`resize.${COMPONENT_NAME}`);
  },

  /**
   * @returns {void}
   */
  destroy() {
    this.teardown();
  }

};

export { ToolbarFlex, COMPONENT_NAME };
