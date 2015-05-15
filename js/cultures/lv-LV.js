(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/lv-LV', ['jquery'], factory);
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
  Locale.addCulture('lv-LV', {
    //layout/language
    language: 'lv',
    englishName: 'Latvian (Latvia)',
    nativeName: 'latviešu (Latvija)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'dd.MM.yyyy', //use four digit year
                   'medium': 'y. gada d. MMM',
                   'long': 'y. gada d. MMMM',
                   'full': 'EEEE, y. gada d. MMMM',
                   'datetime': 'dd.MM.yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['svētdiena', 'pirmdiena', 'otrdiena', 'trešdiena', 'ceturtdiena', 'piektdiena', 'sestdiena'],
         abbreviated: ['Sv', 'Pr', 'Ot', 'Tr', 'Ce', 'Pk', 'Se']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'],
        abbreviated: ['Janv.', 'Febr.', 'Marts', 'Apr.', 'Maijs', 'Jūn.', 'Jūl.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dec.']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['priekšpusdienā', 'pēcpusdienā']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'Ls', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: ' '
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'Nepieciešamais', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Iestatītu laiku', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'šodien', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'stundas', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'protokols', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'periods', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Izmanto bultiņas, lai atlasītu.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'iekraušana', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
