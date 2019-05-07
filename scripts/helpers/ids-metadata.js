/** Class representing the ids-identity library metadata */
"use strict";

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
  }

  /**
   * Get metadata for a specified theme
   * @param {string} themeName - The name of the theme
   */
  getTheme(themeName) {
    return this.metadataObj.themes.find(el => {
      return el.name === themeName;
    });
  }

  /**
   * Get metadata for all themes
   */
  getThemes() {
    return this.metadataObj.themes;
  }

  /**
   * Get the ids-identity version
   */
  getVersion() {
    return this.metadataObj.version;
  }
}
