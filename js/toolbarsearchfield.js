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

    /**
     * Depends on both a Toolbar control and Searchfield control to be present
     * @constructor
     * @param {Object} element
     */
    function ToolbarSearchfield(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
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
          this.id = this.element.uniqueId('toolbar-searchfield');
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

        // Open the searchfield once on intialize if it's a "non-collapsible" searchfield
        if (!this.settings.collapsible) {
          this.inputWrapper.addClass('no-transition').one('expanded.' + this.id, function() {
            $(this).removeClass('no-transition');
          });
          this.expand();
        }

        return this;
      },

      // Main entry point for setting up event handlers.
      handleEvents: function() {
        var self = this;

        this.inputWrapper.on('mousedown.toolbarsearchfield', function() {
          self.fastExpand = true;
        }).on('focusin.toolbarsearchfield', function(e) {
          self.handleFocus(e);
        }).on('collapse.toolbarsearchfield', function() {
          self.collapse();
        });

        if (this.button && this.button.length) {
          this.button.on('beforeopen.toolbarsearchfield', function(e, menu) {
            return self.handlePopupBeforeOpen(e, menu);
          });
        }

        // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
        $(document).on('keydown.' + this.id, function(e) {
          self.handleOutsideKeydown(e);
        });

        $('body').on('resize.' + this.id, function() {
          self.adjustOnBreakpoint();
        });

        return this;
      },

      handleDeactivationEvents: function() {
        var self = this;

        $(document).onTouchClick(this.id).on('click.' + this.id, function(e) {
          self.handleOutsideClick(e);
        });
      },

      handleFocus: function() {
        var self = this;
        clearTimeout(this.focusTimer);

        this.inputWrapper.addClass('has-focus');

        function searchfieldActivationTimer() {
          self.expand();
        }

        if (this.fastExpand) {
          searchfieldActivationTimer();
          return;
        }

        this.focusTimer = setTimeout(searchfieldActivationTimer, 0);
      },

      handleFakeBlur: function() {
        var self = this;
        clearTimeout(this.focusTimer);

        function searchfieldCollapseTimer() {
          if (!$.contains(self.inputWrapper[0], document.activeElement) && self.inputWrapper.hasClass('active')) {
            //self.inputWrapper.removeClass('has-focus');
            self.collapse();
          }
        }

        this.focusTimer = setTimeout(searchfieldCollapseTimer, 100);
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

        $(document).offTouchClick(this.id).off('click.' + this.id);
        this.collapse();
      },

      handleOutsideKeydown: function(e) {
        var key = e.which;

        this.fastExpand = false;
        if (key === 9) { // Tab
          this.fastExpand = true;
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

      // Retrieves the distance between a left and right boundary.
      // Used on controls like Lookup, Contextual Panel, etc. to fill the space remaining in a toolbar.
      getFillSize: function(leftBoundary, rightBoundary) {
        var defaultWidth = 225,
          leftBoundaryNum = 0,
          rightBoundaryNum = 0,
          maxFillSize = 450;

        function sanitize(boundary) {
          if (!boundary) {
            return 0;
          }

          // Return out if the boundary is just a number
          if (!isNaN(parseInt(boundary))) {
            return parseInt(boundary);
          }

          if (boundary instanceof jQuery) {
            if (!boundary.length) {
              return;
            }

            if (boundary.is('.title')) {
              boundary = boundary.next('.buttonset');
            }

            boundary = boundary[0];
          }

          return boundary;
        }

        function getEdgeFromBoundary(boundary, edge) {
          if (!isNaN(boundary)) {
            return (boundary === null || boundary === undefined) ? 0 : boundary;
          }

          if (!edge || typeof edge !== 'string') {
            edge = 'left';
          }

          var edges = ['left', 'right'];
          if ($.inArray(edge, edges) === -1) {
            edge = edges[0];
          }

          var rect;

          if (boundary instanceof HTMLElement || boundary instanceof SVGElement) {
            rect = boundary.getBoundingClientRect();
          }

          return rect[edge];
        }

        leftBoundary = sanitize(leftBoundary);
        rightBoundary = sanitize(rightBoundary);

        function whichEdge() {
          var e = 'left';
          if (leftBoundary === rightBoundary || ($(rightBoundary).length && $(rightBoundary).is('.buttonset'))) {
            e = 'right';
          }

          return e;
        }

        leftBoundaryNum = getEdgeFromBoundary(leftBoundary);
        rightBoundaryNum = getEdgeFromBoundary(rightBoundary, whichEdge());

        if (!leftBoundaryNum && !rightBoundaryNum) {
          return defaultWidth;
        }

        var distance = rightBoundaryNum - leftBoundaryNum;
        if (distance <= defaultWidth) {
          return defaultWidth;
        }

        if (distance >= maxFillSize) {
          return maxFillSize;
        }

        return distance;
      },

      setOpenWidth: function() {
        this.inputWrapper.css('width', this.openWidth);
      },

      calculateOpenWidth: function() {
        var buttonset = this.element.parents('.toolbar').children('.buttonset'),
          nextElem = this.inputWrapper.next(),
          width;

        // If small form factor, use the right edge
        if (nextElem.is('.title')) {
          nextElem = buttonset;
        }

        if (!buttonset.length) {
          return;
        }

        if (this.shouldBeFullWidth()) {
          width = '100%';

          if (this.toolbarParent.closest('.header').length) {
            width = 'calc(100% - 40px)';
          }

          this.openWidth = width;
          return;
        }

        // Figure out boundaries
        // +10 on the left boundary reduces the likelyhood that the toolbar pushes other elements
        // into the spillover menu whenever the searchfield opens.
        var leftBoundary = buttonset.offset().left + 10;
        var rightBoundary = this.inputWrapper.next();

        // If the search input sits alone, just use the other side of the buttonset to measure
        if (!rightBoundary.length) {
          rightBoundary = buttonset.offset().left + buttonset.outerWidth(true);
        }

        width = this.getFillSize(leftBoundary, rightBoundary);
        this.openWidth = width + 'px';
      },

      isActive: function() {
        return this.inputWrapper.hasClass('is-active');
      },

      adjustOnBreakpoint: function() {
        var isFullWidth = this.shouldBeFullWidth(),
          hasStyleAttr = this.inputWrapper.attr('style');

        if (this.isActive()) {
          this.collapse();
        }

        if (!isFullWidth && !hasStyleAttr) {
          this.calculateOpenWidth();
        }
      },

      expand: function() {
        if (this.inputWrapper.hasClass('active')) {
          return;
        }

        var self = this,
          notFullWidth = !this.shouldBeFullWidth();

        if (this.animationTimer) {
          clearTimeout(this.animationTimer);
        }

        // Places the input wrapper into the toolbar on smaller breakpoints
        if (!notFullWidth) {
          this.inputWrapper.detach().prependTo(this.containmentParent);
        }

        this.inputWrapper.addClass('active');
        this.handleDeactivationEvents();

        function expandCallback() {
          self.inputWrapper.addClass('is-open');
          self.calculateOpenWidth();
          self.setOpenWidth();
          self.input.focus(); // for iOS
          self.toolbarParent.trigger('recalculate-buttons');
          self.inputWrapper.triggerHandler('expanded');
        }

        if (this.settings.collapsible === false && !this.shouldBeFullWidth()) {
          expandCallback();
          return;
        }

        this.animationTimer = setTimeout(expandCallback, 0);
      },

      collapse: function() {
        var self = this,
          textMethod = 'removeClass';

        function closeWidth() {
          if (self.settings.collapsible || self.shouldBeFullWidth()) {
            self.inputWrapper.removeAttr('style');
          }
        }

        if (this.input.val().trim() !== '') {
          textMethod = 'addClass';
        }
        this.inputWrapper[textMethod]('has-text');

        if (this.animationTimer) {
          clearTimeout(this.animationTimer);
        }

        function collapseCallback() {
          self.inputWrapper.removeClass('is-open');
          self.fastExpand = false;

          closeWidth();

          if (self.button && self.button.length && self.button.is('.is-open')) {
            self.button.data('popupmenu').close(false, true);
          }

          self.toolbarParent.trigger('recalculate-buttons');
          self.inputWrapper.triggerHandler('collapsed');
        }

        // Puts the input wrapper back where it should be if it's been moved due to small form factors.
        if (this.inputWrapper.parent().is(this.containmentParent)) {
          this.inputWrapper.detach().prependTo(this.containmentParent.find('.buttonset'));
        }

        self.inputWrapper.removeClass('active has-focus');

        if (this.fastExpand || this.settings.collapsible === false) {
          collapseCallback();
          return;
        }

        this.animationTimer = setTimeout(collapseCallback, 100);
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
        this.inputWrapper.off('mousedown.toolbarsearchfield focusin.toolbarsearchfield collapse.toolbarsearchfield');

        if (this.button && this.button.length) {
          this.button.off('beforeopen.toolbarsearchfield');
        }

        // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
        $(document).off('keydown.' + this.id);
        $('body').off('resize.' + this.id);

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
