/**
 * string utils
 */
let stringUtils = {};

/**
 * The splice() method changes the content of a string by removing a range of
 * characters and/or adding new characters.
 *
 * @param {String} str The string that will be manipulated.
 * @param {number} start Index at which to start changing the string.
 * @param {number} delCount An integer indicating the number of old chars to remove.
 * @param {string} newSubStr The String that is spliced in.
 * @return {string} A new string with the spliced substring.
 */
stringUtils.splice = function splice(str, start, delCount, newSubStr) {
  return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount));
};


/**
 * Takes a string with possible duplicate characters and returns a string
 * containing ALL unique characters.  Useful for construction of REGEX objects
 * with characters from an input field, etc.
 */
stringUtils.removeDuplicates = function removeDuplicates(str) {
  return str
    .split('')
    .filter(function(item, pos, self) {
      return self.indexOf(item) === pos;
    })
    .join('');
};


export { stringUtils };
