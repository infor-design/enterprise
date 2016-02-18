/**
* Personalize Control (TODO: bitly link to soho xi docs)
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

  $.fn.personalize = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'personalize',
        defaults = {
          startingColor: '#2578A9' // Azure 07
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Personalize(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Plugin Methods
    Personalize.prototype = {
      init: function() {
        this.setNewColorScheme(this.settings.startingColor, true);

        return this
          .handleEvents();
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        this.element.on('updated.' + pluginName, function() {
          self.updated();
        }).on('personalizecolors.' + pluginName, function(e, newColor, noAnimate) {
          self.setNewColorScheme(newColor, noAnimate);
        }).on('changetheme.' + pluginName, function(e, newTheme) {
          self.setNewTheme(newTheme);
        });

        return this;
      },

      // Validates a string containing a hexadecimal number
      // @param {String} hex: A hex color.
      // @returns {String} a validated hexadecimal string.
      validateHex: function(hex) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');

        if (hex.length < 6) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        return '#' + hex;
      },

      // Changes all personalizable elements inside this element to match the personalization scheme provided.
      // @param {String} hex: The original Hexadecimal base color.
      setNewColorScheme: function(hex, noAnimate) {
        // If an event sends a blank string through instead of a hex,
        // reset any color values back to the theme defaults.  Otherwise, get a valid hex value.
        if (hex && hex !== '') {
          hex = this.validateHex(hex);
        }

        var self = this,
          colors = {
            'header': hex !== '' ? hex : '',
            'subheader': hex !== '' ? this.getLuminousColorShade(hex, 0.2) : ''
          },
          mappings = [
            ['.header.is-personalizable', 'background-color', colors.header],
            ['.sub-header.is-personalizable', 'background-color', colors.subheader],
            ['.builder-header.is-personalizable', 'background-color', colors.subheader]
          ];

        function setProp(selector, prop, color) {
          var elems = self.element.find(selector);
          if (self.element.is(selector)) {
            elems.add(self.element);
          }

          function changeIt(method) {
            if (noAnimate) {
              elems[method + 'Class']('no-transition');
            }
          }

          changeIt('add');
          elems.css(prop, color);
          elems.height(); // Forces repaint
          changeIt('remove');
        }

        for (var i = 0; i < mappings.length; i++) {
          setProp.apply(null, mappings[i]);
        }
      },

      // Takes a color and performs a change in luminosity of that color programatically.
      // @param {String} hex: The original Hexadecimal base color.
      // @param {Number} lum: A percentage used to set luminosity change on the base color:  -0.1 would be 10% darker, 0.2 would be 20% brighter
      // @returns {String} hexadecimal color.
      getLuminousColorShade: function(hex, lum) {
        // validate hex string
        hex = this.validateHex(hex).substr(1);
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = '#', c, i;
        for (i = 0; i < 3; i++) {
          c = parseInt(hex.substr(i*2, 2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          rgb += ('00' + c).substr(c.length);
        }

        return rgb;
      },

      availableThemes: [
        'grey-theme',
        'dark-theme',
        'high-contrast-theme'
      ],

      // Changes the application's current theme by swapping the "href" attribute of the main stylesheet entry
      // @param {String} theme: Represents the file name of a color scheme
      setNewTheme: function(theme) {
        // validate theme
        if (this.availableThemes.indexOf(theme) === -1) {
          return;
        }

        $('body').fadeOut('fast', function() {
          var css = $('#stylesheet, #sohoxi-stylesheet'),
            path = css.attr('href');
            css.attr('href', path.substring(0, path.lastIndexOf('/')) + '/' + theme +'.css');

          $(this).fadeIn('fast');
        });

      },

      // Handle Updating Settings
      updated: function() {
        return this
          .teardown()
          .init();
      },

      // Simple Teardown - remove events & rebuildable markup.
      // Ideally this will do non-destructive things that make it possible to easily rebuild
      teardown: function() {
        this.element.off('updated.' + pluginName);
        return this;
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
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Personalize(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
