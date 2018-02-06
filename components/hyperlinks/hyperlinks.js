import { utils } from '../utils/utils';
import { HideFocus } from '../utils/behaviors';

// Component Name
const COMPONENT_NAME = 'hyperlink';

/**
 * Component Default Settings
 * @namespace
 */
const HYPERLINK_DEFAULTS = {};

/**
 * Soho component wrapper for Hyperlinks.
 * @class Hyperlink
 * @param {HTMLElement} element the base Hyperlink element
 * @param {object} [settings] incoming settings
 * @returns {this} component instance
 */
function Hyperlink(element, settings) {
  return this.init(element, settings);
}

Hyperlink.prototype = {
  init(element, settings) {
    if (!this.element && element instanceof HTMLElement) {
      this.element = element;
    }

    if (typeof settings === 'object') {
      const previousSettings = this.settings || HYPERLINK_DEFAULTS;
      this.settings = utils.mergeSettings(this.element, settings, previousSettings);
    }

    if (!this.focusBehavior) {
      this.focusBehavior = new HideFocus(this.element);
    }

    return this;
  },

  handleEvents() {
    return this;
  },

  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  teardown() {
    return this;
  }
};

export { Hyperlink, COMPONENT_NAME };
