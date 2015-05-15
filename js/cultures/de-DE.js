(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/de-DE', ['jquery'], factory);
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
  Locale.addCulture('de-DE', {
    //layout/language
    language: 'de',
    englishName: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'dd.MM.yyyy', //use four digit year
                   'medium': 'dd.MM.yyyy',
                   'long': 'd. MMMM yyyy',
                   'full': 'EEEE, d. MMMM y',
                   'datetime': 'dd.MM.yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated
      days: {
        wide: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        abbreviated: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr','Sa']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
            //ca-gregorian/main/dates/calendars/gregorian/months/format/wide and abbreviated
      months: {
        wide: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        abbreviated: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/abbreviated
      dayPeriods: ['vorm.', 'nachm.'] //Not used 24h
    }],
    //numbers/currencyFormats-numberSystem-latn/standard
    currencySign: '€',  //(Replace Sign http://www.currencysymbols.in ?)
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
     'Required': {id: 'Required', value: 'Erforderlich', comment: 'indicates a form field is manditory'},
     'SetTime': {id: 'SetTime', value: 'Uhrzeit', comment: 'button text that inserts time when clicked'},
     'Today': {id: 'Today', value: 'Heute', comment: 'refering to today on a calendar'},
     'Hours': {id: 'Hours', value: 'Stunden', comment: 'the hour portion of a time'},
     'Minutes': {id: 'Minutes', value: 'Minuten', comment: 'the minutes portion of a time'},
     'Period': {id: 'Period', value: 'Zeit', comment: 'the am/pm portion of a time'},
     'UseArrow': {id: 'UseArrow', value: '. Mit den Pfeiltasten wählen Sie.', comment: 'Instructional comments for screen readers, starts with dot for a pause'},
     'Loading': {id: 'Loading', value: 'Wird Geladen', comment: 'Text below spinning indicator to indicate loading'}
    }
  });

}));
