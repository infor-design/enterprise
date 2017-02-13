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
          colors: '',
          theme: ''
        },
        settings = $.extend({}, defaults, options);

    /**
     * Personalize Control
     * @constructor
     * @param {Object} element
     */
    function Personalize(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Personalize.prototype = {
      init: function() {
        this.makeSohoObject()
        .handleEvents();

        if (this.settings.colors) {
          this.setColors(this.settings.colors);
        }

        if (this.settings.theme) {
          this.setTheme(this.settings.theme);
        }
        return this;
      },

      makeSohoObject: function () {
        var self = this;

        window.Soho = window.Soho || {};

        //Handle Personalization and theme
        window.Soho.theme = 'light';

        window.Soho.setTheme = function(theme) { // jshint ignore:line
          self.setTheme(theme);
        };

        window.Soho.setColors = function(colors) { // jshint ignore:line
          self.setColors(colors);
        };

        window.Soho.getColorStyleSheet = function(colors) { // jshint ignore:line
          return self.getColorStyleSheet(colors);
        };

        return this;
      },

      // Sets up event handlers for this control and its sub-elements
      handleEvents: function() {
        var self = this;

        this.element.on('updated.' + pluginName, function() {
          self.updated();
        }).on('changecolors.' + pluginName, function(e, newColor, noAnimate) {
          self.setColors(newColor, noAnimate);
        }).on('changetheme.' + pluginName, function(e, theme) {
          self.setTheme(theme);
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

      appendStyleSheet: function(cssRules) {
        var sheet = document.getElementById('soho-personalization');
        if (sheet) {
          sheet.parentNode.removeChild(sheet);
        }

        // Create the <style> tag
        sheet = document.createElement('style');
        sheet.setAttribute('id', 'soho-personalization');
        sheet.appendChild(document.createTextNode(cssRules));

      	// Add the <style> element to the page
      	document.head.appendChild(sheet);
      },

      getColorStyleSheet: function(colors)  {
        Soho.colors = colors;

        if (typeof colors === 'string') {
          Soho.colors = {};
          Soho.colors.header = colors;
        }

        if (!colors || colors === '') {
          return this;
        }

        // Default Colors...
        // (Color)07 for the main color (fx headers)
        // (Color)06 for the secondary color (fx sub-headers)
        // Light or Dark (fff or 000) for the contrast color

        // (Color)06 for the vertical borders between module tabs - 133C59
        // (Color)07 for the page header and active module tab - 2578A9 DEFAULT
        // (Color)08 for the inactive module tab - 1d5f8a
        // (Color)09 for the horizontal border - 134D71
        // (Color)10 for the hover state on module tab - 133C59
        var defaultColors = {header: '2578A9',
                             subheader: '368AC0',
                             text: 'ffffff',
                             verticalBorder: '133C59',
                             horizontalBorder: '134D71',
                             inactive: '1d5f8a',
                             hover: '133C59'};

        // If an event sends a blank string through instead of a hex,
        // reset any color values back to the theme defaults.  Otherwise, get a valid hex value.
        Soho.colors.header = this.validateHex(Soho.colors.header || defaultColors.header);
        Soho.colors.text = this.validateHex(Soho.colors.text || defaultColors.text);
        Soho.colors.subheader = this.validateHex(Soho.colors.subheader || this.getLuminousColorShade(Soho.colors.header, 0.2));
        Soho.colors.inactive = this.validateHex(Soho.colors.inactive || this.getLuminousColorShade(Soho.colors.header, -0.22));
        Soho.colors.verticalBorder = this.validateHex(Soho.colors.verticalBorder || this.getLuminousColorShade(Soho.colors.header, 0.1));
        Soho.colors.horizontalBorder = this.validateHex(Soho.colors.horizontalBorder || this.getLuminousColorShade(Soho.colors.header, -0.4));
        Soho.colors.hover = this.validateHex(Soho.colors.hover || this.getLuminousColorShade(Soho.colors.header, -0.5));

        //not that the sheet is appended in backwards
        var cssRules = '.tab-container.module-tabs.is-personalizable { border-top: 1px solid '+ Soho.colors.horizontalBorder +'; border-bottom: 1px solid ' + Soho.colors.horizontalBorder + '}' +
        ' .module-tabs.is-personalizable .tab:not(:first-child) { border-left: 1px solid '+ Soho.colors.verticalBorder +'}'  +
        ' .module-tabs.is-personalizable { background-color: '+ Soho.colors.inactive +'}'  +
        ' .module-tabs.is-personalizable .tab.is-selected { background-color: '+ Soho.colors.header +'}'  +
        ' .builder-header.is-personalizable{ background-color: '+ Soho.colors.subheader +'}'  +
        ' .header.is-personalizable { background-color: '+ Soho.colors.header +'}' +
        ' .header.is-personalizable .title { color: '+ Soho.colors.text +'}' +
        ' .header.is-personalizable h1 { color: '+ Soho.colors.text +'}' +
        ' .module-tabs.is-personalizable .tab-more { border-left: '+ Soho.colors.verticalBorder +' }' +
        ' .module-tabs.is-personalizable .tab-more:hover { background-color: '+ Soho.colors.hover +' }' +
        ' .module-tabs.is-personalizable .tab-more.is-open { background-color: '+ Soho.colors.hover +' }' +
        ' .module-tabs.is-personalizable .tab-more.is-selected { background-color: '+ Soho.colors.header +' }' +
        ' .subheader.is-personalizable { background-color: '+ Soho.colors.subheader +'}' +
        ' .builder .sidebar .header {border-right: 1px solid '+ Soho.colors.verticalBorder +'}' +
        ' .module-tabs.is-personalizable .tab:hover { background-color: '+ Soho.colors.hover +'}' +
        ' .module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar { border-left: '+ Soho.colors.verticalBorder +' }' +
        ' .module-tabs.is-personalizable [class^="btn"] { background-color: '+ Soho.colors.inactive +' }' +
        ' .hero-widget.is-personalizable { background-color: '+ Soho.colors.subheader +' }' +
        ' .hero-widget.is-personalizable .hero-bottom { background-color: '+ Soho.colors.header +' }' +
        ' .hero-widget.is-personalizable .hero-footer .hero-footer-nav li::before { color: '+ Soho.colors.verticalBorder +' }' +
        ' .hero-widget.is-personalizable .chart-container .arc { stroke: '+ Soho.colors.subheader +' }' +
        ' .hero-widget.is-personalizable .chart-container .bar { stroke: '+ Soho.colors.subheader +' }' +
        ' .hero-widget.is-personalizable .chart-container.line-chart .dot { stroke: '+ Soho.colors.subheader +' }' +
        '';

        return cssRules;
      },

      // Changes all personalizable elements inside this element to match the personalization scheme provided.
      // The original hex color as a string or an object with all the Colors
      setColors: function(colors) {
        if (!colors) {
          return;
        }

        this.appendStyleSheet(this.getColorStyleSheet(colors));
        return this;
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
        'light',
        'dark',
        'high-contrast'
      ],

      // @param {String} theme: Represents the file name of a color scheme
      setTheme: function(theme) {
        if (Soho.theme === theme) {
          return;
        }

        Soho.theme = theme;
        // validate theme
        if (this.availableThemes.indexOf(theme) === -1) {
          return;
        }

        this.blockUi();

        var css = $('#stylesheet, #sohoxi-stylesheet'),
          path = css.attr('href');
        css.attr('href', path.substring(0, path.lastIndexOf('/')) + '/' + theme + '-theme' + (path.indexOf('.min') > -1 ? '.min' : '') + '.css');

        this.unBlockUi();
      },

      //Block the ui from FOUC
      blockUi: function () {

        this.pageOverlay = this.pageOverlay || $('<div style="' +
        	'background: ' + (Soho.theme === 'light' ? '#f0f0f0;' : (Soho.theme === 'dark' ? '#313236;' : '#bdbdbd;')) +
        	'display: block;' +
          'height: 100%;' +
        	'left: 0;' +
        	'position: fixed;' +
          'text-align: center;' +
        	'top: 0;' +
        	'width: 100%;' +
          'z-index: 999;' +
          '"></div>'
        );

        $('body').append(this.pageOverlay);
      },

      unBlockUi: function (){
        var self = this;

        self.pageOverlay.fadeOut(1200, function() {
          self.pageOverlay.remove();
          self.pageOverlay = undefined;
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
