(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/sv-SE', ['jquery'], factory);
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
  Locale.addCulture('sv-SE', {
    //layout/language
    language: 'sv',
    englishName: 'Swedish (Sweden)',
    nativeName: 'svenska (Sverige)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'M/d/yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE d MMMM yyyy',
                   'datetime': 'yyyy-MM-dd HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
         abbreviated: ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['fm', 'em']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'kr', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: ' '
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'Krävs', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Ställ in tid', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'Idag', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'timmar', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'minuter', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'period', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Använd piltangenterna för att välja.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Loading', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
