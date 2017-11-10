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
  var TOOLBARSEARCHFIELD_EXPAND_SIZE = 280,
    MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE = 450;

  $.fn.toolbarsearchfield = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'toolbarsearchfield',
        defaults = {
          clearable: true,
          collapsible: true,
          collapsibleOnMobile: true
        },
        settings = $.extend({}, defaults, options);

    /**
     * Searchfield Component Wrapper that extends normal Searchfield functionality and provides collapse/expand behavior.  For use inside of Toolbars.
     *
     * @class ToolbarSearchfield
     *
     * @param {boolean} clearable  &nbsp;-&nbsp;  If "true", provides an "x" button on the right edge that clears the field
     * @param {boolean} collapsible  &nbsp;-&nbsp;  If "true", allows the field to expand/collapse on larger breakpoints when focused/blurred respectively
     * @param {boolean} collapsibleOnMobile &nbsp;-&nbsp;  If true, overrides `collapsible` only on mobile settings.
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

      /**
       * @private
       * @returns {this}
       */
      init: function() {
        return this
          .build()
          .handleEvents();
      },

      /**
       * Creates and manages any markup the control needs to function.
       * @returns {this}
       */
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

        this.getToolbarElements();

        // Setup ARIA
        var label = this.element.attr('placeholder') || this.element.prev('label, .label').text().trim();
        if (!label || label === '') {
          label = Locale.translate('Keyword');
        }
        this.input.attr({
          'aria-label': label,
        });

        // Invoke Searchfield, pass settings on
        var sfSettings = $.extend({ 'noToolbarSearchfieldInvoke': true }, this.settings, $.fn.parseOptions(this.input[0]));
        this.input.searchfield(sfSettings);
        this.inputWrapper = this.input.parent();
        this.inputWrapper.addClass('toolbar-searchfield-wrapper');

        // Disable animation/transitions initially
        // For searchfields in "non-collapsible" mode, this helps with sizing algorithms.
        this.element.addClass('no-transition no-animation');
        this.inputWrapper.addClass('no-transition no-animation');

        if (sfSettings.categories) {
          this.categoryButton = this.inputWrapper.find('.searchfield-category-button');
        }

        // Add/remove the collapsible setting
        var collapsibleMethod = this.settings.collapsible ? 'removeClass' : 'addClass';
        this.inputWrapper[collapsibleMethod]('non-collapsible');

        this.xButton = this.inputWrapper.children('.icon.close');

        this.adjustOnBreakpoint();

        if (!this.settings.collapsible || !this.settings.collapsibleOnMobile) {
          this.inputWrapper.addClass('is-open');
        } else {
          this.inputWrapper.removeClass('is-open');
        }

        // When the Toolbar component is rendered, re-enable transitions/animation
        var self = this;
        this.toolbarParent.one('rendered.toolbarsearchfield', function() {
          self.element.removeClass('no-transition no-animation');
          self.inputWrapper.removeClass('no-transition no-animation');
        });

        return this;
      },

      /**
       * TODO: Deprecate in 4.4.0
       * @private
       */
      handleDeactivationEvents: function() {
        return this.addDocumentDeactivationEvents();
      },

      /**
       * @private
       * Sets up event listeners that need to be handled at the global (document) level, since they deal
       * with general keystrokes.
       */
      addDocumentDeactivationEvents: function() {
        var self = this;

        $(document)
          .on('click.' + this.id, function(e) {
            self.handleOutsideClick(e);
          })
          .on('keydown.' + this.id, function(e) {
            self.handleOutsideKeydown(e);
          });
      },

      /**
       * @private
       * Removes global (document) level event handlers.
       */
      removeDocumentDeactivationEvents: function() {
        $(document).off('click.' + this.id + ' keydown.' + this.id);
      },

      /**
       * Detects whether or not the Toolbar Searchfield has focus.
       * @returns {boolean}
       */
      hasFocus: function() {
        return this.element.data('searchfield').hasFocus();
      },

      /**
       * Detects the existence of a "Categories" button added to the searchfield
       * @returns {boolean}
       */
      hasCategories: function() {
        var searchfieldAPI = this.input.data('searchfield');
        if (searchfieldAPI === undefined || typeof searchfieldAPI.hasCategories !== 'function') {
          return false;
        }

        return searchfieldAPI.hasCategories();
      },

      /**
       * Detects the existence of a "Go" button added to the main searchfield API
       * @returns {boolean}
       */
      hasGoButton: function() {
        var searchfieldAPI = this.input.data('searchfield');
        if (!searchfieldAPI || !searchfieldAPI.goButton || !searchfieldAPI.goButton.length) {
          return false;
        }

        return searchfieldAPI.hasGoButton();
      },

      /**
       * Handles the focus of the searchfield.
       */
      handleFocus: function() {
        if (this.isExpanded) {
          return;
        }

        this.inputWrapper.addClass('has-focus');
        this.expand(true);
      },

      /**
       * Triggers an artificial "blur" of the searchfield, resulting in a time-delayed collapse.
       * TODO: Deprecate in 4.4.0
       */
      handleFakeBlur: function(e) {
        return this.handleFocusOut(e);
      },

      /**
       * Handles the "focusout" event
       */
      handleFocusOut: function() {
        if (this.isFocused || !this.settings.collapsible) {
          return;
        }

        this.collapse();
      },

      /**
       * Detects whether or not an element is part of this instance of the Searchfield component
       * @param {HTMLElement} element
       * @returns {boolean}
       */
      isSearchfieldElement: function(element) {
        if ($.contains(this.inputWrapper[0], element)) {
          return true;
        }

        // Don't close if a category is being selected from a category menu
        if (this.categoryButton && this.categoryButton.length) {
          var menu = this.categoryButton.data('popupmenu').menu;
          if (menu.has(element).length) {
            return true;
          }
        }

        return false;
      },

      /**
       * Event Handler for dealing with global (document) level clicks.
       */
      handleOutsideClick: function(e) {
        var target = e.target;
        if (this.isSearchfieldElement(target)) {
          return;
        }

        $(document).off(this.outsideEventStr);
        this.collapse();
      },

      /**
       * Handles Keydown Events
       * @param {jQuery.Event} e - jQuery-wrapped Keydown event.
       */
      handleKeydown: function(e) {
        var key = e.which;

        if (key === 9) { // Tab
          return this.handleFocusOut(e);
        }
      },

      /**
       * Handles global (document) level keydown events that are established to help
       * collapse/de-highlight searchfields on a timer.
       * @param {jQuery.Event} e - jQuery-wrapped Keydown event
       */
      handleOutsideKeydown: function(e) {
        var key = e.which,
          target = e.target;

        if (key === 9 && !this.isSearchfieldElement(target)) {
          this.isFocused = false;
          return this.handleFocusOut(e);
        }
      },

      /**
       * Event Handler for the Popupmenu Component's custom `beforeopen` event.
       * @param {jQuery.Event} e - jQuery-wrapped `beforeopen` Event
       */
      handlePopupBeforeOpen: function(e, menu) {
        if (!menu) {
          return false;
        }

        if (!this.isOpen()) {
          this.categoryButton.focus();
          return false;
        }

        return true;
      },

      /**
       * Retrieves the distance between a left and right boundary.
       * Used on controls like Lookup, Contextual Panel, etc. to fill the space remaining in a toolbar.
       * @param {Number|jQuery[]} leftBoundary
       * @param {Number|jQuery[]} rightBoundary
       * @returns {Number}
       */
      getFillSize: function(leftBoundary, rightBoundary) {
        var leftBoundaryNum = 0,
          rightBoundaryNum = 0;

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
          return TOOLBARSEARCHFIELD_EXPAND_SIZE;
        }

        var distance = rightBoundaryNum - leftBoundaryNum;

        // TODO: Remove this once we figure out how to definitively fix the searchfield sizing.
        // Toolbar Searchfield needs a way to demand that the parent toolbar increase the size of its buttonset
        // and decrease the size of its title under this condition -- currently there is no way.
        if (distance <= TOOLBARSEARCHFIELD_EXPAND_SIZE) {
          return TOOLBARSEARCHFIELD_EXPAND_SIZE;
        }

        if (distance >= MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE) {
          return MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE;
        }

        return distance;
      },

      /**
       * @private
       */
      setClosedWidth: function() {
        var closedWidth = 0;

        // If the searchfield category button exists, change the width of the
        // input field on the inside to provide space for the (variable) size of the currently-selected
        // category (or categories)
        if ((this.categoryButton instanceof $) && this.categoryButton.length) {
          var buttonStyle = window.getComputedStyle(this.categoryButton[0]),
            buttonWidth = this.categoryButton.width(),
            buttonBorder = parseInt(buttonStyle.borderLeftWidth) * 2,
            buttonPadding = parseInt(buttonStyle.paddingLeft) + parseInt(buttonStyle.paddingRight);

            closedWidth = closedWidth + (buttonWidth + buttonBorder + buttonPadding + 4);
        }

        if (this.inputWrapper[0]) {
          this.inputWrapper[0].style.width = closedWidth + 'px';
        }
      },

      /**
       * @private
       */
      setOpenWidth: function() {
        var subtractWidth = 0;

        if (this.inputWrapper[0]) {
          this.inputWrapper[0].style.width = this.openWidth;
        }

        // If the searchfield category button exists, change the width of the
        // input field on the inside to provide space for the (variable) size of the currently-selected
        // category (or categories)
        if (this.hasCategories()) {
          var categoryButtonStyle = window.getComputedStyle(this.categoryButton[0]),
            categoryButtonWidth = this.categoryButton.width(),//parseInt(categoryButtonStyle.width),
            categoryButtonPadding = parseInt(categoryButtonStyle.paddingLeft) + parseInt(categoryButtonStyle.paddingRight),
            categoryButtonBorder = (parseInt(categoryButtonStyle.borderLeftWidth) * 2);

          subtractWidth = subtractWidth + (categoryButtonWidth + categoryButtonPadding + categoryButtonBorder);
        }

        if (this.hasGoButton()) {
          var goButton = this.element.data('searchfield').goButton,
            goButtonStyle = window.getComputedStyle(goButton[0]),
            goButtonWidth = goButton.width(),
            goButtonPadding = parseInt(goButtonStyle.paddingLeft) + parseInt(goButtonStyle.paddingRight),
            goButtonBorder = (parseInt(goButtonStyle.borderLeftWidth) * 2);

          subtractWidth = subtractWidth + (goButtonWidth + goButtonPadding + goButtonBorder);
        }

        if (subtractWidth > 0) {
          this.input[0].style.width = 'calc(100% - ' + subtractWidth + 'px)';
        }
      },

      /**
       * @private
       */
      calculateOpenWidth: function() {
        var buttonset = this.element.parents('.toolbar').children('.buttonset'),
          nextElem = this.inputWrapper.next(),
          width;

        // If small form factor, use the right edge
        if (nextElem.is('.title')) {
          nextElem = buttonset;
        }

        if (this.shouldBeFullWidth()) {
          width = '100%';

          if (this.toolbarParent.closest('.header').length) {
            width = 'calc(100% - 40px)';
          }
          if (this.toolbarParent.closest('.tab-container.module-tabs').length) {
            width = 'calc(100% - 1px)';
          }

          this.openWidth = width;
          return;
        }

        if (!buttonset.length) {
          return;
        }

        // Figure out boundaries
        // +10 on the left boundary reduces the likelyhood that the toolbar pushes other elements
        // into the spillover menu whenever the searchfield opens.
        var leftBoundary = buttonset.offset().left + 10;
        var rightBoundary = nextElem;

        // If the search input sits alone, just use the other side of the buttonset to measure
        if (!rightBoundary.length) {
          rightBoundary = buttonset.offset().left + 10 + buttonset.outerWidth(true);
        }

        width = this.getFillSize(leftBoundary, rightBoundary);
        this.openWidth = (width - 6) + 'px';
      },

      /**
       * Detects whether or not one of the components inside of this searchfield is the document's "active" element.
       * @returns {boolean}
       */
      isActive: function() {
        return this.inputWrapper.hasClass('active');
      },

      /**
       * Detects whether or not this searchfield instance is currently expanded.
       * @returns {boolean}
       */
      isOpen: function() {
        return this.inputWrapper.hasClass('is-open');
      },

      /**
       * Makes necessary adjustments to the DOM surrounding the Searchfield element to accommodate
       * breakpoint changes.
       */
      adjustOnBreakpoint: function() {
        // On smaller form-factor (tablet/phone)
        if (this.shouldBeFullWidth()) {

          this.inputWrapper.removeAttr('style');
          this.input.removeAttr('style');

          if (this.hasFocus()) {
            this.appendToParent();

            this.calculateOpenWidth();
            this.setOpenWidth();

            if (this.isExpanded) {
              return;
            }

            this.expand(true);
          } else {

            if (this.settings.collapsibleOnMobile === true && this.isExpanded) {
              this.collapse();
            }
          }

          return;
        }

        // On larger form-factor (desktop)
        this.appendToButtonset();

        if (!this.settings.collapsible) {
          this.calculateOpenWidth();
          this.setOpenWidth();

          if (!this.isExpanded) {
            this.expand();
            return;
          }
        }

        if (!this.hasFocus() && this.settings.collapsible === true && this.isExpanded) {
          this.collapse();
        }
      },

      /**
       * Angular may not be able to get these elements on demand so we need to be
       * able to call this during the expand method.
       * @private
       */
      getToolbarElements: function() {
        this.buttonsetElem = this.toolbarParent.children('.buttonset')[0];
        if (this.toolbarParent.children('.title').length) {
          this.titleElem = this.toolbarParent.children('.title')[0];
        }
      },

      /**
       * Expands the Searchfield
       */
      expand: function(noFocus) {
        var self = this,
          notFullWidth = !this.shouldBeFullWidth();

        if (this.isActive()) {
          return;
        }

        var toolbarAPI = this.toolbarParent.data('toolbar'),
          toolbarSettings,
          containerSizeSetters;

        if (toolbarAPI) {
           toolbarSettings = this.toolbarParent.data('toolbar').settings;
        }

        if (this.buttonsetElem === undefined) {
          this.getToolbarElements();
        }

        // Places the input wrapper into the toolbar on smaller breakpoints
        if (!notFullWidth) {
          this.appendToParent();
        } else {

          // Re-adjust the size of the buttonset element if the expanded searchfield would be
          // too large to fit.
          var buttonsetWidth = parseInt(window.getComputedStyle(this.buttonsetElem).width),
            d = TOOLBARSEARCHFIELD_EXPAND_SIZE;

          if (buttonsetWidth < TOOLBARSEARCHFIELD_EXPAND_SIZE) {
            d = TOOLBARSEARCHFIELD_EXPAND_SIZE - buttonsetWidth;
          }

          var buttonsetElemWidth = buttonsetWidth + TOOLBARSEARCHFIELD_EXPAND_SIZE;
          containerSizeSetters = {
            buttonset: buttonsetElemWidth
          };

          if (toolbarSettings && toolbarSettings.favorButtonset === true && this.titleElem) {
            var toolbarStyle = window.getComputedStyle(this.toolbarParent[0]),
              titleStyle = window.getComputedStyle(this.titleElem),
              toolbarElemWidth = parseInt(toolbarStyle.width),
              toolbarPadding = parseInt(toolbarStyle.paddingLeft) + parseInt(toolbarStyle.paddingRight),
              titleElemWidth = parseInt(titleStyle.width),
              moreElem = this.toolbarParent.children('more'),
              moreStyle, moreElemWidth = 0;

            if (moreElem.length) {
              moreStyle = window.getComputedStyle(moreElem[0]);
              moreElemWidth = moreStyle.width;
            }

            if (toolbarElemWidth < (toolbarPadding + titleElemWidth + buttonsetElemWidth + moreElemWidth)) {
              containerSizeSetters.title = (titleElemWidth - d);
            }
          }
        }

        this.inputWrapper.addClass('active');
        this.addDocumentDeactivationEvents();

        // Don't continue if we shouldn't expand in a mobile setting.
        if (this.shouldExpandOnMobile()) {
          self.calculateOpenWidth();
          self.setOpenWidth();
          return;
        }

        if (!self.isOpen()) {
          self.inputWrapper.addClass('is-open');
          self.calculateOpenWidth();
          self.setOpenWidth();
        }

        if (!noFocus || Soho.env.os.name === 'ios') {
          self.input.focus();
        }

        // Recalculate the Toolbar Buttonset/Title sizes.
        var eventArgs = [];
        if (containerSizeSetters) {
          eventArgs.push(containerSizeSetters);
        }
        self.toolbarParent.triggerHandler('recalculate-buttons', eventArgs);

        self.inputWrapper.one($.fn.transitionEndName(), function() {
          if (!self.isFocused && self.hasFocus() && document.activeElement !== self.input[0]) {
            self.isFocused = true;
            self.input.focus();
          }

          self.inputWrapper.triggerHandler('expanded');
          self.isExpanded = true;
        });

      },

      /**
       * Collapses the Searchfield
       */
      collapse: function() {
        var self = this,
          textMethod = 'removeClass';

        // Puts the input wrapper back where it should be if it's been moved due to small form factors.
        this.appendToButtonset();

        if (this.input.val().trim() !== '') {
          textMethod = 'addClass';
        }
        this.inputWrapper[textMethod]('has-text');

        self.inputWrapper.removeClass('active');
        if (!self.hasFocus()) {
          self.inputWrapper.removeClass('has-focus');
          self.isFocused = false;
        }

        // Return out without collapsing or handling callbacks for the `collapse` event if:
        // Searchfield is not collapsible in general -OR-
        // Searchfield is only collapsible on mobile, and we aren't below the mobile breakpoint
        if ((self.settings.collapsible === false && self.settings.collapsibleOnMobile === false) ||
           (self.settings.collapsible === false && self.settings.collapsibleOnMobile === true && !self.shouldBeFullWidth())) {
          return;
        }

        if (this.shouldExpandOnMobile()) {
          return;
        }

        this.inputWrapper.removeAttr('style');
        this.input.removeAttr('style');

        if (self.categoryButton && self.categoryButton.length) {
          self.categoryButton.data('popupmenu').close(false, true);
        }

        self.inputWrapper
          .removeClass('is-open')
          .triggerHandler('collapsed');

        self.removeDocumentDeactivationEvents();

        self.isExpanded = false;

        if (Soho.env.os.name === 'ios') {
          $('head').triggerHandler('enable-zoom');
        }

        self.toolbarParent.triggerHandler('recalculate-buttons');
      },

      /**
       * If focused, we need to store a reference to the element with focus (searchfield, internal buttons, etc)
       * because once the element becomes removed from the DOM, focus is lost.
       * @private
       */
      saveFocus: function() {
        if (!this.hasFocus()) {
          return;
        }
        this.focusElem = document.activeElement;
      },

      /**
       * Restores focus to an element reference that was previously focused.
       * @private
       */
      restoreFocus: function() {
        if (!this.focusElem) {
          return;
        }

        this.focusElem.focus();
        this.focusElem = undefined;
      },

      /**
       * Appends this searchfield to the `containmentParent` element
       * Used when the small-form-factor searchfield needs to be established.
       * @private
       */
      appendToParent: function() {
        if (this.inputWrapper.parent().is(this.containmentParent)) {
          return;
        }

        this.saveFocus();

        this.elemBeforeWrapper = this.inputWrapper.prev();
        this.inputWrapper.detach().prependTo(this.containmentParent);
        Soho.utils.fixSVGIcons(this.inputWrapper);

        this.restoreFocus();
      },

      /**
       * Removes this searchfield from the `containmentParent` element, and places it back into the buttonset.
       * Used when the small-form-factor searchfield needs to be established.
       * @private
       */
      appendToButtonset: function() {
        if (!this.inputWrapper.parent().is(this.containmentParent)) {
          return;
        }

        this.saveFocus();

        if (!(this.elemBeforeWrapper instanceof $) || !this.elemBeforeWrapper.length) {
          this.inputWrapper.prependTo(this.toolbarParent.children('.buttonset'));
        } else {
          this.inputWrapper.detach().insertAfter(this.elemBeforeWrapper);
          this.elemBeforeWrapper = null;
        }

        this.removeDocumentDeactivationEvents();
        this.toolbarParent.triggerHandler('scrollup');
        Soho.utils.fixSVGIcons(this.inputWrapper);

        this.restoreFocus();
      },

      /**
       * Determines whether or not the full-size Searchfield should open over top of its sibling Toolbar elements.
       * @private
       * @returns {boolean}
       */
      shouldBeFullWidth: function() {
        var header = this.inputWrapper.closest('.header'),
          headerCondition = false;

        if (header.length) {
          headerCondition = header.width() < Soho.breakpoints.phone;
        }

        return headerCondition || Soho.breakpoints.isBelow('phone-to-tablet');
      },

      /**
       * Determines whether or not the Searchfield should expand on the Mobile breakpoint.
       * @private
       * @returns {boolean}
       */
      shouldExpandOnMobile: function() {
        if (this.settings.collapsible === true) {
          return false;
        }
        if (this.settings.collapsibleOnMobile === true) {
          return true;
        }
        return this.shouldBeFullWidth();
      },

      /**
       * Used when the control has its settings or structural markup changed.  Rebuilds key parts of the control that
       * otherwise wouldn't automatically update.
       * @returns {this}
       */
      updated: function() {
        return this
          .teardown()
          .init();
      },

      /**
       * Enables the Searchfield
       */
      enable: function() {
        this.inputWrapper.addClass('is-disabled');
        this.input.prop('disabled', true);
      },

      /**
       * Disables the Searchfield
       */
      disable: function() {
        this.inputWrapper.removeClass('is-disabled');
        this.input.prop('disabled', false);
      },

      /**
       * Tears down events, properties, etc. and resets the control to "factory" state
       * @returns {this}
       */
      teardown: function() {
        this.inputWrapper.off('mousedown.toolbarsearchfield focusin.toolbarsearchfield keydown.toolbarsearchfield collapse.toolbarsearchfield');
        this.inputWrapper.find('.icon').remove();

        this.toolbarParent.off('navigate.toolbarsearchfield');
        this.element.off('blur.toolbarsearchfield');

        if (this.xButton && this.xButton.length) {
          this.xButton.remove();
        }

        // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
        this.removeDocumentDeactivationEvents();
        $('body').off('resize.' + this.id);

        return this;
      },

      /**
       * Removes the entire control from the DOM and from this element's internal data
       * @param {boolean} dontDestroySearchfield - if true, will not pass through and destroy a linked instance of the Searchfield component.
       */
      destroy: function(dontDestroySearchfield) {
        this.teardown();

        // Destroy the linked Searchfield instance
        var sf = this.element.data('searchfield');
        if (!dontDestroySearchfield && sf && typeof sf.destroy === 'function') {
          sf.destroy(true);
        }

        $.removeData(this.element[0], pluginName);
      },

      /**
       *  This component fires the following events.
       *
       * @fires ToolbarSearchfield#events
       * @param {Object} mousedown  &nbsp;-&nbsp; Fires when the searchfield is clicked (if enabled).
       * @param {Object} focusin  &nbsp;-&nbsp; Fires when the searchfield is focused.
       * @param {Object} keydown  &nbsp;-&nbsp; Fires when a key is pressed inside of the searchfield.
       * @param {Object} collapse  &nbsp;-&nbsp; Fires when a `collapse` event is triggered externally on the searchfield.
       *
       * @param {Object} beforeopen  &nbsp;-&nbsp; Fires when a `beforeopen` event is triggered on the searchfield's optional categories menubutton.
       *
       * @param {Object} navigate  &nbsp;-&nbsp; Fires when a `navigate` event is triggered on the searchfield's parent toolbar.
       *
       * @param {Object} keydown  &nbsp;-&nbsp; Fires when a `keydown` event is triggered at the `document` level.
       * @param {Object} resize  &nbsp;-&nbsp; Fires when a `resize` event is triggered at the `body` level.
       */
      handleEvents: function() {
        var self = this;

        this.element.on('cleared.toolbarsearchfield', function() {
          self.element.addClass('active is-open has-focus');
          self.isFocused = true;
        });

        this.inputWrapper.on('mousedown.toolbarsearchfield', function() {
          self.fastExpand = true;
        }).on('focusin.toolbarsearchfield', function(e) {
          self.handleFocus(e);
        }).on('keydown.toolbarsearchfield', function(e) {
          self.handleKeydown(e);
        }).on('collapse.toolbarsearchfield', function() {
          self.collapse();
        });

        if (this.categoryButton && this.categoryButton.length) {
          this.categoryButton.on('beforeopen.toolbarsearchfield', function(e, menu) {
            return self.handlePopupBeforeOpen(e, menu);
          });
        }

        this.toolbarParent.on('navigate.toolbarsearchfield', function() {
          if (!self.hasFocus()) {
            self.collapse();
          }
        });

        $('body').on('resize.' + this.id, function() {
          self.adjustOnBreakpoint();
        });
        self.adjustOnBreakpoint();

        if (Soho.env.os.name === 'ios') {
          this.element.on('blur.toolbarsearchfield', function() {
            $('head').triggerHandler('disable-zoom');
          });
        }

        return this;
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
