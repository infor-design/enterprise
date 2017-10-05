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
          id: 'contextual-action-modal-' + (parseInt($('.modal').length, 10)+1),
          buttons: null, // List of buttons that will sit in the toolbar's Buttonset area
          title: 'Contextual Action Panel', // string that fits into the toolbar's Title field
          content: null, //Pass content through to modal
          initializeContent: true, // initialize content before opening
          trigger: 'click'
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function ContextualActionPanel(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
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
        if (this.panel[0]) {
          this.panel[0].style.display = 'none';
        }
        this.panel.addClass('is-animating');
        return this;
      },

      build: function() {
        var self = this;

        // Build the Content
        if (this.panel.length === 0) {
          if (this.settings.content  instanceof jQuery) {

            if (this.settings.content.is('.contextual-action-panel')) {
              this.panel = this.settings.content;
            } else {
              this.settings.content.wrap('<div class="contextual-action-panel"></div>');
              this.panel = this.settings.content.parent();
            }

            this.panel.addClass('modal').appendTo('body');

            if (this.settings.content.is('iframe')) {
              this.settings.content.ready(function () {
                self.completeBuild();
                self.settings.content.show();
              });
              return self;
            }
            this.settings.content.show();

          } else {
            this.panel = $('<div class="contextual-action-panel">'+ this.settings.content +'</div>').appendTo('body');
            this.panel.addClass('modal').attr('id', this.settings.id);
          }

        }

        this.completeBuild();
        return this;
      },

      completeBuild: function() {
        var self = this,
          children,
          isIframe = false,
          contents;

        this.panel.find('svg').icon();

        if (this.panel.find('.modal-content').length === 0) {
          children = this.panel.children();
          if (children.is('iframe')) {
            contents = children.contents();
            this.toolbar = contents.find('.toolbar');
            isIframe = true;
          }

          if (!isIframe) {
            children.wrapAll('<div class="modal-content"></div>').wrapAll('<div class="modal-body"></div>');
            this.panel.addClass('modal');
          }
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
		  
		      this.toolbar.searchField = this.toolbar.find('.searchfield');
		  
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
        if (!isIframe) {
          this.panel.detach().appendTo('body');
        }

        this.element.attr('data-modal', this.settings.id);
        if (!this.panel.attr('id')) {
          this.panel.attr('id', this.settings.id);
        }

        this.panel.modal({
          buttons: self.settings.buttons,
          trigger: (self.settings.trigger ? self.settings.trigger : 'click')
        });

        this.buttons = this.panel.find('.buttonset').children('button');
        this.closeButton = this.buttons.filter('.btn-close, [name="close"], .icon-close');

        if (!this.toolbar) {
          this.toolbar = this.panel.find('.toolbar');
        }

        if (this.toolbar.length) {
          this.toolbar.toolbar();
        }

        Soho.utils.fixSVGIcons(this.element);
        return this;
      },

      handleEvents: function() {
        var self = this;

        // Convenience method that takes an event from the Modal control's panel element,
        // and triggers any listeners that may be looking at the Contextual Action Panel's trigger instead.
        function passEvent(e) {
          self.element.triggerHandler(e.type);
        }

        this.panel.addClass('is-animating').on('open.contextualactionpanel', function(e) {
          passEvent(e);
          self.panel.removeClass('is-animating');
        }).on('beforeclose.contextualactionpanel', function() {
          self.panel.addClass('is-animating');
        }).on('close.contextualactionpanel', function(e) {
          passEvent(e);
        }).on('beforeopen.contextualactionpanel', function(e) {
          if (self.settings.initializeContent) {
            $(this).initialize();
          }
          passEvent(e);
        }).on('afteropen.contextualactionpanel', function() {
          if (self.toolbar) {
            self.toolbar.trigger('recalculate-buttons');
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
          Soho.utils.fixSVGIcons(self.panel);
        }).on('click.contextualactionpanel', function() {
          if (self.ctrlPressed) {
            var searchfield = self.toolbar.find('.searchfield');
            if (searchfield.length) {
              searchfield[0].select();
            }
            self.ctrlPressed = false;
          }
        }).on('keydown.contextualactionpanel', function(event) {
          if (event.key === 'Control') {
            self.ctrlPressed = true;
          }
        }).on('beforedestroy.contextualactionpanel', function() {
          self.teardown();
        });

        if (this.toolbar)  {
          this.toolbar.children('.buttonset').children('.btn-close, [name="close"], .icon-close')
            .onTouchClick('contextualactionpanel').on('click.contextualactionpanel', function() {
            self.handleToolbarSelected();
          });
		  
          this.ctrlPressed = false;
          this.toolbar.searchField.on('keydown.contextualactionpanel');
          this.toolbar.searchField.on('click.contextualactionpanel');
        }

        return this;
      },

      handleToolbarSelected: function() {
        this.close();
      },

      teardown: function() {
        var self = this,
          buttonset = self.toolbar.children('.buttonset');

        this.panel.off('open.contextualactionpanel close.contextualactionpanel ' +
          'beforeopen.contextualactionpanel afterclose.contextualactionpanel');

        buttonset.children('*:not(.searchfield)')
          .offTouchClick('contextualactionpanel').off('click.contextualactionpanel');

        var menuButtons = buttonset.children('.btn-menu');
        menuButtons.each(function() {
          var popup = $(this).data('popupmenu');
          if (popup) {
            popup.destroy();
          }
        });

        //self.panel.detach().insertAfter(self.element);
        var toolbar = self.toolbar.data('toolbar');
        this.toolbar.searchField.off('keydown.contextualactionpanel');
        this.toolbar.searchField.off('click.contextualactionpanel');

        if (toolbar) {
          toolbar.destroy();
        }

        if (self.header){
          self.header.remove();
        }

        var children = self.panel.find('.modal-body').children();
        children.first().unwrap().unwrap(); // removes $('.modal-body'), then $('.modal-content')

        self.element.removeAttr('data-modal');

        // Trigger an afterclose event on the Contextual Action Panel's trigger element (different from the panel, which is already removed).
        self.element.trigger('afterteardown');
      },

      close: function() {
        var destroy;
        if (this.settings.trigger === 'immediate') {
          destroy = true;
        }
        if (this.panel.data('modal')) {
          this.panel.data('modal').close(destroy);
        }
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
        this.panel.data('modal').destroy();
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
