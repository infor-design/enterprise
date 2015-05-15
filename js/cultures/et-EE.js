(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/et-EE', ['jquery'], factory);
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
  Locale.addCulture('et-EE', {
    //layout/language
    language: 'et',
    englishName: 'Estonian (Estonia)',
    nativeName: 'eesti (Eesti)',
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
                   'datetime': 'dd.MM.yyyy H:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'],
         abbreviated: ['P', 'E', 'T', 'K', 'N', 'R', 'L']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
        abbreviated: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'au', 'sept','okt', 'nov', 'dets']},
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['e.k.', 'p.k.']
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
      'Required': {id: 'Required', value: 'nõutav', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Määra aeg', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'täna', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'tööaeg', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'protokoll', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'periood', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Kasuta nooleklahve , et valida.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'laadimine', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
