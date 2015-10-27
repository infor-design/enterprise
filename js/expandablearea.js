/**
* Expandable Area Control (TODO: bitly link to soho xi docs)
*/

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

  $.fn.expandablearea = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'expandablearea',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ExpandableArea(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    ExpandableArea.prototype = {
      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        var id;
        this.id = id = this.element.attr('id');
        if (!id || id === undefined) {
          this.id = id = 'expandable-area-' + $('body').find('.expandable-area').index(this.element);
        }

        this.header = this.element.children('.expandable-header');
        this.content = this.element.children('.expandable-pane');
        return this;
      },

      build: function() {
        var self = this,
          expanded = this.element.hasClass('is-expanded');
        this.header.attr({
          'aria-expanded': '' + expanded,
          'aria-controls': this.id + '-content',
          'id': this.id + '-header',
          'tabindex': '0'
        });
        this.content.attr({
          'id': this.id + '-content'
        });

        this.expandedIcon = this.header.children('a').find('.icon.plus-minus');
        if (!this.expandedIcon.length) {
          this.expandedIcon = $('<span class="icon plus-minus"></span>').prependTo(this.header.children('a'));
        }

        //Initialized in expanded mode.
        if (expanded) {
          this.content.addClass('no-transition');
          this.element.one('open-expandablearea', function() {
            self.content.removeClass('no-transition');
          });
          this.open();
        }

        if (!expanded) {
          this.content.addClass('no-transition');
          this.element.one('close-expandablearea', function() {
            self.content.removeClass('no-transition');
          });
          this.close();
        }

        return this;
      },

      isDisabled: function() {
        return this.element.hasClass('is-disabled');
      },

      handleEvents: function() {
        var self = this;
        this.header.children('a').onTouchClick('expandablearea').on('click.expandablearea', function() {
          if (!self.isDisabled()) {
            self.toggleExpanded();
          }
        });

        this.header.on('keydown.expandablearea', function(e) {
          self.handleKeys(e);
        }).on('focus.expandablearea', function(e) {
          self.handleFocus(e);
        }).on('blur.expandablearea', function(e) {
          self.handleBlur(e);
        });

        return this;
      },

      handleKeys: function(e) {
        if (this.isDisabled()) {
          return;
        }

        var key = e.which;

        if (key === 13 || key === 32) { // Enter/Spacebar
          e.preventDefault();
          this.toggleExpanded();
          return false;
        }
      },

      handleFocus: function() {
        if (this.isDisabled()) {
          return;
        }

        this.header.addClass('is-focused');
      },

      handleBlur: function() {
        if (this.isDisabled()) {
          return;
        }

        this.header.removeClass('is-focused');
      },

      toggleExpanded: function() {
        if (this.header.attr('aria-expanded') === 'true') {
          this.close();
        } else {
          this.open();
        }
      },

      open: function() {
        var self = this;
        this.element.addClass('is-expanded');
        this.header.attr('aria-expanded', 'true');
        this.expandedIcon.addClass('active');
        this.content.css('display','block').one('animateopencomplete', function() {
          self.element.trigger('open-expandablearea');
        }).animateOpen();
      },

      close: function() {
        var self = this;
        this.expandedIcon.removeClass('active');
        this.content.one('animateclosedcomplete', function() {
          self.element.removeClass('is-expanded');
          self.header.attr('aria-expanded', 'false');
          self.element.trigger('close-expandablearea');
        }).animateClosed();
      },

      disable: function() {
        this.element.addClass('is-disabled');
      },

      enable: function() {
        this.element.removeClass('is-disabled');
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.header.children('a').offTouchClick('expandablearea').off();
        this.header.off();
        this.header
          .removeAttr('aria-controls')
          .removeAttr('aria-expanded')
          .removeAttr('id')
          .removeAttr('tabindex');
        this.content.removeAttr('id').removeClass('no-transition');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new ExpandableArea(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
