(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/en-AR', ['jquery'], factory);
    factory();
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function () {

  if (!Locale) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Locale.addCulture('es-AR', {
    //layout/language
    language: 'es',
    englishName: 'Spanish (Argentina)',
    nativeName: 'Español (Argentina)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'd/M/yyyy', //use four digit year
                   'medium': 'd/M/yyyy',
                   'long': 'd de MMMM de yyyy',
                   'full': 'EEEE, d de MMMM de y',
                   'month': 'dd MMMM',
                   'year': 'MMMM de yyyy',
                   'timestamp': 'H:mm:ss',
                   'datetime': 'd/M/yyyy H:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
        wide: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        abbreviated: ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        abbreviated: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago','sep', 'oct', 'nov', 'dic']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['a.m.', 'p.m.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '$', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00"',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'necesario', comment: 'indicates a form field is manditory'},
     'SetTime': {id: 'SetTime', value: 'Establecer hora', comment: 'button text that inserts time when clicked'},
     'Today': {id: 'Today', value: 'hoy', comment: 'refering to today on a calendar'},
     'Hours': {id: 'Hours', value: 'horas', comment: 'the hour portion of a time'},
     'Minutes': {id: 'Minutes', value: 'acta', comment: 'the minutes portion of a time'},
     'Period': {id: 'Period', value: 'período', comment: 'the am/pm portion of a time'},
     'UseArrow': {id: 'UseArrow', value: '. Utilice las teclas de flecha para seleccionar.', comment: 'Instructional comments for screen readers'},
     'Loading': {id: 'Loading', value: 'Cargando', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
