(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/ru-RU', ['jquery'], factory);
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
  Locale.addCulture('ru-RU', {
    //layout/language
    language: 'ru',
    englishName: 'Russian (Russia)',
    nativeName: 'русский (Россия)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '.', //Infered
                   'timeSeparator': ':',
                   'short': 'dd.MM.yyyy', //use four digit year
                   'medium': 'd MMM yyyy г.',
                   'long': 'd MMMM yyyy г.',
                   'full': 'EEEE, d MMMM yyyy г.',
                   'month': 'd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'H:mm:ss',
                   'datetime': 'M/d/yyyy H:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
         abbreviated: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        abbreviated: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'руб', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'требуется', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Установка времени', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'сегодня Днем', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'часов', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'минут', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'период', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Используйте клавиши со стрелками, чтобы выбрать.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'загрузка', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
