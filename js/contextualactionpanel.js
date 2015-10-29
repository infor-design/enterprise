/**
* Contextual Action Panel Control (TODO: bitly link to soho xi docs)
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

  $.fn.contextualactionpanel = function(options) {

    // Settings and Options
    var pluginName = 'contextualactionpanel',
        defaults = {
          buttons: null, // List of buttons that will sit in the toolbar's Buttonset area
          title: 'Contextual Action Panel', // string that fits into the toolbar's Title field
          content: null, //Pass content through to modal
          trigger: 'click'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function ContextualActionPanel(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    ContextualActionPanel.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        this.panel = this.element.next('.contextual-action-panel');
        this.panel.css('display', 'none');
        this.id = (parseInt($('.modal').length, 10)+1);

        return this;
      },

      build: function() {
        var self = this,
          children;

        // Build the Content
        if (this.panel.length === 0) {
          if (this.settings.content  instanceof jQuery) {
            this.settings.content.wrap('<div class="contextual-action-panel"></div>');
            this.panel = this.settings.content.parent();
            this.panel.addClass('modal').appendTo('body');
            this.settings.content.show();
          } else {
            this.panel = $('<div class="contextual-action-panel">'+ this.settings.content +'</div>').appendTo('body');
            this.panel.addClass('modal').attr('id', 'contextual-action-modal-' + this.id);
          }
        }

        if (this.panel.find('.modal-content').length === 0) {
          children = this.panel.children();
          children.wrapAll('<div class="modal-content"></div>').wrapAll('<div class="modal-body"></div>');
          this.panel.addClass('modal');
        }

        if (this.panel.find('.modal-header').length === 0) {
          this.header = $('<div class="modal-header"></div>');
          this.header.insertBefore(this.panel.find('.modal-body'));

          if (!this.toolbar) {
            this.toolbar = this.panel.find('.toolbar');
          }

          if (!this.toolbar.length) {
            this.toolbar = $('<div class="toolbar"></div>');
          }
          this.toolbar.appendTo(this.header);

          var toolbarTitle = this.toolbar.find('.title');
          if (!toolbarTitle.length) {
            toolbarTitle = $('<div class="title">' + this.settings.title + '</div>');
            this.toolbar.prepend(toolbarTitle);
          }

          var toolbarButtonset = this.toolbar.find('.buttonset');
          if (!toolbarButtonset.length) {
            toolbarButtonset = $('<div class="buttonset"></div>');
            toolbarButtonset.insertAfter(toolbarTitle);
          }
        }

        // Move to the body element to break stacking context issues.
        this.panel.detach().appendTo('body');

        this.element.attr('data-modal', 'contextual-action-modal-' + this.id);
        if (!this.panel.attr('id')) {
          this.panel.attr('id', 'contextual-action-modal-' + this.id);
        }

        this.panel.modal({
          buttons: self.settings.buttons,
          trigger: (self.settings.trigger ? self.settings.trigger : 'click')
        });
        this.buttons = this.panel.find('.buttonset').children('button');
        this.closeButton = this.buttons.filter('.btn-close, [name="close"], .icon-close');

        if (this.toolbar.length) {
          this.toolbar.toolbar();
        }

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.panel.on('afteropen', function() {
          if (self.toolbar) {
            self.toolbar.trigger('recalculateButtons');
          }

          // Select the proper element on the toolbar
          if (self.toolbar.length) {
            var selected = self.toolbar.find('.buttonset > .is-selected');
            if (!selected.length) {
              selected = self.toolbar.find('.buttonset > *:first-child');
              if (selected.is('.searchfield-wrapper')) {
                selected = selected.children('.searchfield');
              }
            }
            self.toolbar.data('toolbar').setActiveButton(selected, true);
          }

          // Focus the first focusable element inside the Contextual Panel's Body
          self.panel.find('.modal-body-wrapper').find(':focusable').first().focus();
        });

        this.toolbar.children('.buttonset').children('.btn-close, [name="close"], .icon-close')
          .onTouchClick('contextualactionpanel').on('click.contextualactionpanel', function() {
          self.handleToolbarSelected();
        });

        return this;
      },

      handleToolbarSelected: function() {
        this.close();
      },

      teardown: function() {
        this.toolbar.children('.buttonset').children('*:not(.searchfield)')
          .offTouchClick('contextualactionpanel').off('click.contextualactionpanel');

        this.panel.detach().insertAfter(this.element);
        this.panel.find('.toolbar').data('toolbar').destroy();
        this.header.remove();

        var children = this.panel.find('.modal-body').children();
        children.first().unwrap().unwrap(); // removes $('.modal-body'), then $('.modal-content')

        this.panel.removeAttr('id').removeClass('modal');
        this.panel.data('modal').destroy().remove();
      },

      close: function() {
        this.panel.data('modal').close();
      },

      disable: function() {
        this.element.prop('disabled', true);
        if (this.panel.hasClass('is-visible')) {
          this.close();
        }
      },

      enable: function() {
        this.element.prop('disabled', false);
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
        if (settings.trigger === 'immediate') {
          instance = $.data(this, pluginName, new ContextualActionPanel(this, settings));
        }

      } else {
        instance = $.data(this, pluginName, new ContextualActionPanel(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
