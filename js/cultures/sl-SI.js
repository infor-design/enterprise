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
  Locale.addCulture('sl-SI', {
    //layout/language
    language: 'sl',
    englishName: 'Slovenian (Slovenia)',
    nativeName: 'slovenski (Slovenija)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'd. MM. yyyyy', //use four digit year
                   'medium': 'd. MMM yyyy',
                   'long': 'dd. MMMM yyyy',
                   'full': 'EEEE, dd. MMMM yyyy',
                   'datetime': 'd. MM. yyyyy HH.mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
         abbreviated: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
        abbreviated: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH.mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['dop.', 'pop.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'Sk', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'Zahtevana', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Set čas', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'danes', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'ur', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'minut', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'obdobje', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Uporabite smerne tipke za izbiro.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Nalaganje', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
