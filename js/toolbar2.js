/**
* Toolbar Control (TODO: bitly link to soho xi docs)
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
  $.fn.toolbar = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'toolbar',
        defaults = {},
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Toolbar2(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Toolbar2.prototype = {

      init: function() {
        this
          .setup()
          .build()
          .handleEvents();
      },

      setup: function() {
        return this;
      },

      build: function() {
        var self = this;
        this.element.attr('role', 'toolbar');

        // keep track of how many popupmenus there are with an ID.
        // Used for managing events that are bound to $(document)
        this.id = (parseInt($('.toolbar, .editor-toolbar').length, 10)+1);

        // Container for main group of buttons and input fields.  Only these spill into the More menu.
        this.buttonset = this.element.children('.buttonset');

        // Reference all interactive items in the toolbar
        this.items = this.buttonset.children('button, input')
          .add(this.element.find('.title').children('button'));

        // Add and invoke More Button, if it doesn't exist
        this.more = this.element.find('.btn-actions');
        if (!this.more.length) {
          var moreContainer = this.element.find('.more');
          if (!moreContainer.length) {
            moreContainer = $('<div class="more"></div>').appendTo(this.element);
          }
          this.more = $('<button class="btn-actions"></button>')
            .html('<svg class="icon" focusable="false"><use xlink:href="#action-button"></svg>' +
              '<span class="audible">'+Locale.translate('MoreActions')+'</span>')
            .appendTo(moreContainer);
        }
        if (!this.more.data('button')) {
          this.more.button();
        }

        // Setup the More Actions Menu.  Add Menu Items for existing buttons/elements in the toolbar, but
        // hide them initially.  They are revealed when overflow checking happens as the menu is opened.
        var popupPlugin = this.more.data('popupmenu');
        this.moreMenu = popupPlugin ? popupPlugin.menu : $('<ul class="popupmenu"></ul>').insertAfter(this.more);

        function menuItemFilter() {
          return $(this).parent('.buttonset').length;
        }

        var menuItems = [];
        function buildMenuItem() {
          var item = $(this),
            popupLi = $('<li></li>'),
            a = $('<a href="#">' + item.text().trim() + '</a>').appendTo(popupLi);

          item.data(item, 'action-button-link', a)
          popupLi.data(popupLi, 'original-button', item);
          menuItems.push(popupLi);
        }

        this.items.filter(menuItemFilter).each(buildMenuItem);
        menuItems.reverse();
        $.each(menuItems, function(i, item) {
          item.prependTo(self.moreMenu);
        });

        if (!popupPlugin) {
          this.more.popupmenu({
            trigger: 'click',
            menu: this.moreMenu
          });
        }

        return this;
      },

      handleEvents: function() {
        var self = this;

        this.more.on('beforeOpen.toolbar', function() {
          self.checkOverflowItems();
        });

        return this;
      },

      // NOTE: Tabs has similar code... not very DRY
      isItemOverflowed: function(item) {
        if (!item || item.length === 0) {
          return true;
        }

        if (this.buttonset.scrollTop() > 0) {
          this.buttonset.scrollTop(0);
        }
        var offset = $(item).offset().top - this.buttonset.offset().top;
        return offset >= this.buttonset.height();
      },

      checkOverflowItems: function() {
        var self = this;
        function menuItemFilter() {
          return $(this).data('action-button-link');
        }

        this.items.filter(menuItemFilter).each(function() {
          var i = $(this),
            li = i.data('action-button-link').parent();

          if (!self.isItemOverflowed()) {
            li.addClass('hidden');
          } else {
            li.removeClass('hidden');
          }
        });
      },

      unbind: function() {
        return this;
      },

      teardown: function() {
        var self = this;

        function menuItemFilter() {
          return $(this).data('action-button-link');
        }

        function deconstructMenuItem() {
          var item = $(this),
            a = item.data('action-button-link'),
            li = a.parent();

          a.off('mousedown.toolbar click.toolbar touchend.toolbar touchcancel.toolbar')
            .removeAttr('onclick').removeAttr('onmousedown');

          $.removeData(li[0], 'original-button');
          $.removeData(a[0], 'action-button-link');
        }

        this.items.filter(menuItemFilter).each(deconstructMenuItem);
        return this;
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this
          .unbind()
          .teardown();
        this.element.removeAttr('role');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
      } else {
        instance = $.data(this, pluginName, new Toolbar2(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
