(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define('no-NO', ['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function () {

  if (!Locale) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Locale.addCulture('no-NO', {
    //layout/language
    language: 'no',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'dd.MM.yy', //use four digit year
                   'medium': 'd. MMM y',
                   'long': 'd. MMMM y',
                   'full': 'EEEE d. MMMM y',
                   'datetime': 'dd.MM.yy HH.mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated
      days: {
        wide: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
        abbreviated: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide and abbreviated
      months: {
        wide: ['februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
        abbreviated: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH.mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
     }],
     //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
     currencySign: 'kr', //(Replace Sign http://www.currencysymbols.in ?)
     currencyFormat: '¤ #,##0.00',
     //numbers/symbols-numberSystem-latn
     numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: '.'
     },
     //Resx
     messages: {
      'Required': {id: 'Required', value: 'Påkrevd', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Still inn Tid', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'i dag', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Timer', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'Minutter', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'Periode', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Bruk piltastene til å velge.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Laster', comment: 'Text below spinning indicator to indicate loading'}
    }
  });

}));
