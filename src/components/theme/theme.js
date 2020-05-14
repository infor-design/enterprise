import { color as sohoLightColors } from './theme-soho-colors.json';
import { color as sohoDarkColors } from './theme-soho-dark-colors.json';
import { color as sohoContrastColors } from './theme-soho-contrast-colors.json';
import { color as upliftLightColors } from './theme-uplift-colors.json';
import { color as upliftDarkColors } from './theme-uplift-dark-colors.json';
import { color as upliftContrastColors } from './theme-uplift-contrast-colors.json';
import { Locale } from '../locale/locale';

/**
* The Theme Component is a lightweight wrapper for theme information, which contains the colors
* that are used on the theme.
* @class Theme
*/
const theme = {

  /**
   * @property {object} [currentTheme]
   * @property {string} [currentTheme.id]
   * @property {string} [currentTheme.name]
   */
  currentTheme: { id: 'theme-soho-light', name: Locale.translate('SohoLightTheme'), legacyId: 'light' },

  /**
   * Get all of the colors for all themes
   * @returns {object[]} An array of color objects
   */
  allColors: [
    { id: 'theme-soho-light', colors: sohoLightColors, legacyId: 'light' },
    { id: 'theme-soho-dark', colors: sohoDarkColors, legacyId: 'dark' },
    { id: 'theme-soho-contrast', colors: sohoContrastColors, legacyId: 'high-contrast' },
    { id: 'theme-uplift-light', colors: upliftLightColors },
    { id: 'theme-uplift-dark', colors: upliftDarkColors },
    { id: 'theme-uplift-contrast', colors: upliftContrastColors }
  ],

  /**
   * Return a list of all the available themes
   * @returns {object[]} The list of themes
   */
  themes: function themes() {
    return [
      { id: 'theme-soho-light', name: Locale.translate('SohoLightTheme'), themeId: 'theme-soho', variantId: 'light', variantName: Locale.translate('Light'), legacyId: 'light' },
      { id: 'theme-soho-dark', name: Locale.translate('SohoDarkTheme'), themeId: 'theme-soho', variantId: 'dark', variantName: Locale.translate('Dark'), legacyId: 'dark' },
      { id: 'theme-soho-contrast', name: Locale.translate('SohoHighContrastTheme'), themeId: 'theme-soho', variantId: 'contrast', variantName: Locale.translate('Contrast'), legacyId: 'high-contrast' },
      { id: 'theme-uplift-light', name: Locale.translate('UpliftLightTheme'), themeId: 'theme-uplift', variantId: 'light', variantName: Locale.translate('Light') },
      { id: 'theme-uplift-dark', name: Locale.translate('UpliftDarkTheme'), themeId: 'theme-uplift', variantId: 'dark', variantName: Locale.translate('Dark') },
      { id: 'theme-uplift-contrast', name: Locale.translate('UpliftHighContrastTheme'), themeId: 'theme-uplift', variantId: 'contrast', variantName: Locale.translate('Contrast') }
    ];
  },

  /**
   * Get the colors used in the current theme
   * @param {string} themeId The id of the theme.
   * @returns {object} An object full of the colors 01-10
   */
  themeColors: function themeColors() {
    const result = this.allColors.filter(color => color.id === this.currentTheme.id);
    if (!result[0]) {
      return { palette: { }, colors: { }, brand: { } };
    }

    return result[0].colors;
  },

  /**
   * Get the colors used in the current theme that are reccomended for personalization
   * @returns {object} An object full of the colors with id, name abd hex value
   */
  personalizationColors: function personalizationColors() {
    const palette = this.themeColors().palette;
    const brand = this.themeColors().brand;
    const personalize = {};
    const opts = { showBrackets: false };
    personalize.default = { id: 'default', name: Locale.translate('Default', opts), backgroundColorClass: 'primary-bg-color', value: brand.primary.base.value };
    personalize.amber = { id: 'amber', name: Locale.translate('Amber', opts), backgroundColorClass: 'amber09', value: palette.amber['90'].value };
    personalize.amethyst = { id: 'amethyst', name: Locale.translate('Amethyst', opts), backgroundColorClass: 'amethyst06', value: palette.amethyst['60'].value };
    personalize.azure = { id: 'azure', name: Locale.translate('Azure', opts), backgroundColorClass: 'azure07', value: palette.azure['70'].value };
    personalize.emerald = { id: 'emerald', name: Locale.translate('Emerald', opts), backgroundColorClass: 'emerald08', value: palette.emerald['80'].value };
    personalize.graphite = { id: 'graphite', name: Locale.translate('Graphite', opts), backgroundColorClass: 'graphite06', value: palette.graphite['60'].value };
    personalize.ruby = { id: 'ruby', name: Locale.translate('Ruby', opts), backgroundColorClass: 'ruby09', value: palette.ruby['90'].value };
    personalize.slate = { id: 'slate', name: Locale.translate('Slate', opts), backgroundColorClass: 'slate06', value: palette.slate['60'].value };
    personalize.turquoise = { id: 'turquoise', name: Locale.translate('Turquoise', opts), backgroundColorClass: 'turquoise09', value: palette.turquoise['90'].value };

    return personalize;
  },

  /**
   * Set the current application theme
   * @param {string} themeId The id of the theme
   * @returns {[type]} [description]
   */
  setTheme: function setTheme(themeId) {
    const result = this.themes().filter(themeObj => themeObj.id === themeId || (themeObj.legacyId && themeObj.legacyId === themeId)); //eslint-disable-line

    if (result.length === 0) {
      return '';
    }
    this.currentTheme = result[0];
    return result;
  },

  /**
   * @returns {boolean} whether or not the current theme is an Uplift variant
   */
  get uplift() {
    return this.currentTheme.id.indexOf('-uplift-') > -1;
  }

};

export { theme };
