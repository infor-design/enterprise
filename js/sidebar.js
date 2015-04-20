/**
* Side Bar Menu Control (TODO: bitly link to soho xi docs)
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

  $.fn.sidebar = function() {

    // Settings and Options
    var pluginName = 'sidebar';

    // Plugin Constructor
    function Sidebar(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Sidebar.prototype = {

      init: function() {
        this.buildIndex();
        this.handleEvents();
      },

      // Make an Internal Array with all H elements
      buildIndex: function() {

      },

      // Make an Internal Array with
      handleEvents: function() {
        $(window).add('.editorial').on('scroll.sidebar', function (e) {
          console.log($(this).scrollTop());
        });
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        instance = $.data(this, pluginName, new Sidebar(this));
      }
    });
  };
}));
