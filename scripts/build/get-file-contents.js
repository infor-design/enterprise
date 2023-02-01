import * as fs from 'fs';

/**
 * Gets the contents of a file on the file system
 * @param {string} filePath the target file to be read.
 * @returns {string} containing the imported file.
 */
export default function getFileContents(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
