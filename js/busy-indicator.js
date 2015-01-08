/**
* Busy Indicator Control (TODO: bitly link to docs)
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

  $.fn.busyIndicator = function(options) {

    // Settings and Options
    var pluginName = 'busyIndicator',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function BusyIndicator(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    BusyIndicator.prototype = {

      init: function() {
        this.setupEvents();
      },

      setupEvents: function() {
        var self = this;
        self.element.on('start.busyIndicator', function() {
          self.activate();
        }).on('complete.busyIndicator', function() {
          self.complete();
        }).on('close.busyIndicator', function() {
          self.close();
        });
      },

      // Builds and starts the indicator
      activate: function() {

      },

      // Creates the checkmark and shows a complete state
      complete: function() {

      },

      // Removes the appended markup and hides any trace of the indicator
      close: function() {

      },

      addMarkup: function() {

      },

      // Teardown
      destroy: function() {
        this.off('start.busyIndicator complete.busyIndicator close.busyIndicator');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new BusyIndicator(this, settings));
      }
    });
  };
}));
