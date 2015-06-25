/**
* Localization Routines
* Data From: http://www.unicode.org/repos/cldr-aux/json/22.1/main/
* For Docs See: http://ibm.co/1nXyNxp
*/

/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  //If there already exists a Locale object with a culturesPath use that path
  //This allows manually setting the directory for the culture files to be retrieved from
  var existingCulturePath = '';
  if (window.Locale && window.Locale.hasOwnProperty('culturesPath')) {
    existingCulturePath = window.Locale.culturesPath;
  }

  window.Locale = {

    currentLocale:  {name: '', data: {}}, //default
    cultures: [],
    culturesPath: existingCulturePath,

    //Sets the Lang in the Html Header
    updateLang: function () {
      $('html').attr('lang', this.currentLocale.name);
    },

    //Get the path to the directory with the cultures
    getCulturesPath: function() {
      if (!this.culturesPath) {
        var scripts = document.getElementsByTagName('script'),
          partialPathMin = 'sohoxi.min.js',
          partialPath = 'sohoxi.js';

        for (var i = 0; i < scripts.length; i++) {
          var src = scripts[i].src;
          if (scripts[i].id === 'sohoxi-script') {
            return src.substring(0, src.lastIndexOf('/')) + '/';
          }

          if (src.indexOf(partialPathMin) > -1) {
            this.culturesPath = src.replace(partialPathMin, '') + 'cultures/';
          }
          if (src.indexOf(partialPath) > -1) {
            this.culturesPath = src.replace(partialPath, '') + 'cultures/';
          }
        }
      }
      return this.culturesPath;
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
          url: this.getCulturesPath() + this.currentLocale.name + '.js',
          dataType: 'script',
          success: function () {
            self.currentLocale.name = locale;
            self.currentLocale.data = self.cultures[locale];
            self.addCulture(locale, self.currentLocale.data);
            self.dff.resolve(self.currentLocale.name);
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

      if (!value) {
        return undefined;
      }

      //Convert if a string..
      if (!(value instanceof Date)) {
        value = new Date(value);
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
      var day = value.getDate(), month = value.getMonth(), year = value.getFullYear(),
        mins = value.getMinutes(), hours = value.getHours(), seconds = value.getSeconds();

      //Special
      pattern = pattern.replace('ngày','nnnn');
      pattern = pattern.replace('tháng','t1áng');

      //Day of Month
      ret = pattern.replace('dd', this.pad(day, 2));
      ret = ret.replace('d', day);

      //years
      ret = ret.replace('yyyy', year);
      ret = ret.replace('yy', year.toString().substr(2));
      ret = ret.replace('y', year);

      //Time
      ret = ret.replace('hh', (hours > 12 ? hours - 12 : hours));
      ret = ret.replace('h', (hours > 12 ? hours - 12 : hours));
      ret = ret.replace('HH', hours);
      ret = ret.replace('mm', this.pad(mins, 2));
      ret = ret.replace('ss', seconds);
      ret = ret.replace(' a', ' '+ (hours > 12 ? cal.dayPeriods[1] : cal.dayPeriods[0]));

      //months
      ret = ret.replace('MMMM', cal.months.wide[month]);  //full
      ret = ret.replace('MMM', cal.months.abbreviated[month]);  //abreviation
      if (pattern.indexOf('MMM') === -1) {
        ret = ret.replace('MM', this.pad(month+1, 2));  //number padded
        ret = ret.replace('M', month+1);                //number unpadded
      }

      //Day of Week
      ret = ret.replace('EEEE', cal.days.wide[value.getDay()]);  //Day of Week
      ret = ret.replace('nnnn','ngày');
      ret = ret.replace('t1áng','tháng');

      return ret.trim();
    },

    // Take a date string written in the current locale and parse it into a Date Object
    parseDate: function(dateString, dateFormat) {
      var thisLocaleCalendar = this.calendar();

      if (!dateString) {
        return undefined;
      }
      if (!dateFormat) {
        dateFormat = this.calendar().dateFormat.short;
      }

      var formatParts,
        dateStringParts,
        dateObj = {},
        isDateTime = (dateFormat !== this.calendar().dateFormat.short);

      if(isDateTime) {
        //replace [space & colon] with "/"
        dateFormat = dateFormat.replace(/[\s:]/g,'/');
        dateString = dateString.replace(/[\s:]/g,'/');
      }

      formatParts = dateFormat.split('/');
      dateStringParts = dateString.split('/');

      if (formatParts.length === 1) {
        formatParts = dateFormat.split('.');
      }

      if (dateStringParts.length === 1) {
        dateStringParts = dateString.split('.');
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
          case 'h':
            if(!/^(0?[1-9]|1[0-9]|2[01234])$/.test(value)) {
              return;
            }
            dateObj.h = value;
            break;
          case 'mm':
            if(!/^([0-5]\d)$/.test(value)) {
              return;
            }
            dateObj.mm = value;
            break;
          case 'a':
            if(($.inArray(value.toLowerCase(), thisLocaleCalendar.dayPeriods) === -1) &&
              ($.inArray(value.toUpperCase(), thisLocaleCalendar.dayPeriods) === -1)) {
              return;
            }
            if((value.toLowerCase() === thisLocaleCalendar.dayPeriods[0]) ||
             (value.toUpperCase() === thisLocaleCalendar.dayPeriods[0])) {
              dateObj.a = 'AM';
            }
            if((value.toLowerCase() === thisLocaleCalendar.dayPeriods[1]) ||
             (value.toUpperCase() === thisLocaleCalendar.dayPeriods[1])) {
              dateObj.a = 'PM';
            }
            break;
        }
      });
      dateObj.return = new Date('error');
      dateObj.leapYear = ((dateObj.year % 4 === 0) && (dateObj.year % 100 !== 0)) || (dateObj.year % 400 === 0);

      if((isDateTime && !dateObj.h && !dateObj.mm)) {
        return undefined;
      }
      if((!dateObj.year ||(!dateObj.month && dateObj.month !==0) || !dateObj.day)) {
        return undefined;
      }
      if((dateObj.leapYear && (dateObj.month === 1 && dateObj.day > 29)) ||
        (!dateObj.leapYear && (dateObj.month === 1 && dateObj.day > 28))) {
        return undefined;
      }

      if(isDateTime) {
        if(dateObj.a) {
          dateObj.return = new Date(dateObj.year +'/'+ (dateObj.month + 1) +'/'+ dateObj.day +' '+ dateObj.h +':'+ dateObj.mm +' '+ dateObj.a);
        } else {
          dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm);
        }
      } else {
        dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day);
      }

      if(Object.prototype.toString.call(dateObj.return) === '[object Date]') { //it is a date
        if(isNaN( dateObj.return.getTime())) { //date is not valid
          dateObj.return = undefined;
        }
      } else { //not a date
        dateObj.return = undefined;
      }
      return dateObj.return;

    },

    //format a decimal with thousands and padding in the current locale
    // options.style can be decimal, currency, percent and integer
    // http://mzl.la/1MUOEWm
    // percentSign, minusSign, decimal, group
    // minimumFractionDigits (0), maximumFractionDigits (3)
    formatNumber: function(number, options) {
      //Lookup , decimals, decimalSep, thousandsSep
      var formattedNum, curFormat,
        decimal = options && options.decimal ? options.decimal : this.numbers().decimal,
        group = options && options.group ? options.group : this.numbers().group,
        minimumFractionDigits = options && options.minimumFractionDigits ? options.minimumFractionDigits : 0,
        maximumFractionDigits = options && options.maximumFractionDigits ? options.maximumFractionDigits : 3;

      if (options && options.style === 'integer') {
        maximumFractionDigits = 0;
        minimumFractionDigits = 0;
      }

      //Doc Note: Uses Rounding
      if (options && options.style === 'currency') {
        var sign = this.currentLocale.data.currencySign;

        maximumFractionDigits = 2;
        minimumFractionDigits = 2;
        curFormat = this.currentLocale.data.currencyFormat;
        curFormat = curFormat.replace('¤', sign);
      }

      if (typeof number === 'string') {
        number = parseFloat(number);
      }

      var parts = number.toFixed(maximumFractionDigits).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, group);
      formattedNum = parts.join(decimal);

      //TODO: Confirm Logic After All Locales are added.
      if (options && options.style === 'currency') {
        formattedNum = curFormat.replace('#,##0.00', formattedNum);
      }

      return formattedNum;
    },

    // Overridable culture messages
    translate: function(key) {
      if (this.currentLocale.data === undefined) {
        return key;
      }

      if (this.currentLocale.data.messages[key] === undefined) {
        // Substitue English Expression if missing
        if (this.cultures['en-US'].messages[key] === undefined) {
          return undefined;
        }
        return this.cultures['en-US'].messages[key].value;
      }

      if (this.currentLocale.data.messages[key] === undefined) {
        return undefined;
      }
      return this.currentLocale.data.messages[key].value;
    },

    // Short cut function to get 'first' calendar
    calendar: function() {
      return this.currentLocale.data.calendars[0];
    },

    // Short cut function to get numbers
    numbers: function() {
      return this.currentLocale.data.numbers;
    },

    pad: function(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
  };

  window.Locale.set('en-US');

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
