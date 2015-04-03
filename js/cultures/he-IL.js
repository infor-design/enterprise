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
  Locale.addCulture('he-IL', {
    //layout/language
    language: 'he',
    englishName: 'Hebrew (Israel)',
    nativeName: 'עברית (ישראל)',
    //layout/orientation/@characters
    direction: 'right-to-left',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'dd/MM/yyyy', //use four digit year
                   'medium': 'd בMMM yyyy',
                   'long': 'd בMMMM yyyy',
                   'full': 'EEEE, d בMMMM yyyy',
                   'datetime': 'dd/MM/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['יום ראשון','יום שני','יום שלישי','יום רביעי','יום חמישי','יום שישי','יום שבת'],
         abbreviated: ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
        abbreviated: ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['לפנה״צ', 'אחה״צ']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '₪', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: '.',
      group: ','
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'חובה', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'שעה יעודה', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'היום', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'שעות', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'דקות', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'תקופה', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. השתמש במקשי חצים כדי לבחור.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'מחכה', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
