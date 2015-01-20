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

  function Locale(locale) {
    if (!(this instanceof Locale)) {
      return new Locale(locale);
    }
    var self = this;

    this.currentLocale = {name: '', data: {}}; //default
    this.cultures =  [];

    if (locale) { //Can init new Locale object
      self.set(locale);
    }
    this.updateLang();
  }

  Locale.prototype = {

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

    //Set the Local
    set: function (locale) {
      var self = this;
      this.dff = $.Deferred();

      if (locale && !this.cultures[locale] && this.currentLocale.name !== locale) {
        this.currentLocale.name = locale;

        //fetch the local and cache it
        $.ajax({
          url: this.scriptPath('sohoxi') + 'cultures/' + this.currentLocale.name + '.js',
          dataType: 'script',
          success: function () {
            self.currentLocale.name = locale;
            self.currentLocale.data = self.cultures[locale];
            self.dff.resolve(self.currentLocale.name);
            self.addCulture(locale, self.currentLocale.data);
          },
          error: function () {
            self.dff.reject();
          }
        });
      }

      this.currentLocale.name = locale;
      self.currentLocale.data = self.cultures[locale];
      this.updateLang();

      if (locale && self.currentLocale.data) {
        self.dff.resolve(self.currentLocale.name);
      }
      return this.dff.promise();
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
      ret = ret.replace('MM', this.pad(month+1, 2));  //number padded
      ret = ret.replace('M', month+1);                //number unpadded

      //years
      ret = ret.replace('yyyy', year);
      ret = ret.replace('yy', year.toString().substr(2));
      ret = ret.replace('y', year);

      return ret.trim();
    },

    // Take a date string written in the current locale and parse it into a Date Object
    parseDate: function(dateString, dateFormat) {

      if (!dateString) {
        return undefined;
      }
      if (!dateFormat) {
        dateFormat = this.calendar().dateFormat.short;
      }

      var formatParts = dateFormat.split('/'),
        dateStringParts = dateString.split('/'),
        dateObj = {};

      if (formatParts.length === 1) {
        formatParts = dateFormat.split('.');
      }

      if (dateStringParts.length === 1) {
        dateStringParts = dateString.split('.');
      }

      if (formatParts.length !== dateStringParts.length) {
        return undefined;
      }

      // Check the incoming date string's parts to make sure the values are valid against the localized
      // Date pattern.
      $.each(dateStringParts, function(i, value) {
        var pattern = formatParts[i],
          numberValue = parseInt(value);

        switch(pattern) {
          case 'd':
            if (numberValue < 1 || numberValue > 31) {
              return;
            }
            dateObj.day = value;
            break;
          case 'dd':
            if ((numberValue < 1 || numberValue > 31) || (numberValue < 10 && value.substr(0,1) !== '0')) {
              return;
            }
            dateObj.day = value;
            break;
          case 'M':
            if (numberValue < 1 || numberValue > 12) {
              return;
            }
            dateObj.month = value-1;
            break;
          case 'MM':
            if ((numberValue < 1 || numberValue > 12) || (numberValue < 10 && value.substr(0,1) !== '0')) {
              return;
            }
            dateObj.month = value-1;
            break;
          case 'yy':
            if ((numberValue < 0 || numberValue > 99) || (numberValue < 10 && value.substr(0,1) !== '0')) {
              return;
            }
            dateObj.year = parseInt('20'+value, 10);
            break;
          case 'yyyy':
            var lastTwo = value.substr(2,4),
              lastTwoNumber = parseInt(lastTwo);
            if ((lastTwoNumber < 0 || lastTwoNumber > 99) || (lastTwoNumber < 10 && lastTwo.substr(0,1) !== '0')) {
              return;
            }
            dateObj.year = value;
            break;
        }
      });

      if (!dateObj.year || (!dateObj.month && dateObj.month !==0) || !dateObj.day) {
        return undefined;
      }
      return new Date(dateObj.year, dateObj.month, dateObj.day);

    },

    // Overridable culture messages
    translate: function(key) {
      if (this.currentLocale.data.messages[key] === undefined) {
        // Need to substitue English Here
        return this.cultures['en'].messages[key];
      }
      return this.currentLocale.data.messages[key];
    },

    // Short cut function to get 'first' calendar
    calendar: function() {
      return this.currentLocale.data.calendars[0];
    },

    pad: function(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
  };

  window.Locale = new Locale('en');
}));
