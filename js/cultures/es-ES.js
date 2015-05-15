(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/es-ES', ['jquery'], factory);
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
  Locale.addCulture('es-ES', {
    //layout/language
    language: 'es',
    englishName: 'Spanish (Spain)',
    nativeName: 'Español (España)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
        name: 'gregorian',
        //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
        dateFormat: {'seperator': '/', //Infered
                     'short': 'd/M/yyyy', //use four digit year
                     'medium': 'd/M/yyy',
                     'long': 'd de MMMM de y',
                     'full': 'EEEE, d de MMMM de y',
                     'datetime': 'd/M/yyyy H:mm'}, //Infered short + short gregorian/dateTimeFormats
        //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated
        days: {
          wide: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          abbreviated: ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA']
        },
        //ca-gregorian/main/dates/calendars/gregorian/months/format/wide and abbreviated
        months: {
          wide: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          abbreviated: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic']
        },
        //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
        timeFormat: 'H:mm',
        //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/abbreviated
        dayPeriods: ['a.m.', 'p.m.']
      }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '€', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx
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
