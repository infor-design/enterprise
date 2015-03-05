(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define('en-US', ['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function () {

  if (!Locale) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Locale.addCulture('da-DK', {
    //layout/language
    language: 'da',
    englishName: 'Danish (Denmark)',
    nativeName: 'dansk (Danmark)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'dd/MM/yyyy',
                   'long': 'd. MMM yyyy',
                   'full': 'EEEE den d. MMMM yyyy',
                   'datetime': 'dd/MM/yyyy HH.mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
         abbreviated: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
        abbreviated: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH.mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'kr', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'Nødvendig', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Indstil tid', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'i dag', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Timer', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'minutter', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'periode', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Brug piletasterne til at vælge.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Loading', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
