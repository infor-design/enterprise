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
        defaults = {
          trigger: null,
          bottomBorder: false
        },
        settings = $.extend({}, defaults, options);

    /**
    * The About Dialog Component is displays information regarding the application.
    *
    * @class ExpandableArea
    * @param {String} trigger  Id of some other button to use as a trigger
    * @param {String} bottomBorder  Change the border to bottom vs top (for some cases)
    *
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

        this.header = this.settings.trigger ? this.element : this.element.children('.expandable-header');
        this.footer = this.element.children('.expandable-footer');
        this.content = this.element.children('.expandable-pane');

        this.isCard = this.element.is('.card, .widget');
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

        // Add the link and footer if not there.
        // If we're using an expandable card,
        if (!this.isCard && !this.footer.length && !this.settings.trigger) {
          this.footer =  $('<div class="expandable-footer"></div>').appendTo(this.element);
        }

        function getExpander(instance, useHeaderExpander) {
          var expander;

          if (useHeaderExpander === true) {
            // Use icon-based expander in the header
            expander = instance.header.find('expandable-expander');
            if (!expander.length) {
              expander = $('<a href="#" target="_self" class="btn-expander">' +
                '<svg class="chevron icon" focusable="false" aria-hidden="true" role="presenation">' +
                  '<use xlink:href="' + '#icon-caret-down' + '"></use>' +
                '</svg>' +
                '<span class="audible">'+ Locale.translate('ShowMore') +'</span>' +
              '</a>').appendTo(instance.header);
            }

            return expander;
          }

          // Use the text-based expander button in the footer
          expander = instance.footer.find('.expandable-expander');
          if (!expander.length) {
            expander = $('<a href="#" target="_self" class="expandable-expander hyperlink">' +
              '<span data-translated="true">'+ Locale.translate('ShowMore') +'</span>' +
            '</a>').prependTo(instance.footer);
          }
          return expander;
        }

        this.expander = getExpander(self, this.isCard);
        this.expander.attr('href', '#').hideFocus();

        if (this.expander.length === 0) {
          this.expander = $('#' + this.settings.trigger);
        }

        // Change the borer to the bottom vs top
        if (this.settings.bottomBorder) {
          this.element.addClass('has-bottom-border');
        }

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

      /**
      * Return if the expandable area is current disable or not.
      * @returns {Boolean}
      */
      isDisabled: function() {
        return this.element.hasClass('is-disabled');
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

      /**
       * Indicates whether or not this area is expanded.
       * @returns {boolean}
       */
      isExpanded: function() {
        return this.element.is('.is-expanded');
      },

      /**
       * Toggle Current Expansion State.
       */
      toggleExpanded: function() {
        // if (this.header.attr('aria-expanded') === 'true') {
        if (this.isExpanded()) {
          this.close();
        } else {
          this.open();
        }
      },

      /**
       * Open the pane if closed.
       */
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

        if (this.isCard) {
          this.expander.find('.icon').addClass('active');
        }

        if (this.content[0]) {
          this.content[0].style.display = 'block';
        }
        this.content.one('animateopencomplete', function() {
          self.element.triggerHandler('afterexpand', [self.element]);
        }).animateOpen();
      },

      /**
       * Close the pane if open.
       */
      close: function() {
        var self = this,
        canCollapse = this.element.triggerHandler('beforecollapse', [this.element]);

        if (canCollapse === false) {
          return;
        }

        this.expander.removeClass('active');
        this.element.triggerHandler('collapse', [this.element]);
        this.expander.find('span[data-translated="true"]').text(Locale.translate('ShowMore') ? Locale.translate('ShowMore') : 'Show More');

        if (this.isCard) {
          this.expander.find('.icon').removeClass('active');
        }

        this.content.one('animateclosedcomplete', function() {
          self.element.removeClass('is-expanded');
          self.header.attr('aria-expanded', 'false');
          self.element.triggerHandler('aftercollapse', [self.element]);
          self.content[0].style.display = 'none';
        }).animateClosed();
      },

      /**
       * Disable the Expandable Area from being closable.
       */
      disable: function() {
        this.element.addClass('is-disabled');
      },

      /**
       * Enable the Expandable Area to allow close.
       */
      enable: function() {
        this.element.removeClass('is-disabled');
      },

      /**
       * Teardown - Remove added markup and events
       */
      destroy: function() {
        this.header.children('a').offTouchClick('expandablearea').off();
        this.header.off();
        this.header
          .removeAttr('aria-controls')
          .removeAttr('aria-expanded')
          .removeAttr('id');
        this.content.removeAttr('id').removeClass('no-transition');
        $.removeData(this.element[0], pluginName);
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
