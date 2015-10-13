/**
* Toolbar Searchfield (TODO: bitly link to soho xi docs)
*/

// NOTE:  There are AMD Blocks available

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

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.toolbarsearchfield = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'toolbarsearchfield',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ToolbarSearchfield(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    ToolbarSearchfield.prototype = {

      init: function() {
        return this
          .build()
          .handleEvents();
      },

      // Creates and manages any markup the control needs to function.
      build: function() {
        return this;
      },

      // Main entry point for setting up event handlers.
      handleEvents: function() {
        console.log('Toolbar Searchfield Created!');
        return this;
      },

      // Used when the control has its settings or structural markup changed.  Rebuilds key parts of the control that
      // otherwise wouldn't automatically update.
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Tears down events, properties, etc. and resets the control to "factory" state
      teardown: function() {
        return this;
      },

      // Removes the entire control from the DOM and from this element's internal data
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new ToolbarSearchfield(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
