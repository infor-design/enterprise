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

  $.fn.datepicker = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'datepicker',
        defaults = {
          showTime: false,
          timeFormat: undefined, // The time format
          minuteInterval: undefined, // Integer from 1 to 60. Multiples of this value are displayed as options in the minutes dropdown.
          mode: undefined, // options: 'standard', 'range',
          roundToInterval: undefined, // If a non-matching minutes value is entered, rounds the minutes value to the nearest interval when the field is blurred.
          dateFormat: 'locale', //or can be a specific format like 'yyyy-MM-dd' iso8601 format
          placeholder: false,
          /*  Disabling of dates
          **    dates: 'M/d/yyyy' or
          **      ['M/d/yyyy'] or
          **      ['M/d/yyyy', new Date('M/d/yyyy')] or
          **      ['M/d/yyyy', new Date('M/d/yyyy'), new Date(yyyy,(M-0),d)]
          **    minDate: 'M/d/yyyy'
          **    maxDate: 'M/d/yyyy'
          **    dayOfWeek: [2] or [0,6] - {0-sun, 1-mon, 2-tue, 3-wed, 4-thu, 5-fri, 6-sat}
          **    isEnable: false or true
          **/
          disable: {
            'dates'     : [],
            'minDate'   : '',
            'maxDate'   : '',
            'dayOfWeek' : [],
            'isEnable' : false
          }
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function DatePicker(element) {
      this.element = $(element);
      this.settings = settings;
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    DatePicker.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
      },

      //Add any markup
      build: function() {

        // Add "is-disabled" css class to closest ".field" if element is disabled
        if (this.element.is(':disabled')) {
          this.element.closest('.field').addClass('is-disabled');
        }

        //Append a trigger button
        this.trigger = $.createIconElement('calendar').insertAfter(this.element);
        this.addAria();
      },

      addAria: function () {
        this.label = $('label[for="'+ this.element.attr('id') + '"]');
        this.label.append('<span class="audible">' + Locale.translate('PressDown') + '</span>');
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;

        this.trigger.on('click.datepicker', function () {
          if (self.isOpen()) {
            self.closeCalendar();
          } else {
            self.openCalendar();
          }
        });

        self.mask();
        this.handleKeys(this.element);
      },

      // Handle Keyboard Stuff
      handleKeys: function (elem) {
        var self = this;

        elem.off('keydown.datepicker').on('keydown.datepicker', function (e) {
          var handled = false,
            key = e.keyCode || e.charCode || 0,
            focused = $(':focus'),
            focusedlabel = focused.attr('aria-label');

          if (focusedlabel) {
            var focusedDate = new Date(focusedlabel);
            self.currentDate = new Date(focusedDate.getTime());
          } else if (focused.hasClass('alternate')) {
              var year = parseInt(self.header.find('.year').text()),
              month = parseInt(self.header.find('.month').attr('data-month')),
              day = parseInt(focused.text());

            if (focused.hasClass('prev-month')) {
              if(month === 0) {
                month = 11;
                year--;
              }
              else {
                month--;
              }
            } else if (focused.hasClass('next-month')) {
              if(month === 11) {
                month = 0;
                year++;
              }
              else {
                month++;
              }
            }
            self.currentDate = new Date(year, month, day);
          }

         //Arrow Down or Alt first opens the dialog
          if (key === 40 && !self.isOpen()) {
            handled = true;
            self.openCalendar();

            setTimeout(function() {
              self.setFocusAfterOpen();
            }, 200);
          }

          //Arrow Down: select same day of the week in the next week
          if (key === 40 && self.isOpen()) {
              handled = true;
              self.currentDate.setDate(self.currentDate.getDate() + 7);
              self.insertDate(self.currentDate);
          }

          //Arrow Up: select same day of the week in the previous week
          if (key === 38 && self.isOpen()) {
            handled = true;
            self.currentDate.setDate(self.currentDate.getDate() - 7);
            self.insertDate(self.currentDate);
          }

          //Arrow Left
          if (key === 37 && self.isOpen()) {
            handled = true;
            self.currentDate.setDate(self.currentDate.getDate() - 1);
            self.insertDate(self.currentDate);
          }

          //Arrow Right
          if (key === 39 && self.isOpen()) {
            handled = true;
            self.currentDate.setDate(self.currentDate.getDate() + 1);
            self.insertDate(self.currentDate);
          }

          //Page Up Selects Same Day Next Month
          if (key === 33 && !e.altKey && self.isOpen()) {
            handled = true;
            self.currentDate.setMonth(self.currentDate.getMonth() + 1);
            self.insertDate(self.currentDate);
          }

          //Page Down Selects Same Day Prev Month
          if (key === 34 && !e.altKey && self.isOpen()) {
            handled = true;
            self.currentDate.setMonth(self.currentDate.getMonth() - 1);
            self.insertDate(self.currentDate);
          }

          //ctrl + Page Up Selects Same Day Next Year
          if (key === 33 && e.ctrlKey && self.isOpen()) {
            handled = true;
            self.currentDate.setFullYear(self.currentDate.getFullYear() + 1);
            self.insertDate(self.currentDate);
          }

          //ctrl + Page Down Selects Same Day Prev Year
          if (key === 34 && e.ctrlKey && self.isOpen()) {
            handled = true;
            self.currentDate.setFullYear(self.currentDate.getFullYear() - 1);
            self.insertDate(self.currentDate);
          }

          //Home Moves to End of the month
          if (key === 35 && self.isOpen()) {
            handled = true;
            var lastDay =  new Date(self.currentDate.getFullYear(), self.currentDate.getMonth()+1, 0);
            self.currentDate = lastDay;
            self.insertDate(self.currentDate);
          }

          //End Moves to Start of the month
          if (key === 36 && self.isOpen()) {
            var firstDay =  new Date(self.currentDate.getFullYear(), self.currentDate.getMonth(), 1);
            self.currentDate = firstDay;
            self.insertDate(self.currentDate);
          }

          // 't' selects today
          if (key === 84) {
            handled = true;
            self.currentDate = new Date();

            if (self.isOpen()) {
              self.insertDate(self.currentDate, true);
            } else {
              self.element.val(Locale.formatDate(self.currentDate, {pattern: self.pattern})).trigger('change');
            }
          }

          // Space or Enter closes Date Picker, selecting the Date
          if (key === 32 && self.isOpen() || key === 13 && self.isOpen()) {
            self.closeCalendar();
            self.element.focus();
            handled = true;
          }

          // Tab closes Date Picker and goes to next field
          if (key === 9 && self.isOpen()) {
            if (!self.settings.showTime) {
              self.element.focus();
              self.closeCalendar();
            }
          }

          // Esc closes Date Picker and goes back to field
          if (key === 27 && self.isOpen()) {
            self.closeCalendar();
            self.element.focus();
          }

          if (handled) {
            e.stopPropagation();
            e.preventDefault();
            return false;
          }

        });
      },

      //Parse the Date Format Options
      setFormat: function () {
        var localeDateFormat = ((typeof Locale === 'object' && Locale.calendar().dateFormat) ? Locale.calendar().dateFormat : null),
          localeTimeFormat = ((typeof Locale === 'object' && Locale.calendar().timeFormat) ? Locale.calendar().timeFormat : null);

        if (this.settings.dateFormat === 'locale') {
          this.pattern = localeDateFormat.short + (this.settings.showTime ? ' ' + (this.settings.timeFormat || localeTimeFormat) : '');
        } else {
          this.pattern = this.settings.dateFormat + (this.settings.showTime ? ' ' + this.settings.timeFormat : '');
        }

        this.show24Hours = (this.pattern.match('HH') || []).length > 0;
        this.isSeconds = (this.pattern.match('ss') || []).length > 0;
      },

      // Add masking with the mask function
      mask: function () {
        this.setFormat();

        var validation = 'date availableDate',
          events = {'date': 'blur', 'availableDate': 'blur'},
          customValidation = this.element.attr('data-validate'),
          customEvents = this.element.attr('data-validation-events'),
          mask = this.pattern.toLowerCase()
                   .replace(/yyyy/g,'####')
                   .replace(/mmm/g,'***')
                   .replace(/mm/g,'##')
                   .replace(/dd/g,'##')
                   .replace(/hh/g,'##')
                   .replace(/ss/g,'##')
                   .replace(/[mdh]/g,'##')
                   .replace(/[a]/g,'am');

        //TO DO - Time seperator
        // '##/##/#### ##:## am' -or- ##/##/#### ##:##' -or- ##/##/####'
        // '##/##/#### ##:##:## am' -or- ##/##/#### ##:##:##'
        mask = (this.settings.showTime ?
          (this.show24Hours ? mask.substr(0, (this.isSeconds ? 19:16)) : mask) : mask);

        if (customValidation === 'required' && !customEvents) {
          validation = customValidation + ' ' + validation;
          $.extend(events, {'required': 'change blur'});
        } else if (!!customValidation && !!customEvents) {
          // Remove default validation, if found "no-default-validation" string in "data-validate" attribute
          if (customValidation.indexOf('no-default-validation') > -1) {
            validation = customValidation.replace(/no-default-validation/g, '');
            events = $.fn.parseOptions(this.element, 'data-validation-events');
          }
          // Keep default validation along custom validation
          else {
            validation = customValidation + ' ' + validation;
            $.extend(events, $.fn.parseOptions(this.element, 'data-validation-events'));
          }
        }

        this.element
          .attr({
            'data-mask': mask,
            'data-validate': validation,
            'data-validation-events': JSON.stringify(events),
            'data-mask-mode': 'date'
          }).mask().validate();

        if (this.settings.placeholder && (!this.element.attr('placeholder') ||  this.element.attr('placeholder') === 'M / D / YYYY')) {
          this.element.attr('placeholder', this.pattern);
        }
      },

      // Return whether or not the calendar div is open.
      isOpen: function () {
        return (this.popup && this.popup.is(':visible') &&
          !this.popup.hasClass('is-hidden'));
      },

      open: function() {
        return this.openCalendar();
      },

      // Open the calendar in a popup
      openCalendar: function () {
        var self = this,
          timeOptions = {};


        if (this.element.is(':disabled') || this.element.attr('readonly')) {
          return;
        }

        $('#validation-tooltip').addClass('is-hidden');


        this.element.addClass('is-active').trigger('listopened');

        // Calendar Html in Popups
        this.table = $('<table class="calendar-table" aria-label="'+ Locale.translate('Calendar') +'" role="application"></table>');
        this.header = $('<div class="calendar-header"><span class="month">november</span><span class="year"> 2015</span><button type="button" class="btn-icon prev" tabindex="-1">' + $.createIcon('caret-left') + '<span>'+ Locale.translate('PreviousMonth') +'</span></button><button type="button" class="btn-icon next" tabindex="-1">' + $.createIcon('caret-right') + '<span>'+ Locale.translate('NextMonth') +'</span></button></div>');
        this.dayNames = $('<thead><tr><th>SU</th> <th>MO</th> <th>TU</th> <th>WE</th> <th>TH</th> <th>FR</th> <th>SA</th> </tr> </thead>').appendTo(this.table);
        this.days = $('<tbody> <tr> <td class="alternate">26</td> <td class="alternate">27</td> <td class="alternate">28</td> <td class="alternate">29</td> <td class="alternate" >30</td> <td class="alternate">31</td> <td>1</td> </tr> <tr> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> </tr> <tr> <td>9</td> <td>10</td> <td>11</td> <td>12</td> <td>13</td> <td>14</td> <td>15</td> </tr> <tr> <td>16</td> <td>17</td> <td>18</td> <td>19</td> <td class="is-today">20</td> <td>21</td> <td>22</td> </tr> <tr> <td>23</td> <td>24</td> <td>25</td> <td>26</td> <td>27</td> <td>28</td> <td class="alternate">1</td> </tr> <tr> <td class="alternate">2</td> <td class="alternate">3</td> <td class="alternate">4</td> <td class="alternate">5</td> <td class="alternate">6</td> <td class="alternate">7</td> <td class="alternate">8</td> </tr> </tbody>').appendTo(this.table);
        this.timepickerContainer = $('<div class="datepicker-time-container"></div>');
        this.footer = $('<div class="popup-footer"> <button type="button" class="cancel btn-tertiary" tabindex="-1">'+ Locale.translate('Clear') +'</button> <button type="button" tabindex="-1" class="is-today btn-tertiary">'+Locale.translate('Today')+'</button> </div>');

        // Timepicker options
        if (this.settings.showTime) {
          if (this.settings.timeFormat !== undefined) {
            timeOptions.timeFormat = this.settings.timeFormat;
          }
          if (this.settings.minuteInterval !== undefined) {
            timeOptions.minuteInterval = this.settings.minuteInterval;
          }
          if (this.settings.mode !== undefined) {
            timeOptions.mode = this.settings.mode;
          }
          if (this.settings.roundToInterval !== undefined) {
            timeOptions.roundToInterval = this.settings.roundToInterval;
          }

        }

        this.calendar = $('<div class="calendar'+ (this.settings.showTime ? ' is-timepicker' : '') +'"></div')
          .append(
            this.header,
            this.table,
            (this.settings.showTime ? this.timepickerContainer : ''),
            this.footer
          );

        var popoverOpts = {
          content: this.calendar,
          placementOpts: {
            parent: this.element,
            parentXAlignment: (Locale.isRTL() ? 'right' : 'left'),
            strategies: ['flip', 'nudge', 'shrink']
          },
          placement : 'bottom',
          popover: true,
          trigger: 'immediate',
          tooltipElement: '#calendar-popup'
        };

        this.trigger.popover(popoverOpts)
        .on('hide.datepicker', function () {
          self.closeCalendar();
        }).on('open.datepicker', function () {
          self.days.find('.is-selected').attr('tabindex', 0).focus();
        });

        // ICONS: Right to Left Direction
        setTimeout(function() {
          if (Locale.isRTL()) {
            Locale.flipIconsHorizontally();
          }
        }, 0);

        this.handleKeys($('#calendar-popup'));
        $('.calendar-footer a', this.calendar).button();

        // Show Month
        var currentVal = Locale.parseDate(this.element.val(), this.pattern);

        this.currentDate = currentVal || new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.currentDay = this.currentDate.getDate();

        // Set timepicker
        if (this.settings.showTime) {
          timeOptions.parentElement = this.timepickerContainer;
          this.time = self.getTimeString(currentVal, self.show24Hours);
          this.timepicker = this.timepickerContainer.timepicker(timeOptions).data('timepicker');
          this.timepickerContainer.find('dropdown').dropdown();

          // Wait for timepicker to initialize
          setTimeout(function() {
            self.timepicker.initValues = self.timepicker.getTimeFromField(self.time);
            self.timepicker.afterShow(self.timepickerContainer);
            return;
          }, 1);
        }

        this.todayDate = new Date();
        this.todayMonth = this.todayDate.getMonth();
        this.todayYear = this.todayDate.getFullYear();
        this.todayDay = this.todayDate.getDate();

        this.showMonth(this.currentMonth, this.currentYear);
        this.popup = $('#calendar-popup');
        this.popup.attr('role', 'dialog');
        this.originalDate = this.element.val();

        // Calendar Day Events
        this.days.off('click.datepicker').on('click.datepicker', 'td', function () {
          var td = $(this);
          if (td.hasClass('is-disabled')) {
            td.attr('tabindex', 0).focus();
          }
          else {
            self.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected');

            var cell = $(this),
              year = parseInt(self.header.find('.year').text()),
              month = parseInt(self.header.find('.month').attr('data-month')),
              day = parseInt(cell.addClass('is-selected').attr('aria-selected', 'true').text());

            if (cell.hasClass('prev-month')) {
              if(month === 0) {
                month = 11;
                year--;
              }
              else {
                month--;
              }
            }
            else if (cell.hasClass('next-month')) {
              if(month === 11) {
                month = 0;
                year++;
              }
              else {
                month++;
              }
            }

            self.currentDate = new Date(year, month, day);
            self.insertDate(self.currentDate);
            self.closeCalendar();
            self.element.focus();
          }
        });

        // Calendar Footer Events
        this.footer.off('click.datepicker').on('click.datepicker', 'button', function (e) {
          var btn = $(this);

          if (btn.hasClass('cancel')) {
            self.element.val('').trigger('change');
            self.currentDate = null;
            self.closeCalendar();
          }

          if (btn.hasClass('is-today')) {
            self.currentDate = new Date();
            self.insertDate(self.currentDate);
            self.closeCalendar();
          }
          self.element.focus();
          e.preventDefault();
        });

        // Change Month Events
        this.header.off('click.datepicker').on('click.datepicker', 'button', function () {
          self.showMonth(self.currentMonth + ($(this).hasClass('next') ? 1 : -1), self.currentYear);
        });

        setTimeout(function() {
          self.setFocusAfterOpen();
        }, 200);

      },

      // Alias for _closeCalendar()_ that works with the global "closeChildren" method
      close: function() {
        return this.closeCalendar();
      },

      // Close the calendar in a popup
      closeCalendar: function () {
        // Close timepicker
        if (this.settings.showTime && this.timepickerControl && this.timepickerControl.isOpen()) {
          this.timepickerControl.closeTimePopup();
        }

        if (this.popup && this.popup.length) {
          this.popup.hide().remove();
        }

        var popoverAPI = this.trigger.data('tooltip');
        if (popoverAPI) {
          popoverAPI.destroy();
        }

        this.element.removeClass('is-active');
        this.element.trigger('listclosed');
      },

      // Check through the options to see if the date is disabled
      isDateDisabled: function (year, month, date) {
        var d, i, l,
          self = this,
          d2 = new Date(year, month, date),
          min = (new Date(this.settings.disable.minDate)).setHours(0,0,0,0),
          max = (new Date(this.settings.disable.maxDate)).setHours(0,0,0,0);

        //dayOfWeek
        if(this.settings.disable.dayOfWeek.indexOf(d2.getDay()) !== -1) {
          return true;
        }

        d2 = d2.setHours(0,0,0,0);

        //min and max
        if ((d2 <= min) || (d2 >= max)) {
          return true;
        }

        //dates
        if (this.settings.disable.dates.length && typeof this.settings.disable.dates === 'string') {
          this.settings.disable.dates = [this.settings.disable.dates];
        }

        for (i=0, l=this.settings.disable.dates.length; i<l; i++) {
          d = new Date(self.settings.disable.dates[i]);
          if(d2 === d.setHours(0,0,0,0)) {
            return true;
          }
        }

        return false;
      },

      // Set disable Date
      setDisabled: function (elem, year, month, date) {
        var dateIsDisabled = this.isDateDisabled(year, month, date);
        elem.removeClass('is-disabled').removeAttr('aria-disabled');

        if ((dateIsDisabled && !this.settings.disable.isEnable) || (!dateIsDisabled && this.settings.disable.isEnable)) {
          elem
            .addClass('is-disabled').attr('aria-disabled','true')
            .removeClass('is-selected').removeAttr('aria-selected');
        }
      },

      // Set focus after opening the calendar
      setFocusAfterOpen: function () {
        if (!this.calendar) {
          return;
        }
        this.calendar.find('.is-selected').attr('tabindex', 0).focus();
      },

      // Update the calendar to show the month (month is zero based)
      showMonth: function (month, year) {
        var self = this;

        var elementDate = this.currentDate.getDate() ?
          this.currentDate : (new Date()).setHours(0,0,0,0);

        if (year.toString().length < 4) {
          year = new Date().getFullYear();
        }

        if (month === 12) {
          year ++;
          this.currentMonth = month = 0;
          this.currentYear = year;
          this.header.find('.year').text(' ' + year);
        }

        if (month < 0) {
          year --;
          this.currentMonth = month = 11;
          this.currentYear = year;
          this.header.find('.year').text(' ' + year);
        }

        var days = Locale.calendar().days.narrow || Locale.calendar().days.narrow || Locale.calendar().days.abbreviated,
          monthName = Locale.calendar().months.wide[month];

        this.currentMonth = month;
        this.currentYear = year;

        // Set the Days of the week
        this.dayNames.find('th').each(function (i) {
          $(this).text(days[i]);
        });

        //Localize Month Name
        this.header.find('.month').attr('data-month', month).text(monthName);
        this.header.find('.year').text(' ' + year);

        //Adjust days of the week
        //lead days
        var leadDays = (new Date(year, month, 1)).getDay();
        var lastMonthDays = (new Date(year, month+0, 0)).getDate(),
          thisMonthDays = (new Date(year, month+1, 0)).getDate(),
          dayCnt = 1, nextMonthDayCnt = 1, exYear, exMonth, exDay;

        this.days.find('td').each(function (i) {
          var th = $(this).removeClass('alternate prev-month next-month is-selected is-today');
          th.removeAttr('aria-selected');

          if (i < leadDays) {
            exDay = lastMonthDays - leadDays + 1 + i;
            exMonth = (month === 0) ? 11 : month - 1;
            exYear = (month === 0) ? year - 1 : year;

            self.setDisabled(th, exYear, exMonth, exDay);
            th.addClass('alternate prev-month').html('<span aria-hidden="true">' + exDay + '</span>');
          }

          if (i >= leadDays && dayCnt <= thisMonthDays) {
            th.html('<span aria-hidden="true">' + dayCnt + '</span>');
            var tHours = elementDate.getHours(),
              tMinutes = elementDate.getMinutes(),
              tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;

            if ((new Date(year, month, dayCnt)).setHours(tHours, tMinutes, tSeconds,0) === elementDate.setHours(tHours, tMinutes, tSeconds, 0)) {
              th.addClass('is-selected').attr('aria-selected', 'true');
            }

            if (dayCnt === self.todayDay && self.currentMonth === self.todayMonth &&
              self.currentYear === self.todayYear) {
              th.addClass('is-today');
            }

            th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), {date: 'full'}));

            self.setDisabled(th, year, month, dayCnt);

            th.attr('role', 'link');
            dayCnt++;
            return;
          }

          if (dayCnt >= thisMonthDays + 1) {
            exDay = nextMonthDayCnt;
            exMonth = (month === 11) ? 0 : month + 1;
            exYear = (month === 11) ? year + 1 : year;

            self.setDisabled(th, exYear, exMonth, exDay);
            th.addClass('alternate next-month').html('<span aria-hidden="true">' + nextMonthDayCnt + '</span>');
            nextMonthDayCnt++;
          }

        });

        //Hide 6th Row if all disabled
        var row = this.days.find('tr').eq(5);
        if (row.find('td.alternate').length === 7) {
          row.hide();
        } else {
          row.show();
        }
      },

      // Put the date in the field and select on the calendar
      insertDate: function (date, isReset) {
        var input = this.element;

        // Make sure Calendar is showing that month
        if (this.currentMonth !== date.getMonth() || this.currentYear !== date.getFullYear()) {
          this.showMonth(date.getMonth(), date.getFullYear());
        }

        if (!this.isOpen()) {
          return;
        }

        // Show the Date in the UI
        var dateTd = this.days.find('td:not(.alternate)').filter(function() {
          return $(this).text().toLowerCase() === date.getDate().toString();
        });

        if (dateTd.hasClass('is-disabled')) {
          dateTd.attr({'tabindex': 0}).focus();
        } else {
          if (this.settings.showTime) {
            if (isReset) {
              this.time = this.getTimeString(date, this.show24Hours);

              if (this.settings.roundToInterval) {
                $('#timepicker-minutes').val('');
                date = this.setTime(date);
              }
            }
            else {
              date = this.setTime(date);
            }
          }

          input.val(Locale.formatDate(date, {pattern: this.pattern})).trigger('change');
          this.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected').removeAttr('tabindex');
          dateTd.addClass('is-selected').attr({'aria-selected': true, 'tabindex': 0}).focus();
        }
      },

      // Convert a string to boolean
      getBoolean: function(val) {
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
      },

      // Set the Formatted value in the input
      setValue: function(date) {
        this.currentDate = date;
        this.element.val(Locale.formatDate(date, {pattern: this.pattern}));
      },

      // Make input enabled
      enable: function() {
        this.element.removeAttr('disabled readonly').closest('.field').removeClass('is-disabled');
      },

      // Make input disabled
      disable: function() {
        this.enable();
        this.element.attr('disabled', 'disabled').closest('.field').addClass('is-disabled');
      },

      // Make input readonly
      readonly: function() {
        this.enable();
        this.element.attr('readonly', 'readonly');
      },

      // Set time
      setTime: function(date) {
        var hours = $('#timepicker-hours').val(),
          minutes = $('#timepicker-minutes').val(),
          seconds = this.isSeconds ? $('#timepicker-seconds').val() : 0,
          period = $('#timepicker-period');

        var timepicker = $('.timepicker.is-active');
        if (timepicker.length && (!minutes || this.isSeconds && !seconds)) {
          var d = new Date(date),
            regex = new RegExp('(\\d+)(?::(\\d\\d))'+ (this.isSeconds ? '(?::(\\d\\d))' : '') +'?\\s*(p?)'),
            time = timepicker.val().match(regex);
          d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
          d.setMinutes(parseInt(time[2]) || 0);
          d.setSeconds(parseInt(time[3]) || 0);
          minutes = d.getMinutes();
          seconds = d.getSeconds();
        }
        hours = (period.length && period.val() === 'PM' && hours < 12) ? (parseInt(hours, 10) + 12) : hours;
        hours = (period.length && period.val() === 'AM' && parseInt(hours, 10) === 12) ? 0 : hours;

        date.setHours(hours, minutes, seconds);
        return date;
      },

      // Get Time String
      getTimeString: function (date, isHours24) {
        var twodigit = function (number) {
            return (number < 10 ? '0' : '') + number;
          },
          d = (date || new Date()),
          h = d.getHours(),
          m = twodigit(d.getMinutes()),
          s = twodigit(d.getSeconds()),
          h12 = (h % 12 || 12) +':'+ m + (this.isSeconds ? ':'+ s : '') +' ' + (h < 12 ? 'AM' : 'PM'),
          h24 = h + ':' + m + (this.isSeconds ? ':'+ s : '');

        return isHours24 ? h24 : h12;
      },

      // Change the order for execution jquery events were bound
      // http://stackoverflow.com/questions/2360655/jquery-event-handlers-always-execute-in-order-they-were-bound-any-way-around-t
      changeEventOrder: function (elements, names, newIndex) {
        // Allow for multiple events.
        $.each(names.split(' '), function (idx, name) {
          elements.each(function () {
            var handlers = $._data(this, 'events')[name.split('.')[0]];
            // Validate requested position.
            newIndex = Math.min(newIndex, handlers.length - 1);
            handlers.splice(newIndex, 0, handlers.pop());
          });
        });
      },

      updated: function() {
        return this
          .teardown()
          .init();
      },

      teardown: function() {
        if (this.isOpen()) {
          this.closeCalendar();
        }

        this.trigger.remove();
        this.element.attr('data-mask', '');

        if (this.calendar && this.calendar.length) {
          this.calendar.remove();
        }

        if (this.popup && this.popup.length) {
          this.popup.remove();
        }

        var api = this.element.data('mask');
        if (api) {
          api.destroy();
        }

        this.element.off('keydown.datepicker blur.validate change.validate keyup.validate focus.validate');

        return this;
      },

      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new DatePicker(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
