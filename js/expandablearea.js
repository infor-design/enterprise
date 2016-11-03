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

    /**
     * @constructor
     * @param {Object} element
     */
    function ExpandableArea(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
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
        this.footer = this.element.children('.expandable-footer');
        this.content = this.element.children('.expandable-pane');
        return this;
      },

      build: function() {
        var self = this,
          expanded = this.element.hasClass('is-expanded');

        this.header.attr({
          'aria-expanded': '' + expanded,
          'aria-controls': this.id + '-content',
          'id': this.id + '-header'
        });
        this.content.attr({
          'id': this.id + '-content'
        });

        //Add the link and footer if not there.
        if (!this.footer.length) {
          this.footer =  $('<div class="expandable-footer"></div>').appendTo(this.element);
        }

        this.expander = this.footer.find('.expandable-expander');
        if (!this.expander.length) {
          this.expander = $('<a href="#" target="_self" class="expandable-expander hyperlink"><span data-translated="true">'+ Locale.translate('ShowMore') +'</span></a>').prependTo(this.footer);
        }

        this.expander.attr('href', '#').hideFocus();

        //Initialized in expanded mode.
        if (expanded) {
          this.content.addClass('no-transition');
          this.element.one('afterexpand.expandable-area', function() {
            self.content.removeClass('no-transition');
          });
          this.open();
        }

        if (!expanded) {
          this.content.addClass('no-transition');
          this.element.one('aftercollapse.expandable-area', function() {
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
        this.expander.onTouchClick('expandablearea').on('click.expandablearea', function(e) {
          if (!self.isDisabled()) {
            e.preventDefault();
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
        // if (this.header.attr('aria-expanded') === 'true') {
        if (this.element.is('.is-expanded')) {
          this.close();
        } else {
          this.open();
        }
      },

      open: function() {
        var self = this,
        canExpand = this.element.triggerHandler('beforeexpand', [this.element]);

        if (canExpand === false) {
          return;
        }

        this.element.addClass('is-expanded');
        this.header.attr('aria-expanded', 'true');
        this.expander.addClass('active');
        this.element.triggerHandler('expand', [this.element]);

        this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowLess') ? Locale.translate('ShowLess') : 'Show Less');

        this.content.css('display','block').one('animateopencomplete', function() {
          self.element.triggerHandler('afterexpand', [self.element]);
        }).animateOpen();
      },

      close: function() {
        var self = this,
        canCollapse = this.element.triggerHandler('beforecollapse', [this.element]);

        if (canCollapse === false) {
          return;
        }

        this.expander.removeClass('active');
        this.element.triggerHandler('collapse', [this.element]);
        this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowMore') ? Locale.translate('ShowMore') : 'Show More');

        this.content.one('animateclosedcomplete', function() {
          self.element.removeClass('is-expanded');
          self.header.attr('aria-expanded', 'false');
          self.element.triggerHandler('aftercollapse', [self.element]);
          self.content.css('display', 'none');
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
          .removeAttr('id');
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
