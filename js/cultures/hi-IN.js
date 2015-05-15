(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/hi-IN', ['jquery'], factory);
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
  Locale.addCulture('hi-IN', {
    //layout/language
    language: 'hi',
    englishName: 'Hindi (India)',
    nativeName: 'हिंदी (भारत)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '-', //Infered
                   'short': 'd-M-yyyy', //use four digit year
                   'medium': 'dd-MM-yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE, d MMMM yyyy',
                   'datetime': 'd-M-yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
        wide: ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'],
        abbreviated: ['र','सो','मं','बु','गु','शु','श']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'],
        abbreviated: ['ज','फ़','मा','अ','म','जू','जु','अ','सि','अ','न','दि']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['पूर्व', 'अपर']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '₹', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '"¤#,##,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: '.',
      group: ','
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'अपेक्षित', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'निर्धारित समय', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'आज श', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'घंट घंटे', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'कार्यवृत्त', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'पीरियड', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. चयन करने के लिए तीर कुंजी का प्रयोग करें.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'लोडिंग', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
