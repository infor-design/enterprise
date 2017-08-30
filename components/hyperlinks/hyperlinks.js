/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  window.Soho = window.Soho || {};
  window.Soho.components = window.Soho.components || {};

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
        this.options = $.extend({}, previousOptions, options);
      }

      if (!this.focusBehavior) {
        this.focusBehavior = new Soho.behaviors.hideFocus(this.element);
      }

      return this;
    },

    handleEvents: function() {
      return this;
    },

    updated: function(options) {
      $.extend({}, this.options, options);

      return this
        .teardown()
        .init();
    },

    teardown: function() {
      return this;
    }
  };

  // Add to the Soho object
  window.Soho.components.hyperlink = Hyperlink;

  // Legacy jQuery wrappers
  $.fn.hyperlink = function(options) {
    'use strict';

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, 'hyperlink');
      if (instance) {
        instance.updated(options);
      } else {
        instance = $.data(this, 'hyperlink', new Hyperlink(this, options));
        instance.destroy = function destroy() {
          this.teardown();
          $.removeData(this, 'hyperlink');
        };
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
