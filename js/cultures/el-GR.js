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
  Locale.addCulture('el-GR', {
    //layout/language
    language: 'el',
      englishName: 'Greek (Greece)',
    nativeName: 'Ελληνικά (Ελλάδα)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'd/M/yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE, d MMMM yyyy',
                   'datetime': 'd/M/yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'],
         abbreviated: ['Κυ','Δε','Τρ','Τε','Πε','Πα','Σά']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου', 'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'],
        abbreviated: ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['π.μ.', 'μ.μ.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '€', //(Replace Sign http://www.currencysymbols.in ?)
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
      'Required': {id: 'Required', value: 'Απαραίτητα', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Ρύθμιση ώρας', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'σήμερα', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'Ώρες', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'πρακτικά', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'περίοδος', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Χρησιμοποιήστε τα πλήκτρα βέλους για να επιλέξετε.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'φόρτωση', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
