/**
* Localization Routines
* Data From: http://www.unicode.org/repos/cldr-aux/json/22.1/main/
* For Docs See: http://ibm.co/1nXyNxp
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else {
    // No AMD. Register plugin with global jQuery object.
    factory(jQuery);
  }
}(function () {

  function Globalize(locale) {
    var self = this;

    this.currentLocale = {name: '', data: {}}; //default
    this.cultures =  [];

    if (locale) { //Can init new Globalize object
      $(document).ready(function() {
        self.locale(locale);
      });
    }
    this.updateLang();
  }

  Globalize.prototype = {
    init: function () {
      this.appendLang();
    },

    //Sets the Lang in the Html Header
    updateLang: function () {
      $('html').attr('lang', this.currentLocale.name);
    },

    //Get the Path of the Script
    scriptPath: function(partialPath) {
     var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (src.indexOf(partialPath) > -1) {
          return src.replace(new RegExp('(.*)'+partialPath+'\\.js$'), '$1');
        }
      }
    },

    addCulture: function(locale, data) {
      this.cultures[locale]= data;
    },

    //Set / Return the Local
    locale: function (locale) {
      var self = this;

      if (locale && !this.cultures[locale]) {
        this.currentLocale.name = locale;

        //fetch the local and cache it
        $.ajax({
          url: this.scriptPath('sohoxi') + 'cultures/' + this.currentLocale.name + '.js',
          dataType: 'script',
          success: function () {
            self.currentLocale.name = locale;
            self.currentLocale.data = self.cultures[locale];
          },
          async: false
        });
      }
      this.currentLocale.name = locale;
      self.currentLocale.data = self.cultures[locale];
      this.updateLang();
      return this.currentLocale.name;
    },

    //Format a Date Object and return it parsed in the current locale
    formatDate: function(value, attribs) {

      //We will use http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
      if (!attribs) {
        attribs = {date: 'short'};  //can be date, time, datetime or pattern
      }

      var data = this.currentLocale.data,
        pattern, ret = '', cal = (data.calendars ? data.calendars[0] : null);

      if (attribs.pattern) {
        pattern = attribs.pattern;
      }
      if (attribs.date) {
        pattern = cal.dateFormat[attribs.date];
      }

      if (!pattern) { //missing translations
        return undefined;
      }
      var day = value.getDate(), month = value.getMonth(), year = value.getFullYear();

      //Day of Month
      ret = pattern.replace('dd', this.pad(day, 2));
      ret = ret.replace('d', day);

      //months
      ret = ret.replace('MMMM', cal.months.wide[month]);  //full
      ret = ret.replace('MMM', cal.months.abbreviated[month]);  //abreviation
      ret = ret.replace('MM', this.pad(month, 2));  //number padded
      ret = ret.replace('M', month);                //number unpadded

      //years
      ret = ret.replace('yyyy', year);
      ret = ret.replace('yy', year.toString().substr(2));
      ret = ret.replace('y', year);

      return ret.trim();
    },

    translate: function(key) {
      return key;
    },

    pad: function(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
  };

  window.Globalize = new Globalize('en');

}));
