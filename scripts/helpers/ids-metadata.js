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

    this.createFullName = (theme, mode) => `${theme}-${mode}`;
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
   * Get all theme modes
   * @returns {string[]} Full theme-mode names (i.e. ["classic-light"])
   */
  getThemeModes() {
    const themes = this.getThemes();
    const arr = [];

    themes.forEach((theme) => {
      arr.push(this.createFullName(theme.name, theme.base.name));
      theme.modes.forEach(modes => arr.push(this.createFullName(theme.name, modes.name)));
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
