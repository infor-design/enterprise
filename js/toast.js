/**
* Toast Control (TODO: bitly link to docs)
*/

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }
}(function($) {

  'use strict';

  $.fn.toast = function(options) {

    // Settings and Options
    var pluginName = 'toast',
        defaults = {
          title: '(Title)',
          message: '(Content)'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.show();
      },

      // Show a Single Toast Message
      show: function() {
        var container = $('#toast-container'),
          toast = $('<div class="toast"></div>');

        if (container.length === 0) {
          container = $('<div id="toast-container" class="toast-container toast-top-right" aria-live="polite" role="alert"></div>').appendTo('body');
        }

        toast.append('<span class="toast-title">'+ settings.title + '</span>');
        toast.append('<span class="toast-message">'+ settings.message + '</span>');
        container.append(toast);
      },

      // Teardown
      destroy: function() {
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };
}));
