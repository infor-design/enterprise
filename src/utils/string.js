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
 * Takes a string containing HTML and strips it of extraneous white space.
 * @param {string} str The string to parse
 * @returns {string} The string minus extraneous white space.
 */
stringUtils.stripWhitespace = function stripWhitespace(str) {
  return str.replace(/\n/g, '')
    .replace(/[\t ]+</g, '<')
    .replace(/>[\t ]+</g, '><')
    .replace(/>[\t ]+$/g, '>');
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str the incoming text
 * @returns {string} the modified text
 */
stringUtils.capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * [capitalize description]
 * @param  {string} val A text string ("true" or "false") that can be converted to a boolean.
 * @returns {boolean} true or false
 */
stringUtils.toBoolean = function capitalize(val) {
  const num = +val;
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
};

/**
 * Return the width in pixels, assuming fontsize 14 as a default
 * @param  {string} text A text string to measure.
 * @param  {string} fontsize The elements font size (defaults to 14)
 * @returns {number} The text width.
 */
stringUtils.textWidth = function capitalize(text, fontsize = 14) {
  this.canvas = this.canvas || (this.canvas = document.createElement('canvas'));
  const context = this.canvas.getContext('2d');
  context.font = `${fontsize}px arial`;

  const metrics = context.measureText(text);
  return Math.round(metrics.width);
};

/**
 * Pad a date into a string with zeros added.
 * @private
 * @param {number} year The year to use.
 * @param {number} month The month to use.
 * @param {number} day The day to use.
 * @returns {void}
 */
stringUtils.padDate = function padDate(year, month, day) {
  return year + `0${month + 1}`.slice(-2) + `0${day}`.slice(-2);
};

/**
 * Calculate the width for given text string.
 * @private
 * @param {string} text string to process
 * @param {number} padding value for left + right
 * @param {string} font size and family used with the given text string
 * @returns {number} calculated width
 */
stringUtils.textWidth = function textWidth(text, padding, font) {
  const canvasTW = document.createElement('canvas');
  if (!canvasTW) return 0;
  const context = canvasTW.getContext('2d');
  if (!context) return 0;
  context.font = font || '14px arial';

  const metrics = context.measureText(text);
  return Math.round(metrics.width + (padding || 0));
};

/**
 * Escape user input that will be treated as a literal string.  This prevents incorrect
 * RegExp matching when converting user input.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 * @private
 * @param {string} s string to process.
 * @returns {string} string after escaping.
 */
stringUtils.escapeRegExp = function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& whole matched string
};

/**
 * Return the count of a occurences in a string
 * @param  {string} string The string
 * @param  {string} subString The substring to count
 * @returns {number} The frequency
 */
stringUtils.count = function count(string, subString) {
  return string.split(subString).length - 1;
};

/**
 * Checks a string to see if it represents a valid URL
 * @param {string} val incoming string
 * @returns {boolean} true if the value is a valid URL
 */
stringUtils.isValidURL = function isValidURL(val) {
  const urlRegexPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlRegexPattern.test(val);
};

export { stringUtils }; //eslint-disable-line
