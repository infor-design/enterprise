// Get Latest from http://www.unicode.org/Public/cldr/25/
Soho.Locale.addCulture('es-US', {
  // layout/language
  language: 'es',
  englishName: 'Spanish (United States)',
  nativeName: 'Español (Estados Unidos)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'M/d/yyyy', // use four digit year
      medium: 'MMM d, yyyy',
      long: 'd de MMMM de yyyy',
      full: 'EEEE, d de MMMM de yyyy',
      month: 'MMMM d',
      year: 'MMMM de yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'h:mm:ss a',
      timestampMillis: 'h:mm:ss.SSS a',
      hour: 'h:mm a',
      datetime: 'M/d/yyyy h:mm a',
      datetimeMillis: 'M/d/yyyy h:mm:ss.SSS a',
      timezone: 'M/d/yyyy h:mm a zz',
      timezoneLong: 'M/d/yyyy h:mm a zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      abbreviated: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
      narrow: ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      abbreviated: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic']
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
    groupSizes: [3, 0]
  },
  punctuation: {
    comma: ','
  }
});
