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
          clearable: true,  // If "true", provides an "x" button on the right edge that clears the field
          collapsible: true // If "true", allows the field to expand/collapse on larger breakpoints when focused/blurred respectively
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
        this.containmentParent = this.toolbarParent;
        var moduleTabs = this.containmentParent.closest('.module-tabs');
        if (moduleTabs.length) {
          this.containmentParent = moduleTabs;
        }

        // Setup ARIA
        var label = this.element.attr('placeholder') || this.element.prev('label, .label').text().trim();
        if (!label || label === '') {
          label = Locale.translate('Keyword');
        }
        this.input.attr({
          'aria-label': label,
        });

        // Invoke Searchfield, pass settings on
        var sfSettings = $.extend({}, this.settings, $.fn.parseOptions(this.input[0]));
        this.input.searchfield(sfSettings);
        this.inputWrapper = this.input.parent('.searchfield-wrapper');
        this.inputWrapper.addClass('toolbar-searchfield-wrapper');

        if (sfSettings.categories) {
          this.button = this.inputWrapper.find('.searchfield-category-button');
        }

        // Add/remove the collapsible setting
        var collapsibleMethod = this.settings.collapsible ? 'removeClass' : 'addClass';
        this.inputWrapper[collapsibleMethod]('non-collapsible');

        this.xButton = this.inputWrapper.children('.icon.close');

        return this;
      },

      // Main entry point for setting up event handlers.
      handleEvents: function() {
        var self = this;

        this.inputWrapper.on('mousedown.toolbarsearchfield', function() {
          self.fastActivate = true;
        }).on('focusin.toolbarsearchfield', function(e) {
          self.handleFocus(e);
        }).on('deactivate.toolbarsearchfield', function() {
          self.deactivate();
        });

        if (this.button && this.button.length) {
          this.button.on('beforeopen.toolbarsearchfield', function(e, menu) {
            return self.handlePopupBeforeOpen(e, menu);
          });
        }

        // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
        $(document).on('keydown.toolbarsearchfield-' + this.id, function(e) {
          self.handleOutsideKeydown(e);
        });

        return this;
      },

      handleDeactivationEvents: function() {
        var self = this;

        $(document).onTouchClick('toolbarsearchfield-' + this.id).on('click.toolbarsearchfield-' + this.id, function(e) {
          self.handleOutsideClick(e);
        });
      },

      handleFocus: function() {
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

      handleFakeBlur: function() {
        var self = this;
        clearTimeout(this.focusTimer);

        function searchfieldDeactivationTimer() {
          if (!$.contains(self.inputWrapper[0], document.activeElement) && self.inputWrapper.hasClass('active')) {
            self.inputWrapper.removeClass('has-focus');
            self.deactivate();
          }
        }

        this.focusTimer = setTimeout(searchfieldDeactivationTimer, 100);
      },

      handleOutsideClick: function(e) {
        var target = $(e.target);

        // Don't close if we're focused on an element inside the wrapper
        if ($.contains(this.inputWrapper[0], e.target) || target.is(this.element) || target.is(this.inputWrapper)) {
          return;
        }

        // Don't close if a category is being selected from a category menu
        if (this.button && this.button.length) {
          var menu = this.button.data('popupmenu').menu;
          if (menu.has(target).length) {
            return;
          }
        }

        $(document).offTouchClick('toolbarsearchfield-' + this.id).off('click.toolbarsearchfield-' + this.id);
        this.deactivate();
      },

      handleOutsideKeydown: function(e) {
        var key = e.which;

        this.fastActivate = false;
        if (key === 9) { // Tab
          this.fastActivate = true;
          return this.handleFakeBlur();
        }

        var wasInputTheTarget = ($(e.target).is(this.input) || $(e.target).is(this.inputWrapper));
        if (wasInputTheTarget && (key === 37 || key === 38 || key === 39 || key === 40)) {
          return this.handleFakeBlur();
        }
      },

      handlePopupBeforeOpen: function(e, menu) {
        if (!menu) {
          return false;
        }

        if (!this.inputWrapper.is('.is-open')) {
          this.input.focus();
          return false;
        }

        return true;
      },

      activate: function() {
        if (this.inputWrapper.hasClass('active')) {
          return;
        }

        var self = this;

        if (this.animationTimer) {
          clearTimeout(this.animationTimer);
        }

        // Places the input wrapper into the toolbar on smaller breakpoints
        if (this.shouldBeFullWidth()) {
          this.inputWrapper.detach().prependTo(this.containmentParent);
        }

        this.inputWrapper.addClass('active');
        this.handleDeactivationEvents();

        function activateCallback() {
          self.inputWrapper.addClass('is-open').trigger('activated');
          self.input.focus(); // for iOS
        }

        if (this.settings.collapsible === false && !this.shouldBeFullWidth()) {
          activateCallback();
          return;
        }

        var header = this.inputWrapper.closest('.header'),
          headerWidth = header.width();

        this.animationTimer = setTimeout(activateCallback, (header.length > 0 && headerWidth < 320) ? 0 : 300);
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

          if (self.button && self.button.length && self.button.is('.is-open')) {
            self.button.data('popupmenu').close(false, true);
          }

          self.toolbarParent.trigger('recalculateButtons');
          self.inputWrapper.trigger('deactivated');
        }

        // Puts the input wrapper back where it should be if it's been moved due to small form factors.
        if (this.inputWrapper.parent().is(this.containmentParent)) {
          this.inputWrapper.detach().prependTo(this.containmentParent.find('.buttonset'));
        }

        self.inputWrapper.removeClass('active').removeClass('has-focus');

        if (this.fastActivate || this.settings.collapsible === false) {
          deactivateCallback();
          return;
        }

        this.animationTimer = setTimeout(deactivateCallback, 300);
      },

      shouldBeFullWidth: function() {
        var header = this.inputWrapper.closest('.header'),
          headerWidth = header.width(),
          windowWidth = $(window).width();

        return windowWidth < 767 || (header.length > 0 && headerWidth < 320);
      },

      // Used when the control has its settings or structural markup changed.  Rebuilds key parts of the control that
      // otherwise wouldn't automatically update.
      updated: function() {
        return this
          .teardown()
          .init();
      },

      enable: function() {
        this.inputWrapper.addClass('is-disabled');
        this.input.prop('disabled', true);
      },

      disable: function() {
        this.inputWrapper.removeClass('is-disabled');
        this.input.prop('disabled', false);
      },

      // Tears down events, properties, etc. and resets the control to "factory" state
      teardown: function() {
        this.inputWrapper.off('mousedown.toolbarsearchfield focusin.toolbarsearchfield');

        // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
        $(document).off('keydown.toolbarsearchfield-' + this.id);

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
