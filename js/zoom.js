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

  $.fn.zoom = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'zoom',
        settings = $.extend({}, options);

    /**
     * @constructor
     * @param {Object} element
     * @param {Object} settings
     */
    function Zoom(element, settings) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    Zoom.prototype = {
      init: function() {
        return this
          .build()
          .handleEvents();
      },

      // Add markup to the control
      build: function() {
        // setup environment
        this.env = {
          'iOS': $('html').hasClass('ios'),
          'iPhone': $('html').hasClass('iPhone'),
          'iPad': $('html').hasClass('iPad'),
          'iPod': $('html').hasClass('iPod')
        };

        // get references to elements
        this.viewport = this.element.find('meta[name=viewport]');
        this.body = $('body');

        return this;
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        // Allow the head to listen to events to globally deal with the zoom problem on
        // a per-control basis (for example, Dropdown/Multiselect need to handle this issue manually).
        this.element.on('updated.' + pluginName, function() {
          self.updated();
        }).on('enable-zoom', function() {
          self.enableZoom();
        }).on('disable-zoom', function() {
          self.disableZoom();
        });

        // Don't continue setting this up on each element if
        if (!this.env.iOS) {
          return this;
        }

        // Setup conditional events for all elements that need it.
        this.body.on('touchstart.zoomdisabler', 'input, label', function() {
          if (self.noZoomTimeout) {
            return;
          }

          self.disableZoom();
        }).on('touchend.zoomdisabler', 'input, label', function() {
          if (self.noZoomTimeout) {
            clearTimeout(self.noZoomTimeout);
            self.noZoomTimeout = null;
          }
          self.noZoomTimeout = setTimeout(function() {
            self.noZoomTimeout = null;
            self.enableZoom();
          }, 600);
        });

        return this;
      },

      // TODO: Test to see if prepending this meta tag conflicts with Base Tag implementation
      enableZoom: function() {
        this.viewport.remove();

        this.viewport = $('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1" />');
        this.element.prepend(this.viewport);
      },

      // TODO: Test to see if prepending this meta tag conflicts with Base Tag implementation
      disableZoom: function() {
        this.viewport.remove();

        this.viewport = $('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />');
        this.element.prepend(this.viewport);
      },

      // Handle Updating Settings
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Simple Teardown - remove events & rebuildable markup.
      teardown: function() {
        this.element.off('updated.' + pluginName + ' enable-zoom disable-zoom');
        this.body.off('touchstart.zoomdisabler touchend.zoomdisabler');
        return this;
      },

      // Teardown - Remove added markup and events
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
        instance = $.data(this, pluginName, new Zoom(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
