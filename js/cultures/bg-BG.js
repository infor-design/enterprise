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
  Locale.addCulture('bg-BG', {
    //https://blazingbulgaria.wordpress.com/2012/06/15/time-in-bulgarian/
    //layout/language
    language: 'bg',
    englishName: 'Bulgarian (Bulgaria)',
    nativeName: 'български (България)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'd.MM.yyyy', //use four digit year
                   'medium': 'd.MM.y г.',
                   'long': 'd MMMM y г.',
                   'full': 'EEEEE, d MMMM y г.',
                   'datetime': 'd.MM.yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'],
         abbreviated: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'],
        abbreviated: ['ян', 'февр', 'март', 'апр', 'май', 'юни', 'юли', 'авг', 'септ', 'окт', 'ноем', 'дек']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['пр.об', 'сл.об']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'лв', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'длъжен', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Определете време', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'днес', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Часове', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'минути', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'период', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Използвайте клавишите със стрелки, за да изберете.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'товарене', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
