/**
* Datepicker Control (link to docs)
*/
(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    //Support for Atom/CommonJS - Not Tested TODO
    module.exports = factory;
  } else {
    // Register with Browser globals
    factory(window.jQuery || window.Zepto);
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
        this.trigger = $('<svg focusable="false" class="icon">' +
                         '<use xlink:href="#icon-datepicker"/>' +
                         '</svg>').insertAfter(this.element);
        this.addAria();
      },

      addAria: function () {
        this.element.attr('aria-haspopup', true);

        //TODO: Confirm this with Accessibility Team
        this.label = $('label[for="'+ this.element.attr('id') + '"]');
        this.label.append('<span class="audible">' + Locale.translate('UseArrowDate') + '</span>');

        //TODO: Do We Need This?
        //this.ariaDayOfWeek = $('<span class="dayofweek audible"></span>');
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
          self.element.focus();
        });

        self.mask();
        this.handleKeys();
      },

      // Handle Keyboard Stuff
      handleKeys: function () {
        var self = this;

        this.element.on('keydown.datepicker', function (e) {
          var handled = false,
            key = e.which;

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

          //Arrow Left or - : select prev day
          if (key === 37 && self.isOpen() || key === 61 && !self.isOpen()) {
            handled = true;
            self.currentDate.setDate(self.currentDate.getDate() - 1);
            self.insertDate(self.currentDate);
          }

          //Arrow Right or - : select prev day
          if (key === 39 && self.isOpen() || key === 173 && !self.isOpen()) {
            handled = true;
            self.currentDate.setDate(self.currentDate.getDate() + 1);
            self.insertDate(self.currentDate);
          }

          // 't' selects today
          if (key === 84) {
            handled = true;
            self.currentDate = new Date();
            self.insertDate(self.currentDate);
          }

          // Space closes Date Picker, selecting the Date
          if (key === 32 && self.isOpen()) {
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

        //TODO: Test - should add placeholder if there is one
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
        this.table = $('<table class="calendar-table"></table>');
        this.header = $('<div class="calendar-header"><button class="btn-icon prev"><svg class="icon" focusable="false"><use xlink:href="#icon-caret-left"></use></svg><span>Previous Month</span></button><span class="month">november</span><span class="year"> 2014</span><button class="btn-icon next"><svg class="icon" focusable="false"><use xlink:href="#icon-caret-right"></use></svg><span>Next Month</span></button></div>');
        this.dayNames = $('<thead><tr><th>SU</th> <th>MO</th> <th>TU</th> <th>WE</th> <th>TH</th> <th>FR</th> <th>SA</th> </tr> </thead>').appendTo(this.table);
        this.days = $('<tbody> <tr> <td class="alt">26</td> <td class="alt">27</td> <td class="alt">28</td> <td class="alt">29</td> <td class="alt" >30</td> <td class="alt">31</td> <td>1</td> </tr> <tr> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> </tr> <tr> <td>9</td> <td class="selected">10</td> <td>11</td> <td>12</td> <td>13</td> <td>14</td> <td>15</td> </tr> <tr> <td>16</td> <td>17</td> <td>18</td> <td>19</td> <td class="today">20</td> <td>21</td> <td>22</td> </tr> <tr> <td>23</td> <td>24</td> <td>25</td> <td>26</td> <td>27</td> <td>28</td> <td class="alt">1</td> </tr> <tr> <td class="alt">2</td> <td class="alt">3</td> <td class="alt">4</td> <td class="alt">5</td> <td class="alt">6</td> <td class="alt">7</td> <td class="alt">8</td> </tr> </tbody>').appendTo(this.table);
        this.footer = $('<div class="calendar-footer"> <a href="#" class="link cancel">Clear</a> <a href="#" class="link today">Today</a> </div>');
        this.calendar = $('<div class="calendar"></div').append(this.header, this.table, this.footer);

        this.trigger.popover({content: this.calendar, trigger: 'immediate',
            placement: 'offset', offset: {top: 27, left: 141}, width: '200',
            tooltipElement: '#calendar-popup'})
            .on('hide.datepicker', function () {
              self.closeCalendar();
            });

        // Show Month
        var currentVal = this.element.val();

        this.currentDate = (currentVal ? Locale.parseDate(this.element.val()) : new Date());
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
          self.days.find('.selected').removeClass('selected');

          var month = self.header.find('.month').attr('data-month'),
            day = $(this).addClass('selected').text();

          self.currentDate = new Date(new Date().getFullYear(), month, day);
          self.insertDate(self.currentDate);
          self.closeCalendar();
        });

        // Calendar Footer Events
        this.footer.off('click.datepicker').on('click.datepicker', 'a', function () {
          var btn = $(this);

          if (btn.hasClass('cancel')) {
            self.element.val('');
            self.currentDate = null;
            self.closeCalendar();
          }

          if (btn.hasClass('today')) {
            self.insertDate(new Date());
            self.closeCalendar();
          }
          self.element.focus();
        });

        // Change Month Events
        this.header.off('click.datepicker').on('click.datepicker', 'button', function () {
          if ($(this).attr('class') === 'next') {
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

        var days = Locale.calendar().days,
          monthName = Locale.calendar().months.wide[month];

        this.currentMonth = month;
        this.currentYear = year;

        // Set the Days of the week
        this.dayNames.find('th').each(function (i) {
          $(this).text(days[i]);
        });

        //Localize Month Name
        this.header.find('.month').attr('data-month', month).text(monthName);

        //Adjust days of the week
        //lead days
        var leadDays = (new Date(year, month, 1)).getDay();
        var lastMonthDays = (new Date(year, month+0, 0)).getDate(),
          thisMonthDays = (new Date(year, month+1, 0)).getDate(),
          dayCnt = 1, nextMonthDayCnt = 1;

        this.days.find('td').each(function (i) {
          var th = $(this).removeClass('alt selected today');
          th.attr('tabindex', 0);

          if (i < leadDays) {
            th.addClass('alt').text(lastMonthDays - leadDays + 1 + i);
          }

          if (i >= leadDays && dayCnt <= thisMonthDays) {
            th.text(dayCnt);

            if (dayCnt === self.currentDay) {
              th.addClass('selected');
            }

            if (dayCnt === self.todayDay && self.currentMonth === self.todayMonth) {
              th.addClass('today');
            }

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
        input.val(Locale.formatDate(date)).trigger('updated');

        // Make sure Calendar is showing that month
        if (this.currentMonth !== date.getMonth()) {
          this.showMonth(date.getMonth(), date.getFullYear());
        }

        if (!this.isOpen()) {
          return;
        }

        // Show the Date in the UI
        var dateTd = this.days.find('td:not(.alt)').filter(function(){
                        return $(this).text().toLowerCase() === date.getDate().toString();
                      });

        this.days.find('.selected').removeClass('selected');
        dateTd.addClass('selected');  //.focus();
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
