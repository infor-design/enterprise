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

  $.fn.accordion = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'accordion',
        defaults = {
          allowOnePane: true,
          displayChevron: true,
          rerouteOnLinkClick: true,
          source: null
        },
        settings = $.extend({}, defaults, options);

    /**
    * The Accordion is a grouped set of collapsible panels used to navigate sections of
    * related content. Each panel consists of two levels: the top level identifies the
    * category or section header, and the second level provides the associated options.
    *
    * @class Accordion
    * @param {String} allowOnePane &nbsp;-&nbsp; If set to true, allows only one pane of the Accordion to be open at a time.  If an Accordion pane is open, and that pane contains sub-headers, only one of the pane's sub-headers can be open at a time. (default true)
    * @param {String} displayChevron  &nbsp;-&nbsp; Displays a "Chevron" icon that sits off to the right-most side of a top-level accordion header.  Used in place of an Expander (+/-) if enabled.
    * @param {String} rerouteOnLinkClick  &nbsp;-&nbsp; Can be set to false if routing is externally handled
    * @param {Boolean} source  &nbsp;-&nbsp; A callback function that when implemented provided a call back for "ajax loading" of tab contents on open.
    *
    */
    function Accordion(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Accordion.prototype = {
      init: function() {
        return this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        return this;
      },

      build: function() {
        var self = this;

        this.headers = this.element.find('.accordion-header');
        this.anchors = this.headers.children('a');
        this.panes = this.headers.next('.accordion-pane');

        var headersHaveIcons = false;

        // Accordion Headers that have an expandable pane need to have an expando-button added inside of them
        this.headers.each(function addExpander() {
          var header = $(this),
            hasIcons = false,
            containerPane = header.parent(),
            isTopLevel = containerPane.is('.accordion');

          function checkIfIcons() {
            if (isTopLevel) {
              return;
            }

            if (!hasIcons) {
              header.addClass('no-icon');
              return;
            }

            containerPane.addClass('has-icons');
          }

          header.attr('role', 'presentation').hideFocus();

          // For backwards compatibility:  If an icon is found inside an anchor, bring it up to the level of the header.
          header.children('a').find('svg').detach().insertBefore(header.children('a'));

          var outerIcon = header.children('.icon, svg');
          outerIcon.addClass('icon').attr({'role': 'presentation', 'aria-hidden': 'true', 'focusable': 'false'});
          if (isTopLevel && outerIcon.length) {
            headersHaveIcons = true;
          }

          if (header.is('.list-item') || (!isTopLevel && header.find('button').length)) {
            hasIcons = true;
          }

          // Enable/Disable
          if (header.hasClass('is-disabled')) {
            header.children('a, button').attr('tabindex', '-1');
          }

          // Don't continue if there's no pane
          if (!header.next('.accordion-pane').length) {
            checkIfIcons();
            return;
          }

          hasIcons = true;

          var expander = header.children('.btn');
          if (!expander.length) {
            expander = $('<button class="btn" type="button"></button>');

            var method = 'insertBefore';
            if (self.settings.displayChevron && isTopLevel) {
              header.addClass('has-chevron');
              method = 'insertAfter';
            }
            expander[method](header.children('a'));
            header.data('addedExpander', expander);
          }

          // Hide Focus functionality
          expander.hideFocus();

          // If Chevrons are turned off and an icon is present, it becomes the expander
          if (outerIcon.length && !self.settings.displayChevron) {
            outerIcon.appendTo(expander);
          }

          var expanderIcon = expander.children('.icon, .svg, .plus-minus');
          if (!expanderIcon.length) {
            if (self.settings.displayChevron && isTopLevel) {
              expanderIcon = $.createIconElement({ icon: 'caret-down', classes: ['chevron'] });
            } else {
              var isActive = self.isExpanded(header) ? ' active' : '';
              expanderIcon = $('<span class="icon plus-minus'+ isActive +'" aria-hidden="true" role="presentation"></span>');
            }
            expanderIcon.appendTo(expander);
          }
          var expanderIconOpts = {
            'role': 'presentation',
            'aria-hidden': 'true'
          };
          if (!expanderIcon.is('span')) {
            expanderIconOpts.focusable = 'false';
          }
          expanderIcon.attr(expanderIconOpts);

          // Move around the Expander depending on whether or not it's a chevron
          if (expanderIcon.is('.chevron')) {
            header.addClass('has-chevron');
            expander.insertAfter(header.children('a'));
          } else {
            header.removeClass('has-chevron');
            expander.insertBefore(header.children('a'));
          }

          // Double check to see if we have left-aligned expanders or icons present,
          // so we can add classes that do alignment
          if (!self.settings.displayChevron && isTopLevel) {
            headersHaveIcons = true;
          }
          checkIfIcons();

          // Add an Audible Description to the button
          var description = expander.children('.audible');
          if (!description.length) {
            description = $('<span class="audible"></span>').appendTo(expander);
          }
          description.text(Locale.translate('Expand'));
        });

        if (headersHaveIcons) {
          this.element.addClass('has-icons');
        }

        // Setup correct ARIA for accordion panes, and auto-collapse them
        this.panes.each(function addPaneARIA() {
          var pane = $(this),
            header = pane.prev('.accordion-header');

          header.children('a').attr({'aria-haspopup': 'true', 'role': 'button'});

          if (!self.isExpanded(header)) {
            pane.data('ignore-animation-once', true);
            self.collapse(header);
          }
        });

        // Expand to the current accordion header if we find one that's selected
        if (!this.element.data('updating')) {
          var targetsToExpand = this.headers.filter('.is-selected, .is-expanded');

          if (this.settings.allowOnePane) {
            targetsToExpand = targetsToExpand.first();
          }

          this.expand(targetsToExpand);
          this.select(targetsToExpand.last());
        }

        return this;
      },

      handleHeaderClick: function(e, header) {
        if (!header || !header.length || this.isDisabled(header) || header.data('is-animating')) {
          e.preventDefault();
          return;
        }

        // Check that we aren't clicking the expando button.  If we click that, this listener dies
        if ($(e.target).is('[class^="btn"]')) {
          e.preventDefault();
          return;
        }

        var anchor = header.children('a');
        return this.handleAnchorClick(e, anchor);
      },

      handleAnchorClick: function(e, anchor) {
        var self = this,
          header = anchor.parent('.accordion-header'),
          pane = header.next('.accordion-pane'),
          ngLink = anchor.attr('ng-reflect-href');

        if (e && !ngLink) {
          e.preventDefault();
        }

        if (!header.length || this.isDisabled(header)) {
          return false;
        }

        var canSelect = this.element.triggerHandler('beforeselect', [anchor]);
        if (canSelect === false) {
          return;
        }

        this.element.trigger('selected', header);

        // Set the original element for DOM traversal by keyboard
        this.originalSelection = anchor;

        this.select(anchor);

        function followLink() {
          var href = anchor.attr('href');
          if (href && href !== '' && href !== '#') {
            if (!self.settings.rerouteOnLinkClick) {
              return true;
            }

            window.location.href = href;
            return true;
          }
          return false;
        }

        function toggleExpander() {
          if (pane.length) {
            self.toggle(header);
          }
          anchor.focus();
        }

        // Stop propagation here because we don't want to bubble up to the Header and potentially click the it twice
        if (e) {
          e.stopPropagation();
        }

        // If the anchor's a real link, follow the link and die here
        if (followLink()) {
          this.element.trigger('followlink', [anchor]);
          return true;
        }

        // If it's not a real link, try and toggle an expansion pane
        toggleExpander();
        return true;
      },

      handleExpanderClick: function(e, expander) {
        var header = expander.parent('.accordion-header');
        if (!header.length || this.isDisabled(header) || header.data('is-animating')) {
          return;
        }

        // Set the original element for DOM traversal by keyboard
        this.originalSelection = expander;

        // Don't propagate when clicking the expander.  Propagating can cause the link to be clicked in cases
        // where it shouldn't be clicked.
        if (e) {
          e.stopPropagation();
        }

        var pane = header.next('.accordion-pane');
        if (pane.length) {
          this.toggle(header);
          this.select(header);
          expander.focus();
          return;
        }

        // If there's no accordion pane, attempt to simply follow the link.
        return this.handleAnchorClick(null, header.children('a'));
      },

      handleKeys: function(e) {
        var self = this,
          key = e.which,
          target = $(e.target), // will be either an anchor or expando button.  Should NEVER be the header itself.
          header = target.parent(),
          expander = header.children('[class^="btn"]').first(),
          anchor = header.children('a');

        function setInitialOriginalSelection(selection) {
          if (!selection) {
            selection = target;
          }

          if (!self.originalSelection) {
            self.originalSelection = selection;
          }
        }

        if (key === 9) { // Tab (also triggered by Shift + Tab)
          this.headers.removeClass('is-selected');

          if (target.is('a') && expander.length) {
            setInitialOriginalSelection(expander);
          } else {
            setInitialOriginalSelection(anchor);
          }
        }

        if (key === 32) { // Spacebar
          e.preventDefault();

          // Don't let this propagate and run against the header element, if it's a button
          if (target.is('[class^="btn"]')) {
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Firefox will attempt to run this twice, despite the fact that we're stopping propagation.
            // Just cancel the whole thing if Firefox is running this method.
            if ($('html').hasClass('is-firefox')) {
              return;
            }
          }

          if (expander.length) {
            setInitialOriginalSelection(expander);
            return this.handleExpanderClick(null, target);
          } else {
            setInitialOriginalSelection(anchor);
            return this.handleAnchorClick(null, target);
          }
        }

        if (key === 37 || key === 38) { // Left Arrow/Up Arrow
          e.preventDefault();
          setInitialOriginalSelection();
          if (e.shiftKey) {
            return this.ascend(header);
          }
          return this.prevHeader(header);
        }

        if (key === 39 || key === 40) { // Right Arrow/Down Arrow
          e.preventDefault();
          setInitialOriginalSelection();
          if (e.shiftKey) {
            return this.descend(header);
          }
          return this.nextHeader(header);
        }
      },

      // Makes a header "selected" if its expander button or anchor tag is focused.
      // @param {Object} element - a jQuery Object containing either an expander button or an anchor tag.
      select: function(element) {
        if (!element || !element.length) {
          return;
        }

        // Make sure we select the anchor
        var anchor = element,
          header = anchor.parent();

        if (element.is('.accordion-header')) {
          header = element;
          anchor = header.children('a');
        }

        if (anchor.is('[class^="btn"]')) {
          anchor = element.next('a');
        }

        if (this.isDisabled(header)) {
          return;
        }

        this.headers.removeClass('child-selected').removeClass('is-selected');

        header.addClass('is-selected');

        var items = header.parentsUntil(this.element, '.accordion-pane')
          .prev('.accordion-header');

        items.addClass('child-selected');
      },

      /**
      * Checks if a particular header is disabled, or if the entire accordion is disabled..
      * @param {Object} header &nbsp;-&nbsp; the jquery header element
      * @returns {Boolean}
      */
      isDisabled: function(header) {
        if (this.element.hasClass('is-disabled')) {
          return true;
        }

        if (!header) {
          return false;
        }

        return header.hasClass('is-disabled');
      },

      /**
      * Checks if an Accordion Section is currently expanded
      * @param {Object} header &nbsp;-&nbsp; the jquery header element
      * @returns {Boolean}
      */
      isExpanded: function(header) {
        if (!header || !header.length) {
          return;
        }

        return header.children('a').attr('aria-expanded') === 'true';
      },

      /**
      * Toggle the given Panel on the Accordion between expanded and collapsed
      * @param {Object} header &nbsp;-&nbsp; the jquery header element
      */
      toggle: function(header) {
        if (!header || !header.length || this.isDisabled(header)) {
          return;
        }

        if (this.isExpanded(header)) {
          this.collapse(header);
          return;
        }
        this.expand(header);
      },

      /**
      * Expand the given Panel on the Accordion.
      * @param {Object} header &nbsp;-&nbsp; the jquery header element
      */
      expand: function(header) {
        if (!header || !header.length) {
          return;
        }

        var self = this,
          pane = header.next('.accordion-pane'),
          a = header.children('a');

        var canExpand = this.element.triggerHandler('beforeexpand', [a]);
        if (canExpand === false) {
          return;
        }

        function continueExpand() {
          // Change the expander button into "collapse" mode
          var expander = header.children('.btn');
          if (expander.length) {
            expander.children('.plus-minus, .chevron').addClass('active');
            expander.children('.audible').text(Locale.translate('Collapse'));
          }

          var headerParents = header.parentsUntil(self.element).filter('.accordion-pane').prev('.accordion-header').add(header);

          // If we have the correct settings defined, close other accordion headers that are not parents of this one.
          if (self.settings.allowOnePane) {
            self.headers.not(headerParents).each(function() {
              var h = $(this);
              if (self.isExpanded(h)) {
                self.collapse(h);
              }
            });
          }

          // Expand all headers that are parents of this one, if applicable
          headerParents.not(header).each(function() {
            var h = $(this);
            if (!self.isExpanded(h)) {
              self.expand(h);
            }
          });

          pane.addClass('is-expanded');
          self.element.trigger('expand', [a]);

          pane.one('animateopencomplete', function(e) {
            e.stopPropagation();
            header.children('a').attr('aria-expanded', 'true');
            self.element.trigger('afterexpand', [a]);
          }).css('display', 'block').animateOpen();
        }

        // Load from an external source, if applicable
        if (!this.callSource(a, continueExpand)) {
          continueExpand.apply(this);
        }
      },

      /**
       * Expands all accordion headers, if possible.
       */
      expandAll: function() {
        if (this.settings.allowOnePane === true) {
          return;
        }

        var self = this;
        this.headers.each(function() {
          self.expand($(this));
        });
      },

      /**
       * Collapses all accordion headers.
       */
      collapseAll: function() {
        var self = this;
        this.headers.each(function() {
          self.collapse($(this));
        });
      },

      /**
      * Collapse the given Panel on the Accordion.
      * @param {Object} header &nbsp;-&nbsp; the jquery header element
      */
      collapse: function(header) {
        if (!header || !header.length) {
          return;
        }

        var self = this,
          pane = header.next('.accordion-pane'),
          a = header.children('a');

        var canExpand = this.element.triggerHandler('beforecollapse', [a]);
        if (canExpand === false) {
          return;
        }

        // Change the expander button into "expand" mode
        var expander = header.children('.btn');
        if (expander.length) {
          expander.children('.plus-minus, .chevron').removeClass('active');
          expander.children('.audible').text(Locale.translate('Expand'));
        }

        pane.removeClass('is-expanded').closeChildren();
        a.attr('aria-expanded', 'false');

        self.element.trigger('collapse', [a]);

        pane.one('animateclosedcomplete', function(e) {
          e.stopPropagation();
          pane[0].style.display = 'none';
          self.element.trigger('aftercollapse', [a]);
        }).animateClosed();
      },

      // Uses a function (this.settings.source()) to call out to an external API to fill the
      // inside of an accordion pane.
      callSource: function(anchor, animationCallback) {
        if (!this.settings.source || typeof this.settings.source !== 'function') {
          return false;
        }

        var self = this,
          header = anchor.parent(),
          pane = header.next('.accordion-pane'),
          ui = {
            anchor: anchor,
            header: header,
            pane: pane
          };

        function response() {
          self.updated();
          setTimeout(function() {
            animationCallback.apply(self);
          }, 1);
          return;
        }

        // Trigger the external method and wait for a response.
        return this.settings.source(ui, response);
      },

      // Prepares a handful of references to a specific
      getElements: function(eventTarget) {
        var target = $(eventTarget),
          header, anchor, expander, pane;

        if (target.is('.accordion-header')) {
          header = target;
          expander = target.children('[class^="btn"]');
          anchor = target.children('a');
        }

        if (target.is('.btn')) {
          expander = target;
          header = expander.parent();
          anchor = header.children('a');
        }

        if (target.is('a')) {
          anchor = target;
          header = anchor.parent();
          expander = header.children('.btn');
        }

        pane = header.next('.accordion-pane');

        return {
          header: header,
          expander: expander,
          anchor: anchor,
          pane: pane
        };
      },

      // Selects an adjacent Accordion Header that sits directly before the currently selected Accordion Header.
      // @param {Object} element - a jQuery Object containing either an expander button or an anchor tag.
      // @param {boolean} noDescend - if it's normally possible to descend into a sub-accordion, prevent against descending.
      prevHeader: function(element, noDescend) {
        var elem = this.getElements(element),
          adjacentHeaders = elem.header.parent().children(),
          currentIndex = adjacentHeaders.index(elem.header),
          target = $(adjacentHeaders.get(currentIndex - 1));

        if (!adjacentHeaders.length || currentIndex === 0) {
          if (elem.header.parent('.accordion-pane').length) {
            return this.ascend(elem.header);
          }
          target = adjacentHeaders.last();
        }

        while (target.is('.accordion-content') || this.isDisabled(target)) {
          if (target.is(':only-child') || target.is(':first-child')) {
            return this.ascend(elem.header);
          }
          target = target.prev();
        }

        if (target.is('.accordion-pane')) {
          var prevHeader = target.prev('.accordion-header');
          if (this.isExpanded(prevHeader)) {
            var descendantChildren = prevHeader.next('.accordion-pane').children(':not(.accordion-content)');
            if (descendantChildren.length && !noDescend) {
              return this.descend(prevHeader, -1);
            }
          }
          target = prevHeader;

          // if no target's available here, we've hit the end and need to wrap around
          if (!target.length) {
            if (elem.header.parent('.accordion-pane').length) {
              return this.ascend(elem.header);
            }

            target = adjacentHeaders.last();
            while (target.is('.accordion-content') || this.isDisabled(target)) {
              target = target.prev();
            }
          }
        }

        this.focusOriginalType(target);
      },

      // Selects an adjacent Accordion Header that sits directly after the currently selected Accordion Header.
      // @param {Object} element - a jQuery Object containing either an expander button or an anchor tag.
      // @param {boolean} noDescend - if it's normally possible to descend into a sub-accordion, prevent against descending.
      nextHeader: function(element, noDescend) {
        var elem = this.getElements(element),
          adjacentHeaders = elem.header.parent().children(),
          currentIndex = adjacentHeaders.index(elem.header),
          target = $(adjacentHeaders.get(currentIndex + 1));

        if (!adjacentHeaders.length || currentIndex === adjacentHeaders.length - 1) {
          if (elem.header.parent('.accordion-pane').length) {
            return this.ascend(elem.header, -1);
          }
          target = adjacentHeaders.first();
        }

        while (target.is('.accordion-content') || this.isDisabled(target)) {
          if (target.is(':only-child') || target.is(':last-child')) {
            return this.ascend(elem.header);
          }
          target = target.next();
        }

        if (target.is('.accordion-pane')) {
          var prevHeader = target.prev('.accordion-header');
          if (this.isExpanded(prevHeader)) {
            var descendantChildren = prevHeader.next('.accordion-pane').children(':not(.accordion-content)');
            if (descendantChildren.length && !noDescend) {
              return this.descend(prevHeader);
            }
          }
          target = $(adjacentHeaders.get(currentIndex + 2));

          // if no target's available here, we've hit the end and need to wrap around
          if (!target.length) {
            if (elem.header.parent('.accordion-pane').length) {
              return this.ascend(elem.header, -1);
            }

            target = adjacentHeaders.first();
            while (target.is('.accordion-content') || this.isDisabled(target)) {
              target = target.next();
            }
          }
        }

        this.focusOriginalType(target);
      },

      // Selects the first Accordion Header in the parent container of the current Accordion Pane.
      // If we're at the top level, jump out of the accordion to the last focusable element.
      // @param {Object} header - a jQuery Object containing an Accordion header.
      // @param {integer} direction - if -1, sets the position to be at the end of this set of headers instead of at the beginning.
      ascend: function(header, direction) {
        if (!direction) {
          direction = 0;
        }

        var pane = header.parent('.accordion-pane'),
          target = pane.prev();

        if (direction === -1) {
          target = pane.next('.accordion-header');
          if (!target.length) {
            if (pane.parent('.accordion').length) {
              return this.nextHeader(pane.prev().children('a'), true);
            }

            return this.ascend(pane.prev(), -1);
          }
        }

        this.focusOriginalType(target);
      },

      // Selects the first Accordion Header in the child container of the current Accordion Header.
      // @param {Object} header - a jQuery Object containing an Accordion header.
      // @param {integer} direction - if -1, sets the position to be at the end of this set of headers instead of at the beginning.
      descend: function(header, direction) {
        if (!direction) {
          direction = 0;
        }

        var pane = header.next('.accordion-pane'),
          target = pane.children('.accordion-header').first();

        if (direction === -1) {
          target = pane.children('.accordion-header').last();
        }

        // No headers may be present.  In which case, it may be necessary to simply focus the header for the current pane.
        if (!target.length) {
          return this.focusOriginalType(header);
        }

        if (this.isExpanded(target)) {
          return this.descend(target, -1);
        }

        this.focusOriginalType(target);
      },

      // Selects an Accordion Header, then focuses either an expander button or an anchor.
      // Governed by the property "this.originalSelection".
      // @param {Object} header - a jQuery Object containing an Accordion header.
      focusOriginalType: function(header) {
        //this.select(header.children('a'));

        if (this.originalSelection.is('.btn') && header.children('.btn').length) {
          header.children('.btn').focus();
        } else {
          header.children('a').focus();
        }
      },

      /**
      * Disable an accordion from events
      */
      disable: function() {
        this.element
          .addClass('is-disabled');

        this.anchors.add(this.headers.children('[class^="btn"]')).attr('tabindex', '-1');
      },

      /**
      * Enable a disabled accordion.
      */
      enable: function() {
        this.element
          .removeClass('is-disabled');

        this.anchors.add(this.headers.children('[class^="btn"]')).removeAttr('tabindex');
      },

      updated: function() {
        this.element.data('updating', true);

        var currentFocus = $(document.activeElement);
        if (!$.contains(this.element[0], currentFocus[0])) {
          currentFocus = undefined;
        }

        this
          .teardown()
          .init();

        if (currentFocus && currentFocus.length) {
          currentFocus.focus();
        }

        $.removeData(this.element[0], 'updating');
        return this;
      },

      teardown: function() {
        this.headers
          .off('touchend.accordion click.accordion focusin.accordion focusout.accordion keydown.accordion mousedown.accordion mouseup.accordion')
          .each(function() {
            var expander = $(this).data('addedExpander');
            if (expander) {
              expander.remove();
              $.removeData(this, 'addedExpander');
            }
          });

        this.anchors.off('touchend.accordion keydown.accordion click.accordion');

        this.headers.children('[class^="btn"]')
          .off('touchend.accordion click.accordion keydown.accordion');

        this.element.off('updated.accordion selected.accordion');

        return this;
      },

      /**
      * Teardown and remove any added markup and events.
      */
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      },

      /**
       *  This component fires the following events.
       *
       * @fires Accordion#events
       * @param {Object} selected  &nbsp;-&nbsp; Fires when a panel is opened.
       * @param {Object} followlink  &nbsp;-&nbsp; If the anchor is a real link, follow the link and die here. This indicates the link has been followed.
       * @param {Object} expand  &nbsp;-&nbsp; Fires when expanding a pane is initiated.
       * @param {Object} afterexpand  &nbsp;-&nbsp; Fires after a pane is expanded.
       * @param {Object} collapse  &nbsp;-&nbsp; Fires when collapsed a pane is initiated.
       * @param {Object} aftercollapse  &nbsp;-&nbsp; Fires after a pane is collapsed.
       *
       */
      handleEvents: function() {
        var self = this,
          headerWhereMouseDown = null,
          linkFollowedByTouch = null;

        // Returns "Header", "Anchor", or "Expander" based on the element's tag
        function getElementType(element) {
          var elementType = 'Header';
          if (element.is('a')) {
            elementType = 'Anchor';
          }
          if (element.is('button')) {
            elementType = 'Expander';
          }
          return elementType;
        }

        // Intercepts a 'touchend' event in order to either prevent a link from being followed,
        // or allows it to continue.
        function touchendInterceptor(e, element) {
          linkFollowedByTouch = true;
          var type = getElementType(element),
            result = self['handle' + type + 'Click'](e, element);

          if (!result) {
            e.preventDefault();
          }
          return result;
        }

        // Intercepts a 'click' event in order to either prevent a link from being followed,
        // or allows it to continue.
        function clickInterceptor(e, element) {
          var type = getElementType(element);
          if (linkFollowedByTouch) {
            linkFollowedByTouch = null;
            return false;
          }
          return self['handle' + type + 'Click'](e, element);
        }

        this.headers.on('touchend.accordion', function(e) {
          return touchendInterceptor(e, $(this));
        }).on('click.accordion', function(e) {
          return clickInterceptor(e, $(this));
        }).on('focusin.accordion', function(e) {
          var target = $(e.target);

          if (!self.originalSelection) {
            self.originalSelection = target;
          }

          if (target.is(':not(.btn)')) {
            $(this).addClass('is-focused');
          }
        }).on('focusout.accordion', function() {
          if (!$.contains(this, headerWhereMouseDown) || $(this).is($(headerWhereMouseDown))) {
            $(this).removeClass('is-focused');
          }
        }).on('keydown.accordion', function(e) {
          self.handleKeys(e);
        }).on('mousedown.accordion', function(e) {
          $(this).addClass('is-focused');
          headerWhereMouseDown = e.target;
        }).on('mouseup.accordion', function() {
          headerWhereMouseDown = null;
        });

        this.anchors.on('touchend.accordion', function(e) {
          return touchendInterceptor(e, $(this));
        }).on('click.accordion', function(e) {
          return clickInterceptor(e, $(this));
        });

        this.headers.children('[class^="btn"]')
          .on('touchend.accordion', function(e) {
            return touchendInterceptor(e, $(this));
          })
          .on('click.accordion', function(e) {
            return clickInterceptor(e, $(this));
          }).on('keydown.accordion', function(e) {
            self.handleKeys(e);
          });

        this.element.on('selected.accordion', function(e) {
          // Don't propagate this event above the accordion element
          e.stopPropagation();
        }).on('updated.accordion', function(e) {
          // Don't propagate just in case this is contained by an Application Menu
          e.stopPropagation();
          self.updated();
        });

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
        instance = $.data(this, pluginName, new Accordion(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
