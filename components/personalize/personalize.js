import * as debug from '../utils/debug';

/**
 * Component name as referenced by jQuery/event namespace/etc
 */
const PLUGIN_NAME = 'personalize';

/**
 * Component Defaults
 */
const PERSONALIZE_DEFAULTS = {
  colors: '',
  theme: ''
};

/**
* The personalization routines for setting custom company colors.
*
* @class Personalize
* @param {String} colors  &nbsp;-&nbsp; The list of colors
* @param {String} theme  &nbsp;-&nbsp; The theme name (light, dark or high-contrast)
*
*/
function Personalize(element, options) {
  this.settings = $.extend({}, PERSONALIZE_DEFAULTS, options);
  this.element = $(element);
  debug.logTimeStart(PLUGIN_NAME);
  this.init();
  debug.logTimeEnd(PLUGIN_NAME);
}

// Plugin Methods
Personalize.prototype = {
  init() {
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

  makeSohoObject() {
    const self = this;

    // Set the default theme or take it from the css sheet
    window.Soho.theme = 'light';
    const cssTheme = this.getThemeFromStylesheet();
    if (cssTheme) {
      window.Soho.theme = cssTheme;
    }

    // Add Classes of current theme to the html root for use and debugging.
    $('html').removeClass('light-theme dark-theme high-contrast-theme').addClass(`${window.Soho.theme}-theme`);

    window.Soho.setTheme = function (theme) { // jshint ignore:line
      self.setTheme(theme);
    };

    window.Soho.setColors = function (colors) { // jshint ignore:line
      self.setColors(colors);
    };

    window.Soho.getColorStyleSheet = function (colors) { // jshint ignore:line
      return self.getColorStyleSheet(colors);
    };

    return this;
  },

  // Sets up event handlers for this control and its sub-elements
  handleEvents() {
    const self = this;

    this.element.on(`updated.${PLUGIN_NAME}`, () => {
      self.updated();
    }).on(`changecolors.${PLUGIN_NAME}`, (e, newColor, noAnimate) => {
      self.setColors(newColor, noAnimate);
    }).on(`changetheme.${PLUGIN_NAME}`, (e, theme) => {
      self.setTheme(theme);
    });

    return this;
  },

  // Validates a string containing a hexadecimal number
  // @param {String} hex: A hex color.
  // @returns {String} a validated hexadecimal string.
  validateHex(hex) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');

    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    return `#${hex}`;
  },

  appendStyleSheet(cssRules) {
    let sheet = document.getElementById('soho-personalization');
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

  getColorStyleSheet(colors) {
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
    const defaultColors = {
      header: '2578A9',
      subheader: '1d5f8a',
      text: 'ffffff',
      verticalBorder: '133C59',
      horizontalBorder: '134D71',
      inactive: '1d5f8a',
      hover: '133C59',
      btnColorHeader: '368AC0',
      btnColorSubheader: '54a1d3'
    };

    // If an event sends a blank string through instead of a hex,
    // reset any color values back to the theme defaults.  Otherwise, get a valid hex value.
    Soho.colors.header = this.validateHex(Soho.colors.header || defaultColors.header);
    Soho.colors.text = this.validateHex(Soho.colors.text || defaultColors.text);
    Soho.colors.subheader = this.validateHex(Soho.colors.subheader || this.getLuminousColorShade(Soho.colors.header, 0.2));
    Soho.colors.inactive = this.validateHex(Soho.colors.inactive || this.getLuminousColorShade(Soho.colors.header, -0.22));
    Soho.colors.verticalBorder = this.validateHex(Soho.colors.verticalBorder || this.getLuminousColorShade(Soho.colors.header, 0.1));
    Soho.colors.horizontalBorder = this.validateHex(Soho.colors.horizontalBorder || this.getLuminousColorShade(Soho.colors.header, -0.4));
    Soho.colors.hover = this.validateHex(Soho.colors.hover || this.getLuminousColorShade(Soho.colors.header, -0.5));
    Soho.colors.btnColorHeader = this.validateHex(Soho.colors.btnColorHeader || this.getLuminousColorShade(Soho.colors.subheader, -0.025));
    Soho.colors.btnColorSubheader = this.validateHex(Soho.colors.btnColorSubheader || this.getLuminousColorShade(Soho.colors.header, -0.025));

    // not that the sheet is appended in backwards
    const cssRules = `.tab-container.module-tabs.is-personalizable { border-top: 1px solid ${Soho.colors.horizontalBorder} !important; border-bottom: 1px solid ${Soho.colors.horizontalBorder} !important}` +
    ` .module-tabs.is-personalizable .tab:not(:first-child) { border-left: 1px solid ${Soho.colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable { background-color: ${Soho.colors.inactive} !important}` +
    ` .module-tabs.is-personalizable .tab.is-selected { background-color: ${Soho.colors.header} !important}` +
    ` .accordion.panel .accordion-header.is-selected { background-color: ${Soho.colors.subheader} !important; color: ${Soho.colors.text} !important}` +
    ` .builder-header.is-personalizable{ background-color: ${Soho.colors.subheader}}` +
    ` .header.is-personalizable { background-color: ${Soho.colors.header}}` +
    ` .header.is-personalizable .title { color: ${Soho.colors.text}}` +
    ` .header.is-personalizable h1 { color: ${Soho.colors.text}}` +
    ` .header.is-personalizable .go-button.is-personalizable { background-color: ${Soho.colors.btnColorHeader}; border-color:${Soho.colors.btnColorHeader};color: ${Soho.colors.text}}` +
    ` .subheader.is-personalizable .go-button.is-personalizable { background-color: ${Soho.colors.btnColorSubheader}; border-color:${Soho.colors.btnColorSubheader};color: ${Soho.colors.text}}` +
    ` .module-tabs.is-personalizable .tab-more { border-left: ${Soho.colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable .tab-more:hover { background-color: ${Soho.colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab-more.is-open { background-color: ${Soho.colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab-more.is-selected { background-color: ${Soho.colors.header} !important}` +
    ` .header .toolbar > .toolbar-searchfield-wrapper.active .searchfield { background-color: ${Soho.colors.hover} !important; border-bottom-color: ${Soho.colors.hover} !important}` +
    ` .header .toolbar > .toolbar-searchfield-wrapper.active .searchfield-category-button { background-color: ${Soho.colors.hover} !important; border-bottom-color: ${Soho.colors.hover} !important}` +
    ` .subheader.is-personalizable { background-color: ${Soho.colors.subheader} !important}` +
    ` .builder .sidebar .header {border-right: 1px solid ${Soho.colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab:hover { background-color: ${Soho.colors.hover} !important}` +
    ` .module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar { border-left: ${Soho.colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable [class^="btn"] { background-color: ${Soho.colors.inactive} !important}` +
    ` .hero-widget.is-personalizable { background-color: ${Soho.colors.subheader} }` +
    ` .hero-widget.is-personalizable .hero-bottom { background-color: ${Soho.colors.header} }` +
    ` .hero-widget.is-personalizable .hero-footer .hero-footer-nav li::before { color: ${Soho.colors.verticalBorder} }` +
    ` .hero-widget.is-personalizable .chart-container .arc { stroke: ${Soho.colors.subheader} }` +
    ` .hero-widget.is-personalizable .chart-container .bar { stroke: ${Soho.colors.subheader} }` +
    ` .hero-widget.is-personalizable .chart-container.line-chart .dot { stroke: ${Soho.colors.subheader} }` +
    '';

    return cssRules;
  },

  /**
  * Sets the personalization color(s)
  *
  * @param {Array} colors The original hex color as a string or an object with all the Colors
  */
  setColors(colors) {
    if (!colors) {
      return this;
    }

    this.appendStyleSheet(this.getColorStyleSheet(colors));
    return this;
  },

  /**
  * Takes a color and performs a change in luminosity of that color programatically.
  * @param {String} hex  &nbsp;-&nbsp; The original Hexadecimal base color.
  * @param {String} lum  &nbsp;-&nbsp; A percentage used to set luminosity
  * change on the base color:  -0.1 would be 10% darker, 0.2 would be 20% brighter
  * @returns {String} hexadecimal color.
  */
  getLuminousColorShade(hex, lum) {
    // validate hex string
    hex = this.validateHex(hex).substr(1);
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += (`00${c}`).substr(c.length);
    }

    return rgb;
  },

  availableThemes: [
    'light',
    'dark',
    'high-contrast'
  ],

  getThemeFromStylesheet() {
    const css = $('#stylesheet, #sohoxi-stylesheet');
    let theme = '';

    if (css.length > 0) {
      const path = css.attr('href');
      theme = path.substring(path.lastIndexOf('/') + 1).replace('.min.css', '').replace('.css', '').replace('-theme', '');
    }
    return theme;
  },

  /**
  * Sets the current theme, blocking the ui during the change.
  *
  * @param {String} theme  &nbsp;-&nbsp; Represents the file name of a color
  * scheme (can be dark, light or high-contrast)
  */
  setTheme(theme) {
    if (Soho.theme === theme) {
      return;
    }

    Soho.theme = theme;
    // validate theme
    if (this.availableThemes.indexOf(theme) === -1) {
      return;
    }

    $('html').removeClass('light-theme dark-theme high-contrast-theme').addClass(`${theme}-theme`);

    this.blockUi();

    const self = this;
    const originalCss = $('#stylesheet, #sohoxi-stylesheet');
    const newCss = $('<link rel="stylesheet">');
    const path = originalCss.attr('href');

    newCss.on('load', () => {
      originalCss.remove();
      self.unBlockUi();
    });

    newCss.attr({
      id: originalCss.attr('id'),
      href: `${path.substring(0, path.lastIndexOf('/'))}/${theme}-theme${path.indexOf('.min') > -1 ? '.min' : ''}.css`
    });
    originalCss.removeAttr('id');
    originalCss.after(newCss);
  },

  // Block the ui from FOUC
  blockUi() {
    this.pageOverlay = this.pageOverlay || $(`${'<div style="' +
      'background: '}${Soho.theme === 'light' ? '#f0f0f0;' : (Soho.theme === 'dark' ? '#313236;' : '#bdbdbd;')
    }display: block;` +
      'height: 100%;' +
      'left: 0;' +
      'position: fixed;' +
      'text-align: center;' +
      'top: 0;' +
      'width: 100%;' +
      'z-index: 10000;' +
      '"></div>');

    $('body').append(this.pageOverlay);
  },

  unBlockUi() {
    const self = this;

    self.pageOverlay.fadeOut(300, () => {
      self.pageOverlay.remove();
      self.pageOverlay = undefined;
    });
  },

  // Handle Updating Settings
  updated() {
    return this
      .teardown()
      .init();
  },

  // Simple Teardown - remove events & rebuildable markup.
  // Ideally this will do non-destructive things that make it possible to easily rebuild
  teardown() {
    this.element.off(`updated.${PLUGIN_NAME}`);
    return this;
  },

  // Teardown - Remove added markup and events
  destroy() {
    this.teardown();
    $.removeData(this.element[0], PLUGIN_NAME);
  }
};

/**
 * jQuery Component Wrapper for Personalize
 */
$.fn.personalize = function (options) {
  // Settings and Options
  const settings = $.extend({}, PERSONALIZE_DEFAULTS, options);

  // Initialize the plugin (Once)
  return this.each(function () {
    let instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.settings = $.extend({}, instance.settings, options);
      instance.updated();
    } else {
      instance = $.data(this, PLUGIN_NAME, new Personalize(this, settings));
    }
  });
};

export { Personalize };
