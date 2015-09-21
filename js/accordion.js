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
    var pluginName = 'pluginName',
        defaults = {
          allowOnePane: true
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
            expander = $('<button class="btn"></button>').insertBefore(header.children('a'));
            $('<span class="icon plus-minus" aria-hidden="true" role="presentation"></span>').appendTo(expander);
          }

          var description = expander.children('.audible');
          if (!description.length) {
            description = $('<span class="audible"></span>').appendTo(expander);
          }
          description.text(Locale.translate('Expand'));

          // Don't allow an SVG and an Expando-Icon to co-exist.  Remove the Expando if there's an icon present.
          if (expander.children('svg').length && expander.children('.plus-minus').length) {
            expander.children('.plus-minus').remove();
          }
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

        return this;
      },

      handleHeaderClick: function(e, header) {
        if (!header || !header.length || header.hasClass('is-disabled') || header.data('is-animating')) {
          return;
        }

        // Check that we aren't clicking the expando button.  If we click that, this listener dies
        if ($(e.target).is('[class^="btn"]')) {
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

        if (!header.length || header.hasClass('is-disabled')) {
          return false;
        }

        // Set the original element for DOM traversal by keyboard
        this.originalSelection = anchor;

        this.select(anchor);

        function followLink() {
          var href = anchor.attr('href');
          if (href && href !== '' && href !== '#') {
            self.element.trigger('selected', [header]);
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

        // If no jQuery event is passed in, simply toggle the header pane and be done.
        if (!e) {
          if (!followLink()) {
            toggleExpander();
          }
          return true;
        }

        // Stop propagation here because we don't want to bubble up to the Header and potentially click the it twice
        e.stopPropagation();

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
        if (!header.length || header.hasClass('is-disabled') || header.data('is-animating')) {
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
          return;
        }

        // If there's no accordion pane, attempt to simply follow the link.
        this.handleAnchorClick(null, header.children('a'));
      },

      handleKeys: function(e) {
        var key = e.which,
          target = $(e.target); // can be an anchor, or expando button

        if (key === 9) { // Tab (also triggered by Shift + Tab)
          if (target.is('a') && target.prev('.btn').length) {
            this.originalSelection = target.prev('.btn');
          } else {
            this.originalSelection = target.next('a');
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

        this.headers.removeClass('child-selected').removeClass('is-selected');

        header.addClass('is-selected')
        .parentsUntil(this.element, '.accordion-pane')
          .prev('.accordion-header')
          .addClass('child-selected');
      },

      // Checks if an Accordion Section is currently expanded
      isExpanded: function(header) {
        if (!header || !header.length) {
          return;
        }

        return header.children('a').attr('aria-expanded') === 'true';
      },

      toggle: function(header) {
        if (!header || !header.length) {
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

        // Change the expander button into "collapse" mode
        var expander = header.children('.btn');
        if (expander.length) {
          expander.children('.plus-minus').addClass('active');
          expander.children('.audible').text(Locale.translate('Collapse'));
        }

        // If we have the correct settings defined, close other accordion headers that are not parents of this one.
        if (this.settings.allowOnePane) {
          var headerParents = header.parentsUntil(this.element).filter('.accordion-pane').prev('.accordion-header').add(header);
          this.headers.not(headerParents).each(function() {
            var h = $(this);
            if (self.isExpanded(h)) {
              self.collapse(h);
            }
          });
        }

        pane.one('animateOpenComplete', function(e) {
          e.stopPropagation();
          a.attr('aria-expanded', 'true');
          a.trigger('expanded');
        }).css('display', 'block').animateOpen();
      },

      collapse: function(header) {
        if (!header || !header.length) {
          return;
        }

        var self = this;

        // Change the expander button into "expand" mode
        var expander = header.children('.btn');
        if (expander.length) {
          expander.children('.plus-minus').removeClass('active');
          expander.children('.audible').text(Locale.translate('Expand'));
        }

        var pane = header.next('.accordion-pane'),
          a = header.children('a');
        a.attr('aria-expanded', 'false');

        pane.one('animateClosedComplete', function(e) {
          e.stopPropagation();
          pane.css('display', 'none');
          self.collapse(pane.children('.accordion-header'));
          a.trigger('collapsed');
        }).animateClosed();
      },

      // Prepares a handful of references to a specific
      getElements: function(eventTarget) {
        var target = $(eventTarget),
          header, anchor, expander, pane;

        if (target.is('.btn')) {
          expander = target;
          anchor = expander.next('a');
        }

        if (target.is('a')) {
          anchor = target;
          expander = anchor.prev('.btn');
        }

        header = anchor.parent();
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
      prevHeader: function(element) {
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

        while (target.is('.accordion-content')) {
          if (target.is(':only-child') || target.is(':first-child')) {
            return this.ascend(elem.header);
          }
          target = target.prev();
        }

        if (target.is('.accordion-pane')) {
          var prevHeader = target.prev('.accordion-header');
          if (this.isExpanded(prevHeader)) {
            var descendantChildren = prevHeader.next('.accordion-pane').children(':not(.accordion-content)');
            if (descendantChildren.length) {
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
            while (target.is('.accordion-content')) {
              target = target.prev();
            }
          }
        }

        this.focusOriginalType(target);
      },

      // Selects an adjacent Accordion Header that sits directly after the currently selected Accordion Header.
      // @param {Object} element - a jQuery Object containing either an expander button or an anchor tag.
      nextHeader: function(element) {
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

        while (target.is('.accordion-content')) {
          if (target.is(':only-child') || target.is(':last-child')) {
            return this.ascend(elem.header);
          }
          target = target.next();
        }

        if (target.is('.accordion-pane')) {
          var prevHeader = target.prev('.accordion-header');
          if (this.isExpanded(prevHeader)) {
            var descendantChildren = prevHeader.next('.accordion-pane').children(':not(.accordion-content)');
            if (descendantChildren.length) {
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
            while (target.is('.accordion-content')) {
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
          if (this.isExpanded(target)) {
            return this.descend(target, -1);
          }
        }

        this.focusOriginalType(target);
      },

      // Selects an Accordion Header, then focuses either an expander button or an anchor.
      // Governed by the property "this.originalSelection".
      // @param {Object} header - a jQuery Object containing an Accordion header.
      focusOriginalType: function(header) {
        this.select(header);

        if (this.originalSelection.is('.btn') && header.children('.btn').length) {
          header.children('.btn').focus();
        } else {
          header.children('a').focus();
        }
      },

      disable: function() {
        this.element
          .addClass('is-disabled');
      },

      enable: function() {
        this.element
          .removeClass('is-disabled');
      },

      updated: function() {
        return this;
      },

      teardown: function() {
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
        instance.settings = $.extend({}, defaults, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Accordion(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
