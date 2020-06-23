import { utils } from '../../utils/utils';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { stringUtils as str } from '../../utils/string';
import { Locale } from '../locale/locale';

/**
 * Contains various Mask-related utilities, settings, masking functions, etc.
 * Available globally under `Soho.masks`.
 * @property {string} EMPTY_STRING just an empty string
 * @property {string} PLACEHOLDER_CHAR the default placeholder used in guides
 * @property {string} CARET_TRAP the string of characters representing a caret trap in mask arrays
 * @property {regexp} NON_DIGITS_REGEX regular expression that matches non-digit characters
 * @property {regexp} DIGITS_REGEX regular expression that matches digit characters
 * @property {regexp} ALPHAS_REGEX regular expression that matches alphabetic, non-special characters
 * @property {regexp} ANY_REGEX regular expression that matches any non-special characters
 * @property {object} LEGACY_DEFS mask definitions used by the old Soho Mask component.
 *  Will be translated to RegExp when a string-based pattern is convered to an array in the new Mask.
 * @property {object} DEFAULT_API_OPTIONS base options passed to a Mask API.
 * @property {object} DEFAULT_CONFORM_OPTIONS default set of options that get passed to `maskAPI.conformToMask()`
 */
const masks = {

  EMPTY_STRING: '',

  PLACEHOLDER_CHAR: '_',

  CARET_TRAP: '[]',

  NON_DIGITS_REGEX: /[^\u0660-\u06690-9\u0966-\u096F\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/g,

  DIGITS_REGEX: /[\u0660-\u06690-9\u0966-\u096F\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/,

  ALPHAS_REGEX: /[\u00C0-\u017Fa-zA-Z]/,

  ANY_REGEX: /[\u00C0-\u017Fa-zA-Z0-9]/,

  DEFAULT_API_OPTIONS: {
    locale: 'en-US',
    pattern: undefined,
    pipe: undefined
  }

};

// Legacy Mask pattern definitions.
// The New Mask works based on an array of RegExps and Strings.
masks.LEGACY_DEFS = {
  '#': masks.DIGITS_REGEX,
  0: masks.DIGITS_REGEX,
  x: masks.ALPHAS_REGEX,
  '*': masks.ANY_REGEX,
  '?': /./,
  '~': /[-0-9]/,
  a: /[APap]/,
  m: /[Mm]/
};

// Default options that get passed for the _conformToMask()_ method.
masks.DEFAULT_CONFORM_OPTIONS = {
  caretTrapIndexes: [],
  guide: true,
  previousMaskResult: masks.EMPTY_STRING,
  placeholderChar: masks.PLACEHOLDER_CHAR,
  placeholder: masks.EMPTY_STRING,
  selection: {
    start: 0
  },
  keepCharacterPositions: true
};

// Default Number Mask Options
const DEFAULT_NUMBER_MASK_OPTIONS = {
  prefix: masks.EMPTY_STRING,
  suffix: masks.EMPTY_STRING,
  allowThousandsSeparator: true,
  symbols: {
    currency: '$',
    decimal: '.',
    negative: '-',
    thousands: ','
  },
  allowDecimal: true,
  decimalLimit: 2,
  locale: '',
  requireDecimal: false,
  allowNegative: false,
  allowLeadingZeros: false,
  integerLimit: null
};

// Gets the number of leading zeros in a string representing a formatted number.
// @param {string} formattedStr the string to be checked
// @returns {number} containing the number of leading zeros.
function getLeadingZeros(formattedStr) {
  return `${formattedStr}`.match(/^0*/)[0].length;
}

// Converts a string representing a formatted number into a Number Mask.
// @param {string} strNumber incoming string
// @returns {array} contains strings representing character literals and regex patterns.
function convertToMask(strNumber) {
  return strNumber
    .split(masks.EMPTY_STRING)
    .map(char => (masks.DIGITS_REGEX.test(char) ? masks.DIGITS_REGEX : char));
}

// Adds thousands separators to the correct spot in a formatted number string.
// @param {string} n - the string
// @param {string} thousands - the thousands separator.
// @param {object} [options] - number mask function options.
// @param {object} [localeStringOpts] - settings for `toLocaleString`.
// @returns {string} the incoming string formatted with a thousands separator.
// http://stackoverflow.com/a/10899795/604296
function addThousandsSeparator(n, thousands, options, localeStringOpts) {
  if (n === '' || isNaN(n)) {
    return n;
  }

  let formatted = Locale.toLocaleString(Number(n), options.locale, localeStringOpts, thousands);

  // `Number.toLocaleString` does not account for leading zeroes, so we have to put them
  // back if we've configured this Mask to use them.
  if (options && options.allowLeadingZeros && n.indexOf('0') === 0) {
    let zeros = getLeadingZeros(n);
    if (formatted.indexOf('0') === 0) {
      formatted = formatted.substring(1);
    }
    while (zeros > 0) {
      zeros -= 1;
      formatted = `0${formatted}`;
    }
  }

  return formatted;
}

// Gets an array of Regex objects matching the number of digits present in a source string
// @param {string} part string representing the mark part.
// @param {string} type 'any', 'digits', or 'alphas'
// @returns {array} regex representing the part that was passed in.
function getRegexForPart(part, type) {
  const types = {
    any: masks.ANY_REGEX,
    digits: masks.DIGITS_REGEX,
    alphas: masks.ALPHAS_REGEX
  };

  if (!types[type]) {
    type = 'any';
  }

  let size = part.toString().length;
  const arr = [];

  while (size > 0) {
    arr.push(types[type]);
    size -= 1;
  }
  return arr;
}

/**
 * Soho Number Mask Function
 * @param {string} rawValue the un-formatted value that will eventually be masked.
 * @param {object} options masking options
 * @returns {array} representing a mask that will match a formatted number.
 */
masks.numberMask = function sohoNumberMask(rawValue, options) {
  options = utils.mergeSettings(undefined, options, DEFAULT_NUMBER_MASK_OPTIONS);
  if (!options.locale || !options.locale.length) {
    options.locale = Locale.currentLocale.name;
  }

  const dSeparator = Locale.getSeparator(options.locale, 'decimal');
  if (dSeparator === ',') {
    options.symbols.decimal = dSeparator;
  }

  // Deprecated in v4.25.1
  if (options.allowLeadingZeroes) {
    warnAboutDeprecation('allowLeadingZeros', 'allowLeadingZeroes', 'Number Mask');
    options.allowLeadingZeros = options.allowLeadingZeroes;
    options.allowLeadingZeroes = undefined;
  }

  const PREFIX = options.prefix;
  const SUFFIX = options.suffix;
  const DECIMAL = options.symbols.decimal;
  const THOUSANDS = options.symbols.thousands;
  const prefixLength = PREFIX && PREFIX.length || 0;
  const suffixLength = SUFFIX && SUFFIX.length || 0;
  const thousandsSeparatorSymbolLength = THOUSANDS && THOUSANDS.length || 0;

  function numberMask(thisRawValue) {
    if (typeof thisRawValue !== 'string') {
      thisRawValue = masks.EMPTY_STRING;
    }

    const rawValueLength = thisRawValue.length;

    if (
      thisRawValue === masks.EMPTY_STRING ||
      (thisRawValue[0] === PREFIX[0] && rawValueLength === 1)
    ) {
      return PREFIX.split(masks.EMPTY_STRING).concat([masks.DIGITS_REGEX])
        .concat(SUFFIX.split(masks.EMPTY_STRING));
    }
    if (
      thisRawValue === DECIMAL && options.allowDecimal
    ) {
      return PREFIX.split(masks.EMPTY_STRING).concat(['0', DECIMAL, masks.DIGITS_REGEX])
        .concat(SUFFIX.split(masks.EMPTY_STRING));
    }

    const indexOfLastDecimal = thisRawValue.lastIndexOf(DECIMAL);
    const hasDecimal = indexOfLastDecimal !== -1;
    const isNegative = (thisRawValue[0] === options.symbols.negative) && options.allowNegative;
    let integer;
    let fraction;
    let mask;

    // remove the suffix
    if (thisRawValue.slice(suffixLength * -1) === SUFFIX) {
      thisRawValue = thisRawValue.slice(0, suffixLength * -1);
    }

    if (hasDecimal) {
      integer = thisRawValue.slice(thisRawValue.slice(0, prefixLength) === PREFIX ?
        prefixLength : 0, indexOfLastDecimal);

      fraction = thisRawValue.slice(indexOfLastDecimal + 1, rawValueLength);
      fraction = convertToMask(fraction.replace(masks.NON_DIGITS_REGEX, masks.EMPTY_STRING));
    } else if (thisRawValue.slice(0, prefixLength) === PREFIX) {
      integer = thisRawValue.slice(prefixLength);
    } else {
      integer = thisRawValue;
    }

    if (options.integerLimit && typeof options.integerLimit === 'number') {
      const thousandsSeparatorRegex = THOUSANDS === '.' ? '[.]' : `${THOUSANDS}`;
      const numberOfThousandSeparators = (integer.match(new RegExp(thousandsSeparatorRegex, 'g')) || []).length;

      integer = integer.slice(0, options.integerLimit + (isNegative ? 1 : 0) +
        (numberOfThousandSeparators * thousandsSeparatorSymbolLength));
    }

    integer = integer.replace(masks.NON_DIGITS_REGEX, masks.EMPTY_STRING);

    if (!options.allowLeadingZeros) {
      integer = integer.replace(/^0+(0$|[^0])/, '$1');
    }

    const localeOptions = {
      maximumFractionDigits: options.decimalLimit,
      style: 'decimal',
      useGrouping: true
    };

    integer = (options.allowThousandsSeparator) ?
      addThousandsSeparator(integer, THOUSANDS, options, localeOptions) : integer;

    mask = convertToMask(integer);

    if ((hasDecimal && options.allowDecimal) || options.requireDecimal === true) {
      if (thisRawValue[indexOfLastDecimal - 1] !== DECIMAL) {
        mask.push(masks.CARET_TRAP);
      }

      mask.push(DECIMAL, masks.CARET_TRAP);

      if (fraction) {
        if (typeof options.decimalLimit === 'number') {
          fraction = fraction.slice(0, options.decimalLimit);
        }

        mask = mask.concat(fraction);
      }

      if (options.requireDecimal === true && thisRawValue[indexOfLastDecimal - 1] === DECIMAL) {
        mask.push(masks.DIGITS_REGEX);
      }
    }

    if (prefixLength > 0) {
      mask = PREFIX.split(masks.EMPTY_STRING).concat(mask);
    }

    if (isNegative) {
      // If user is entering a negative number, add a mask placeholder spot to
      // attract the caret to it.
      // TODO: Allow the negative symbol as the suffix as well (SOHO-3259)
      if (mask.length === prefixLength) {
        mask.push(masks.DIGITS_REGEX);
      }

      mask = [/-/].concat(mask);
    }

    if (SUFFIX.length > 0) {
      mask = mask.concat(SUFFIX.split(masks.EMPTY_STRING));
    }

    return mask;
  }

  numberMask.instanceOf = 'createNumberMask';

  return numberMask(rawValue);
};

// Default Date Mask Options
const DEFAULT_DATETIME_MASK_OPTIONS = {
  format: 'M/d/yyyy',
  symbols: {
    timeSeparator: ':',
    dayPeriodSeparator: ' ',
    dateSeparator: '/'
  }
};

// Maximum Values for various section maps of date strings.
const DATE_MAX_VALUES = {
  dd: 31,
  d: 31,
  MMM: undefined,
  MM: 12,
  M: 12,
  yy: 99,
  yyyy: 9999,
  h: 12,
  hh: 12,
  H: 24,
  HH: 24,
  mm: 60,
  ss: 60,
  a: undefined
};

/**
 * Soho Date Mask Function
 * @param {string} rawValue the un-formatted value that will eventually be masked.
 * @param {object} options masking options
 * @returns {array} representing a mask that will match a formatted date.
 */
masks.dateMask = function dateMask(rawValue, options) {
  options = utils.mergeSettings(undefined, options, DEFAULT_DATETIME_MASK_OPTIONS);

  let mask = [];
  const digitRegex = masks.DIGITS_REGEX;
  const format = options.format;
  const splitterStr = str.removeDuplicates(format.replace(/[dMyHhmsa]+/g, ''));
  const splitterRegex = new RegExp(`[${splitterStr}]+`);
  const formatArray = format.split(/[^dMyHhmsa]+/);
  const rawValueArray = rawValue.split(splitterRegex);
  const maxValue = DATE_MAX_VALUES;

  formatArray.forEach((part, i) => {
    const value = maxValue[part];
    let size;

    if (part === 'a' || part === 'ah') {
      let am = 'AM';
      let pm = 'PM';
      // Match the day period
      if (Locale.calendar()) {
        am = Locale.calendar().dayPeriods[0];
        pm = Locale.calendar().dayPeriods[1];
        const apRegex = [];

        for (let j = 0; j < am.length; j++) {
          if (am[j] && pm[j] && am[j].toLowerCase() === pm[j].toLowerCase()) {
            apRegex.push(am[j].toLowerCase());
          } else {
            apRegex.push(am[j].toLowerCase() + (pm[j] ? pm[j].toLowerCase() : ''));
          }
        }

        for (let k = 0; k < apRegex.length; k++) {
          mask.push(new RegExp(`[${apRegex[k]}]`, 'i'));
        }
      } else {
        mask.push(/[aApP]/, /[Mm]/);
      }
      if (part === 'ah') {
        const hourValue = rawValueArray[i].replace(am, '').replace(pm, '');
        mask = mask.concat(getRegexForPart(hourValue, 'digits'));
      }
    } else if (!value) {
      mask = mask.concat(getRegexForPart(part, 'alphas'));
    } else if (rawValueArray[i]) {
      // Detect based on the size of a pre-existing formatted value, if possible.
      const rawValueStr = rawValueArray[i].toString();
      const rawValueFirstDigit = parseInt(rawValueStr.substr(0, 1), 10);
      const maxFirstDigit = parseInt(maxValue[part].toString().substr(0, 1), 10);

      if (part.length === 1 && rawValueFirstDigit > maxFirstDigit) {
        mask.push(digitRegex);
      } else if (rawValueStr !== '0' && rawValueStr.length === 1 && rawValueFirstDigit <= maxFirstDigit && rawValueArray[i + 1] !== undefined && part.toUpperCase() !== 'HH') {
        mask.push(digitRegex);
      } else {
        mask = mask.concat(getRegexForPart(value, 'digits'));
      }
    } else {
      // If NOT possible, pass back the maximum digit length that can be entered here
      size = value.toString().length;
      while (size > 0) {
        mask.push(digitRegex);
        size -= 1;
      }
    }

    // If this is not the last part, add whatever literals come after this part,
    // but before the next part.
    const nextPart = formatArray[i + 1];
    if (nextPart !== undefined) {
      const thisPartSize = part.toString().length;
      const start = format.indexOf(part) + thisPartSize;
      const end = format.indexOf(nextPart);
      const literals = format.substring(start, end).split(masks.EMPTY_STRING);

      mask = mask.concat(literals);
    }
  });

  return mask;
};

/**
 * Soho Range Date Mask Function
 * @param {string} rawValue the un-formatted value that will eventually be masked.
 * @param {object} options masking options
 * @returns {array} representing a mask that will match a formatted date.
 */
masks.rangeDateMask = function (rawValue, options) {
  const parts = rawValue.split(options.delimeter);
  const delimiterArr = options.delimeter.split('');
  const firstDate = masks.dateMask(parts[0], options);
  let secondDate = [];

  if (parts[1]) {
    secondDate = masks.dateMask(parts[1], options);
  }

  return firstDate.concat(delimiterArr.concat(secondDate));
};

/**
 * Generates a pipe function that can be applied to a Mask API that will correct
 * shorthand numeric dates.
 * NOTE: DOES NOT WORK FOR DATES WITH ALPHABETIC CONTENT. Do not use this if your
 * dates contain "MMM" or the full month name.
 * @param {object} processResult the results object of a mask process
 * @param {object} options settings for the date pipe function
 * @returns {object} the result of the piping function's changes
 */
masks.autocorrectedDatePipe = function autoCorrectedDatePipe(processResult, options) {
  if (!options.dateFormat) {
    options.dateFormat = Locale.calendar().dateFormat.short;
  }

  const indexesOfPipedChars = [];
  const dateFormatArray = options.dateFormat.split(/[^dMy]+/);
  const maxValue = { d: 31, M: 12, yy: 99, yyyy: 9999 };
  const minValue = { d: 1, M: 1, yy: 0, yyyy: 1 };
  const conformedValueArr = processResult.conformedValue.split('');

  // Check first digit
  dateFormatArray.forEach((format) => {
    const position = options.dateFormat.indexOf(format);
    const maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

    if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
      conformedValueArr[position + 1] = conformedValueArr[position];
      conformedValueArr[position] = 0;
      indexesOfPipedChars.push(position);
    }
  });

  const placeholderRegex = new RegExp(`[^${processResult.placeholderChar}]`);
  const maskPieces = processResult.placeholder.split(placeholderRegex);
  const conformedPieces = processResult.conformedValue.split(/\D/g);

  // Check for invalid date
  const isInvalid = dateFormatArray.some((format, i) => {
    const length = maskPieces[i].length > format.length ? maskPieces[i].length : format.length;
    const textValue = conformedPieces[i] || '';
    const value = parseInt(textValue, 10);

    return value > maxValue[format] || (textValue.length === length && value < minValue[format]);
  });

  if (isInvalid) {
    return false;
  }

  return {
    value: conformedValueArr.join(''),
    characterIndexes: indexesOfPipedChars
  };
};

export { masks };
