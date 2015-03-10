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
  Locale.addCulture('fr-CA', {
    //layout/language
    language: 'fr',
    englishName: 'French (Canada)',
    nativeName: 'français (Canada)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'yyyy-MM-dd', //use four digit year
                   'medium': 'yyyy-MM-dd',
                   'long': 'd MMMM yyyyy',
                   'full': 'EEEE d MMMM yyyy',
                   'datetime': 'yyyy-MM-dd HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
         abbreviated: ['di', 'lu', 'ma', 'me', 'je', 've', 'sa']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
        abbreviated: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '$', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'requis', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'fixé temps', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'aujourd\'hui', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'heures', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'minute', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'période', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Utilisez les touches fléchées pour sélectionner.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'chargement', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
