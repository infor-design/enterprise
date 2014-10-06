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
  Globalize.addCulture('de', {
    language: 'de',   //layout/language
    direction: 'left-to-right',   //layout/orientation/@characters
    calendars: [{    //ca-gregorian
      name: 'gregorian',
      dateFormat: {'short': 'dd.MM.yy',
                   'medium': 'dd.MM.y',
                   'long': 'd. MMMM y'},   //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      months: {'abbreviated': { //ca-gregorian/main/dates/calendars/gregorian/months/format/abbreviated
                  '1': 'Jan.',
                  '2': 'Feb.',
                  '3': 'März',
                  '4': 'Apr.',
                  '5': 'Mai',
                  '6': 'Juni',
                  '7': 'Juli',
                  '8': 'Aug.',
                  '9': 'Sep.',
                  '10': 'Okt.',
                  '11': 'Nov.',
                  '12': 'Dez.'},
                'wide': { //ca-gregorian/main/dates/calendars/gregorian/months/format/abbreviated
                  '1': 'Januar',
                  '2': 'Februar',
                  '3': 'März',
                  '4': 'April',
                  '5': 'Mai',
                  '6': 'Juni',
                  '7': 'Juli',
                  '8': 'August',
                  '9': 'September',
                  '10': 'Oktober',
                  '11': 'November',
                  '12': 'Dezember'
                }},
      timeFormat: 'HH:mm'    //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    }]
  });

}));
