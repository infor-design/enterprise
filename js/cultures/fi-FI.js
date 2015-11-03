(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/fi-FI', ['jquery'], factory);
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
  Locale.addCulture('fi-FI', {
    //layout/language
    language: 'fi',
    englishName: 'Finnish (Finland)',
    nativeName: 'suomi (Suomi)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '.', //Infered
                   'timeSeparator': ':',
                   'short': 'd.M.yyyy', //use four digit year
                   'medium': 'd.M.yyyy',
                   'long': 'd. MMMM yyyy',
                   'full': 'EEEE d. MMMM yyyyy',
                   'month': 'd. MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'H:mm:ss',
                   'datetime': 'd.M.y H:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['sunnuntaina', 'maanantaina', 'tiistaina', 'keskiviikkona', 'torstaina', 'perjantaina', 'lauantaina'],
         abbreviated: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'],
        abbreviated: ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ap.', 'ip.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '€', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'Pakollinen', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Aseta aika', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'tänään', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Tunnit', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'pöytäkirja', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'aika', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Käytä nuolinäppäimiä valitaksesi.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'ladataan', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
