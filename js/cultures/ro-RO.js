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
  Locale.addCulture('ro-RO', {
    //layout/language
    language: 'ro',
    englishName: 'Romanian (Romania)',
    nativeName: 'română (România)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '.', //Infered
                   'timeSeparator': ':',
                   'short': 'dd.MM.yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE, d MMMM yyyy',
                   'month': 'd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'dd.MM.yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
         abbreviated: ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
        abbreviated: ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['a.m.', 'p.m.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'lei', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'necesar', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Setarea timpului', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'astăzi', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Ore', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'Proces-verbal', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'perioadă', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Foloseste sagetile pentru a selecta.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'încărcare', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
