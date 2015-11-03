(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/lt-LT', ['jquery'], factory);
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
  Locale.addCulture('lt-LT', {
    //layout/language
    language: 'lt',
    englishName: 'Lithuanian (Lithuania)',
    nativeName: 'lietuvių (Lietuva)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '-', //Infered
                   'timeSeparator': ':',
                   'short': 'yyyy-MM-dd', //use four digit year
                   'medium': 'yyyy MMM d',
                   'long': 'yyyy m. MMMM d d.',
                   'full': 'yyyy m. MMMM d d., EEEE',
                   'month': 'MMMM d d.',
                   'year': 'yyyy m. MMMM',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'yyyy-MM-dd HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'],
         abbreviated: ['sk', 'pr', 'an', 'tr', 'kt', 'pn', 'št']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['sausis', 'vasaris', 'kovas', 'balandis', 'gegužė', 'birželis', 'rugpjūtis', 'rugsėjis', 'spalis', 'lapkritis', 'gruodis'],
        abbreviated: ['saus.','vas.','kov.','bal.','geg.','birž.','liep.','rugp.','rugs.', 'spal.', 'lapkr.', 'gruod.']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['pr.p.', 'pop.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'Lt', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'Reikalinga', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Nustatyti laikas', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'šiandien', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Darbo laikas', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'protokolas', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'laikotarpis', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Naudokite rodyklių klavišus, kad pasirinktumėte.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'pakrovimas', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
