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
  Locale.addCulture('zh-CN', {
    //layout/language
    language: 'zh',
    englishName: 'Chinese (Simplified, PRC)',
    nativeName: '中文(中华人民共和国)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'M/d/yyyy', //use four digit year
                   'medium': 'MMM d, yyyy',
                   'long': 'MMMM d, yyyy',
                   'full': 'EEEE, MMMM d, y',
                   'datetime': 'M/d/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
        wide: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        abbreviated: ['週日','週一','週二','週三','週四','週五','週六']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        abbreviated: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['上午', '下午']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '¥', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤ #,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: '.',
      group: ','
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: '需要', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: '设置时间', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: '今天', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: '小时', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: '分钟', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: '期', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. 使用箭头键选择.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: '载入中', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
