(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/id-ID', ['jquery'], factory);
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
  Locale.addCulture('id-ID', {
    //layout/language
    language: 'id',
    englishName: 'Indonesian (Indonesia)',
    nativeName: 'Bahasa Indonesia (Indonesia)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE, dd MMMM yyyy',
                   'datetime': 'dd/MM/yyyy HH.mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
         abbreviated: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH.mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'Rp', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'Yang Dibutuhkan', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Atur Waktu', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'Hari Ini', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'jam', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'menit', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'periode', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Gunakan tombol panah untuk memilih.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Pemuatan', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
