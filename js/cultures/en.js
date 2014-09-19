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
  Globalize.addCulture('en', {
    language: 'en',   //layout/language
    direction: 'left-to-right',   //layout/orientation/@characters
    calendars: [{    //ca-gregorian
      name: 'gregorian',
      dateFormat: 'M/d/yy',   //ca-gregorian/main/dates/calendars/gregorian/dateFormats/short
      timeFormat: 'h:mm a'    //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
     }]
  });

}));
