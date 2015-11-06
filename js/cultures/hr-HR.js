(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/hr-HR', ['jquery'], factory);
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
  Locale.addCulture('hr-HR', {
    //layout/language
    language: 'hr',
    englishName: 'Croatian (Croatia)',
    nativeName: 'hrvatski (Hrvatska)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '.', //Infered
                   'timeSeparator': ':',
                   'short': 'd.M.yyyy.', //use four digit year
                   'medium': 'd. MMM yyyy.',
                   'long': 'd. MMMM yyyyy.',
                   'full': 'EEEE, d. MMMM yyyyy.',
                   'month': 'd. MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'd.M.yyyy. HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
         abbreviated: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja', 'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca'],
        abbreviated: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'kn', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
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
      'Required': {id: 'Required', value: 'potreban', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Set vrijeme', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'danas', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Radno vrijeme', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'minuta', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'razdoblje', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Koristite tipke sa strelicama za odabir.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'utovar', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
