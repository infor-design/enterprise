/**
* Datepicker Control (TODO link to docs)
*/
(function(factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function($) {

  'use strict';

  $.fn.datepicker = function(options) {

    // Settings and Options
    var pluginName = 'datepicker',
        defaults = {
          dateFormat: 'M/d/yyyy'
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
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
        this.trigger = $('<svg focusable="false" aria-hidden="true" class="icon">' +
                         '<use xlink:href="#icon-datepicker"/>' +
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
            key = e.keyCode || e.charCode || 0;

          console.log(key, e.metaKey, e.altKey);

         //Arrow Down or Alt first opens the dialog
          if (key === 40 && !self.isOpen()) {
            handled = true;
            self.openCalendar();
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
            self.insertDate(self.currentDate);
          }

          // Space or Enter closes Date Picker, selecting the Date
          if (key === 32 && self.isOpen() || key === 13 && self.isOpen()) {
            self.closeCalendar();
            self.element.focus();
            handled = true;
          }

          // Tab closes Date Picker like escape and goes to next field
          if (key === 9 && self.isOpen()) {
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
            sep = dateFormat.seperator;

        settings.dateFormat = (typeof Locale === 'object' ?
                              dateFormat.short :
                              settings.dateFormat);

        if (this.element.data('mask')) {
          this.element.data('mask').destroy();
        }

        var mask = '##/##/####'.replace(new RegExp('/', 'g'), sep);

        this.element
          .attr('data-mask', mask)
          .attr('data-validate', 'date')
          .attr('data-mask-mode', 'date')
          .mask().validate();

        if (this.element.attr('placeholder') !== undefined) {
          this.element.attr('placeholder', settings.dateFormat);
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

        if (this.element.is(':disabled')) {
          return;
        }

        if (this.popup && this.popup.is(':visible')) {
          self.closeCalendar();
        }

        this.element.addClass('is-active');

        // Calendar Html in Popups
        this.table = $('<table class="calendar-table" aria-label="'+ Locale.translate('Calendar') +'" role="application"></table>');
        this.header = $('<div class="calendar-header"><button class="btn-icon prev" tabindex="-1"><svg class="icon" focusable="false" aria-hidden="true"><use xlink:href="#icon-caret-left"></use></svg><span>'+ Locale.translate('PreviousMonth') +'</span></button><span class="month">november</span><span class="year"> 2015</span><button class="btn-icon next" tabindex="-1"><svg class="icon" focusable="false" aria-hidden="true"><use xlink:href="#icon-caret-right"></use></svg><span>'+ Locale.translate('NextMonth') +'</span></button></div>');
        this.dayNames = $('<thead><tr><th>SU</th> <th>MO</th> <th>TU</th> <th>WE</th> <th>TH</th> <th>FR</th> <th>SA</th> </tr> </thead>').appendTo(this.table);
        this.days = $('<tbody> <tr> <td class="alt">26</td> <td class="alt">27</td> <td class="alt">28</td> <td class="alt">29</td> <td class="alt" >30</td> <td class="alt">31</td> <td>1</td> </tr> <tr> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> </tr> <tr> <td>9</td> <td class="is-selected" aria-selected="true">10</td> <td>11</td> <td>12</td> <td>13</td> <td>14</td> <td>15</td> </tr> <tr> <td>16</td> <td>17</td> <td>18</td> <td>19</td> <td class="is-today">20</td> <td>21</td> <td>22</td> </tr> <tr> <td>23</td> <td>24</td> <td>25</td> <td>26</td> <td>27</td> <td>28</td> <td class="alt">1</td> </tr> <tr> <td class="alt">2</td> <td class="alt">3</td> <td class="alt">4</td> <td class="alt">5</td> <td class="alt">6</td> <td class="alt">7</td> <td class="alt">8</td> </tr> </tbody>').appendTo(this.table);
        this.footer = $('<div class="calendar-footer"> <a href="#" class="hyperlink cancel" tabindex="-1">'+ Locale.translate('Clear') +'</a> <a href="#" tabindex="-1" class="hyperlink is-today">'+Locale.translate('Today')+'</a> </div>');
        this.calendar = $('<div class="calendar"></div').append(this.header, this.table, this.footer);

        this.trigger.popover({content: this.calendar, trigger: 'immediate',
            placement: 'offset', offset: {top: 20, left: 147}, width: '200',
            tooltipElement: '#calendar-popup'})
            .on('hide.datepicker', function () {
              self.closeCalendar();
            }).on('open.datepicker', function () {
              self.days.find('.is-selected').attr('tabindex', 0).focus();
            });

        this.handleKeys($('#calendar-popup'));

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
          self.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected');

          var month = self.header.find('.month').attr('data-month'),
            day = $(this).addClass('is-selected').attr('aria-selected', 'true').text();

          self.currentDate = new Date(new Date().getFullYear(), month, day);
          self.insertDate(self.currentDate);
          self.closeCalendar();
          self.element.focus();
        });

        // Calendar Footer Events
        this.footer.off('click.datepicker').on('click.datepicker', 'a', function (e) {
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

      },

      // Open the calendar in a popup
      closeCalendar: function () {
        this.popup.hide();
        this.element.removeClass('is-active');
      },

      // Update the calendar to show the month (month is zero based)
      showMonth: function (month, year) {
        var self = this;

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
          dayCnt = 1, nextMonthDayCnt = 1;

        this.days.find('td').each(function (i) {
          var th = $(this).removeClass('alt is-selected is-today');
          th.removeAttr('aria-selected');

          if (i < leadDays) {
            th.addClass('alt').html('<span aria-hidden="true">' + (lastMonthDays - leadDays + 1 + i) + '</span>');
          }

          if (i >= leadDays && dayCnt <= thisMonthDays) {
            th.html('<span aria-hidden="true">' + dayCnt + '</span>');

            if (dayCnt === self.currentDay) {
              th.addClass('is-selected').attr('aria-selected', 'true');
            }

            if (dayCnt === self.todayDay && self.currentMonth === self.todayMonth) {
              th.addClass('is-today');
            }

            th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), {date: 'full'}));
            //th.append('<span class="audible">' + Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), {date: 'full'}) + '</span>');
            th.attr('role', 'link');
            dayCnt++;
            return;
          }

          if (dayCnt >= thisMonthDays + 1) {
            th.addClass('alt').text(nextMonthDayCnt);
            nextMonthDayCnt++;
          }

        });
      },

      // Put the date in the field and select on the calendar
      insertDate: function (date) {
        var input = this.element;
        input.val(Locale.formatDate(date)).trigger('updated').trigger('change');

        // Make sure Calendar is showing that month
        if (this.currentMonth !== date.getMonth() || this.currentYear !== date.getFullYear()) {
          this.showMonth(date.getMonth(), date.getFullYear());
        }

        if (!this.isOpen()) {
          return;
        }

        // Show the Date in the UI
        var dateTd = this.days.find('td:not(.alt)').filter(function(){
                        return $(this).text().toLowerCase() === date.getDate().toString();
                      });

        this.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected').removeAttr('tabindex');
        dateTd.addClass('is-selected').attr({'aria-selected': true, 'tabindex': 0}).focus();
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
}));
