import { utils } from '../utils/utils';
import { ToolbarFlexItem, TOOLBAR_ELEMENTS } from './toolbar-flex.item';

// Component Name
const COMPONENT_NAME = 'toolbar-flex';

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

  sections: [],

  items: [],

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.sections = this.element.querySelectorAll('.toolbar-section');
    this.items = this.getElements().map(item => new ToolbarFlexItem(item));

    if (!this.items) {
      return;
    }

    if (!this.selectedItem) {
      this.selectedItem = this.items[0];
    }

    this.handleEvents();
  },

  /**
   * @private
   * @returns {void}
   */
  handleEvents() {
    $('body').on(`resize.${COMPONENT_NAME}`, () => this.handleResize);
    this.element.addEventListener('keypress', this.handleItemKeypress.bind(this));
  },

  /**
   *
   */
  handleItemKeypress(e) {

  },

  /**
   * Gets all the elements currently inside the Toolbar Markup.
   * The array of items produced is ordered by Toolbar Section.
   * @returns {array} of Toolbar Items
   */
  getElements() {
    const items = [];

    utils.forEach(this.sections, (section) => {
      utils.forEach(TOOLBAR_ELEMENTS, (elemObj) => {
        const thisElems = section.querySelectorAll(elemObj.selector);
        utils.forEach(thisElems, (elem) => {
          if (typeof elemObj.filter === 'function') {
            if (!elemObj.filter(elem)) {
              return;
            }
          }
          items.push(elem);
        }, this);
      }, this);
    }, this);

    return items;
  },

  get selectedItem() {
    if (!this.items || !this.items.length) {
      return undefined;
    }

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].focusable) {
        return this.items[i];
      }
    }
    return undefined;
  },

  set selectedItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].disableFocus();
    }
    item.enableFocus();
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
    this.element.removeEventListener('keypress', this.handleItemKeypress.bind(this));
  },

  /**
   * @returns {void}
   */
  destroy() {
    this.teardown();
  }

};

export { ToolbarFlex, COMPONENT_NAME };
