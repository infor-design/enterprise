import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

/**
 * Current "theme" string
 */
let theme = 'light'; //eslint-disable-line

// Component name as referenced by jQuery/event namespace/etc
const COMPONENT_NAME = 'personalize';

/**
 * Component Defaults
 * @param {string} colors  The list of colors
 * @param {string} theme  The theme name (light, dark or high-contrast)
 */
const PERSONALIZE_DEFAULTS = {
  colors: '',
  theme
};

/**
 * The personalization routines for setting custom company colors.
 *
 * @class Personalize
 * @param {HTMLElement|jQuery[]} element the base element
 * @param {object} [settings] incoming settings
 */
function Personalize(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, PERSONALIZE_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Personalize.prototype = {

  /**
   * Runs on each initialization
   * @private
   * @returns {this} component instance
   */
  init() {
    // Set the default theme, or grab the theme from an external CSS stylesheet.
    const cssTheme = this.getThemeFromStylesheet();
    this.currentTheme = cssTheme || this.settings.theme;
    this.setTheme(this.currentTheme);

    if (this.settings.colors) {
      this.setColors(this.settings.colors);
    }

    this.handleEvents();

    return this;
  },

  /**
   * Sets up event handlers for this control and its sub-elements
   * @private
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    }).on(`changecolors.${COMPONENT_NAME}`, (e, newColor, noAnimate) => {
      self.setColors(newColor, noAnimate);
    }).on(`changetheme.${COMPONENT_NAME}`, (e, thisTheme) => {
      self.setTheme(thisTheme);
    });

    return this;
  },

  /**
   * Validates a string containing a hexadecimal number
   * @param {string} hex: A hex color.
   * @returns {string} a validated hexadecimal string.
   */
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
    if (!colors) {
      colors = {};
    }

    // Use an incoming `colors` param defined as a string, as the desired
    // "header" color (backwards compatibility)
    if (typeof colors === 'string') {
      colors = {
        header: colors
      };
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
    colors.header = this.validateHex(colors.header || defaultColors.header);
    colors.text = this.validateHex(colors.text || defaultColors.text);
    colors.subheader = this.validateHex(colors.subheader ||
      this.getLuminousColorShade(colors.header, 0.2));
    colors.inactive = this.validateHex(colors.inactive ||
      this.getLuminousColorShade(colors.header, -0.22));
    colors.verticalBorder = this.validateHex(colors.verticalBorder ||
      this.getLuminousColorShade(colors.header, 0.1));
    colors.horizontalBorder = this.validateHex(colors.horizontalBorder ||
      this.getLuminousColorShade(colors.header, -0.4));
    colors.hover = this.validateHex(colors.hover ||
      this.getLuminousColorShade(colors.header, -0.5));
    colors.btnColorHeader = this.validateHex(colors.btnColorHeader ||
      this.getLuminousColorShade(colors.subheader, -0.025));
    colors.btnColorSubheader = this.validateHex(colors.btnColorSubheader ||
      this.getLuminousColorShade(colors.header, -0.025));

    // not that the sheet is appended in backwards
    const cssRules = `.tab-container.module-tabs.is-personalizable { border-top: 1px solid ${colors.horizontalBorder} !important; border-bottom: 1px solid ${colors.horizontalBorder} !important}` +
    ` .module-tabs.is-personalizable .tab:not(:first-child) { border-left: 1px solid ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable { background-color: ${colors.inactive} !important}` +
    ` .module-tabs.is-personalizable .tab.is-selected { background-color: ${colors.header} !important}` +
    ` .accordion.panel .accordion-header.is-selected { background-color: ${colors.subheader} !important; color: ${colors.text} !important}` +
    ` .builder-header.is-personalizable{ background-color: ${colors.subheader}}` +
    ` .header.is-personalizable { background-color: ${colors.header}}` +
    ` .header.is-personalizable .title { color: ${colors.text}}` +
    ` .header.is-personalizable h1 { color: ${colors.text}}` +
    ` .header.is-personalizable .go-button.is-personalizable { background-color: ${colors.btnColorHeader}; border-color:${colors.btnColorHeader};color: ${colors.text}}` +
    ` .subheader.is-personalizable .go-button.is-personalizable { background-color: ${colors.btnColorSubheader}; border-color:${colors.btnColorSubheader};color: ${colors.text}}` +
    ` .module-tabs.is-personalizable .tab-more { border-left: ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable .tab-more:hover { background-color: ${colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab-more.is-open { background-color: ${colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab-more.is-selected { background-color: ${colors.header} !important}` +
    ` .header .toolbar > .toolbar-searchfield-wrapper.active .searchfield { background-color: ${colors.hover} !important; border-bottom-color: ${colors.hover} !important}` +
    ` .header .toolbar > .toolbar-searchfield-wrapper.active .searchfield-category-button { background-color: ${colors.hover} !important; border-bottom-color: ${colors.hover} !important}` +
    ` .subheader.is-personalizable { background-color: ${colors.subheader} !important}` +
    ` .builder .sidebar .header {border-right: 1px solid ${colors.hover} !important}` +
    ` .module-tabs.is-personalizable .tab:hover { background-color: ${colors.hover} !important}` +
    ` .module-tabs.has-toolbar.is-personalizable .tab-list-container + .toolbar { border-left: ${colors.verticalBorder} !important}` +
    ` .module-tabs.is-personalizable [class^="btn"] { background-color: ${colors.inactive} !important}` +
    ` .hero-widget.is-personalizable { background-color: ${colors.subheader} }` +
    ` .hero-widget.is-personalizable .hero-bottom { background-color: ${colors.header} }` +
    ` .hero-widget.is-personalizable .hero-footer .hero-footer-nav li::before { color: ${colors.verticalBorder} }` +
    ` .hero-widget.is-personalizable .chart-container .arc { stroke: ${colors.subheader} }` +
    ` .hero-widget.is-personalizable .chart-container .bar { stroke: ${colors.subheader} }` +
    ` .hero-widget.is-personalizable .chart-container.line-chart .dot { stroke: ${colors.subheader} }` +
    '';

    return cssRules;
  },

  /**
  * Sets the personalization color(s)
  * @param {array} colors The original hex color as a string or an object with all the Colors
  * @returns {this} component instance
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
  * @param {string} hex  The original Hexadecimal base color.
  * @param {string} lum  A percentage used to set luminosity
  * change on the base color:  -0.1 would be 10% darker, 0.2 would be 20% brighter
  * @returns {string} hexadecimal color.
  */
  getLuminousColorShade(hex, lum) {
    // validate hex string
    hex = this.validateHex(hex).substr(1);
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#';
    let c;
    let i;

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
    let thisTheme = '';

    if (css.length > 0) {
      const path = css.attr('href');
      thisTheme = path.substring(path.lastIndexOf('/') + 1).replace('.min.css', '').replace('.css', '').replace('-theme', '');
    }
    return thisTheme;
  },

  /**
  * Sets the current theme, blocking the ui during the change.
  * @param {string} incomingTheme  Represents the file name of a color
  * scheme (can be dark, light or high-contrast)
  */
  setTheme(incomingTheme) {
    if (theme === incomingTheme) {
      return;
    }

    theme = incomingTheme;

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

  /**
   * Builds a temporary page overlay that prevents end users from experiencing FOUC
   * @returns {void}
   */
  blockUi() {
    let backgroundColor = '#bdbdbd';
    if (theme === 'light') {
      backgroundColor = '#f0f0f0';
    }
    if (theme === 'dark') {
      backgroundColor = '#313236';
    }

    this.pageOverlay = this.pageOverlay ||
      $(`<div style="background: ${backgroundColor};
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        text-align: center;
        top: 0;
        width: 100%;
        z-index: 10000;"></div>`);

    $('body').append(this.pageOverlay);
  },

  /**
   * Removes a temporary page overlay built by `blockUi()`
   * @returns {void}
   */
  unBlockUi() {
    const self = this;

    self.pageOverlay.fadeOut(300, () => {
      self.pageOverlay.remove();
      self.pageOverlay = undefined;
    });
  },

  /**
   * Handle Updating Settings
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * Ideally this will do non-destructive things that make it possible to easily rebuild
   * @returns {this} component instance
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { theme, Personalize, COMPONENT_NAME };
