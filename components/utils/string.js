const stringUtils = {};

/**
 * Re-usable Empty String that can be referenced everywhere to save small amounts of space.
 */
stringUtils.EMPTY = '';

/**
* The splice() method changes the content of a string by removing a range of
* characters and/or adding new characters.
*
* @param {string} str The string that will be manipulated.
* @param {number} start Index at which to start changing the string.
* @param {number} delCount An integer indicating the number of old chars to remove.
* @param {string} newSubStr The String that is spliced in.
* @returns {string} A new string with the spliced substring.
*/
stringUtils.splice = function splice(str, start, delCount, newSubStr) {
  return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
};

/**
 * Takes a string with possible duplicate characters and returns a string
 * containing ALL unique characters.  Useful for construction of REGEX objects
 * with characters from an input field, etc.
 * @param {string} str The string to process
 * @returns {string} The processed string
 */
stringUtils.removeDuplicates = function removeDuplicates(str) {
  return str
    .split('')
    .filter(function(item, pos, self) { //eslint-disable-line
      return self.indexOf(item) === pos;
    })
    .join('');
};

/**
 * Takes a string and uses a regex test to detect the presence of HTML elements.
 * @param {string} str The string to search
 * @returns {boolean} True if the string is contained.
 */
stringUtils.containsHTML = function containsHTML(str) {
  return /<[a-z][\s\S]*>/i.test(str);
};

/**
 * Takes a string and removes html tabs
 * @param {string} str The string to parse
 * @returns {string} The string minus html tags.
 */
stringUtils.stripHTML = function stripHTML(str) {
  let newStr = str;
  newStr = newStr.replace(/<\/?[^>]+(>|$)/g, '');
  return newStr;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str the incoming text
 * @returns {string} the modified text
 */
stringUtils.capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { stringUtils }; //eslint-disable-line
