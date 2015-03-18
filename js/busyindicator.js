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

  $.fn.busyindicator = function(options) {

    // Settings and Options
    var pluginName = 'busyindicator',
        defaults = {
          blockUI: true, // makes the element that Busy Indicator is invoked on unusable while it's displayed.
          text: null, //Custom Text To Show or Will Show Localized Loading....
          delay: 0, // number in miliseconds to pass before the markup is displayed.  If 0, displays immediately.
          timeToComplete: 0, // fires the 'complete' trigger at a certain timing interval.  If 0, goes indefinitely.
          timeToClose: 0, // fires the 'close' trigger at a certain timing interval.  If 0, goes indefinitely.
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function BusyIndicator(element) {
      this.element = $(element);
      this.init();
    }

    // Check to see if the current browser supports CSS3 Animation
    function browserSupportsAnimation() {
      var s = document.createElement('p').style,
        supportsAnimation = 'animation' in s ||
                              'WebkitAnimation' in s ||
                              'MozAnimation' in s ||
                              'msAnimation' in s ||
                              'OAnimation' in s;
      return supportsAnimation;
    }

    // Plugin Methods
    BusyIndicator.prototype = {

      init: function() {
        this.setup();
        this.setupEvents();
      },

      // Sanitize incoming option values
      setup: function() {
        var blockUI = this.element.attr('data-block-ui'),
          delay = this.element.attr('data-delay'),
          completionTime = this.element.attr('data-completion-time'),
          closeTime = this.element.attr('data-close-time');

        this.blockUI = blockUI !== undefined ? blockUI : settings.blockUI;
        this.loadingText = settings.text ? settings.text : Locale.translate('Loading');
        this.delay = delay !== undefined && !isNaN(delay) && parseInt(delay, 10) > 20 ? delay : !isNaN(settings.delay) && settings.delay >= 20 ? settings.delay : 20;
        this.completionTime = completionTime !== undefined && !isNaN(completionTime) ? parseInt(completionTime, 10) : settings.timeToComplete;
        this.closeTime = closeTime !== undefined && !isNaN(closeTime) ? parseInt(closeTime, 10) : settings.timeToClose;
      },

      setupEvents: function() {
        var self = this;
        self.element.on('start.busyindicator', function(e) {
          e.stopPropagation();
          self.activate();
        }).on('started.busyindicator', function() {
          // Completed/Close events are only active once the indicator is "started"
          self.element.on('complete.busyindicator', function(e) {
            e.stopPropagation();
            self.complete();
          }).on('close.busyindicator', function(e) {
            e.stopPropagation();
            self.close();
          });
        }).on('updated.busyindicator', function() {
          self.setup();
        });
      },

      // Builds and starts the indicator
      activate: function() {
        var self = this;

        // If the markup already exists don't do anything but clear
        if (this.container) {
          if (self.closeTimeout) {
            clearTimeout(self.closeTimeout);
          }
          this.label.remove();
          this.label = $('<span>' + this.loadingText + '</span>').appendTo(this.container);
          this.loader.removeClass('complete').addClass('active');
          this.container
            .removeClass('is-hidden')
            .trigger('started.busyindicator');
          return;
        }

        // Build all the markup
        this.container = $('<div class="busy-indicator-container is-hidden"></div>').attr({
          'aria-live': 'polite',
          'role': 'status'
        });
        this.loader = $('<div class="busy-indicator active"></div>').appendTo(this.container);

        var bowl = $('<div class="busy-indicator-bowl"></div>').appendTo(this.loader),
          container = $('<div class="busy-indicator-ball-container"></div>'),
          ball = $('<div class="busy-indicator-ball"></div>');

        if (!browserSupportsAnimation()) {
          ball.appendTo(bowl);
        } else {
          container.appendTo(bowl);
          ball.appendTo(container);
        }

        $('<div class="complete-check"></div>').appendTo(this.loader);
        this.label = $('<span>'+ this.loadingText +'</span>').appendTo(this.container);
        if (this.blockUI) {
          this.originalPositionProp = this.element.css('position');
          this.element.css('position', 'relative');
          this.overlay = $('<div class="overlay busy is-hidden"></div>').appendTo(this.element);
          this.container.addClass('blocked-ui');
        }

        // Append the markup to the page
        this.container.appendTo(this.element);

        // Fade in shortly after adding the markup to the page (prevents the indicator from abruptly showing)
        setTimeout(function() {
          self.container.removeClass('is-hidden');
          if (self.overlay) {
            self.overlay.removeClass('is-hidden');
          }
        }, self.delay);

        // Lets external code know that we've successully kicked off.
        this.element.trigger('started.busyindicator');

        // Start the JS Animation Loop if IE9
        if (!browserSupportsAnimation()) {
          self.isAnimating = true;
          self.animateWithJS();
        }

        // Triggers complete if the "timeToComplete" option is set.
        if (this.completionTime > 0) {
          setTimeout(function() {
            self.element.trigger('complete.busyindicator');
          }, self.completionTime);
        }
      },

      // Creates the checkmark and shows a complete state
      complete: function() {
        var self = this;
        this.label.remove();
        this.label = $('<span>Completed</span>').appendTo(this.container); // TODO: Localize
        this.loader.removeClass('active').addClass('complete');

        if (!browserSupportsAnimation()) {
          self.isAnimating = false;
        }

        this.element.trigger('completed.busyindicator');

        if (this.closeTime > 0) {
          setTimeout(function() {
            self.element.trigger('close.busyindicator');
          }, self.closeTime);
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
        self.closeTimeout = setTimeout(function() {
          clearTimeout(self.closeTimeout);
          self.container.remove();
          self.container = undefined;
          self.loader = undefined;
          if (self.overlay) {
            self.overlay.remove();
            self.element.css('position', self.originalPositionProp);
            self.originalPositionProp = undefined;
          }
          self.element.trigger('closed.busyindicator');
          self.element.off('complete.busyindicator close.busyindicator');
        }, 500);
      },

      // Browsers that don't support CSS-based animation can still show the animating Busy Indicator.
      animateWithJS: function() {
        var self = this,
          ball = this.container.find('.busy-indicator-ball'),
          bowl = this.container.find('.busy-indicator-bowl'),
          bowlPos = bowl.position(),
          bowlX = Math.floor(parseInt(bowlPos.left) + (bowl.width()/2)),
          bowlY = Math.floor(parseInt(bowlPos.top) + (bowl.height()/2)),
          radius = 25,
          t = 0;

        // Animation Loop
        function animate() {
          t += 0.1;
          var newLeft = Math.floor(bowlX + (radius * Math.cos(t))) - (ball.width()/2),
            newTop = Math.floor(bowlY + (radius * Math.sin(t))) - (ball.height()/2);

          ball.animate({
            left: newLeft,
            top: newTop
          }, 10, 'linear', function() {
            if (self.isAnimating) {
              animate();
            }
          });
        }

        animate();
      },

      // Teardown
      destroy: function() {
        this.off('start.busyindicator complete.busyindicator close.busyindicator updated.busyindicator');
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
