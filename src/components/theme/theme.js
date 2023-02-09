import { color as classicLightColors } from './theme-classic-colors.json';
import { color as classicDarkColors } from './theme-classic-dark-colors.json';
import { color as classicContrastColors } from './theme-classic-contrast-colors.json';
import { color as newLightColors } from './theme-new-colors.json';
import { color as newDarkColors } from './theme-new-dark-colors.json';
import { color as newContrastColors } from './theme-new-contrast-colors.json';
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
  currentTheme: { id: 'theme-new-light', name: Locale.translate('NewLightTheme') },

  /**
   * Get all of the colors for all themes
   * @returns {object[]} An array of color objects
   */
  allColors: [
    { id: 'theme-classic-light', colors: classicLightColors },
    { id: 'theme-classic-dark', colors: classicDarkColors },
    { id: 'theme-classic-contrast', colors: classicContrastColors },
    { id: 'theme-new-light', colors: newLightColors },
    { id: 'theme-new-dark', colors: newDarkColors },
    { id: 'theme-new-contrast', colors: newContrastColors }
  ],

  /**
   * Return a list of all the available themes
   * @returns {object[]} The list of themes
   */
  themes: function themes() {
    return [
      { id: 'theme-classic-light', name: Locale.translate('ClassicLightTheme'), themeId: 'theme-classic', modeId: 'light', modeName: Locale.translate('Light') },
      { id: 'theme-classic-dark', name: Locale.translate('ClassicDarkTheme'), themeId: 'theme-classic', modeId: 'dark', modeName: Locale.translate('Dark') },
      { id: 'theme-classic-contrast', name: Locale.translate('ClassicHighContrastTheme'), themeId: 'theme-classic', modeId: 'contrast', modeName: Locale.translate('Contrast') },
      { id: 'theme-new-light', name: Locale.translate('NewLightTheme'), themeId: 'theme-new', modeId: 'light', modeName: Locale.translate('Light') },
      { id: 'theme-new-dark', name: Locale.translate('NewDarkTheme'), themeId: 'theme-new', modeId: 'dark', modeName: Locale.translate('Dark') },
      { id: 'theme-new-contrast', name: Locale.translate('NewHighContrastTheme'), themeId: 'theme-new', modeId: 'contrast', modeName: Locale.translate('Contrast') }
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
    const defaultColor = () => ([
      { id: 'theme-classic-light', color: '#2578a9' },
      { id: 'theme-classic-dark', color: '#50535A' },
      { id: 'theme-classic-contrast', color: '#134d71' },
      { id: 'theme-new-light', color: '#ffffff' },
      { id: 'theme-new-dark', color: '#606066' },
      { id: 'theme-new-contrast', color: '#ffffff' }
    ].filter(color => color.id === this.currentTheme.id)?.[0]?.color);

    personalize.default = { id: 'default', name: Locale.translate('Default', opts), backgroundColorClass: 'primary-bg-color', value: defaultColor() || brand.primary.base.value };
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
    themeId = themeId.replace('soho', 'classic').replace('uplift', 'new');
    const result = this.themes().filter(themeObj => themeObj.id === themeId);

    if (result.length === 0) {
      return '';
    }
    this.currentTheme = result[0];
    return result;
  },

  /**
   * @returns {boolean} whether or not the current theme is an Uplift mode
   */
  get uplift() {
    return this.currentTheme.id.indexOf('-uplift-') > -1 || this.currentTheme.id.indexOf('-new-') > -1;
  },

  /**
   * @returns {boolean} whether or not the current theme is the new/uplift theme
   */
  get new() {
    return this.currentTheme.id.indexOf('-uplift-') > -1 || this.currentTheme.id.indexOf('-new-') > -1;
  }

};

export { theme };
