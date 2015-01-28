/**
* Toolbar Control (TODO: bitly link to soho xi docs)
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

  $.fn.toolbar = function(options) {

    // Settings and Options
    var pluginName = 'toolbar',
        defaults = {
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
        this.settings = settings;
        this.initial();
        this.handleKeys();
        this.handleResponsive();
      },

      initial: function () {
        this.element.attr('role', 'toolbar');
        this.buttons = this.element.find('button');
        this.buttons.attr('tabindex', '-1');
        this.activeButton = this.buttons.filter(':visible:not(:disabled)').first().attr('tabindex', '0');
      },

      // Go To a button
      navigate: function (direction) {
        this.buttons = this.buttons.filter(':visible:not(:disabled)').first();
        var current = this.buttons.index(this.activeButton),
          next = current + direction;

        if (next >= 0 && next < this.buttons.length) {
          this.buttons.attr('tabindex', '-1');
          $(this.buttons[next]).attr('tabindex', '0').focus();
          return false;
        }
      },

      // Handle Arrow Keys
      handleKeys: function() {
        var self = this;

        this.element.on('keydown.toolbar', 'button', function (e) {

          if (e.keyCode === 38) {
            return self.navigate(-1);
          }

          if (e.keyCode === 39) {
           return self.navigate(1);
          }
        });
      },

      // Tuck the hidden buttons under the overflow menu
      handleResponsive: function() {

      },

      // Teardown - Remove added markup and events
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
