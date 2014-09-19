(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(jQuery);
  }
}(function () {

  if (!Globalize) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Globalize.addCulture('de', {
    language: 'de',   //layout/language
    direction: 'left-to-right',   //layout/orientation/@characters
    calendars: [{    //ca-gregorian
      name: 'gregorian',
      dateFormat: 'dd.MM.yy',   //ca-gregorian/main/dates/calendars/gregorian/dateFormats/short
      timeFormat: 'HH:mm'    //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
    }]
  });

}));
