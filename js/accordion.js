/**
* Accordion Control (TODO: bitly link to soho xi docs)
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

  $.fn.accordion = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'accordion',
        defaults = {
          allowOnePane: true,
          displayChevron: true, // Displays a "Chevron" icon that sits off to the right-most side of a top-level accordion header.  Used in place of an Expander (+/-) if enabled.
          source: null
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Accordion(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
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

        // Accordion Headers that have an expandable pane need to have an expando-button added inside of them
        this.headers.each(function addExpander() {
          var header = $(this);

          // Strip newlines
          header.removeHtmlWhitespace()
            .attr('role', 'presentation');

          if (!header.next('.accordion-pane').length) {
            return;
          }

          var expander = header.children('.btn');
          if (!expander.length) {
            expander = $('<button class="btn"></button>');

            var method = 'insertBefore';
            if (self.settings.displayChevron && header.parent().is('.accordion')) {
              header.addClass('has-chevron');
              method = 'insertAfter';
            }
            expander[method](header.children('a'));

            var icon = $('<span class="icon plus-minus" aria-hidden="true" role="presentation"></span>');
            if (self.settings.displayChevron && header.parent().is('.accordion')) {
              icon = $('<svg class="icon chevron" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-caret-down"></use></svg>');
            }
            icon.appendTo(expander);

            header.data('addedExpander', expander);
          }

          // For backwards compatibility:  If an icon is found inside an anchor, bring it up to the level of the header.
          header.children('a').find('svg').detach().insertBefore(header.children('a'));

          // Setup the correct attributes on any icons present
          // Leave alone an SVG Icon that's been pre-defined, but adjust it if necessary.
          // Add a Chevron if the setting is present, along with a top-level header.
          var expanderIcon = expander.children('svg');
          if (expanderIcon.length) {
            expanderIcon.attr({'role': 'presentation', 'aria-hidden': 'true', 'focusable': 'false'});
          } else {
            if (self.settings.displayChevron && header.parent().is('.accordion')) {
              expanderIcon = $('<svg class="icon chevron" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-caret-down"></use></svg>');
              expanderIcon.appendTo(expander);
            }
          }

          // Setup a plus/minus expander icon if no other icon types are present
          var plusMinusIcon = expander.children('span.plus-minus');
          if (plusMinusIcon.length) {
            plusMinusIcon.attr({'role': 'presentation', 'aria-hidden': 'true'});
          } else if (!plusMinusIcon.length && !expanderIcon.length) {
            if ((!self.settings.displayChevron && header.parent().is('.accordion')) || header.parent().is('.accordion-pane')) {
              plusMinusIcon = $('<span class="icon plus-minus" aria-hidden="true" role="presentation"></span>');
              plusMinusIcon.appendTo(expander);
            }
          }

          if (expanderIcon.length) {
            // Don't allow an SVG and an Expando-Icon to co-exist.  Remove the Expando if there's an icon present.
            if (plusMinusIcon.length) {
              expander.children('.plus-minus').remove();
            }

            // Swap the positions of this header's expander button if a Chevron is present, put the header back to normal if it's not.
            if (expanderIcon.is('.chevron')) {
              header.addClass('has-chevron');
              expander.insertAfter(header.children('a'));
            } else {
              header.removeClass('has-chevron');
              expander.insertBefore(header.children('a'));
            }
          }

          // Add an Audible Description to the button
          var description = expander.children('.audible');
          if (!description.length) {
            description = $('<span class="audible"></span>').appendTo(expander);
          }
          description.text(Locale.translate('Expand'));
        });

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
          this.expand(this.headers.filter('.is-selected'));
        }

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.headers.onTouchClick('accordion').on('click.accordion', function(e) {
          self.handleHeaderClick(e, $(this));
        }).on('focusin.accordion', function(e) {
          if (!self.originalSelection) {
            self.originalSelection = $(e.target);
          }

          $(this).addClass('is-focused');
        }).on('focusout.accordion', function() {
          $(this).removeClass('is-focused');
        }).on('keydown.accordion', function(e) {
          self.handleKeys(e);
        });

        this.anchors.on('click.accordion', function(e) {
          return self.handleAnchorClick(e, $(this));
        });

        this.headers.children('[class^="btn"]').onTouchClick('accordion').on('click.accordion', function(e) {
          self.handleExpanderClick(e, $(this));
        }).on('keydown.accordion', function(e) {
          self.handleKeys(e);
        });

        this.element.on('updated.accordion', function() {
          self.updated();
        });

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
        this.handleAnchorClick(e, anchor);
      },

      handleAnchorClick: function(e, anchor) {
        var self = this,
          header = anchor.parent('.accordion-header'),
          pane = header.next('.accordion-pane');

        if (e) {
          e.preventDefault();
        }

        if (!header.length || this.isDisabled(header)) {
          if (e) {
            e.preventDefault();
          }
          return false;
        }

        self.element.trigger('selected', [header]);

        // Set the original element for DOM traversal by keyboard
        this.originalSelection = anchor;

        this.select(anchor);

        function followLink() {
          var href = anchor.attr('href');
          if (href && href !== '' && href !== '#') {
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
        e.stopPropagation();

        var pane = header.next('.accordion-pane');
        if (pane.length) {
          this.toggle(header);
          expander.focus();
          return;
        }

        // If there's no accordion pane, attempt to simply follow the link.
        this.handleAnchorClick(null, header.children('a'));
      },

      handleKeys: function(e) {
        var key = e.which,
          target = $(e.target); // can be an anchor, or expando button

        if (key === 9) { // Tab (also triggered by Shift + Tab)
          if (target.is('a') && target.parent().children('.btn').length) {
            this.originalSelection = target.parent().children('.btn');
          } else {
            this.originalSelection = target.parent().children('a');
          }
        }

        if (key === 37 || key === 38) { // Left Arrow/Up Arrow
          e.preventDefault();
          if (e.shiftKey) {
            return this.ascend(target);
          }
          return this.prevHeader(target);
        }

        if (key === 39 || key === 40) { // Right Arrow/Down Arrow
          e.preventDefault();
          if (e.shiftKey) {
            return this.descend(target);
          }
          return this.nextHeader(target);
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

      // Checks if a particular header is disabled, or if the entire accordion is disabled.
      isDisabled: function(header) {
        if (this.element.hasClass('is-disabled')) {
          return true;
        }

        if (!header) {
          return false;
        }

        return header.hasClass('is-disabled');
      },

      // Checks if an Accordion Section is currently expanded
      isExpanded: function(header) {
        if (!header || !header.length) {
          return;
        }

        return header.children('a').attr('aria-expanded') === 'true';
      },

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
              var h = $(self);
              if (self.isExpanded(h)) {
                self.collapse(h);
              }
            });
          }

          // Expand all headers that are parents of this one, if applicable
          headerParents.not(header).each(function() {
            var h = $(self);
            if (!self.isExpanded(h)) {
              self.expand(h);
            }
          });

          self.element.trigger('expand', [a]);

          pane.one('animateOpenComplete', function(e) {
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

        a.attr('aria-expanded', 'false');

        pane.one('animateClosedComplete', function(e) {
          e.stopPropagation();
          pane.css('display', 'none');
          self.collapse(pane.children('.accordion-header'));
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
        this.select(header.children('a'));

        if (this.originalSelection.is('.btn') && header.children('.btn').length) {
          header.children('.btn').focus();
        } else {
          header.children('a').focus();
        }
      },

      disable: function() {
        this.element
          .addClass('is-disabled');

        this.anchors.add(this.headers.children('[class^="btn"]')).attr('tabindex', '-1');
      },

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
          .offTouchClick('accordion')
          .off('click.accordion focusin.accordion focusout.accordion keydown.accordion')
          .each(function() {
            var expander = $(this).data('addedExpander');
            if (expander) {
              expander.remove();
              $.removeData(this, 'addedExpander');
            }
          });

        this.anchors.off('click.accordion');

        this.headers.children('[class^="btn"]')
          .offTouchClick('accordion')
          .off('click.accordion keydown.accordion');

        this.element.off('updated.accordion');

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
        instance = $.data(this, pluginName, new Accordion(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
