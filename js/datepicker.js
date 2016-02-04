/**
* Datepicker Control (TODO link to docs)
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

  $.fn.datepicker = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'datepicker',
        defaults = {
          dateFormat: 'yyyy-MM-dd', //Default is iso8601 format
          /*  disable:
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

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.settings = settings;
      this.init();
    }

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = $('<svg class="icon" focusable="false" aria-hidden="true" role="presentation">' +
                         '<use xlink:href="#icon-calendar"/>' +
                         '</svg>').insertAfter(this.element);
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
          }
          else if (focused.hasClass('alternate')) {
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
            }
            else if (focused.hasClass('next-month')) {
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

          //Alt+Page Up Selects Same Day Next Year
          if (key === 33 && e.altKey && self.isOpen()) {
            handled = true;
            self.currentDate.setFullYear(self.currentDate.getFullYear() + 1);
            self.insertDate(self.currentDate);
          }

          //Alt+Page Down Selects Same Day Prev Year
          if (key === 34 && e.altKey && self.isOpen()) {
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
              self.element.val(Locale.formatDate(self.currentDate)).trigger('change');
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
            self.element.focus();
            self.closeCalendar();
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

      // Add masking with the mask function
      mask: function () {
        var dateFormat = Locale.calendar().dateFormat,
            sep = dateFormat.separator;

        this.settings.dateFormat = (typeof Locale === 'object' ?
                              dateFormat.short :
                              this.settings.dateFormat);

        if (this.element.data('mask')) {
          this.element.data('mask').destroy();
        }

        var mask = '##/##/####'.replace(new RegExp('/', 'g'), sep),
          validation = 'date availableDate',
          events = '{"date": "blur ", "availableDate": "blur "}',
          customValidation = this.element.attr('data-validate'),
          customEvents = this.element.attr('data-validation-events');

        if (customValidation === 'required' && !customEvents) {
          validation = customValidation + ' ' + validation;
          events = '{"required": "change blur", "date": "blur ", "availableDate": "blur "}';
        }

        this.element
          .attr({
            'data-mask': mask,
            'data-validate': validation,
            'data-validation-events': events,
            'data-mask-mode': 'date'
          }).mask().validate();

        if (this.element.attr('placeholder') !== undefined) {
          this.element.attr('placeholder', this.settings.dateFormat);
        }
      },

      // Return whether or not the calendar div is open.
      isOpen: function () {
        return (this.popup && this.popup.is(':visible') &&
          !this.popup.hasClass('is-hidden'));
      },

      // Open the calendar in a popup
      openCalendar: function () {
        var self = this;

        if (this.element.is(':disabled') || this.element.attr('readonly')) {
          return;
        }

        $('#validation-tooltip').addClass('is-hidden');

        if (this.popup && this.popup.is(':visible')) {
          self.closeCalendar();
        }

        this.element.addClass('is-active');
        this.element.trigger('listopened');

        // Calendar Html in Popups
        this.table = $('<table class="calendar-table" aria-label="'+ Locale.translate('Calendar') +'" role="application"></table>');
        this.header = $('<div class="calendar-header"><span class="month">november</span><span class="year"> 2015</span><button class="btn-icon prev" tabindex="-1"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-caret-left"></use></svg><span>'+ Locale.translate('PreviousMonth') +'</span></button><button class="btn-icon next" tabindex="-1"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-caret-right"></use></svg><span>'+ Locale.translate('NextMonth') +'</span></button></div>');
        this.dayNames = $('<thead><tr><th>SU</th> <th>MO</th> <th>TU</th> <th>WE</th> <th>TH</th> <th>FR</th> <th>SA</th> </tr> </thead>').appendTo(this.table);
        this.days = $('<tbody> <tr> <td class="alternate">26</td> <td class="alternate">27</td> <td class="alternate">28</td> <td class="alternate">29</td> <td class="alternate" >30</td> <td class="alternate">31</td> <td>1</td> </tr> <tr> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> </tr> <tr> <td>9</td> <td>10</td> <td>11</td> <td>12</td> <td>13</td> <td>14</td> <td>15</td> </tr> <tr> <td>16</td> <td>17</td> <td>18</td> <td>19</td> <td class="is-today">20</td> <td>21</td> <td>22</td> </tr> <tr> <td>23</td> <td>24</td> <td>25</td> <td>26</td> <td>27</td> <td>28</td> <td class="alternate">1</td> </tr> <tr> <td class="alternate">2</td> <td class="alternate">3</td> <td class="alternate">4</td> <td class="alternate">5</td> <td class="alternate">6</td> <td class="alternate">7</td> <td class="alternate">8</td> </tr> </tbody>').appendTo(this.table);
        this.footer = $('<div class="popup-footer"> <button type="button" class="cancel btn-tertiary" tabindex="-1">'+ Locale.translate('Clear') +'</button> <button type="button" tabindex="-1" class="is-today btn-tertiary">'+Locale.translate('Today')+'</button> </div>');
        this.calendar = $('<div class="calendar"></div').append(this.header, this.table, this.footer);

        this.trigger.popover({content: this.calendar, popover: true, trigger: 'immediate',
            placement: 'offset', offset: {top: 20, left: Locale.isRTL() ? -150 : 147}, width: '200',
            tooltipElement: '#calendar-popup'})
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
        var currentVal = Locale.parseDate(this.element.val());

        this.currentDate = (currentVal ? currentVal : new Date());
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.currentDay = this.currentDate.getDate();

        this.todayDate = new Date();
        this.todayMonth = this.todayDate.getMonth();
        this.todayYear = this.todayDate.getFullYear();
        this.todayDay = this.todayDate.getDate();

        this.showMonth(this.currentMonth, this.currentYear);
        this.popup = $('#calendar-popup');
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
            self.element.val('');
            self.currentDate = null;
            self.closeCalendar();
          }

          if (btn.hasClass('is-today')) {
            self.insertDate(new Date());
            self.closeCalendar();
          }
          self.element.focus();
          e.preventDefault();
        });

        // Change Month Events
        this.header.off('click.datepicker').on('click.datepicker', 'button', function () {
          if ($(this).hasClass('next')) {
            self.showMonth(self.currentMonth + 1, self.currentYear);
          } else {
            self.showMonth(self.currentMonth - 1, self.currentYear);
          }
        });

        setTimeout(function() {
          self.setFocusAfterOpen();
        }, 200);

      },

      // Open the calendar in a popup
      closeCalendar: function () {
        this.popup.hide();
        this.element.removeClass('is-active');
        this.popup.remove();
        this.element.trigger('listclosed');
      },

      // Check date in obj, return: true|false
      checkDates: function (year, month, date) {
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
        if((d2 <= min) || (d2 >= max)) {
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
      setDisable: function (elem, year, month, date) {
        var checkDates = this.checkDates(year, month, date);
        elem.removeClass('is-disabled').removeAttr('aria-disabled');

        if ((checkDates && !this.settings.disable.isEnable) || (!checkDates && this.settings.disable.isEnable)) {
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
        var self = this,
          elementDate = new Date(this.element.val());

        elementDate = elementDate.getDate() ? elementDate : new Date();
        elementDate = elementDate.setHours(0,0,0,0);

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

        var days = Locale.calendar().days.abbreviated,
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
          var th = $(this).removeClass('alternate is-selected is-today');
          th.removeAttr('aria-selected');

          if (i < leadDays) {
            exDay = lastMonthDays - leadDays + 1 + i;
            exMonth = (month === 0) ? 11 : month - 1;
            exYear = (month === 0) ? year - 1 : year;

            self.setDisable(th, exYear, exMonth, exDay);
            th.addClass('alternate prev-month').html('<span aria-hidden="true">' + exDay + '</span>');
          }

          if (i >= leadDays && dayCnt <= thisMonthDays) {
            th.html('<span aria-hidden="true">' + dayCnt + '</span>');

            if ((new Date(year, month, dayCnt)).setHours(0,0,0,0) === elementDate) {
              th.addClass('is-selected').attr('aria-selected', 'true');
            }

            if (dayCnt === self.todayDay && self.currentMonth === self.todayMonth && self.currentYear === self.todayYear) {
              th.addClass('is-today');
            }

            th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), {date: 'full'}));

            self.setDisable(th, year, month, dayCnt);

            th.attr('role', 'link');
            dayCnt++;
            return;
          }

          if (dayCnt >= thisMonthDays + 1) {
            exDay = nextMonthDayCnt;
            exMonth = (month === 11) ? 0 : month + 1;
            exYear = (month === 11) ? year + 1 : year;

            self.setDisable(th, exYear, exMonth, exDay);
            th.addClass('alternate next-month').text(nextMonthDayCnt);
            nextMonthDayCnt++;
          }

        });
      },

      // Put the date in the field and select on the calendar
      insertDate: function (date) {
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
          input.val(Locale.formatDate(date)).trigger('change');
          this.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected').removeAttr('tabindex');
          dateTd.addClass('is-selected').attr({'aria-selected': true, 'tabindex': 0}).focus();
        }
      },

      //Helper Function
      setValue: function(date) {
        this.currentDate = date;
        this.element.val(Locale.formatDate(date));
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
