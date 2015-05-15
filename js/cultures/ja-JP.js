(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/ja-JP', ['jquery'], factory);
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
  Locale.addCulture('ja-JP', {
    //layout/language
    language: 'ja',
    englishName: 'Japanese (Japan)',
    nativeName: '日本語 (日本)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'yyyy/MM/dd', //use four digit year
                   'medium': 'yyyy/MM/dd',
                   'long': 'yyyy年M月d日',
                   'full': 'yyyy年M月d日EEEE',
                   'datetime': 'yyyy/MM/dd H:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
         abbreviated: ['日','月','火','水','木','金','土']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        abbreviated: ['1','2','3','4','5','6','7','8','9','10','11','12']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['正午', '午後']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '¥', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: '.',
      group: ','
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: '必須', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: '設定時間', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: '今日', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: '営業時間', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: '議事録', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: '期間', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. 選択するには矢印キーを使用して.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: '荷重', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
