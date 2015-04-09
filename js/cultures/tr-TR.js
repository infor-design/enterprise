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
  Locale.addCulture('tr-TR', {
    //layout/language
    language: 'tr',
    englishName: 'Turkish (Turkey)',
    nativeName: 'Türkçe (Türkiye)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '.', //Infered
                   'short': 'd.MM.yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'd MMMM yyyy EEEE',
                   'datetime': 'd.MM.yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
         abbreviated: ['Pa','Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        abbreviated: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ÖÖ', 'ÖS']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '₤', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'gereken', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Saat Set', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'Bugün Mü', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Saat', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'dakika', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'önem', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Seçmek için ok tuşlarını kullanın.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'yükleme', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
