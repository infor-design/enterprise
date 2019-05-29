/* eslint-disable no-bitwise, no-undef */

// Get Latest from http://www.unicode.org/Public/cldr/25/
Soho.Locale.addCulture('pt-BR', {
  // layout/language
  language: 'pt',
  englishName: 'Portuguese (Brazil)',
  nativeName: 'Português (Brasil)',
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
      medium: 'd de MMM de yyyy',
      long: 'd de MMMM de yyyy',
      full: 'EEEE, d de MMMM de yyyy',
      month: 'd de MMMM',
      year: 'MMMM de yyyy',
      timestamp: 'HH:mm:ss',
      datetime: 'dd/MM/yyyy HH:mm',
      timezone: 'dd/MM/yyyy HH:mm zz',
      timezoneLong: 'dd/MM/yyyy HH:mm zzzz'
    }, // Infered short + short gregorian/dateTimeFormats
    // ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
    days: {
      wide: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
      abbreviated: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      narrow: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    },
    // ca-gregorian/main/dates/calendars/gregorian/months/format/wide
    months: {
      wide: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      abbreviated: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    },
    // ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    timeFormat: 'HH:mm',
    // ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
    dayPeriods: ['AM', 'PM']
  }],
  // numbers/currencyFormats-numberSystem-latn/standard
  currencySign: 'R$',
  currencyFormat: '¤###',
  // numbers/symbols-numberSystem-latn
  numbers: {
    percentSign: '%',
    percentFormat: '### %',
    minusSign: '-',
    decimal: ',',
    group: '.',
    groupSizes: [3, 3]
  }
});
