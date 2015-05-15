(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/nl-NL', ['jquery'], factory);
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
  Locale.addCulture('nl-NL', {
    //layout/language
    language: 'nl',
    englishName: 'Dutch (Netherlands)',
    nativeName: 'Nederlands (Nederland)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '-', //Infered
                   'short': 'dd-MM-yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE d MMMM yyyy',
                   'datetime': 'M/d/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
         abbreviated: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        abbreviated: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jul', 'Jul', 'aug', 'sep', 'okt', 'nov', 'dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '€', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤ #,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'verplicht', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Tijd instellen', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'vandaag Nog', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'uur', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'notulen', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'Periode', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Gebruik de pijltoetsen om te selecteren.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Bezig Met Laden', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
