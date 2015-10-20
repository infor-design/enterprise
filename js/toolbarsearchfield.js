/**
* Toolbar Searchfield (TODO: bitly link to soho xi docs)
* NOTE:  Depends on both a Toolbar control and Searchfield control to be present
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
        defaults = {
          searchfieldPlaceholder: Locale.translate('Keyword')
        },
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
        // Used for managing events that are bound to $(document)
        if (!this.id) {
          this.id = (parseInt($('.toolbar-searchfield').length, 10)+1).toString();
        }

        // Build the searchfield element
        this.input = this.element;

        // If inside a toolbar, make sure to append it to the root toolbar element.
        this.toolbarParent = this.element.parents('.toolbar');

        // Setup ARIA
        this.input.attr({
          'aria-label': this.settings.searchfieldPlaceholder,
          'placeholder': this.settings.searchfieldPlaceholder
        });

        // Invoke Searchfield, pass settings on
        this.input.searchfield(this.settings);
        this.inputWrapper = this.input.parent('.searchfield-wrapper');
        this.inputWrapper.addClass('toolbar-searchfield-wrapper');

        return this;
      },

      // Main entry point for setting up event handlers.
      handleEvents: function() {
        var self = this;

        this.input
        .on('mousedown.toolbarsearchfield', function() {
          self.fastActivate = true;
        }).on('focusin.toolbarsearchfield', function(e) {
          self.handleFocus(e);
        }).on('focusout.toolbarsearchfield', function() {
          clearTimeout(self.focusTimer);
          self.inputWrapper.removeClass('has-focus');
        });

        this.input.on('focusout.toolbarsearchfield', function(e) {
          self.handleBlur(e);
        });

        // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
        $(document).on('keydown.toolbarsearchfield-' + this.id, function(e) {
          self.handleOutsideKeydown(e);
        });

        return this;
      },

      handleDeactivationEvents: function() {
        var self = this;

        $(document).on('click.toolbarsearchfield-' + this.id, function(e) {
          self.handleOutsideClick(e);
        });
      },

      handleFocus: function(e) {
        var self = this;
        clearTimeout(this.focusTimer);

        this.inputWrapper.addClass('has-focus');

        function searchfieldActivationTimer() {
          self.activate();
        }

        if (this.fastActivate) {
          searchfieldActivationTimer();
          return;
        }

        this.focusTimer = setTimeout(searchfieldActivationTimer, 300);
      },

      handleBlur: function(e) {
        clearTimeout(this.focusTimer);

        if (this.inputWrapper.hasClass('active')) {
          this.deactivate();
        }
      },

      handleOutsideClick: function(e) {
        var self = this,
          target = $(e.target);

        if ($.contains(this.element[0], e.target) || $.contains(this.inputWrapper[0], e.target) ||
          target.is(this.element) || target.is(this.inputWrapper)) {
          return;
        }

        $(document).off('click.toolbarsearchfield-' + this.id);
        this.deactivate();
      },

      handleOutsideKeydown: function(e) {
        var key = e.which;

        this.fastActivate = false;
        if (key === 9) {
          this.fastActivate = true;
        }
      },

      activate: function() {
        if (this.inputWrapper.hasClass('active')) {
          return;
        }

        var self = this;
        this.inputWrapper.addClass('active');

        if (this.animationTimer) {
          clearTimeout(this.animationTimer);
        }

        function activateCallback() {
          self.inputWrapper.addClass('is-open');
          self.input.focus(); // for iOS
          self.handleDeactivationEvents();
        }

        this.animationTimer = setTimeout(activateCallback, 300);
      },

      deactivate: function() {
        var self = this,
          textMethod = 'removeClass';

        if (this.input.val().trim() !== '') {
          textMethod = 'addClass';
        }
        this.inputWrapper[textMethod]('has-text');

        if (this.animationTimer) {
          clearTimeout(this.animationTimer);
        }

        function deactivateCallback() {
          self.inputWrapper.removeClass('is-open');
          self.fastActivate = false;
        }

        self.inputWrapper.removeClass('active');

        if (this.fastActivate) {
          deactivateCallback();
          return;
        }

        this.animationTimer = setTimeout(deactivateCallback, 300);
      },

      // sets the positioning of the input element
      position: function(open) {
        var elemPos, elemWidth, elemHeight;

        elemPos = this.element.offset();
        elemWidth = this.element.outerWidth();
        elemHeight = this.element.outerHeight();

        // Open
        if (open) {
          this.inputWrapper.css({
            left: elemPos.left,
            right: elemPos.left + elemWidth,
            width: elemWidth
          });
          return;
        }

        // Close
        this.inputWrapper.css({
          left: elemPos.left + (elemWidth/2),
          right: elemPos.left + (elemWidth/2),
          top: elemPos.top,
          width: 0
        });
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
