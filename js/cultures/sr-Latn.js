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
  Locale.addCulture('sr-Latn', {
    //layout/language
    language: 'sr-Latn',
    englishName: 'Serbian (Latin)',
    nativeName: 'srpski',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'd.M.yyyy.', //use four digit year
                   'medium': 'dd.MM.yyyy.',
                   'long': 'dd. MMMM yyyy.',
                   'full': 'EEEE, MMMM d, y',
                   'datetime': 'd.M.yyyy. HH.mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
         abbreviated: ['ned', 'pon', 'uto', 'sre', 'čet', 'pet', 'sub']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'maj', 'Jun', 'Jul', 'avg', 'Sep', 'okt', 'Nov', 'Dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH.mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['a', 'p']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'Дин.', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'потребан', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'сет Време', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'данас', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'сати', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'записник', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'период', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Користите стрелице за избор.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'утовар', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
