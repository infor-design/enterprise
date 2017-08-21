/**
 * Default Number Mask Options
 */
var DEFAULT_NUMBER_MASK_OPTIONS = {
  prefix: Soho.masks.EMPTY_STRING,
  suffix: Soho.masks.EMPTY_STRING,
  allowThousandsSeparator: true,
  symbols: {
    currency: '$',
    decimal: '.',
    negative: '-',
    thousands: ','
  },
  allowDecimal: true,
  decimalLimit: 2,
  requireDecimal: false,
  allowNegative: false,
  allowLeadingZeroes: false,
  integerLimit: null
};

/**
 * Converts a string representing a formatted number into a Number Mask.
 * @param {String} strNumber
 * @returns {Array} - contains strings representing character literals and regex patterns.
 */
function convertToMask(strNumber) {
  return strNumber
    .split(Soho.masks.EMPTY_STRING)
    .map(function(char) {
      return Soho.masks.DIGITS_REGEX.test(char) ? Soho.masks.DIGITS_REGEX : char;
    });
}

/**
 * Adds thousands separators to the correct spot in a formatted number string.
 * @param {String} n - the string
 * @param {String} thousands - the thousands separator.
 * @returns {String} the incoming string formatted with a thousands separator.
 */
// http://stackoverflow.com/a/10899795/604296
function addThousandsSeparator(n, thousands) {
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
}

/**
 * Soho Number Mask Function
 * @param {String} rawValue
 * @param {Object} options
 */
window.Soho.masks.numberMask = function sohoNumberMask(rawValue, options) {

  // Handle default options
  options = Soho.utils.extend({}, DEFAULT_NUMBER_MASK_OPTIONS, options);

  var PREFIX = options.prefix,
    SUFFIX = options.suffix,
    DECIMAL = options.symbols.decimal,
    THOUSANDS = options.symbols.thousands,
    prefixLength = PREFIX && PREFIX.length || 0,
    suffixLength = SUFFIX && SUFFIX.length || 0,
    thousandsSeparatorSymbolLength = THOUSANDS && THOUSANDS.length || 0;

  function numberMask(rawValue) {
    if (typeof rawValue !== 'string') {
      rawValue = Soho.masks.EMPTY_STRING;
    }

    var rawValueLength = rawValue.length;

    if (
      rawValue === Soho.masks.EMPTY_STRING ||
      (rawValue[0] === PREFIX[0] && rawValueLength === 1)
    ) {
      return PREFIX.split(Soho.masks.EMPTY_STRING).concat([Soho.masks.DIGITS_REGEX]).concat(SUFFIX.split(Soho.masks.EMPTY_STRING));
    } else if(
      rawValue === DECIMAL && options.allowDecimal
    ) {
      return PREFIX.split(Soho.masks.EMPTY_STRING).concat(['0', DECIMAL, Soho.masks.DIGITS_REGEX]).concat(SUFFIX.split(Soho.masks.EMPTY_STRING));
    }

    var indexOfLastDecimal = rawValue.lastIndexOf(DECIMAL),
      hasDecimal = indexOfLastDecimal !== -1,
      isNegative = (rawValue[0] === options.symbols.negative) && options.allowNegative,
      integer,
      fraction,
      mask;

    // remove the suffix
    if (rawValue.slice(suffixLength * -1) === SUFFIX) {
      rawValue = rawValue.slice(0, suffixLength * -1);
    }

    if (hasDecimal && (options.allowDecimal || options.requireDecimal)) {
      integer = rawValue.slice(rawValue.slice(0, prefixLength) === PREFIX ? prefixLength : 0, indexOfLastDecimal);

      fraction = rawValue.slice(indexOfLastDecimal + 1, rawValueLength);
      fraction = convertToMask(fraction.replace(Soho.masks.NON_DIGITS_REGEX, Soho.masks.EMPTY_STRING));
    } else {
      if (rawValue.slice(0, prefixLength) === PREFIX) {
        integer = rawValue.slice(prefixLength);
      } else {
        integer = rawValue;
      }
    }

    if (options.integerLimit && typeof options.integerLimit === 'number') {
      var thousandsSeparatorRegex = THOUSANDS === '.' ? '[.]' : '' + THOUSANDS;
      var numberOfThousandSeparators = (integer.match(new RegExp(thousandsSeparatorRegex, 'g')) || []).length;

      integer = integer.slice(0, options.integerLimit + (isNegative ? 1 : 0) + (numberOfThousandSeparators * thousandsSeparatorSymbolLength));
    }

    integer = integer.replace(Soho.masks.NON_DIGITS_REGEX, Soho.masks.EMPTY_STRING);

    if (!options.allowLeadingZeroes) {
      integer = integer.replace(/^0+(0$|[^0])/, '$1');
    }

    integer = (options.allowThousandsSeparator) ? addThousandsSeparator(integer, THOUSANDS) : integer;

    mask = convertToMask(integer);

    if ((hasDecimal && options.allowDecimal) || options.requireDecimal === true) {
      if (rawValue[indexOfLastDecimal - 1] !== DECIMAL) {
        mask.push(Soho.masks.CARET_TRAP);
      }

      mask.push(DECIMAL, Soho.masks.CARET_TRAP);

      if (fraction) {
        if (typeof options.decimalLimit === 'number') {
          fraction = fraction.slice(0, options.decimalLimit);
        }

        mask = mask.concat(fraction);
      }

      if (options.requireDecimal === true && rawValue[indexOfLastDecimal - 1] === DECIMAL) {
        mask.push(Soho.masks.DIGITS_REGEX);
      }
    }

    if (prefixLength > 0) {
      mask = PREFIX.split(Soho.masks.EMPTY_STRING).concat(mask);
    }

    if (isNegative) {
      // If user is entering a negative number, add a mask placeholder spot to attract the caret to it.
      if (mask.length === prefixLength) {
        mask.push(Soho.masks.DIGITS_REGEX);
      }

      mask = [/-/].concat(mask);
    }

    if (SUFFIX.length > 0) {
      mask = mask.concat(SUFFIX.split(Soho.masks.EMPTY_STRING));
    }

    return mask;
  }

  numberMask.instanceOf = 'createNumberMask';

  return numberMask(rawValue);
};



/**
 * Generates a pipe function that can be applied to a Mask API that will correct
 * shorthand numeric dates.
 * NOTE: DOES NOT WORK FOR DATES WITH ALPHABETIC CONTENT. Do not use this if your
 * dates contain "MMM" or the full month name.
 */
window.Soho.masks.autocorrectedDatePipe = function autoCorrectedDatePipe(processResult, options) {
  if (!options.dateFormat) {
    options.dateFormat = Locale.calendar().dateFormat.short;
  }

  var indexesOfPipedChars = [],
    dateFormatArray = options.dateFormat.split(/[^dMy]+/),
    maxValue = {'d': 31, 'M': 12, 'yy': 99, 'yyyy': 9999},
    minValue = {'d': 1, 'M': 1, 'yy': 0, 'yyyy': 1},
    conformedValueArr = processResult.conformedValue.split('');

  // Check first digit
  dateFormatArray.forEach(function(format) {
    var position = options.dateFormat.indexOf(format);
    var maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

    if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
      conformedValueArr[position + 1] = conformedValueArr[position];
      conformedValueArr[position] = 0;
      indexesOfPipedChars.push(position);
    }
  });

  var placeholderRegex = new RegExp('[^'+ processResult.placeholderChar +']'),
    maskPieces = processResult.placeholder.split(placeholderRegex),
    conformedPieces = processResult.conformedValue.split(/\D/g);

  // Check for invalid date
  var isInvalid = dateFormatArray.some(function(format, i) {
    var length = maskPieces[i].length > format.length ? maskPieces[i].length : format.length,
      textValue = conformedPieces[i] || '',
      value = parseInt(textValue, 10);

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
