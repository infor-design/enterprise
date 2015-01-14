(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function () {

  if (!Locale) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Locale.addCulture('en', {
    //layout/language
    language: 'en',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'M/d/yyyy', //use four digit year
                   'medium': 'MMM d, yyyy',
                   'long': 'MMMM d, yyyy'},
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated
      days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide and abbreviated
      months: {
        wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/abbreviated
      dayPeriods: ['AM', 'PM']
     }],
     //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
     currencySign: '$', //(Replace Sign http://www.currencysymbols.in ?)
     currencyFormat: '¤#,##0.00',
     //Resx
     messages: {
      'Required': 'Required',
      'SetTime': 'Set Time',
      'TimeHours': 'Hours',
      'TimeMintues': 'Minutes',
      'TimePeriod': 'Period',
      'UseArrowColor': 'Use arrow keys to select a color.',
      'UseArrowDate': 'Use arrow keys to select a date.',
      'UseArrowTime': 'Use arrow keys to select a time.'
    }
  });

}));
