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

  /**
   * @private
   */
  trueFocusedItem: undefined,

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

    // Check for a focused item
    this.items.forEach((item) => {
      if (item.focused) {
        if (this.focusedItem === undefined) {
          this.focusedItem = item;
        } else {
          item.focused = false;
        }
      }
    });
    if (!this.focusedItem) {
      this.focusedItem = this.items[0];
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
    this.element.addEventListener('click', this.handleClick.bind(this));

    $(this.element).on(`selected.${COMPONENT_NAME}`, (e, ...args) => {
      log('dir', args);
    });
  },

  /**
   * Event Handler for internal `keydown` events.
   * @private
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
   * @private
   * @param {KeyboardEvent} e `keydown`
   * @returns {void}
   */
  handleItemKeydown(e) {
    const key = e.key;

    // NOTE: 'Enter' and 'SpaceBar' are purposely not handled on keydown, since
    // a `click` event will be fired on Toolbar items while pressing either of these keys.

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      this.navigate(-1);
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      this.navigate(1);
    }
  },

  /**
   * Event Handler for internal `click` events
   * @private
   * @param {KeyboardEvent} e `click`
   * @returns {void}
   */
  handleClick(e) {
    const target = e.target;

    // Toolbar Items get handled separately.
    if ($(target).data('toolbarflexitem')) {
      this.handleItemClick(e);
      // return;
    }
  },

  /**
   * Event Handler for internal `click` events, specifically on Toolbar Items.
   * @private
   * @param {KeyboardEvent} e `click`
   * @returns {void}
   */
  handleItemClick(e) {
    this.select(e.target);
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
   * @param {HTMLElement} element the element to be checked
   * @returns {ToolbarFlexItem} an instance of a Toolbar item
   */
  getItemFromElement(element) {
    let item;
    for (let i = 0; i < this.items.length; i++) {
      // Simple comparison of innerHTML to figure out if the elements match up
      if (this.items[i].element.innerHTML === element.innerHTML) {
        item = this.items[i];
      }
    }

    if (!item) {
      throw new Error(`No Toolbar Item instance available for element ${element}.`);
    }

    return item;
  },

  /**
   * @returns {ToolbarFlexItem|undefined} either a toolbar item, or undefined if one
   *  wasn't previously focused.
   */
  get focusedItem() {
    if (this.trueFocusedItem) {
      return this.trueFocusedItem;
    }
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].focused === true) {
        return this.items[i];
      }
    }
    return undefined;
  },

  // Setter for focusedItem
  set focusedItem(item) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].focused = false;
    }
    item.focused = true;
    this.trueFocusedItem = item;
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
      currentIndex = this.items.indexOf(this.focusedItem);
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

    this.focusedItem = targetItem;
  },

  /**
   * @param {HTMLElement} element an HTMLElement representing a Toolbar Item.
   * @returns {void}
   */
  select(element) {
    const item = this.getItemFromElement(element);

    switch (item.type) {
      default:
        item.selected = true;
        break;
    }

    log('log', `Item ${item} selected.`);
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
    this.element.removeEventListener('click', this.handleClick.bind(this));

    $(this.element).off(`selected.${COMPONENT_NAME}`);
  },

  /**
   * @returns {void}
   */
  destroy() {
    this.teardown();
  }

};

export { ToolbarFlex, COMPONENT_NAME };
