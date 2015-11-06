(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/en-ZA', ['jquery'], factory);
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
  Locale.addCulture('en-ZA', {
    //layout/language
    language: 'en',
    englishName: 'English (South Africa)',
    nativeName: 'English (South Africa)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'yyyy/MM/dd', //use four digit year
                   'medium': 'dd MMM yyyy',
                   'long': 'dd MMMM yyyy',
                   'full': 'EEEE dd MMMM yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'h:mm:ss a',
                   'datetime': 'yyyy/MM/dd h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
         abbreviated: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'S', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '#,##0 %',
      minusSign: '-',
      decimal: ',',
      group: ' '
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'Required', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Set Time', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'Today', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Hours', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'Minutes', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'Period', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Use arrow keys to select.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Loading', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
