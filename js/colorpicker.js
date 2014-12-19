/**
* Color Picker Control (TODO: bitly link to docs)
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

  $.fn.colorpicker = function(options) {

    // Settings and Options
    var pluginName = 'colorpicker',
        defaults = {  //TODO: Localize
          colors: [{label: 'Azure', value: '0896e9'},
                   {label: 'Amber', value: 'ffa800'},
                   {label: 'Turquoise', value: '00c2b4'},
                   {label: 'Amethyst', value: 'a352cc'},
                   {label: 'Emerald', value: '2db329'},
                   {label: 'Ruby', value: 'ed1c24'},
                   {label: 'Tourmaline', value: 'e63262'},
                   {label: 'Graphite', value: '737373'}]
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
        this.icon = $('<svg class="icon"><use xlink:href="#icon-dropdown"/></svg>').appendTo(this.swatch);
        colorpicker.parent().append(this.swatch);

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

        this.addAria();
      },

      // Add/Update Aria
      addAria: function () {
        this.element.attr('aria-haspopup', true);

        //TODO: Test
        $('label[for="'+ this.element.attr('id') + '"]')
          .append('<span class="audible">' + Locale.translate('UseArrowColor') + '</span>');
      },

      // Attach Control Events
      handleEvents: function () {
        var self = this;
        this.swatch.on('click.colorpicker', function () {
          self.toggleList();
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
        self.swatch.popupmenu({trigger: 'immediate', menuId: 'colorpicker-menu'})
        .on('beforeOpen.colorpicker', function () {
          self.element.addClass('is-open');
        })
        .on('close.colorpicker', function () {
          $('#colorpicker-menu').parent('.popupmenu-wrapper').remove();
          self.element.removeClass('is-open');
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

          a.attr('title', settings.colors[i].label + ' #' + settings.colors[i].value );
          a.find('.swatch').css('background-color', '#' + settings.colors[i].value);
          a.data('label', settings.colors[i].label);
          a.data('value', settings.colors[i].value);
          a.tooltip({placement: 'right'});
          menu.append(li);
        }

        $('body').append(menu);
      },

      enable: function() {
        this.element.prop('disabled', false);
      },

      disable: function() {
        this.element.prop('disabled', true);
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
}));
