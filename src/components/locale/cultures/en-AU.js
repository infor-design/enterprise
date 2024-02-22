// Get Latest from http://www.unicode.org/Public/cldr/25/
Soho.Locale.addCulture('en-AU', {
  // layout/language
  language: 'en',
  englishName: 'English (Australia)',
  nativeName: 'English (Australia)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'd/MM/yyyy', // use four digit year
      medium: 'd MMM yyyy',
      long: 'd MMMM yyyy',
      full: 'EEEE, d MMMM yyyy',
      month: 'd MMMM',
      year: 'MMMM yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'h:mm:ss a',
      dateTimestamp: 'yyyy-MM-dd HH:mm:ss',
      timestampMillis: 'h:mm:ss.SSS a',
      hour: 'h:mm a',
      datetime: 'd/MM/yyyy h:mm a',
      datetimeMillis: 'd/MM/yyyy h:mm.SSS a',
      timezone: 'd/MM/yyyy h:mm a zz',
      timezoneLong: 'd/MM/yyyy h:mm a zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      narrow: ['S', 'M', 'Τ', 'W', 'T', 'F', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'h:mm a',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM'],
    firstDayofWeek: 0 // Starts on Sun
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '$',
  currencyFormat: '¤###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '### %',
    percentSuffix: ' %',
    percentPrefix: '',
    minusSign: '-',
    decimal: '.',
    group: ',',
    groupSizes: [3, 3]
  },
  punctuation: {
    comma: ','
  }
});
