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

          // Theme key: MUST match with theme file name (ie: [filename: 'light-theme.css' -> 'light-theme'])

          // BORDERS
          // Use (,) commas to separate themes or single entry for border as:
          // colors[{label: 'Slate', number: '01', value: 'F0F0F0', border: 'light-theme, high-contrast-theme'}]
          // and assign which swatch theborder should apply ['all' or 'matched-only']
          // themes: { 'high-contrast-theme': {'border': 'all'} }

          // CHECKMARKS
          // checkmark: {'one': [1, 2], 'two': [3, 10]}
          // will add class as "checkmark-{key}", where current colors number is in range [{value[0]} to {value[1]}]
          // will add class "checkmark-one", where current colors number is in range [1 to 3]
          // and will add class "checkmark-two", where current colors number is in range [3 to 10]
          themes: {
            'light': {'border': 'matched-only', checkmark: {'one': [1, 2], 'two': [3, 10]} },
            'dark': {'border': 'matched-only', checkmark: {'one': [1, 2], 'two': [3, 10]} },
            'high-contrast': {'border': 'all', checkmark: {'one': [1, 3], 'two': [4, 10]} }
          },
          colors: [
            {label: 'Slate', number: '10', value: '1a1a1a'},
            {label: 'Slate', number: '09', value: '292929'},
            {label: 'Slate', number: '08', value: '383838', border: 'dark'},
            {label: 'Slate', number: '07', value: '454545', border: 'dark'},
            {label: 'Slate', number: '06', value: '5C5C5C'},
            {label: 'Slate', number: '05', value: '737373'},
            {label: 'Slate', number: '04', value: '999999'},
            {label: 'Slate', number: '03', value: 'BDBDBD'},
            {label: 'Slate', number: '02', value: 'D8D8D8'},
            {label: 'Slate', number: '01', value: 'F0F0F0', border: 'light, high-contrast'},
            {label: 'Amber', number: '10', value: 'D66221'},
            {label: 'Amber', number: '09', value: 'DE7223'},
            {label: 'Amber', number: '08', value: 'E68425'},
            {label: 'Amber', number: '07', value: 'EB9728'},
            {label: 'Amber', number: '06', value: 'EFAA30'},
            {label: 'Amber', number: '05', value: 'F2BC41'},
            {label: 'Amber', number: '04', value: 'F4C951'},
            {label: 'Amber', number: '03', value: 'F7D475'},
            {label: 'Amber', number: '02', value: 'F8E09C'},
            {label: 'Amber', number: '01', value: 'FBE9BF'},
            {label: 'Ruby', number: '10', value: '880E0E'},
            {label: 'Ruby', number: '09', value: '941E1E'},
            {label: 'Ruby', number: '08', value: 'A13030'},
            {label: 'Ruby', number: '07', value: 'AD4242'},
            {label: 'Ruby', number: '06', value: 'B94E4E'},
            {label: 'Ruby', number: '05', value: 'C65F5F'},
            {label: 'Ruby', number: '04', value: 'D26D6D'},
            {label: 'Ruby', number: '03', value: 'DE8181'},
            {label: 'Ruby', number: '02', value: 'EB9D9D'},
            {label: 'Ruby', number: '01', value: 'F4BCBC'},
            {label: 'Turquoise', number: '10', value: '0E5B52'},
            {label: 'Turquoise', number: '09', value: '206B62'},
            {label: 'Turquoise', number: '08', value: '317C73'},
            {label: 'Turquoise', number: '07', value: '448D83'},
            {label: 'Turquoise', number: '06', value: '579E95'},
            {label: 'Turquoise', number: '05', value: '69ADA3'},
            {label: 'Turquoise', number: '04', value: '7BBFB5'},
            {label: 'Turquoise', number: '03', value: '8ED1C6'},
            {label: 'Turquoise', number: '02', value: 'A9E1D6'},
            {label: 'Turquoise', number: '01', value: 'C0EDE3'},
            {label: 'Emerald', number: '10', value: '397514'},
            {label: 'Emerald', number: '09', value: '44831F'},
            {label: 'Emerald', number: '08', value: '56932E'},
            {label: 'Emerald', number: '07', value: '66A140'},
            {label: 'Emerald', number: '06', value: '76B051'},
            {label: 'Emerald', number: '05', value: '89BF65'},
            {label: 'Emerald', number: '04', value: '9CCE7C'},
            {label: 'Emerald', number: '03', value: 'AFDC91'},
            {label: 'Emerald', number: '02', value: 'C3E8AC'},
            {label: 'Emerald', number: '01', value: 'D5F6C0'},
            {label: 'Amethyst', number: '10', value: '4B2A5E'},
            {label: 'Amethyst', number: '09', value: '5A3A6F'},
            {label: 'Amethyst', number: '08', value: '6C4B81'},
            {label: 'Amethyst', number: '07', value: '7D5F92'},
            {label: 'Amethyst', number: '06', value: '8E72A4'},
            {label: 'Amethyst', number: '05', value: 'A189B8'},
            {label: 'Amethyst', number: '04', value: 'B59ECA'},
            {label: 'Amethyst', number: '03', value: 'C7B4DB'},
            {label: 'Amethyst', number: '02', value: 'DACCEC'},
            {label: 'Amethyst', number: '01', value: 'EDE3FC'},
            {label: 'Azure', number: '10', value: '133C59'},
            {label: 'Azure', number: '09', value: '134D71'},
            {label: 'Azure', number: '08', value: '1D5F8A'},
            {label: 'Azure', number: '07', value: '2876A8'},
            {label: 'Azure', number: '06', value: '368AC0'},
            {label: 'Azure', number: '05', value: '4EA0D1'},
            {label: 'Azure', number: '04', value: '69B5DD'},
            {label: 'Azure', number: '03', value: '8DC9E6'},
            {label: 'Azure', number: '02', value: 'ADD8EB'},
            {label: 'Azure', number: '01', value: 'CBEBF4'}
          ],
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function ColorPicker(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    ColorPicker.prototype = {

      init: function() {
        this.inlineLabel = this.element.closest('label');
        this.inlineLabelText = this.inlineLabel.find('.label-text');
        this.isInlineLabel = this.element.parent().is('.inline');
        this.build();
        this.handleEvents();
      },

      // Add the extra markup
      build: function() {
        var colorpicker = this.element,
          initialValue = this.element.val();

        //Add Button
        if (this.isInlineLabel) {
          this.inlineLabel.addClass('colorpicker-container');
        }
        else {
          this.container = $('<span class="colorpicker-container"></span>');
          colorpicker.wrap(this.container);
        }

        this.container = colorpicker.parent();
        this.swatch = $('<span class="swatch"></span>').prependTo(this.container);
        this.icon = $.createIconElement('dropdown').appendTo(this.container);
        this.icon.wrap('<span class="trigger"></span>');

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
        this.element.attr('role', 'combobox').attr('aria-autocomplete', 'list');

        $('label[for="'+ this.element.attr('id') + '"]')
          .append('<span class="audible">' + Locale.translate('UseArrow') + '</span>');
      },

      // Attach Control Events
      handleEvents: function () {
        var self = this;
        this.icon.parent().onTouchClick().on('click.colorpicker', function () {
          self.toggleList();
        });

        this.element.on('focus.colorpicker', function () {
          $(this).parent().addClass('is-focused');
        })
        .on('blur.colorpicker', function () {
          $(this).parent().removeClass('is-focused');
        });

        this.element.on('keypress.colorpicker', function () {
          self.setColor($(this).val());
        }).on('change.colorpicker', function () {
          self.setColor($(this).val());
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
        var self = this,
          isMenu =  !!($('#colorpicker-menu').length);

        if (isMenu || self.element.is(':disabled')) {
          return;
        }

        //Append Color Menu
        self.updateColorMenu();

        var popupmenuOpts = {
          ariaListbox: true,
          menuId: 'colorpicker-menu',
          trigger: 'immediate',
          placementOpts: {
            containerOffsetX: 10,
            containerOffsetY: 10,
            parentXAlignment: (Locale.isRTL() ? 'right': 'left'),
            strategies: ['flip', 'nudge', 'shrink']
          },
          offset: {
            x: 0,
            y: 10
          }
        };

        // Show Menu
        self.element
        .popupmenu(popupmenuOpts)
        .on('open.colorpicker', function () {
          self.element.parent().addClass('is-open');
        })
        .on('close.colorpicker', function () {
          $('#colorpicker-menu').parent('.popupmenu-wrapper').remove();
          self.element.parent().removeClass('is-open');
        })
        .on('selected.colorpicker', function (e, item) {
          self.element.val('#'+item.data('value'));
          self.swatch.css('background-color', '#' + item.data('value'));
          self.element.focus();
        });

        //Append Buttons
        this.menu = $('#colorpicker-menu');

        setTimeout(function () {
          self.menu.find('.is-selected').focus();
        }, 1);
      },

      // Set the Visible Color
      setColor: function (hex, text) {
        // Make sure there is always a hash
        if (hex.substr(0,1) !== '#') {
          hex = '#' + hex;
          this.element.val(hex);
        }

        if (hex.length !== 7) {
          return;
        }

        this.swatch.css('background-color', hex);
        this.element.attr('aria-describedby', text);
      },

      // Refresh and Append the Color Menu
      updateColorMenu: function () {
        var isMenu =  !!($('#colorpicker-menu').length),
          menu = $('<ul id="colorpicker-menu" class="popupmenu colorpicker"></ul>'),
          currentTheme = Soho.theme;

        var isBorderAll = (settings.themes[currentTheme].border === 'all'),
          checkmark = settings.themes[currentTheme].checkmark,
          checkmarkClass = '';

        for (var i = 0, l = settings.colors.length; i < l; i++) {
          var li = $('<li></li>'),
            a = $('<a href="#"><span class="swatch"></span></a>').appendTo(li),
            number = settings.colors[i].number,
            num = parseInt(number, 10),
            text = (Locale.translate(settings.colors[i].label) || settings.colors[i].label) + (settings.colors[i].number || ''),
            value = settings.colors[i].value,
            isBorder = false,
            regexp = new RegExp('\\b'+ currentTheme +'\\b');

          // Set border to this swatch
          if (isBorderAll || regexp.test(settings.colors[i].border)) {
            isBorder = true;
          }

          if (this.element.val().replace('#', '') === value) {
            // Set checkmark color class
            if (checkmark) {
              $.each(checkmark, function(k, v) {
                // checkmark: {'one': [1, 2], 'two': [3, 10]}
                // will add class "checkmark-one", where current colors number is in range [1 to 3]
                // and will add class "checkmark-two", where current colors number is in range [3 to 10]
                if ((num >= v[0]) && (num <= v[1])) {
                  checkmarkClass = ' checkmark-'+ k;
                }
              });
            }
            a.addClass('is-selected'+ checkmarkClass);
          }

          a.find('.swatch')
              .css('background-color', '#'+ value)
              .addClass(isBorder ? 'is-border' : '').end()
            .data('label', text)
            .data('value', value)
            .attr('title', text +' #'+ value)
            .tooltip();

          // menu.append(li);
          if (!isMenu) {
            menu.append(li);
          }
        }

        if (!isMenu) {
          $('body').append(menu);
        }
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

      rgb2hex: function (rgb) {
        if (rgb.search('rgb') === -1) {
          return rgb;
        }
        else if (rgb === 'rgba(0, 0, 0, 0)') {
          return 'transparent';
        }
        else {
          var hex = function (x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
          };
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
      },

      // Teardown
      destroy: function() {
        this.swatch.remove();
        this.element.off('keypress.colorpicker');
        this.swatch.off('click.colorpicker');
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new ColorPicker(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
