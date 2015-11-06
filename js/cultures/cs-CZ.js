(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/cs-CZ', ['jquery'], factory);
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
  Locale.addCulture('cs-CZ', {
    //layout/language
    language: 'cs',
    englishName: 'Czech (Czech Republic)',
    nativeName: 'čeština (Česká republika)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '.', //Infered
                   'timeSeparator': ':',
                   'short': 'dd.MM.yyyy', //use four digit year
                   'medium': 'd. M. yyyy',
                   'long': 'd. MMMM yyyy',
                   'full': 'EEEE d. MMMM yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'H:mm',
                   'datetime': 'dd.MM.yyyy H:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
         abbreviated: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'],
        abbreviated: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'H:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'Kč', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '#,##0 %',
      minusSign: '-',
      decimal: ',',
      group: ' '
    },
    //Resx - Approved By Translation Team
    messages: {
      'Required': {id: 'Required', value: 'potřebný', comment: 'indicates a form field is manditory'},
      'SetTime': {id: 'SetTime', value: 'Nastavení času', comment: 'button text that inserts time when clicked'},
      'Today': {id: 'Today', value: 'dnes', comment: 'refering to today on a calendar'},
      'Hours': {id: 'Hours', value: 'hodiny', comment: 'the hour portion of a time'},
      'Minutes': {id: 'Minutes', value: 'Minutes', comment: 'the minutes portion of a time'},
      'Period': {id: 'Period', value: 'zápis', comment: 'the am/pm portion of a time'},
      'UseArrow': {id: 'UseArrow', value: '. Pomocí kláves se šipkami vyberte.', comment: 'Instructional comments for screen readers'},
      'Loading': {id: 'Loading', value: 'Nakládání', comment: 'Text below spinning indicator to indicate loading'}
    }
  });
}));
