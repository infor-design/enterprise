import { utils } from '../utils/utils';
import { HideFocus } from '../utils/behaviors';

/**
 * Plugin Name
 */
let COMPONENT_NAME = 'hyperlink';

/**
 *
 */
var HYPERLINK_DEFAULTS = {};

/**
 * Soho component wrapper for Hyperlinks.
 * @class Hyperlink
 *
 * @param {HTMLElement} element
 * @param {object} options
 * @returns {Hyperlink}
 */
function Hyperlink(element, settings) {
  return this.init(element, settings);
}

Hyperlink.prototype = {
  init: function(element, settings) {
    if (!this.element && element instanceof HTMLElement) {
      this.element = element;
    }

    if (typeof settings === 'object') {
      var previousSettings = this.settings || HYPERLINK_DEFAULTS;
      this.settings = utils.mergeSettings(this.element, settings, previousSettings);
    }

    if (!this.focusBehavior) {
      this.focusBehavior = new HideFocus(this.element);
    }

    return this;
  },

  handleEvents: function() {
    return this;
  },

  updated: function(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  teardown: function() {
    return this;
  }
};


export { Hyperlink, COMPONENT_NAME };
