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
 * Gets an array of Regex objects matching the number of digits present in a source string
 * @param {String} part - string representing the mark part.
 * @param {String} type - 'any', 'digits', or 'alphas'
 * @returns {Array}
 */
function getRegexForPart(part, type) {
  var types = {
    'any': Soho.masks.ANY_REGEX,
    'digits': Soho.masks.DIGITS_REGEX,
    'alphas': Soho.masks.ALPHAS_REGEX
  };

  if (!types[type]) {
    type = 'any';
  }

  var size = part.toString().length,
    arr = [];

  while (size > 0) {
    arr.push(types[type]);
    size = size - 1;
  }
  return arr;
}


/**
 * Gets an array of Regex objects matching the number of digits present in a source string
 * @param {String} part
 * @returns {Array}
 */
function getAlphasForPart(part) {

}


/**
 * Soho Number Mask Function
 * @param {String} rawValue
 * @param {Object} options
 * @returns {Array}
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
      // TODO: Allow the negative symbol as the suffix as well (SOHO-3259)
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
 * Default Date Mask Options
 */
var DEFAULT_DATETIME_MASK_OPTIONS = {
  format: 'M/d/yyyy',
  symbols: {
    timeSeparator: ':',
    dayPeriodSeparator: ' ',
    dateSeparator: '/'
  }
};

/**
 * Maximum Values for various section maps of date strings.
 */
var DATE_MAX_VALUES = {
  'dd': 31,
  'd': 31,
  'MMM': undefined,
  'MM': 12,
  'M': 12,
  'yy': 99,
  'yyyy': 9999,
  'h': 12,
  'HH': 24,
  'mm': 60,
  'ss': 60,
  'a': undefined
};


/**
 * Mask function that properly handles time formats.
 * This does NOT deal with AM/PM (day period), which will be handled by a normal pattern match.
 *
 */
window.Soho.masks.timeMask = function timeMask(rawValue, options) {
  options = Soho.utils.extend({}, DEFAULT_DATETIME_MASK_OPTIONS, options);

  var mask = [],
    digitRegex = Soho.masks.DIGITS_REGEX,
    rawValueArr = rawValue.split(options.symbols.timeSeparator),
    timeFormatArray = options.format.split(/[^Hhms]+/),
    timeFormatSections = timeFormatArray.length,
    maxValue = DATE_MAX_VALUES;

  timeFormatArray.forEach(function(format, i) {
    var additionalChars = [],
      maxValueForPart = maxValue[format],
      maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

    // If we don't already have a value here, simply push the longest-possible value
    if (!rawValueArr[i]) {
      additionalChars = getRegexForPart(maxValueForPart, 'digits');
    } else {
      // Check the rawValue's content.  If the "maxFirstDigit" for this section
      // is less than the provided digit's value, cut off the section and make this a "single digit"
      // section, even though multiple digits are normally allowed.
      // ONLY do this for `d` and `M`, not for `dd` and `MM`
      var rawValueStr = rawValueArr[i].toString(),
        rawValueFirstDigit = parseInt(rawValueStr.substr(0, 1), 10);

      if (format.length === 1 && rawValueFirstDigit > maxFirstDigit) {
        additionalChars.push(digitRegex);
      } else {
        additionalChars = getRegexForPart(maxValueForPart, '');
      }
    }

    // Add to the mask
    mask = mask.concat(additionalChars);

    // Add a section separator if we have another section to go.
    if (timeFormatSections > (i + 1)) {
      mask.push(options.symbols.timeSeparator);
    }
  });

  return mask;
};


/**
 * Mask function that properly handles short dates
 * @param {String} rawValue
 * @param {Object} options
 * @returns {Array}
 */
window.Soho.masks.shortDateMask = function shortDateMask(rawValue, options) {
  options = Soho.utils.extend({}, DEFAULT_DATETIME_MASK_OPTIONS, options);

  var mask = [],
    digitRegex = Soho.masks.DIGITS_REGEX,
    rawValueArr = rawValue.split(options.symbols.dateSeparator),
    dateFormatArray = options.format.split(/[^dMy]+/),
    dateFormatSections = dateFormatArray.length,
    maxValue = DATE_MAX_VALUES;

  dateFormatArray.forEach(function(format, i) {
    var additionalChars = [],
      maxValueForPart = maxValue[format],
      maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

    // If we don't already have a value here, simply push the longest-possible value
    if (!rawValueArr[i]) {
      additionalChars = getRegexForPart(maxValueForPart, 'digits');
    } else {
      // Check the rawValue's content.  If the "maxFirstDigit" for this section
      // is less than the provided digit's value, cut off the section and make this a "single digit"
      // section, even though multiple digits are normally allowed.
      // ONLY do this for `d` and `M`, not for `dd` and `MM`
      var rawValueStr = rawValueArr[i].toString(),
        rawValueFirstDigit = parseInt(rawValueStr.substr(0, 1), 10);

      if (format.length === 1 && rawValueFirstDigit > maxFirstDigit) {
        additionalChars.push(digitRegex);
      } else {
        additionalChars = getRegexForPart(maxValueForPart, 'digits');
      }
    }

    // Add to the mask
    mask = mask.concat(additionalChars);

    // Add a section separator if we have another section to go.
    if (dateFormatSections > (i + 1)) {
      mask.push(options.symbols.dateSeparator);
    }
  });

  return mask;
};


/**
 * Mask function that takes a custom date-time pattern and only formats the short date.
 * @param {String} rawValue
 * @param {Object} options
 * @returns {Array}
 */
window.Soho.masks.dateMask = function dateMask(rawValue, options) {
  options = Soho.utils.extend({}, DEFAULT_DATETIME_MASK_OPTIONS, options);

  var mask = [],
    SHORT_DATE_MARKER = '~',
    TIME_MARKER = '@',
    digitRegex = Soho.masks.DIGITS_REGEX,
    format = options.format.replace(SHORT_DATE_MARKER, '').replace(TIME_MARKER, ''),
    formatArray = format.split(/[^dMyHhmsa]+/),
    maxValue = DATE_MAX_VALUES;

  // Detect the existence of a short date, if applicable.
  var shortDates = (function(symbols) {
    var sep = symbols.dateSeparator;
    return [
      'd' + sep + 'M' + sep + 'yyyy',
      'dd' + sep + 'M' + sep + 'yyyy',
      'dd' + sep + 'MM' + sep + 'yyyy',
      'M' + sep + 'd' + sep + 'yyyy',
      'MM' + sep + 'd' + sep + 'yyyy',
      'MM' + sep + 'dd' + sep + 'yyyy',
      'yyyy' + sep + 'd' + sep + 'M',
      'yyyy' + sep + 'dd' + sep + 'M',
      'yyyy' + sep + 'dd' + sep + 'MM',
      'yyyy' + sep + 'M' + sep + 'd',
      'yyyy' + sep + 'MM' + sep + 'd',
      'yyyy' + sep + 'MM' + sep + 'dd'
    ];
  })(options.symbols);

  var times = (function(symbols) {
    var sep = symbols.timeSeparator;
    return [
      'HH' + sep + 'mm',
      'HH' + sep + 'mm' + sep + 'ss',
      'h' + sep + 'mm',
      'h' + sep + 'mm' + sep + 'ss',
    ];
  })(options.symbols);

  var shortDateMatch, shortDateStartIndex, shortDateMaskResult;
  for (var i = 0; i < shortDates.length; i++) {
    shortDateStartIndex = options.format.indexOf(shortDates[i]);
    if (shortDateStartIndex !== -1) {
      shortDateMatch = shortDates[i];
      break;
    }
  }

  if (shortDateMatch) {
    shortDateMaskResult = Soho.masks.shortDateMask(rawValue.substr(shortDateStartIndex, shortDateMatch.length), {
      format: shortDateMatch,
      symbols: options.symbols
    });

    // Reset everything to account for the removed short date.
    format = format.replace(shortDateMatch, SHORT_DATE_MARKER);
    formatArray = format.split(new RegExp('[^' + SHORT_DATE_MARKER + 'Hhmsa]+'));
  }

  var timeMatch, timeStartIndex, timeMaskResult;
  for (var j = 0; j < times.length; j++) {
    timeStartIndex = options.format.indexOf(times[j]);
    if (timeStartIndex !== -1) {
      timeMatch = times[j];
      break;
    }
  }

  if (timeMatch) {
    timeMaskResult = Soho.masks.timeMask(rawValue.substr(timeStartIndex, timeMatch.length), {
      format: timeMatch,
      symbols: options.symbols
    });

    // Reset everything to account for the removed time.
    format = format.replace(timeMatch, TIME_MARKER);
    formatArray = format.split(new RegExp('[^' + SHORT_DATE_MARKER + TIME_MARKER + 'dMya]+'));
  }

  formatArray.forEach(function(part, i) {
    var value = maxValue[part],
      isShortDate = shortDateMatch && part === SHORT_DATE_MARKER,
      isTime = timeMatch && part === TIME_MARKER,
      size;

    if (isShortDate) {
      // Match the (possibly) pre-existing, rendered short date.
      mask = mask.concat(shortDateMaskResult);
    } else if (isTime) {
      mask = mask.concat(timeMaskResult);
    } else if (part === 'a') {
      // Match the day period
      mask.push(/[aApP]/, /[Mm]/);
    } else if (!value) {
      mask.push(part.split(getRegexForPart(part, 'alphas')));
    } else {
      size = value.toString().length;

      while(size > 0) {
        mask.push(digitRegex);
        size = size - 1;
      }
    }

    // If this is not the last part, add whatever literals come after this part, but before the next part.
    var nextPart = formatArray[i+1];
    if (nextPart !== undefined) {
      var thisPartSize = isShortDate ? SHORT_DATE_MARKER.length :
        isTime ? TIME_MARKER.length :
        part.toString().length;

      var start = format.indexOf(part) + thisPartSize,
        end = format.indexOf(nextPart),
        literals = format.substring(start, end).split(Soho.masks.EMPTY_STRING);

      mask = mask.concat(literals);
    }
  });

  return mask;
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
