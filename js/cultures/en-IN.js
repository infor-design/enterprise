(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/en-IN', ['jquery'], factory);
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
  Locale.addCulture('en-IN', {
    //layout/language
    language: 'en',
    englishName: 'English (India)',
    nativeName: 'English (India)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'dd-MMM-yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE d MMMM yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'h:mm:ss a',
                   'datetime': 'dd/MM/yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
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
      dayPeriods: ['am', 'pm']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '₹', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##,##0%',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '#,##0 %',
      minusSign: '-',
      decimal: '.',
      group: ','
    }
  });
}));
