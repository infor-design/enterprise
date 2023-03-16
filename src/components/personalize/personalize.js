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
  blockUI: true,
  noInit: false
};

/**
 * The personalization routines for setting custom company colors.
 *
 * @class Personalize
 * @param {HTMLElement|jQuery[]} element The base element
 * @param {object} [settings] Incoming settings
 * @param {string} [settings.colors]  The list of colors
 * @param {string} [settings.theme] The theme name (light, dark or high-contrast)
 * @param {string} [settings.font] Use the newer source sans font
 * @param {boolean} [settings.blockUI=true] Cover the UI and animate when changing theme.
 * @param {boolean} [settings.noInit=false] If true, prevents automatic setup of personalized theme/colors/font, allowing for manual triggering at a more convenient time.
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
    this.handleEvents();

    // Skip automatic setup of theme/colors/font.
    if (this.settings.noInit) {
      return this;
    }

    if (this.settings.theme) {
      this.setTheme(this.settings.theme);
    } else {
      this.setTheme(this.getThemeFromStylesheet());
    }

    if (this.settings.colors) {
      this.setColors(this.settings.colors);
    }

    if (this.settings.font) {
      this.setFont(this.settings.font);
    }

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
      header: '2578A9'
    };

    // Pass in a standard set of theme-specific colors.
    // These colors aren't personalized, but they may need to be referenced
    // within the personalization colors CSS generator.
    const themeColors = theme.themeColors();
    colors.theme = {};
    colors.theme.bg = themeColors.components.body.primary.background.value;
    colors.theme.altbg = themeColors.components.body.secondary.background.value;
    colors.theme.text = themeColors.components.body.primary.font.value;
    colors.theme.altText = themeColors.components.body.secondary.background.value;
    colors.theme.disabledText = themeColors.brand.secondary.alt.value;

    let dark = false;
    let contrast = false;
    let newTheme = false;
    if (themeColors.themeName.indexOf('contrast') > -1) {
      contrast = true;
    }
    if (themeColors.themeName.indexOf('dark') > -1) {
      dark = true;
    }
    if (themeColors.themeName.indexOf('uplift') > -1 || themeColors.themeName.indexOf('new') > -1) {
      newTheme = true;
    }
    colors.theme.props = {
      contrast,
      dark,
      newTheme
    };

    // Force to be light text on custom colors { color: ['classic', 'new'] }
    const forceToBeLightTextOn = {
      amber: ['#db7726', '#bb5500'], // amber 09
      amethyst: ['#9279a6', '#7834dd'], // amethyst 06
      azure: ['#2578a9', '#0563c2', '#368AC0', '#368ac0'], // azure 07/08
      emerald: ['#56932e', '#1f9254', '#2AC371'], // emerald 08
      graphite: ['#5c5c5c', '#808080'], // graphite 06
      ruby: ['#941e1e', '#7b0f11'], // ruby 09
      slate: ['#50535a', '#98949e'], // slate 06
      turquoise: ['#206b62', '#297b7b'] // turquoise 09
    };
    let foundColor = false;
    let isDark = `${colors.header || defaultColors.header}`.toLowerCase();
    isDark = colorUtils.validateHex(isDark);
    Object.keys(forceToBeLightTextOn).forEach((color) => {
      foundColor = foundColor || forceToBeLightTextOn[color].indexOf(isDark) > -1;
    });
    isDark = foundColor ? 'white' : null;

    // START OF NEW THEME COLOR STYLES
    const buttonNewColors = {
      amber: ['#bb5500', '#fbaf50', '#fcc888', '#fef2e5'],
      amethyst: ['#7928e1', '#c2a1f1', '#ddcbf7', '#f1ebfc'],
      azure: ['#0066d4', '#55a3f3', '#8abff7', '#e6f1fd'],
      emerald: ['#1f9254', '#78d8a3', '#a1e4bf', '#ebf9f1'],
      graphite: ['#535353', '#97979b', '#b7b7ba', '#efeff0'],
      ruby: ['#8d0b0e', '#ee9496', '#f5c3c4', '#fbe7e8'],
      slate: ['#606066', '#97979b', '#b7b7ba', '#efeff0'],
      turquoise: ['#297b7b', '#82d4d4', '#a8e1e1', '#ecf8f8']
    };

    const currentColor = `${colors.header || defaultColors.header}`.toLowerCase();
    Object.keys(buttonNewColors).forEach((color) => {
      if (buttonNewColors[color].indexOf(currentColor) > -1) {
        colors.darkNewButton = buttonNewColors[color][1];
        colors.darkNewButtonHover = buttonNewColors[color][2];
        colors.secondaryButtonHover = buttonNewColors[color][3];
      }
    });

    colors.darkNewButtonLighterHover = '#3e3e42';
    colors.darkNewButtonDisabled = '#47474c';
    colors.darkNewButtonTextDisabled = '#77777c';
    // END OF NEW THEME COLOR STYLES

    // Evaluate text contrast colors.
    // If the primary color is too "bright", this will flip the text color to black.
    const lightest = colorUtils.validateHex(colors.lightest ||
      colorUtils.getLuminousColorShade((colors.header || defaultColors.header), 0.3));
    const textContrastColor = colorUtils.getContrastColor(lightest, null, isDark);
    if (textContrastColor === 'white') {
      defaultColors.text = 'ffffff';
      defaultColors.subtext = 'f0f0f0';
    } else {
      defaultColors.text = '000000';
      defaultColors.subtext = '292929';
    }

    // If an event sends a blank string through instead of a hex,
    // reset any color values back to the theme defaults.  Otherwise, get a valid hex value.
    colors.header = colorUtils.validateHex(colors.header || defaultColors.header);
    colors.text = colorUtils.validateHex(colors.text || defaultColors.text);
    colors.subtext = colorUtils.validateHex(colors.subtext || defaultColors.subtext);
    colors.btnColorHeader = colorUtils.validateHex(colors.btnColorHeader ||
      colorUtils.getLuminousColorShade(colors.header, 0.3));
    colors.subheader = colorUtils.validateHex(colors.subheader ||
      colorUtils.getLuminousColorShade(colors.header, 0.2));
    colors.verticalBorder = colorUtils.validateHex(colors.verticalBorder ||
      colorUtils.getLuminousColorShade(colors.header, 0.1));

    // Darker
    colors.btnColorSubheader = colorUtils.validateHex(colors.btnColorSubheader ||
      colorUtils.getLuminousColorShade(colors.header, -0.1));
    colors.inactive = colorUtils.validateHex(colors.inactive ||
      colorUtils.getLuminousColorShade(colors.header, -0.2));
    colors.horizontalBorder = colorUtils.validateHex(colors.horizontalBorder ||
      colorUtils.getLuminousColorShade(colors.header, -0.3));

    // Legacy
    colors.hover = colorUtils.validateHex(colors.hover ||
      colorUtils.getLuminousColorShade(colors.header, -0.5));
    colors.button = colorUtils.validateHex(colors.button ||
      colorUtils.getLuminousColorShade(colors.text, -0.8));

    colors.lightest = colors.btnColorHeader;
    colors.lighter = colors.subheader;
    colors.light = colors.verticalBorder;
    colors.base = colors.header;
    colors.contrast = colors.text;
    colors.dark = colors.btnColorSubheader;
    colors.darker = colors.inactive;
    colors.darkest = colors.horizontalBorder;

    // Some disabled colors on some preset color schemes come out terrible,
    // unless they are adjusted here. { color: ['classic', 'new'] }
    // The alternate color is generally less luminous and less color-saturated (more gray).
    const alternateDisabledColors = {
      amber: ['#db7726', '#bb5500'], // amber 09
      amethyst: ['#9279a6', '#7834dd'], // amethyst 06
      emerald: ['#56932e', '#1f9254', '#2AC371'], // emerald 08
      slate: ['#50535a', '#98949e'], // slate 06
    };
    let useAlternates = false;
    const fixedVal = colorUtils.validateHex(`${colors.header || defaultColors.header}`.toLowerCase());
    Object.keys(alternateDisabledColors).forEach((color) => {
      useAlternates = useAlternates || alternateDisabledColors[color].indexOf(fixedVal) > -1;
    });

    // Start with standard Soho values
    let baseColor = colors.light;
    let lum = useAlternates ? 0.5 : 0.7;
    let sat = useAlternates ? 0.3 : 0.5;

    if (!newTheme) {
      // Soho adjustments go here
      if (dark) {
        baseColor = colors.darkest;
        lum = -0.1;
      } else if (contrast) {
        lum = 0.3;
      }
    } else {
      // Uplift adjustments go here
      lum = useAlternates ? 0.6 : 0.8;
      sat = useAlternates ? 0.6 : 0.8;
      if (dark) {
        baseColor = colors.darkest;
        lum = 0.1;
      } else if (contrast) {
        lum = 0.8;
        sat = 0.4;
      }
    }

    let disabledBGColor = colorUtils.getLuminousColorShade(baseColor, lum);
    disabledBGColor = colorUtils.getDesaturatedColor(disabledBGColor, sat);
    colors.baseDisabled = disabledBGColor;

    // Hyperlink/Text Selection
    colors.hyperlinkText = colors.text;
    colors.hyperlinkTextHover = defaultColors.subtext;
    colors.selection = defaultColors.subtext;

    const tooltipContrast = colorUtils.getContrastColor(colors.darkest);
    defaultColors.tooltipText = tooltipContrast === 'white' ? 'ffffff' : '000000';
    colors.tooltipText = colorUtils.validateHex(colors.tooltipText || defaultColors.tooltipText);

    return personalizeStyles(colors);
  },

  /**
   * Set the font
   * @param {string} font The font name
   */
  setFont(font) {
    $('html').addClass(`font-${font}`);
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
    this.element.triggerHandler('colorschanged', {
      colors: this.settings.colors.header ||
        this.settings.colors || theme.themeColors().brand.primary.alt.value,
      isDefault: false,
      theme: this.currentTheme || 'theme-new-light'
    });
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
    this.element.triggerHandler('colorschanged', {
      colors: theme.themeColors().brand.primary.alt.value,
      isDefault: true,
      theme: this.currentTheme || 'theme-new-light'
    });
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
    if (!incomingTheme) {
      return;
    }
    incomingTheme = incomingTheme.replace('soho', 'classic').replace('uplift', 'new');

    // Somehow colorpicker uses this, so keep it
    this.currentTheme = incomingTheme;

    if (theme.currentTheme.id === incomingTheme) {
      if (!$html.hasClass(incomingTheme)) {
        $html.addClass(incomingTheme);
      }
      return;
    }

    // Adapt them for backwards compatibility
    const legacyThemeNames = ['light', 'dark', 'high-contrast'];
    if (legacyThemeNames.indexOf(incomingTheme) > -1) {
      incomingTheme += '-theme';
    }

    $html
      .removeClass((idx, val) => {
        const classes = val.split(' ');
        const toRemove = classes.filter(c => c.indexOf('theme') > -1);
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
      self.triggerEvent(incomingTheme);
    }).on('error', () => {
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

    // Do another color reset, if applicable
    this.setColors(this.settings.colors);
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
   * Trigger the change events.
   * @private
   * @param {string} incomingTheme Represents the file name of a color
   * @returns {void}
   */
  triggerEvent(incomingTheme) {
    /**
    * Fires after the theme is changed
    * @event themechanged
    * @memberof Personalize
    * @property {object} event - The jquery event object
    * @property {object} args - The event args
    * @property {string} args.theme - The theme id changed to.
    */
    this.element.triggerHandler('themechanged', {
      colors: this.settings.colors.header ||
        this.settings.colors || theme.themeColors().brand.primary.alt.value,
      theme: incomingTheme || 'theme-new-light'
    });
    $('body').trigger('resize');
  },

  /**
   * Removes a temporary page overlay built by `blockUi()`
   * @private
   * @returns {void}
   */
  unBlockUi() {
    const self = this;

    if (!self.settings.blockUI || !self.pageOverlay) {
      return;
    }

    self.pageOverlay.fadeOut(300, () => {
      self.pageOverlay.remove();
      self.pageOverlay = undefined;
    });
  },

  /**
   * Handle Updating Settings
   * @param {object} settings Incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (!settings) {
      return this;
    }

    // Copy the old settings to compare
    const prevSettings = utils.extend({}, this.settings);

    // Merge in the new settings
    this.settings = utils.mergeSettings(this.element[0], settings, this.settings);

    if (this.settingsDidChange(prevSettings, 'theme')) {
      this.setTheme(this.settings.theme);
    }

    if (this.settingsDidChange(prevSettings, 'colors')) {
      this.setColors(this.settings.colors);
    }

    if (this.settingsDidChange(prevSettings, 'font')) {
      this.setFont(this.settings.font);
    }

    return this;
  },

  /**
   * Compare previous settings to current settings
   * @param {object} prevSettings The previous settings object
   * @param {string} prop The property to compare
   * @returns {boolean} If the settings changed
   */
  settingsDidChange(prevSettings, prop) {
    return this.settings[prop] && this.settings[prop] !== prevSettings[prop];
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
