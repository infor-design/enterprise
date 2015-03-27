/**
* Accordion Control (TODO: bitly link to soho xi docs)
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

  $.fn.accordion = function(options) {

    // Settings and Options
    var pluginName = 'accordion',
        defaults = {
          allowOnePane: false // If true, only allows one pane open at a time
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
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        var allowOnePane = this.element.attr('data-allow-one-pane');
        this.settings.allowOnePane = allowOnePane !== undefined ? allowOnePane === 'true' : this.settings.allowOnePane;

        this.anchors = this.element.find('.accordion-header > a');
        this.headers = this.element.find('.accordion-header').filter(function() {
          return $(this).children('.accordion-pane').length > 0;
        });

        var active = this.anchors.filter('.is-selected');
        if (!active.length) {
          active = this.anchors.filter(':not(:disabled):not(:hidden)').first();
        }
        this.setActiveAnchor(active);

        return this;
      },

      build: function() {
        var self = this;
        this.element.attr({
          'role': 'tablist',
          'aria-multiselectable': 'true'
        }).find('ul').attr({
          'role': 'tablist',
          'aria-multiselectable': 'true'
        });

        this.element.find('.accordion-header').attr({
          'role': 'tab'
        });

        this.element.find('a + .accordion-pane').parent().each(function() {
          var header = $(this);
          if (header.hasClass('is-expanded')) {
            header.attr('aria-expanded', 'true');
            self.openHeader(header);
          } else {
            self.closeHeader(header);
          }
        });

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.anchors.on('touchend.accordion touchcancel.accordion', function(e) {
          e.preventDefault();
          $(e.target).click();
        }).on('click.accordion', function(e) {
          self.setActiveAnchor($(e.target));
          self.handleSelected(e);
        }).on('keydown.accordion', function(e) {
          self.handleKeydown(e);
        }).on('focus.accordion', function() {
          $(this).parent().addClass('is-focused');
        }).on('blur.accordion', function() {
          $(this).parent().removeClass('is-focused');
        });

        return this;
      },

      handleKeydown: function(e) {
        var key = e.which,
          anchors = this.anchors.filter(':not(:disabled):not(:hidden)'),
          selected = this.element.find('.is-selected').children('a'),
          next, prev;

        if (!selected.length) {
          selected = anchors.first();
        }

        // NOTE: Enter is handled by the anchor's default implementation

        if (key === 32) { // Spacebar
          this.handleSelected(selected);
          return false;
        }

        if (key === 38) { // Up
          e.preventDefault();
          prev = anchors.eq(anchors.index(selected) - 1);
          if (!prev.length) {
            prev = anchors.last();
          }
          this.setActiveAnchor(prev);
          return false;
        }

        if (key === 40) { // Down
          e.preventDefault();
          next = anchors.eq(anchors.index(selected) + 1);
          if (!next.length) {
            next = anchors.first();
          }
          this.setActiveAnchor(next);
        }
      },

      // NOTE: "e" is either an event or a jQuery object
      handleSelected: function(e) {
        var isEvent = e !== undefined && e.type !== undefined,
          target = isEvent ? $(e.target) : e;

        if (isEvent) {
          e.preventDefault();
        }

        this.element.trigger('selected', [target]);

        if (target.next('.accordion-pane').length) {
          this.toggleHeader(target.parent());
        }
      },

      setActiveAnchor: function(anchor) {
        this.headers.removeClass('child-selected');

        this.anchors.attr({
          'tabindex': '-1',
          'aria-selected': 'false'
        }).parent().removeClass('is-selected');
        anchor.attr({
          'tabindex': '0',
          'aria-selected': 'true'
        })
        .parent()
          .addClass('is-selected')
        .parentsUntil(this.element, '.accordion-header')
          .addClass('child-selected');

        anchor.focus();
      },

      toggleHeader: function(header, forceClosed) {
        if (forceClosed || header.hasClass('is-expanded')) {
          this.closeHeader(header);
        } else {
          this.openHeader(header);
        }
      },

      openHeader: function(header) {
        var self = this;

        if (this.settings.allowOnePane) {
          this.headers.not(header).filter(function() {
            return header.parentsUntil(this.element).filter($(this)).length === 0;
          }).each(function() {
            if ($(this).hasClass('is-expanded')) {
              self.closeHeader($(this));
            }
          });
        }
        header.attr('aria-expanded', 'true').addClass('is-expanded');
        header.children('.accordion-pane').css('display','block').animateOpen();
      },

      closeHeader: function(header) {
        header.attr('aria-expanded', 'false').removeClass('is-expanded');
        header.children('.accordion-pane').one('animateClosedComplete', function(e) {
          e.stopPropagation();
          $(this).css('display','none');
        }).animateClosed();
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.anchors.parent()
          .removeClass('is-focused')
          .removeClass('is-selected')
          .removeClass('is-expanded')
          .removeAttr('aria-expanded')
          .removeAttr('role');
        this.anchors
          .removeAttr('tabindex')
          .removeAttr('aria-selected')
          .off('touchend.accordion touchcancel.accordion click.accordion keydown.accordion focus.accordion blur.accordion');
        this.element.removeAttr('role').removeAttr('aria-multiselectable');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new Accordion(this, settings));
      }
    });
  };
}));
