import { utils } from '../utils/utils';
import { HideFocus } from '../utils/behaviors';

/**
 * Plugin Name
 */
let PLUGIN_NAME = 'hyperlink';

/**
 *
 */
var HYPERLINK_DEFAULTS = {};

/**
 * Soho component wrapper for Hyperlinks.
 * @class Hyperlink
 *
 * @param {HTMLElement} element
 * @param {Object} options
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


/**
 * Legacy jQuery wrappers
 */
$.fn.hyperlink = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Hyperlink(this, settings));
      instance.destroy = function destroy() {
        this.teardown();
        $.removeData(this, PLUGIN_NAME);
      };
    }
  });
};


export { Hyperlink };
