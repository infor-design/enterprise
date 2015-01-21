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
  Locale.addCulture('de-DE', {
    //layout/language
    language: 'de',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'dd.MM.yyyy', //use four digit year
                   'medium': 'dd.MM.yyyy',
                   'long': 'd. MMMM yyyy'},
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated
      days: ['So', 'Mo', 'Tu', 'Di', 'Mi', 'Fr','Sa'],
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
    //Resx
    messages: {
      'Required': {value: 'Erforderlich', comment: 'indicates a form field is manditory'},
      'SetTime': {value: 'Uhrzeit', comment: 'button text that inserts time when clicked'},
      'Today': {value: 'Heute', comment: 'refering to today on a calendar'},
      'Hours': {value: 'Stunden', comment: 'the hour portion of a time'},
      'Minutes': {value: 'Minuten', comment: 'the minutes portion of a time'},
      'Period': {value: 'Zeit', comment: 'the am/pm portion of a time'},
      'UseArrow': {value: '. Mit den Pfeiltasten wählen Sie.', comment: 'Instructional comments for screen readers, starts with dot for a pause'}
    }
  });

}));
