import { color as lightColors } from './theme-soho-colors.json';
import { color as darkColors } from './theme-soho-dark-colors.json';
import { color as contrastColors } from './theme-soho-contrast-colors.json';
import { color as upliftColors } from './theme-uplift-colors.json';
import { Locale } from '../../components/locale/locale';

/**
* The Theme Component is a lightweight wrapper for theme information, which contains the colors
* that are used on the theme.
* @class Theme
*/
const theme = {

  /**
   * Return a list of all the available themes.
   * @returns {object} The id and name of the theme.
   */
  currentTheme: { id: 'light', name: Locale.translate('Light') },

  /**
   * Return a list of the colors across all themes.
   * @returns {array} An array with an object for each theme.
   */
  allColors: [
    { id: 'light', colors: lightColors },
    { id: 'dark', colors: darkColors },
    { id: 'high-contrast', colors: contrastColors },
    { id: 'uplift', colors: upliftColors }
  ],

  /**
   * Return a list of all the available themes.
   * @returns {array} The list of themes.
   */
  themes: function themes() {
    return [
      { id: 'light', name: Locale.translate('LightTheme') },
      { id: 'dark', name: Locale.translate('DarkTheme') },
      { id: 'high-contrast', name: Locale.translate('HighContrastTheme') },
      { id: 'uplift', name: Locale.translate('UpliftTheme') }
    ];
  },

  /**
   * Return the colors used in the current theme.
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
   * Return the colors used in the current theme that are reccomended for personalization.
   * @returns {object} An object full of the colors with id, name abd hex value.
   */
  personalizationColors: function themeColors() {
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
   * Set the current application theme.
   * @param {string} themeId The id of the theme.
   * @returns {[type]} [description]
   */
  setTheme: function setTheme(themeId) {
    const result = this.themes().filter(themeObj => themeObj.id === themeId);
    if (result.length === 0) {
      return '';
    }
    this.currentTheme = result[0];
    return result;
  }
};

export { theme };
