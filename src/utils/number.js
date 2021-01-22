const numberUtils = {};

/**
 * Truncates the number down by simply cutting off the number to the decimals provided.
 * Handles large numbers as strings up to 18, 6.
 * @param {string|number} number The number to truuncate.
 * @param  {number} [decimals=2] The decimals to truncate to.
 * @returns {string} The truncated number.
 */
numberUtils.truncate = function truncate(number, decimals = 2) {
  const numString = number.toString();
  const parts = numString.split('.');
  parts[1] = !parts[1] ? '' : parts[1].substr(0, decimals);
  return `${parts[0]}.${parts[1]}`;
};

/**
 * Rounds the number down by true rounding.
 * Handles large numbers as strings up to 18, 6.
 * @param {string|number} number The number to round.
 * @param  {number} [decimals=2] The decials to round to.
 * @returns {string} The rounded number.
 */
numberUtils.round = function round(number, decimals = 2) {
  return numberUtils.toFixed(number, decimals);
};

/**
 * Support function for toFixed that replaces JS toFixed and handles rounding properly.
 * This function does not handle big numbers.
 * @param  {string|number} number The number to fix.
 * @param  {decimals} [decimals=2] The decimal precision.
 * @returns {string} The string formatted to the precision.
 */
numberUtils.fixTo = function toFixed(number, decimals = 2) {
  return (+(Math.round(+(number + 'e' + decimals)) + 'e' + -decimals)).toFixed(decimals); //eslint-disable-line
};

/**
 * Returns a string representation of the number that does not use exponential notation
 * and has exactly digits after the decimal place. The number is rounded if necessary,
 * and the fractional part is padded with zeros if necessary so that it has the specified length.
 * This implementation handles greater or equal to 1e+21 so accepts string or number.
 * @param  {string|number} number The number to fix
 * @param  {decimals} [decimals=2] The decimal precision.
 * @returns {string} The string formatted to the precision.
 */
numberUtils.toFixed = function toFixed(number, decimals = 2) {
  // Parse the number into three parts. Max supported number is 18.6
  const numStr = number.toString();
  let parsedNum = '';
  const noDecimals = numStr.split('.');
  const parts = [noDecimals[0].substr(0, 10), noDecimals[0].substr(10), noDecimals[1]];

  let firstPart = parts[0];
  const lastPart = parts[1];
  parsedNum = this.fixTo((lastPart || firstPart) + (parts[2] ? `.${parts[2]}` : ''), decimals).toString();

  if (lastPart && parsedNum.length === 11 && parsedNum === '10000000000') {
    parsedNum = '0000000000';
    firstPart = (parseInt(firstPart, 10) + 1).toString();
  }

  if (lastPart && lastPart.substr(0, 1) !== '0') {
    parsedNum = firstPart + parsedNum;
  }
  if (lastPart && lastPart.substr(0, 1) === '0') {
    parsedNum = `${firstPart}0${parsedNum}`;
  }
  return parsedNum;
};

/**
 * Returns the number of decimal places in a number.
 * @param  {string|number} number The number to check.
 * @returns {number} The number of decimal places.
 */
numberUtils.decimalPlaces = function decimalPlaces(number) {
  if (Math.floor(number) === number) {
    return 0;
  }

  if (number.toString().indexOf('.') === -1) {
    return 0;
  }
  return number.toString().split('.')[1].length || 0;
};

export { numberUtils };
