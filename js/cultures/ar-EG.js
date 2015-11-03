(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/ar-EG', ['jquery'], factory);
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
  Locale.addCulture('ar-EG', {
    //layout/language
    language: 'ar',
    englishName: 'Arabic (Egypt)',
    nativeName: 'العربية (مصر)',
    //layout/orientation/@characters
    direction: 'right-to-left',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'M/d/yyyy', //use four digit year
                   'medium': 'dd/MM/yyyy',
                   'long': 'd MMMM، yyyy',
                   'full': 'EEEE، d MMMM، yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'h:mm:ss a',
                   'datetime': 'M/d/yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'لسبت'],
         abbreviated: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        abbreviated: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ص', 'م']
    }, { name: 'islamic-umalqura',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'short': 'd/M/yyyy', //use four digit year
                   'medium': 'd MMM، yyyy',
                   'long': 'd MMM، yyyy G',
                   'full': 'EEEE، d MMMM، y G',
                   'datetime': 'd/M/yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
         abbreviated: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
        abbreviated: ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ص', 'م']
    }

    ],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '£', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤ #,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '٪',
      minusSign: '-',
      decimal: '٫',
      group: '٬'
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'مطلوب', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'مجموعة الوقت', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'اليوم', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'ساعات', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'دقائق', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'فترة', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. استخدام مفاتيح الأسهم لتحديد.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'تحميل', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
