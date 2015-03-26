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
        defaults = {},
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
        this.anchors = this.element.find('li > a');

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

        this.element.find('li').attr({
          'role': 'tab'
        });

        this.element.find('a + ul').parent().each(function() {
          var header = $(this);
          if (header.hasClass('is-expanded')) {
            header.attr('aria-expanded', 'true');
          } else {
            self.toggleHeader(header, true);
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

      handleSelected: function(e) {
        var target = $(e.target);
        e.preventDefault();
        this.element.trigger('selected', [target]);

        if (target.next('ul').length) {
          this.toggleHeader(target.parent());
        }
      },

      setActiveAnchor: function(anchor) {
        this.anchors.attr({
          'tabindex': '-1',
          'aria-selected': 'false'
        }).parent().removeClass('is-selected');
        anchor.attr({
          'tabindex': '0',
          'aria-selected': 'true'
        }).parent().addClass('is-selected');

        anchor.focus();
      },

      toggleHeader: function(header, forceClosed) {
        if (forceClosed || header.hasClass('is-expanded')) {
          // close
          header.attr('aria-expanded', 'false').removeClass('is-expanded');
          header.children('ul').one('animateClosedComplete', function() {
            $(this).css('display','none');
          }).animateClosed();

        } else {
          // open
          header.attr('aria-expanded', 'true').addClass('is-expanded');
          header.children('ul').css('display','block').animateOpen();
        }
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.anchors.off();
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
