import { utils } from '../utils/utils';
import { log } from '../utils/debug';
import { TOOLBAR_ELEMENTS } from './toolbar-flex.item';

// jQuery Components
import './toolbar-flex.item.jquery';

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
    this.items = this.getElements().map((item) => {
      $(item).toolbarflexitem();
      return $(item).data('toolbarflexitem');
    });

    if (!this.items) {
      return;
    }

    // Check for a selected item
    this.items.forEach((item) => {
      if (item.selected) {
        if (this.selectedItem === undefined) {
          this.selectedItem = item;
        } else {
          item.selected = false;
        }
      }
    });
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
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  },

  /**
   * Event Handler for internal `keydown` events.
   * @param {KeyboardEvent} e `keydown`
   * @returns {void}
   */
  handleKeydown(e) {
    const target = e.target;

    // Toolbar Items get handled separately.
    if ($(target).data('toolbarflexitem')) {
      this.handleItemKeydown(e);
      // return;
    }
  },

  /**
   * Event Handler for internal `keydown` events, specifically on Toolbar Items.
   * @param {KeyboardEvent} e `keydown`
   * @returns {void}
   */
  handleItemKeydown(e) {
    const key = e.key;

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      this.navigate(-1);
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      this.navigate(1);
    }
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

  /**
   * @returns {ToolbarFlexItem|undefined} either a toolbar item, or undefined if one
   *  wasn't previously selected.
   */
  get selectedItem() {
    if (this.trueSelectedItem) {
      return this.trueSelectedItem;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].selected === true) {
        return this.items[i];
      }
    }
    return undefined;
  },

  // Setter for SelectedItem
  set selectedItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].selected = false;
    }
    item.selected = true;
    this.trueSelectedItem = item;
  },

  // Flag for figuring out if a Toolbar's items are all completely unavailable for keyboard focus.
  get hasFocusableItems() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].focusable === true) {
        return true;
      }
    }
    return false;
  },

  /**
   * Navigates among toolbar items and gets a reference to a potential target for focus.
   * @param {number} direction positive/negative value representing how many spaces to move
   * @param {number} [currentIndex] the index to start checking from
   *  the current focus either right/left respectively.
   */
  navigate(direction, currentIndex) {
    if (this.hasFocusableItems === false) {
      log('No focusable items');
      return;
    }

    if (currentIndex === undefined) {
      currentIndex = this.items.indexOf(this.selectedItem);
    }

    log(`Toolbar Navigation: ${direction} points away from index ${currentIndex}`);

    while (direction !== 0) {
      if (direction > 0) {
        if (currentIndex === this.items.length - 1) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }
        --direction;
      }
      if (direction < 0) {
        if (currentIndex === 0) {
          currentIndex = this.items.length - 1;
        } else {
          --currentIndex;
        }
        direction++;
      }
    }

    const targetItem = this.items[currentIndex];
    if (targetItem.focusable === false) {
      this.navigate(direction > 0 ? 1 : -1, currentIndex);
      return;
    }

    this.selectedItem = targetItem;
    this.selectedItem.element.focus();
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
    this.element.removeEventListener('keydown', this.handleKeypress.bind(this));
  },

  /**
   * @returns {void}
   */
  destroy() {
    this.teardown();
  }

};

export { ToolbarFlex, COMPONENT_NAME };
