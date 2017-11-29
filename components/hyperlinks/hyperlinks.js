import { utils } from '../utils/utils';
import { HideFocus } from '../utils/behaviors';

/**
 * Plugin Name
 */
let PLUGIN_NAME = 'hyperlink';

/**
 *
 */
var DEFAULT_HYPERLINK_OPTIONS = {};

/**
 * Soho component wrapper for Hyperlinks.
 * @class Hyperlink
 *
 * @param {HTMLElement} element
 * @param {Object} options
 * @returns {Hyperlink}
 */
function Hyperlink(element, options) {
  return this.init(element, options);
}

Hyperlink.prototype = {
  init: function(element, options) {
    if (!this.element && element instanceof HTMLElement) {
      this.element = element;
    }

    if (typeof options === 'object') {
      var previousOptions = this.options || DEFAULT_HYPERLINK_OPTIONS;
      this.options = utils.extend({}, previousOptions, options);
    }

    if (!this.focusBehavior) {
      this.focusBehavior = new HideFocus(this.element);
    }

    return this;
  },

  handleEvents: function() {
    return this;
  },

  updated: function(options) {
    if (options) {
      this.options = utils.extend({}, this.options, options);
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
$.fn.hyperlink = function(options) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(options);
    } else {
      instance = $.data(this, PLUGIN_NAME, new Hyperlink(this, options));
      instance.destroy = function destroy() {
        this.teardown();
        $.removeData(this, PLUGIN_NAME);
      };
    }
  });
};


export { Hyperlink };
