/**
* Contextual Action Panel Control (TODO: bitly link to soho xi docs)
*/

(function(factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
  }

}(function($) {

  'use strict';

  $.fn.contextualactionpanel = function(options) {

    // Settings and Options
    var pluginName = 'contextualactionpanel',
        defaults = {
          buttons: null, // List of buttons that will sit in the toolbar's Buttonset area
          title: 'Contextual Action Panel', // string that fits into the toolbar's Title field
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
          children,
          toolbar;

        // Build the Content
        if (!this.panel.length) {
          this.panel = $('<div class="contextual-action-panel"></div>');
          $('<div class="modal-content"></div>').appendTo(this.modal);
        }
        this.panel.addClass('modal').attr('id', 'contextual-action-modal-' + this.id);

        if (this.panel.find('.modal-content').length === 0) {
          children = this.panel.children();
          children.wrapAll('<div class="modal-content"></div>').wrapAll('<div class="modal-body"></div>');
        }

        if (this.panel.find('.modal-header').length === 0) {
          this.header = $('<div class="modal-header"></div>');
          this.header.insertBefore(this.panel.find('.modal-body'));

          toolbar = this.panel.find('.toolbar');
          if (!toolbar.length) {
            toolbar = $('<div class="toolbar"></div>');
          }
          toolbar.appendTo(this.header);
          toolbar.append($('<div class="title">' + this.settings.title + '</div>'));
          toolbar.append($('<div class="buttonset"></div>'));
        }

        // Move to the body element to break stacking context issues.
        this.panel.detach().appendTo('body');

        this.element.attr('data-modal', 'contextual-action-modal-' + this.id);
        this.panel.modal({
          buttons: self.settings.buttons
        });
        this.buttons = this.panel.find('.buttonset').children('button');
        this.closeButton = this.buttons.filter('.btn-close, [name="close"]');

        if (toolbar.length) {
          toolbar.toolbar();
        }

        return this;
      },

      handleEvents: function() {
        var self = this;

        if (this.closeButton.length) {
          this.closeButton.on('touchend.contextualactionpanel touchcancel.contextualactionpanel', function(e) {
            e.preventDefault();
            $(e.target).click();
          }).on('click.contextualactionpanel', function() {
            self.close();
          });
        }

        return this;
      },

      deconstruct: function() {
        this.panel.detach().insertAfter(this.element);
        this.panel.find('.toolbar').data('toolbar').destroy();
        this.header.remove();

        var children = this.panel.find('.modal-body').children();
        children.first().unwrap().unwrap(); // removes $('.modal-body'), then $('.modal-content')

        this.panel.removeAttr('id').removeClass('modal');
        this.panel.data('modal').destroy();
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
        if (this.closeButton.length) {
          this.closeButton.off('touchend.contextualactionpanel touchcancel.contextualactionpanel click.contextualactionpanel');
        }

        this.deconstruct();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new ContextualActionPanel(this, settings));
      }
    });
  };
}));
