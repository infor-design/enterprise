/** Class representing the ids-identity library metadata */

const fs = require('fs');
const slash = require('slash');

const rootDir = slash(process.cwd());
const themeData = `${rootDir}/node_modules/ids-identity/dist/metadata.json`;

module.exports = class IdsMetadata {
  /**
   * Create the metadata
   */
  constructor() {
    this.metadataObj = JSON.parse(fs.readFileSync(themeData, 'utf-8'));

    this.createFullName = (theme, variant) => `${theme}-${variant}`;
  }

  /**
   * Get metadata for a specified theme
   * @param {string} themeName The name of the theme
   * @returns {obj} A theme object
   */
  getTheme(themeName) {
    return this.metadataObj.themes.find(el => el.name === themeName);
  }

  /**
   * Get metadata for all themes
   * @returns {obj[]} Theme objects
   */
  getThemes() {
    return this.metadataObj.themes;
  }

  /**
   * Get all theme variants
   * @returns {string[]} Full theme-variant names (i.e. ["soho-light"])
   */
  getThemeVariants() {
    const themes = this.getThemes();
    const arr = [];

    themes.forEach((theme) => {
      arr.push(this.createFullName(theme.name, theme.base.name));
      theme.variants.forEach(variant =>
        arr.push(this.createFullName(theme.name, variant.name)));
    });

    return arr;
  }

  /**
   * Get the ids-identity version
   * @returns {string} A semver string
   */
  getVersion() {
    return this.metadataObj.version;
  }
};
