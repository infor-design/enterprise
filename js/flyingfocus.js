/**
* Flying Focus Control (TODO: bitly link to soho xi docs)
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

  $.fn.flyingfocus = function(options) {

    // Settings and Options
    var pluginName = 'flyingfocus',
        defaults = {
          duration: 150 // in ms
        },
        settings = $.extend({}, defaults, options);

    // Used inside the plugin itself
    var blurTimeout = 0,
      prevFocused = null,
      keydownTime = 0,
      focusHandler,
      blurHandler;

    // Plugin Constructor
    function FlyingFocus(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    FlyingFocus.prototype = {
      init: function() {
        this
          .build()
          .handleEvents();
      },

      build: function() {
        this.root = $(document.documentElement); // <html> tag
        this.root.addClass('has-flying-focus');
        return this;
      },

      handleEvents: function() {
        var self = this;
        $(document).on('keydown.flyingfocus', function(e) {
          self.handleKeydown(e);
        });

        // Need to use event capturing, so can't use $.on() here.
        // Define a focus/blur hanlder here that gets stored for later removal
        var doc = $(document).get(0);
        focusHandler = function(e) {
          self.handleFocus(e);
        };
        blurHandler = function(e) {
          self.handleBlur(e);
        };
        doc.addEventListener('focus', focusHandler, true);
        doc.addEventListener('blur', blurHandler, true);

        return this;
      },

      handleKeydown: function(e) {
        var key = e.which;

        // Flying focus should only show up whenever the tab key or arrow keys are used
        if (key === 9 || (key > 36 && key < 41)) {
          keydownTime = Date.now();
        }
      },

      handleFocus: function(e) {
        var self = this,
          target = $(e.target);

        if (target.is('#flying-focus')) {
          return;
        }

        var isFirstFocus = false;

        if (!this.focusIndicator) {
          isFirstFocus = true;
          this.focusIndicator = $('<div id="flying-focus"></div>').appendTo('body');
          this.focusIndicator.cssVendorProp('transition-duration', this.settings.duration + 'ms');
        }

        var offset = this.getOffset(target);
        this.focusIndicator.css({
          'left': offset.left + 'px',
          'top': offset.top + 'px',
          'width': target[0].offsetWidth + 'px',
          'height': target[0].offsetHeight + 'px'
        });

        if (isFirstFocus || !this.isJustPressed()) {
          return;
        }

        this.handleBlur();
        target.addClass('flying-focus-target');
        this.focusIndicator.addClass('is-visible');
        prevFocused = target;
        blurTimeout = setTimeout(function() {
          self.handleBlur();
        }, this.settings.duration);
      },

      handleBlur: function() {
        if (!blurTimeout) {
          return;
        }
        clearTimeout(blurTimeout);
        blurTimeout = 0;
        this.focusIndicator.removeClass('is-visible');
        prevFocused.removeClass('flying-focus-target');
        prevFocused = null;
      },

      isJustPressed: function() {
        return Date.now() - keydownTime < 42;
      },

      getOffset: function(target) {
        var rect = target[0].getBoundingClientRect(),
          clientLeft = this.root[0].clientLeft || $('body')[0].clientLeft,
          clientTop  = this.root[0].clientTop  || $('body')[0].clientTop,
          scrollLeft = $(window)[0].pageXOffset || this.root[0].scrollLeft || $('body')[0].scrollLeft,
          scrollTop  = $(window)[0].pageYOffset || this.root[0].scrollTop  || $('body')[0].scrollTop,
          left = rect.left + scrollLeft - clientLeft,
          top =  rect.top  + scrollTop  - clientTop;

        return {
          top: top || 0,
          left: left || 0
        };
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        $(document).off('keydown.flyingfocus');
        var doc = $(document).get(0);
        doc.removeEventListener('focus', focusHandler, true);
        doc.removeEventListener('blur', blurHandler, true);
        focusHandler = undefined;
        blurHandler = undefined;

        this.focusIndicator.remove();
        this.root.removeClass('has-flying-focus');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new FlyingFocus(this, settings));
      }
    });
  };
}));
