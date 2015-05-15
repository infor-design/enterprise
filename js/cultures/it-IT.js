(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/it-IT', ['jquery'], factory);
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
  Locale.addCulture('it-IT', {
    //layout/language
    language: 'it',
    englishName: 'Italian (Italy)',
    nativeName: 'italiano (Italia)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'dd/MMM/yyyy',
                   'long': 'dd MMMM yyyy',
                   'full': 'EEEE d MMMM yyyy',
                   'datetime': 'M/d/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
         abbreviated: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
        abbreviated: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
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
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'richiesto', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'impostare il tempo', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'oggi Stesso', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'orario', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'verbale', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'periodo', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Utilizzare i tasti freccia per selezionare.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Caricamento In Corso', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
