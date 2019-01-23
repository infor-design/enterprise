const fs = require('fs');

/**
 * Gets the contents of a file on the file system
 * @param {string} filePath the target file to be read.
 * @returns {string} containing the imported file.
 */
function getFileContents(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

module.exports = getFileContents;
