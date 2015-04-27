/**
* Modal Search Control (TODO: bitly link to soho xi docs)
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

  $.fn.modalsearch = function(options) {

    // Settings and Options
    var pluginName = 'modalsearch',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ModalSearch(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    ModalSearch.prototype = {
      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        return this;
      },

      build: function() {
        this.element.modal();
        this.modal = this.element.data('modal');
        this.overlay = this.modal.overlay;

        this.modal.element.add(this.overlay).addClass('modal-search');

        return this;
      },

      handleEvents: function() {
        var self = this;

        $(document).on('keydown.modalsearch', function(e) {
          var key = e.which;
          if (key === 27) { // Escape
            if (self.modal.isOpen()) {
              self.modal.close();
            }
          }
        });

        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $(document).off('keydown.modalsearch');
        this.element.data('modal').destroy();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new ModalSearch(this, settings));
      }
    });
  };
}));
