(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/vi-VN', ['jquery'], factory);
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
  Locale.addCulture('vi-VN', {
    //layout/language
    language: 'vi',
    englishName: 'Vietnamese (Vietnam)',
    nativeName: 'Tiếng Việt (Việt Nam)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'dd-MM-yyyy',
                   'long': 'ngày dd tháng MM năm yyyy',
                   'full': 'EEEE, ngày dd MMMM năm yyyy',
                   'datetime': 'dd/MM/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
          wide: ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],
          abbreviated: ['CN','Hai','Ba','Tư','Năm','Sáu','Bảy']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Tháng Giêng','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bảy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai'],
        abbreviated: ['Thg1','Thg2','Thg3','Thg4','Thg5','Thg6','Thg7','Thg8','Thg9','Thg10','Thg11','Thg12']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['SA', 'CH']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '₫', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'cần thiết', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Đặt Time', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'ngày nay', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'giờ', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'từ phút', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'thời gian', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Sử dụng các phím mũi tên để chọn.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Đang tải', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
