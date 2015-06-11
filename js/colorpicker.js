/**
* Color Picker Control (TODO: bitly link to docs)
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

  $.fn.colorpicker = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'colorpicker',
        defaults = {
          colors: [{label: 'Azure', value: '368AC0'},
                   {label: 'Amber', value: 'EFA836'},
                   {label: 'Amethyst', value: '9279A6'},
                   {label: 'Turquoise', value: '579E95'},
                   {label: 'Ruby', value: 'B94E4E'},
                   {label: 'Emerald', value: '76B051'},
                   {label: 'Graphite', value: '5C5C5C'},
                   {label: 'Slate', value: '50535A'}]
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
       this.build();
       this.handleEvents();
      },

      // Add the extra markup
      build: function() {
        var colorpicker = this.element,
          initialValue = this.element.val();

        //Add Button
        this.swatch = $('<span class="swatch"></span>');
        this.icon = $('<svg class="icon" focusable="false" aria-hidden="true"><use xlink:href="#icon-arrow-down"/></svg>').appendTo(this.swatch);
        this.container = $('<div class="colorpicker-container"></div>');
        colorpicker.wrap(this.container);
        colorpicker.after(this.swatch);

        //Add Masking to show the #
        colorpicker.attr('data-mask', '*******').mask();

        if (initialValue.substr(0,1) !== '#') {
          initialValue = '#' + initialValue;
          this.element.val(initialValue);
        }

        if (initialValue.length === 7) {
          this.setColor(initialValue);
          this.element.val(initialValue);
        }

         if (this.element.is(':disabled')) {
          this.disable();
        }

        this.addAria();
      },

      // Add/Update Aria
      addAria: function () {
        this.element.attr('aria-haspopup', true);
        $('label[for="'+ this.element.attr('id') + '"]')
          .append('<span class="audible">' + Locale.translate('UseArrow') + '</span>');
      },

      // Attach Control Events
      handleEvents: function () {
        var self = this;
        this.swatch.on('click.colorpicker', function () {
          self.toggleList();
        });

        this.element.on('focus.colorpicker', function () {
          $(this).parent().addClass('is-focused');
        })
        .on('blur.colorpicker', function () {
          $(this).parent().removeClass('is-focused');
        });

        this.element.on('keypress.colorpicker', function () {
          var input = $(this),
            val = input.val();

          // Make sure there is always a hash
          if (val.substr(0,1) !== '#') {
            input.val('#'+val);
          }

          if (val.length === 7) {
            self.setColor(val);
          }

        });

        //Handle Key Down to open
        this.element.on('keydown.colorpicker', function (e) {
          if (e.keyCode === 38 || e.keyCode === 40) {
            self.toggleList();
          }
        });
      },

      // Toggle / Open the List
      toggleList: function () {
        var self = this;
        if (self.element.is(':disabled')) {
          return;
        }

        //Append Color Menu
        self.updateColorMenu();

        // Show Menu
        self.swatch.popupmenu({trigger: 'immediate', ariaListbox: true, menuId: 'colorpicker-menu'})
        .on('open.colorpicker', function () {
          self.element.parent().addClass('is-open');
        })
        .on('close.colorpicker', function () {
          $('#colorpicker-menu').parent('.popupmenu-wrapper').remove();
          self.element.parent().removeClass('is-open');
          self.element.focus();
        })
        .on('selected.colorpicker', function (e, item) {
          self.element.val('#'+item.data('value'));
          self.swatch.css('background-color', '#' + item.data('value'));
          self.element.focus();
        });
      },

      // Set the Visible Color
      setColor: function (hex, text) {
        this.swatch.css('background-color', hex);
        this.element.attr('aria-describedby', text);
      },

      // Refresh and Append the Color Menu
      updateColorMenu: function () {
        var menu = $('<ul id="colorpicker-menu" class="popupmenu colorpicker"></ul>');
        for (var i = 0; i < settings.colors.length; i++) {
          var li = $('<li></li>'),
              a = $('<a href="#"><span class="swatch"></span></a>').appendTo(li);

          a.attr('title', Locale.translate(settings.colors[i].label) + ' #' + settings.colors[i].value );
          a.find('.swatch').css('background-color', '#' + settings.colors[i].value);
          a.data('label', Locale.translate(settings.colors[i].label));
          a.data('value', settings.colors[i].value);
          a.tooltip({placement: 'right'});
          menu.append(li);
        }

        $('body').append(menu);
      },

      enable: function() {
        this.element.prop('disabled', false);
        this.element.parent().removeClass('is-disabled');
      },

      disable: function() {
        this.element.prop('disabled', true);
        this.element.parent().addClass('is-disabled');
      },

      isDisabled: function() {
        return this.element.prop('disabled');
      },

      // Teardown
      destroy: function() {
        this.swatch.remove();
        this.element.off('keypress.colorpicker');
        this.swatch.on('click.colorpicker');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
