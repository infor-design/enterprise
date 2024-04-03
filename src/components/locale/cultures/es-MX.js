// Get Latest from http://www.unicode.org/Public/cldr/25/
Soho.Locale.addCulture('es-MX', {
  // layout/language
  language: 'es',
  englishName: 'Spanish (Mexico)',
  nativeName: 'Español (Mexico)',
  // layout/orientation/@characters
  direction: 'left-to-right',
  // ca-gregorian
  calendars: [{
    name: 'gregorian',
    // ca-gregorian/main/dates/calendars/gregorian/dateFormats/
    dateFormat: {
      separator: '/', // Infered
      timeSeparator: ':',
      short: 'dd/MM/yyyy', // use four digit year
      medium: 'd MMM y',
      long: 'dd de MMMM de yyyy',
      full: 'EEEE, d de MMMM de yyyy',
      month: 'dd de MMMM',
      year: 'MMMM de yyyy',
      dayOfWeek: 'EEE d',
      timestamp: 'H:mm:ss',
      timestampMillis: 'H:mm:ss.SSS',
      hour: 'H:mm',
      datetime: 'dd/MM/yyyy H:mm',
      dateTimestamp: 'dd/MM/yyyy H:mm:ss',
      datetimeMillis: 'dd/MM/yyyy H:mm:ss.SSS',
      timezone: 'dd/MM/yyyy H:mm zz',
      timezoneLong: 'dd/MM/yyyy H:mm zzzz'
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
    timeFormat: 'H:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['a.m.', 'p.m.'],
    firstDayofWeek: 0 // Starts on Sun
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: '$',
  currencyFormat: '¤###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '###%',
    percentSuffix: '%',
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
