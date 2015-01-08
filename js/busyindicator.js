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
        defaults = {
          blockUI: false, // makes the element that Busy Indicator is invoked on unusable while it's displayed.
          timeToComplete: 0, // fires the 'complete' trigger at a certain timing interval.  If 0, goes indefinitely.
          timeToClose: 0, // fires the 'close' trigger at a certain timing interval.  If 0, goes indefinitely.
        },
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
        var self = this;

        // If the markup already exists don't do anything
        if (this.container) {
          this.label.text('Loading...'); // TODO: Localize
          this.loader.removeClass('complete').addClass('active');
          this.container.removeClass('is-hidden');
          return;
        }

        // Build all the markup
        this.container = $('<div class="busy-indicator-container is-hidden"></div>');
        this.loader = $('<div class="busy-indicator active"></div>').appendTo(this.container);
        var bowl = $('<div class="busy-indicator-bowl"></div>').appendTo(this.loader),
          container = $('<div class="busy-indicator-ball-container"></div>').appendTo(bowl);
        $('<div class="busy-indicator-ball"></div>').appendTo(container);
        $('<div class="complete-check"></div>').appendTo(this.loader);
        this.label = $('<span>Loading...</span>').appendTo(this.container);
        if (settings.blockUI) {
          this.originalPositionProp = this.element.css('position');
          this.element.css('position', 'relative');
          this.overlay = $('<div class="overlay busy is-hidden"></div>').appendTo(this.element);
          this.container.addClass('blocked-ui');
        }

        // Append the markup to the page
        this.container.appendTo(this.element);

        // Remove focus from any controls inside of this element.
        this.element.find(':focus').blur();

        // Fade in shortly after adding the markup to the page (prevents the indicator from abruptly showing)
        setTimeout(function() {
          self.container.removeClass('is-hidden');
          if (self.overlay) {
            self.overlay.removeClass('is-hidden');
          }
        }, 20);

        // Lets external code know that we've successully kicked off.
        this.element.trigger('started.busyIndicator');

        // Triggers complete if the "timeToComplete" option is set.
        if (settings.timeToComplete > 0) {
          setTimeout(function() {
            self.element.trigger('complete.busyIndicator');
          }, settings.timeToComplete);
        }
      },

      // Creates the checkmark and shows a complete state
      complete: function() {
        var self = this;
        this.label.text('Completed'); // TODO: Localize
        this.loader.removeClass('active').addClass('complete');
        this.element.trigger('completed.busyIndicator');

        if (settings.timeToClose > 0) {
          setTimeout(function() {
            self.element.trigger('close.busyIndicator');
          }, settings.timeToClose);
        }
      },

      // Removes the appended markup and hides any trace of the indicator
      close: function() {
        var self = this;
        this.container.addClass('is-hidden');
        if (this.overlay) {
          this.overlay.addClass('is-hidden');
        }
        // Give the indicator time to fade out before removing all of its components from view
        setTimeout(function() {
          self.container.remove();
          self.container = undefined;
          self.loader = undefined;
          if (self.overlay) {
            self.overlay.remove();
            self.element.css('position', self.originalPositionProp);
            self.originalPositionProp = undefined;
          }
          self.element.trigger('closed.busyIndicator');
        }, 500);
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
        instance.settings = $.extend(instance.settings, defaults, options);
      } else {
        instance = $.data(this, pluginName, new BusyIndicator(this, settings));
        instance.settings = settings;
      }
    });
  };
}));
