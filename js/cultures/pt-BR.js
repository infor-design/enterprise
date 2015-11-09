(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/pt-BR', ['jquery'], factory);
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
  Locale.addCulture('pt-BR', {
    //layout/language
    language: 'pt',
    englishName: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'dd/MM/yyyy',
                   'long': 'd de MMMM de yyyy',
                   'full': 'EEEE, d de MMMM de yyyy',
                   'month': 'd de MMMM',
                   'year': 'MMMM de yyyy',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'dd/MM/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
         abbreviated: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        abbreviated: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'R$', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '#,##0 %',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'Requeridos', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Defina o Tempo', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'hoje Mesmo', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'horas', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'atas', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'período', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Use as setas para selecionar.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'carregamento', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
