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
    cultures: {},
    culturesPath: existingCulturePath,

    //Sets the Lang in the Html Header
    updateLang: function () {
      var html = $('html');

      html.attr('lang', this.currentLocale.name);
      if (this.isRTL()) {
        html.attr('dir', 'rtl');
      } else {
        html.removeAttr('dir');
      }
    },

    //Get the path to the directory with the cultures
    getCulturesPath: function() {
      if (!this.culturesPath) {
        var scripts = document.getElementsByTagName('script'),
          partialPathMin = 'sohoxi.min.js',
          partialPath = 'sohoxi.js';

        for (var i = 0; i < scripts.length; i++) {
          var src = scripts[i].src;

          //remove from ? to end
          var idx = src.indexOf('?');
          if (src !== '' && idx > -1) {
            src = src.substr(0, idx);
          }

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

    cultureInHead: function() {
      var isThere = false,
        scripts = document.getElementsByTagName('script'),
        partialPath = 'cultures';


        for (var i = 0; i < scripts.length; i++) {
          var src = scripts[i].src;

          if (src.indexOf(partialPath) > -1) {
            isThere = true;
          }
        }

      return isThere;
    },

    addCulture: function(locale, data) {
      this.cultures[locale] = data;
    },

    //Set the Local
    set: function (locale) {

      var self = this;
      this.dff = $.Deferred();

      //Map incorrect java locale to correct locale
      if (locale === 'in-ID') {
        locale = 'id-ID';
      }

      if (locale && !this.cultures[locale] && this.currentLocale.name !== locale) {
        this.setCurrentLocale(locale);

        //fetch the local and cache it
        $.ajax({
          url: this.getCulturesPath() + this.currentLocale.name + '.js',
          dataType: 'script',
          success: function () {
            self.setCurrentLocale(locale, self.cultures[locale]);
            self.addCulture(locale, self.currentLocale.data);
            self.dff.resolve(self.currentLocale.name);
          },
          error: function () {
            self.dff.reject();
          }
        });
      }

      if (locale && self.currentLocale.data && self.currentLocale.dataName === locale) {
        self.dff.resolve(self.currentLocale.name);
      }

      self.setCurrentLocale(locale, self.cultures[locale]);

      if (self.cultures[locale] && this.cultureInHead()) {
        self.dff.resolve(self.currentLocale.name);
      }
      return this.dff.promise();
    },

    setCurrentLocale: function(name, data) {
      this.currentLocale.name = name;

      if (data) {
        this.currentLocale.data = data;
        this.currentLocale.dataName = name;
      }
      this.updateLang();
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

      // TODO: Can we handle this if (this.dff.state()==='pending')
       var data = this.currentLocale.data,
        pattern, ret = '', cal = (data.calendars ? data.calendars[0] : null);

      if (attribs.pattern) {
        pattern = attribs.pattern;
      }
      if (attribs.date) {
        pattern = cal.dateFormat[attribs.date];
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
      var showDayPeriods = ret.indexOf(' a') > -1;

      if (showDayPeriods && hours === 0) {
        ret = ret.replace('hh', 12);
        ret = ret.replace('h', 12);
      }

      ret = ret.replace('hh', (hours > 12 ? hours - 12 : hours));
      ret = ret.replace('h', (hours > 12 ? hours - 12 : hours));
      ret = ret.replace('HH', hours);
      ret = ret.replace('mm', this.pad(mins, 2));
      ret = ret.replace('ss', this.pad(seconds, 2));
      ret = ret.replace('SSS', this.pad(value.getMilliseconds(), 0));

      //months
      ret = ret.replace('MMMM', cal.months.wide[month]);  //full
      ret = ret.replace('MMM', cal.months.abbreviated[month]);  //abreviation
      if (pattern.indexOf('MMM') === -1) {
        ret = ret.replace('MM', this.pad(month+1, 2));  //number padded
        ret = ret.replace('M', month+1);                //number unpadded
      }

      //PM
      ret = ret.replace(' a', ' '+ (hours >= 12 ? cal.dayPeriods[1] : cal.dayPeriods[0]));

      //Day of Week
      ret = ret.replace('EEEE', cal.days.wide[value.getDay()]);  //Day of Week
      ret = ret.replace('nnnn','ngày');
      ret = ret.replace('t1áng','tháng');

      return ret.trim();
    },

    isValidDate: function (date) {
      if (Object.prototype.toString.call(date) === '[object Date]') {
        // it is a date
        if (isNaN(date.getTime())) {  // d.valueOf() could also work
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },

    // Take a date string written in the current locale and parse it into a Date Object
    parseDate: function(dateString, dateFormat, isStrict) {
      var thisLocaleCalendar = this.calendar(),
        orgDatestring = dateString;

      if (!dateString) {
        return undefined;
      }

      if (!dateFormat) {
        dateFormat = this.calendar().dateFormat.short;
      }

      if (dateFormat.pattern) {
        dateFormat = dateFormat.pattern;
      }

      var formatParts,
        dateStringParts,
        dateObj = {},
        isDateTime = (dateFormat.toLowerCase().indexOf('h') > -1);

      if (isDateTime) {
        //replace [space & colon & dot] with "/"
        dateFormat = dateFormat.replace(/[\s:.-]/g,'/');
        dateString = dateString.replace(/[\s:.]/g,'/');
      }

      if (dateFormat === 'Mdyyyy' || dateFormat === 'dMyyyy') {
        dateString = dateString.substr(0, dateString.length - 4) + '/' + dateString.substr(dateString.length - 4, dateString.length);
        dateString = dateString.substr(0, dateString.indexOf('/')/2) + '/' + dateString.substr(dateString.indexOf('/')/2);
      }

      if (dateFormat === 'Mdyyyy') {
        dateFormat = 'M/d/yyyy';
      }

      if (dateFormat === 'dMyyyy') {
        dateFormat = 'd/M/yyyy';
      }

      if (dateFormat.indexOf(' ') !== -1 ) {
        dateFormat = dateFormat.replace(/[\s:.]/g,'/');
        dateString = dateString.replace(/[\s:.]/g,'/');
      }

      if (dateFormat.indexOf(' ') === -1 && dateFormat.indexOf('.') === -1  && dateFormat.indexOf('/')  === -1 && dateFormat.indexOf('-')  === -1) {
        var lastChar = dateFormat[0],
          newFormat = '', newDateString = '';

        for (var j = 0; j < dateFormat.length; j++) {
          newFormat +=  (dateFormat[j] !== lastChar ? '/' + dateFormat[j]  : dateFormat[j]);
          newDateString += (dateFormat[j] !== lastChar ? '/' + dateString[j]  : dateString[j]);

          if (j > 1) {
            lastChar = dateFormat[j];
          }
        }

        dateString = newDateString;
        dateFormat = newFormat;
      }

      formatParts = dateFormat.split('/');
      dateStringParts = dateString.split('/');

      if (formatParts.length === 1) {
        formatParts = dateFormat.split('.');
      }

      if (dateStringParts.length === 1) {
        dateStringParts = dateString.split('.');
      }

      if (formatParts.length === 1) {
        formatParts = dateFormat.split('-');
      }

      if (dateStringParts.length === 1) {
        dateStringParts = dateString.split('-');
      }

      if (formatParts.length === 1) {
        formatParts = dateFormat.split(' ');
      }

      if (dateStringParts.length === 1) {
        dateStringParts = dateString.split(' ');
      }

      // Check the incoming date string's parts to make sure the values are valid against the localized
      // Date pattern.
      var month = this.getDatePart(formatParts, dateStringParts, 'M', 'MM', 'MMM'),
        year = this.getDatePart(formatParts, dateStringParts, 'yy', 'yyyy');

      for (var i = 0; i < dateStringParts.length; i++) {
        var pattern = formatParts[i],
          value = dateStringParts[i],
          numberValue = parseInt(value);

        switch(pattern) {
          case 'd':
            var lastDay = new Date(year, month, 0).getDate();

            if (numberValue < 1 || numberValue > 31 || numberValue > lastDay) {
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
          case 'MMM':
              var abrMonth = this.calendar().months.abbreviated;

              for (var l = 0; l < abrMonth.length; l++) {
                if (orgDatestring.indexOf(abrMonth[l]) > -1) {
                  dateObj.month = l;
                }
              }

              break;
          case 'MMMM':
            var textMonths = this.calendar().months.wide;

            for (var k = 0; k < textMonths.length; k++) {
              if (orgDatestring.indexOf(textMonths[k]) > -1) {
                dateObj.month = k;
              }
            }

            break;
          case 'yy':
            dateObj.year = parseInt('20'+value, 10);
            break;
          case 'yyyy':
            dateObj.year = value;
            break;
          case 'h':
            if (numberValue < 0 || numberValue > 12) {
              return;
            }
            dateObj.h = value;
            break;
          case 'HH':
            if (numberValue < 0 || numberValue > 24) {
              return;
            }
            dateObj.h = value;
            break;

          case 'ss':
            if (numberValue < 0 || numberValue > 60) {
              dateObj.ss = 0;
              break;
            }
            dateObj.ss = value;
            break;

          case 'mm':
            if (numberValue < 0 || numberValue > 60) {
              dateObj.mm = 0;
              break;
            }
            dateObj.mm = value;
            break;

          case 'a':
            if((value.toLowerCase() === thisLocaleCalendar.dayPeriods[0]) ||
             (value.toUpperCase() === thisLocaleCalendar.dayPeriods[0])) {
              dateObj.a = 'AM';
            }

            if((value.toLowerCase() === thisLocaleCalendar.dayPeriods[1]) ||
             (value.toUpperCase() === thisLocaleCalendar.dayPeriods[1])) {
              dateObj.a = 'PM';

              if (dateObj.h) {
                dateObj.h = parseInt(dateObj.h) + 12;
              }
            }
            break;
        }
      }

      dateObj.return = undefined;
      dateObj.leapYear = ((dateObj.year % 4 === 0) && (dateObj.year % 100 !== 0)) || (dateObj.year % 400 === 0);

      if ((isDateTime && !dateObj.h && !dateObj.mm)) {
        return undefined;
      }

      if (!dateObj.year && !isStrict) {
        dateObj.year = (new Date()).getFullYear();
      }

      if (!dateObj.month && !isStrict) {
        dateObj.month = (new Date()).getMonth();
      }

      if (!dateObj.day && !isStrict) {
        dateObj.day = 1;
      }

      if (isDateTime) {
        if (dateObj.h) {
          dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm);
        }
        if (dateObj.ss !== undefined) {
          dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.h, dateObj.mm, dateObj.ss);
        }
      } else {
        dateObj.return = new Date(dateObj.year, dateObj.month, dateObj.day);
      }

      return (this.isValidDate(dateObj.return) ? dateObj.return : undefined);

    },

    getDatePart: function (formatParts, dateStringParts, filter1, filter2, filter3) {
      var ret = 0;

      $.each(dateStringParts, function(i) {
        if (filter1 === formatParts[i] || filter2 === formatParts[i] || filter3 === formatParts[i]) {
          ret = dateStringParts[i];
        }
      });

      return ret;
    },

    //format a decimal with thousands and padding in the current locale
    // options.style can be decimal, currency, percent and integer
    // http://mzl.la/1MUOEWm
    // percentSign, minusSign, decimal, group
    // minimumFractionDigits (0), maximumFractionDigits (3)
    formatNumber: function(number, options) {
      //Lookup , decimals, decimalSep, thousandsSep
      var formattedNum, curFormat, percentFormat,
        decimal = options && options.decimal ? options.decimal : this.numbers().decimal,
        group = options && options.group ? options.group : this.numbers().group,
        minimumFractionDigits = options && options.minimumFractionDigits !== undefined ? options.minimumFractionDigits : (options && options.style && (options.style === 'currency' || options.style === 'percent') ? 2: 2),
        maximumFractionDigits = options && options.maximumFractionDigits !== undefined ? options.maximumFractionDigits : (options && options.style && (options.style === 'currency' || options.style === 'percent') ? 2: (options && options.minimumFractionDigits ? options.minimumFractionDigits :3));

      if (number === undefined || number === null || number === '') {
        return undefined;
      }

      if (options && options.style === 'integer') {
        maximumFractionDigits = 0;
        minimumFractionDigits = 0;
      }

      if (options && options.style === 'percent') {
        minimumFractionDigits = 2;
      }

      //TODO: Doc Note: Uses Truncation
      if (options && options.style === 'currency') {
        var sign = this.currentLocale.data.currencySign;

        curFormat = this.currentLocale.data.currencyFormat;
        curFormat = curFormat.replace('¤', sign);
      }

      if (options && options.style === 'percent') {
        var percentSign = this.currentLocale.data.numbers.percentSign;

        percentFormat = this.currentLocale.data.numbers.percentFormat;
        percentFormat = percentFormat.replace('¤', percentSign);
      }

      if (typeof number === 'string') {
        number = parseFloat(number);
      }

      if (options && options.style === 'percent') {
        number = number * 100;
      }

      var parts = this.truncateDecimals(number, minimumFractionDigits, maximumFractionDigits, options && options.round).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, group);
      formattedNum = parts.join(decimal);

      if (minimumFractionDigits === 0) { //Not default
        formattedNum = formattedNum.replace(/(\.[0-9]*?)0+$/, '$1'); // remove trailing zeros
        formattedNum = formattedNum.replace(/\.$/, '');              // remove trailing dot
      }

      if (minimumFractionDigits > 0) {
        var expr = new RegExp('(\\..{' + minimumFractionDigits+ '}[0-9]*?)0+$');
        formattedNum = formattedNum.replace(expr, '$1'); // remove trailing zeros
        formattedNum = formattedNum.replace(/\.$/, '');  // remove trailing dot
      }

      //Confirm Logic After All Locales are added.
      if (options && options.style === 'currency') {
        formattedNum = curFormat.replace('#,##0.00', formattedNum);
      }

      if (options && options.style === 'percent') {
        formattedNum = percentFormat.replace('#,##0', formattedNum);
      }

      return formattedNum;
    },

    decimalPlaces: function(number) {
      var result= /^-?[0-9]+\.([0-9]+)$/.exec(number);
      return result === null ? 0 : result[1].length;
    },

    truncateDecimals: function (number, minDigits, maxDigits, round) {
      var multiplier = Math.pow(10, maxDigits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

      //Round Decimals
      var decimals = this.decimalPlaces(number);
      if (round && decimals >= maxDigits && adjustedNum > 0) {
        truncatedNum = Math.ceil(adjustedNum);
      }

      if (round && decimals <= maxDigits && decimals > 0) {
        truncatedNum = Math.ceil(adjustedNum);
      }

      if (decimals <= maxDigits && decimals > 0) {
        truncatedNum = Math.ceil(adjustedNum);
        maxDigits = Math.max(decimals, minDigits);
      }

      return (truncatedNum / multiplier).toFixed(maxDigits);
    },


    //Take a Formatted Number and return a real number
    parseNumber: function(input) {
      var numSettings = this.currentLocale.data.numbers,
        numString;

      numString = input;

      if (!numString) {
        return NaN;
      }

      numString = numString.replace(new RegExp('\\' + numSettings.group, 'g'), '');
      numString = numString.replace(numSettings.decimal, '.');
      numString = numString.replace(numSettings.percentSign, '');
      numString = numString.replace(this.currentLocale.data.currencySign, '');
      numString = numString.replace(' ', '');

      return parseFloat(numString);
    },

    // Overridable culture messages
    translate: function(key) {
      if (this.currentLocale.data === undefined || this.currentLocale.data.messages === undefined) {
        return key;
      }

      if (this.currentLocale.data.messages[key] === undefined) {
        // Substitue English Expression if missing
        if (!this.cultures['en-US'] || this.cultures['en-US'].messages[key] === undefined) {
          return undefined;
        }
        return this.cultures['en-US'].messages[key].value;
      }

      return this.currentLocale.data.messages[key].value;
    },

    // Translate Day Period
    translateDayPeriod: function(period) {
      if (/am|pm|AM|PM/i.test(period)) {
        return Locale.calendar().dayPeriods[/AM|am/i.test(period) ? 0 : 1];
      }
      return period;
    },

    // Short cut function to get 'first' calendar
    calendar: function() {
      if (this.currentLocale.data.calendars) {
        return this.currentLocale.data.calendars[0];
      }

      //Defaults to ISO 8601
      return {dateFormat: 'yyyy-MM-dd', timeFormat: 'HH:mm:ss'};
    },

    // Short cut function to get numbers
    numbers: function() {
      return this.currentLocale.data.numbers;
    },

    pad: function(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },

    isRTL: function() {
      return this.currentLocale.data.direction === 'right-to-left';
    },

    flipIconsHorizontally: function() {
      var icons = [
        'icon-attach',
        'icon-bottom-aligned',
        'icon-bullet-list',
        'icon-cancel',
        'icon-cart',
        'icon-collapse-app-tray',
        'icon-cut',
        'icon-document',
        'icon-drilldown',
        'icon-duplicate',
        'icon-expand-app-tray',
        'icon-export',
        'icon-first-page',
        'icon-folder',
        'icon-import',
        'icon-last-page',
        'icon-launch',
        'icon-left-align',
        'icon-left-text-align',
        'icon-left-arrow',
        'icon-new-document',
        'icon-next-page',
        'icon-number-list',
        'icon-paste',
        'icon-previous-page',
        'icon-quote',
        'icon-redo',
        'icon-refresh',
        'icon-right-align',
        'icon-right-arrow',
        'icon-right-text-align',
        'icon-save',
        'icon-search-folder',
        'icon-search-list',
        'icon-search',
        'icon-send',
        'icon-tack',
        'icon-tree-collapse',
        'icon-tree-expand',
        'icon-undo',
        'icon-unlocked',
        'icon-add-grid-record',
        'icon-add-grid-row',
        'icon-additional-help',
        'icon-bubble',
        'icon-cascade',
        'icon-change-font',
        'icon-clear-screen',
        'icon-script',
        'icon-clockwise-90',
        'icon-close-cancel',
        'icon-close-save',
        'icon-contacts',
        'icon-copy-from',
        'icon-copy-mail',
        'icon-copy-url',
        'icon-counter-clockwise-90',
        'icon-create-report',
        'icon-delete-grid-record',
        'icon-delete-grid-row',
        'icon-display',
        'icon-employee-directory',
        'icon-export-2',
        'icon-export-to-pdf',
        'icon-generate-key',
        'icon-get-more-rows',
        'icon-group-selection',
        'icon-headphones',
        'icon-help',
        'icon-helper-list-select',
        'icon-history',
        'icon-invoice-released',
        'icon-language',
        'icon-logout',
        'icon-key',
        'icon-lasso',
        'icon-line-bar-chart',
        'icon-line-chart',
        'icon-new-expense-report',
        'icon-new-payment-request',
        'icon-new-time-sheet',
        'icon-new-travel-plan',
        'icon-no-attachment',
        'icon-no-comment',
        'icon-no-filter',
        'icon-overlay-line',
        'icon-pdf-file',
        'icon-phone',
        'icon-payment-request',
        'icon-pie-chart',
        'icon-queries',
        'icon-quick-access',
        'icon-refresh-current',
        'icon-restore-user',
        'icon-run-quick-access',
        'icon-save-close',
        'icon-save-new',
        'icon-search-results-history',
        'icon-select',
        'icon-send-submit',
        'icon-show-last-x-days',
        'icon-special-item',
        'icon-stacked',
        'icon-timesheet',
        'icon-unsubscribe',
        'icon-update-preview',
        'icon-zoom-100',
        'icon-zoom-in',
        'icon-zoom-out',
        'icon-caret-left',
        'icon-caret-right'
      ];
      $('svg').each(function() {
        var use = $('use', this).attr('xlink:href');
        if(use && $.inArray(use.substring(1), icons) !== -1) {
          $(this).addClass('icon-rtl-rotate');
        }
      });
    }

  };

  $(function() {

    if (!window.Locale.cultureInHead()) {
      window.Locale.set('en-US');
    }

    // ICONS: Right to Left Direction
    setTimeout(function() {
      if (window.Locale.isRTL()) {
        window.Locale.flipIconsHorizontally();
      }
    }, 300);

  });

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
