(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function () {

  if (!Globalize) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Globalize.addCulture('en', {
    language: 'en',   //layout/language
    direction: 'left-to-right',   //layout/orientation/@characters
    calendars: [{    //ca-gregorian
      name: 'gregorian',
      dateFormat: {'seperator': '/', //Infered
                   'short': 'M/d/yy',
                   'medium': 'MMM d, y',
                   'long': 'MMMM d, y'},   //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      months: {'abbreviated': { //ca-gregorian/main/dates/calendars/gregorian/months/format/abbreviated
                  '1': 'Jan',
                  '2': 'Feb',
                  '3': 'Mar',
                  '4': 'Apr',
                  '5': 'May',
                  '6': 'Jun',
                  '7': 'Jul',
                  '8': 'Aug',
                  '9': 'Sep',
                  '10': 'Oct',
                  '11': 'Nov',
                  '12': 'Dec'},
                'wide': { //ca-gregorian/main/dates/calendars/gregorian/months/format/abbreviated
                  '1': 'January',
                  '2': 'February',
                  '3': 'March',
                  '4': 'April',
                  '5': 'May',
                  '6': 'June',
                  '7': 'July',
                  '8': 'August',
                  '9': 'September',
                  '10': 'October',
                  '11': 'November',
                  '12': 'December'
                }},
      timeFormat: 'h:mm a'    //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
     }],
     currencySign: '$', //(Replace Sign http://www.currencysymbols.in ?)
     currencyFormat: '¤#,##0.00', //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
     messages: {'Required': 'Required'} //Resx
  });

}));
