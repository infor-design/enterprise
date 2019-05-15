import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { colorUtils } from '../../utils/color';
import { xssUtils } from '../../utils/xss';
import { theme } from '../theme/theme';
import { personalizeStyles } from './personalize.styles';

// Component name as referenced by jQuery/event namespace/etc
const COMPONENT_NAME = 'personalize';

// Component Defaults
const PERSONALIZE_DEFAULTS = {
  colors: '',
  theme: '',
  font: '',
  blockUI: true
};

/**
 * The personalization routines for setting custom company colors.
 *
 * @class Personalize
 * @param {HTMLElement|jQuery[]} element The base element
 * @param {object} [settings] Incoming settings
 * @param {string} [settings.colors]  The list of colors
 * @param {string} [settings.theme='light'] The theme name (light, dark or high-contrast)
 * @param {string} [settings.font='Helvetica'] Use the newer source sans font
 * @param {boolean} [settings.blockUI=true] Cover the UI and animate when changing theme.
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

    const legacyThemeNames = ['light', 'dark', 'high-contrast'];
    if (legacyThemeNames.includes(this.settings.theme)) {
      this.settings.theme += '-theme';
    }

    this.currentTheme = this.settings.theme || cssTheme;
    this.setTheme(this.currentTheme);

    if (this.settings.colors) {
      this.setColors(this.settings.colors);
    }

    if (this.settings.font) {
      $('html').addClass(`font-${this.settings.font}`);
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

    this.element
      .off(`updated.${COMPONENT_NAME}`)
      .on(`updated.${COMPONENT_NAME}`, () => {
        self.updated();
      });

    return this;
  },

  /**
   * Create new CSS rules in head and override any existing
   * @private
   * @param {object} cssRules The rules to append.
   */
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

  /**
   * Generate a style sheet to append in the page.
   * @private
   * @param {array} colors The rules to append.
   * @returns {string} The string of css to append.
   */
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
    colors.header = colorUtils.validateHex(colors.header || defaultColors.header);
    colors.text = colorUtils.validateHex(colors.text || defaultColors.text);
    colors.subheader = colorUtils.validateHex(colors.subheader ||
      colorUtils.getLuminousColorShade(colors.header, 0.2));
    colors.button = colorUtils.validateHex(colors.button ||
      colorUtils.getLuminousColorShade(colors.text, -0.80));
    colors.inactive = colorUtils.validateHex(colors.inactive ||
      colorUtils.getLuminousColorShade(colors.header, -0.22));
    colors.verticalBorder = colorUtils.validateHex(colors.verticalBorder ||
      colorUtils.getLuminousColorShade(colors.header, 0.1));
    colors.horizontalBorder = colorUtils.validateHex(colors.horizontalBorder ||
      colorUtils.getLuminousColorShade(colors.header, -0.4));
    colors.hover = colorUtils.validateHex(colors.hover ||
      colorUtils.getLuminousColorShade(colors.header, -0.5));
    colors.btnColorHeader = colorUtils.validateHex(colors.btnColorHeader ||
      colorUtils.getLuminousColorShade(colors.subheader, -0.025));
    colors.btnColorSubheader = colorUtils.validateHex(colors.btnColorSubheader ||
      colorUtils.getLuminousColorShade(colors.header, -0.025));

    return personalizeStyles(colors);
  },

  /**
  * Sets the personalization color(s)
  * @param {array} colors The original hex color as a string or an object with all the Colors
  * @returns {this} component instance
  */
  setColors(colors) {
    if (colors === '') {
      this.setColorsToDefault();
      return this;
    }

    if (!colors) {
      return this;
    }

    this.appendStyleSheet(this.getColorStyleSheet(colors));

    // record state of colors in settings
    this.settings.colors = colors;

    /**
    * Fires after the colors are changed.
    * @event colorschanged
    * @memberof Personalize
    * @property {object} event - The jquery event object
    * @property {object} args - The event args
    * @property {string} args.colors - The color(s) changed to.
    */
    this.element.triggerHandler('colorschanged', { colors });
    return this;
  },

  /**
   * Sets the colors back to the default color (by removing the geneated stylesheet).
   */
  setColorsToDefault() {
    this.settings.colors = '';
    const sheet = document.getElementById('soho-personalization');
    if (sheet) {
      sheet.parentNode.removeChild(sheet);
    }
  },

  /**
   * Detect the current theme based on the style sheet.
   * @private
   * @returns {string} The current theme.
   */
  getThemeFromStylesheet() {
    const css = $('#stylesheet, #sohoxi-stylesheet');
    let thisTheme = '';

    if (css.length > 0) {
      const path = css.attr('href');
      thisTheme = path.substring(path.lastIndexOf('/') + 1);
      // trim query string off the end if it exists
      // something like ?v=123 may be used for cache busting or build identifiers
      const queryParamIndex = thisTheme.lastIndexOf('?');
      if (queryParamIndex > -1) {
        thisTheme = thisTheme.slice(0, queryParamIndex);
      }
      // trim the file extensions off the end
      thisTheme = thisTheme.replace('.min', '').replace('.css', '');
    }
    return thisTheme;
  },

  /**
  * Sets the current theme, blocking the ui during the change.
  * @param {string} incomingTheme  Represents the file name of a color
  * scheme (can be dark, light or high-contrast)
  */
  setTheme(incomingTheme) {
    const $html = $('html');
    if (theme.currentTheme.id === incomingTheme) {
      if (!$html.hasClass(incomingTheme)) {
        $html.addClass(incomingTheme);
      }
      return;
    }

    $html
      .removeClass((idx, val) => {
        const classes = val.split(' ');
        const toRemove = classes.filter(c => c.includes('theme'));
        return toRemove.join();
      })
      .addClass(incomingTheme);

    this.blockUi();

    const self = this;
    const originalCss = $('#stylesheet, #sohoxi-stylesheet');
    const newCss = $('<link rel="stylesheet">');
    const path = originalCss.attr('href');

    newCss.on('load', () => {
      originalCss.remove();
      self.unBlockUi();
    });

    const themePath = path ? path.substring(0, path.lastIndexOf('/')) : '';
    const isMin = path ? path.indexOf('.min') > -1 : false;

    newCss.attr({
      id: originalCss.attr('id'),
      href: xssUtils.stripTags(`${themePath}/${incomingTheme}${isMin ? '.min' : ''}.css`)
    });
    originalCss.removeAttr('id');

    // Add new stylesheet before current stylesheet
    // to give it time to parse/render before revealing it
    originalCss.before(newCss);

    // record state of theme in settings
    this.settings.theme = incomingTheme;
    theme.setTheme(incomingTheme);

    /**
    * Fires after the theme is changed
    * @event themechanged
    * @memberof Personalize
    * @property {object} event - The jquery event object
    * @property {object} args - The event args
    * @property {string} args.theme - The theme id changed to.
    */
    this.element.triggerHandler('themechanged', { theme: incomingTheme });
  },

  /**
   * Builds a temporary page overlay that prevents end users from experiencing FOUC
   * @private
   * @returns {void}
   */
  blockUi() {
    const self = this;
    if (!self.settings.blockUI) {
      return;
    }

    let backgroundColor = '#bdbdbd';
    switch (theme) {
      case 'light':
        backgroundColor = '#f0f0f0';
        break;
      case 'dark':
        backgroundColor = '#313236';
        break;
      case 'high-contrast':
        backgroundColor = '#d8d8d8';
        break;
      default:
        backgroundColor = '#f0f0f0';
    }

    this.pageOverlay = this.pageOverlay || $('<div class="personalize-overlay"></div>');
    this.pageOverlay.css('background', backgroundColor);
    $('body').append(this.pageOverlay);
  },

  /**
   * Removes a temporary page overlay built by `blockUi()`
   * @private
   * @returns {void}
   */
  unBlockUi() {
    const self = this;
    if (!self.settings.blockUI) {
      return;
    }

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
   * @private
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

export { Personalize, COMPONENT_NAME };
