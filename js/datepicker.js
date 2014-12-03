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
          dateFormat: (typeof Locale === 'object' ?
                        Locale.calendar().dateFormat.short :
                        '## /##/ ####')
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
      this.element = $(element);
      this.init();
    }

    //

    // Plugin Methods
    Plugin.prototype = {

      init: function() {
        this.build();
        this.handleEvents();
      },

      //Add any markup
      build: function() {
        //Append a Button
        this.trigger = $('<svg class="icon">' +
                         '<use xlink:href="#icon-datepicker"/>' +
                         '</svg>').insertAfter(this.element);
        this.trigger.attr('title', 'Open Calendar View').tooltip();

        // Add Aria
        this.element.attr('aria-haspopup', true);
        //.attr('aria-label', 'to change the date use the arrow keys');
        //aria-describedby
      },

      //Attach Events used by the Control
      handleEvents: function () {
        var self = this;
        this.trigger.on('click.datepicker', function () {
          self.openCalendar();
          self.element.focus();
        });

        this.element.on('focus.datepicker', function () {
          self.mask();
        });

        this.handleKeys();
      },

      // Handle Keyboard Stuff
      handleKeys: function () {
        var self = this;

        this.element.on('keydown.datepicker', function (e) {
          var handled = false;
          //Arrow Down or Alt first opens the dialog
          if (e.keyCode === 40 && !self.isOpen()) {
            handled = true;
            self.openCalendar();
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
        settings.dateFormat = (typeof Locale === 'object' ?
                              Locale.calendar().dateFormat.short :
                              settings.dateFormat);
        if (this.element.data('mask')) {
          this.element.data('mask').destroy();
        }

        var mask = settings.dateFormat.toLowerCase().replace(/[a-z]/g, '#');
        this.element
          .attr('data-mask', mask)
          .attr('data-validate', 'date')
          .attr('data-mask-mode', 'date')
          .mask().validate();
      },

      // Return whether or not the calendar div is open.
      isOpen: function () {
        return (this.popup && this.popup.is(':visible') &&
          !this.popup.hasClass('is-hidden'));
      },

      // Open the calendar in a popup
      openCalendar: function () {
        var self = this;

        // Calendar Html in Popups
        this.table = $('<table class="calendar-table"></table>');
        this.header = $('<div class="calendar-header"><button type="button" class="prev">Previous Month</button><span class="month">november</span><span class="year"> 2014</span><button type="button" class="next">Next Month</button></div>');
        this.dayNames = $('<thead><tr><th>SU</th> <th>MO</th> <th>TU</th> <th>WE</th> <th>TH</th> <th>FR</th> <th>SA</th> </tr> </thead>').appendTo(this.table);
        this.days = $('<tbody> <tr> <td class="alt">26</td> <td class="alt">27</td> <td class="alt">28</td> <td class="alt">29</td> <td class="alt" >30</td> <td class="alt">31</td> <td>1</td> </tr> <tr> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> </tr> <tr> <td>9</td> <td class="selected">10</td> <td>11</td> <td>12</td> <td>13</td> <td>14</td> <td>15</td> </tr> <tr> <td>16</td> <td>17</td> <td>18</td> <td>19</td> <td class="today">20</td> <td>21</td> <td>22</td> </tr> <tr> <td>23</td> <td>24</td> <td>25</td> <td>26</td> <td>27</td> <td>28</td> <td class="alt">1</td> </tr> <tr> <td class="alt">2</td> <td class="alt">3</td> <td class="alt">4</td> <td class="alt">5</td> <td class="alt">6</td> <td class="alt">7</td> <td class="alt">8</td> </tr> </tbody>').appendTo(this.table);
        this.footer = $('<div class="calendar-footer"> <a href="#" class="link cancel">Clear</a> <a href="#" class="link set">Set Date</a> </div>');
        this.calendar = $('<div class="calendar"></div').append(this.header, this.table, this.footer);

        this.trigger.popover({content: this.calendar, trigger: 'immediate',
            placement: 'offset', offset: {top: 20, left: 140}, width: '200',
            tooltipElement: '#calendar-popup'});

        // Show Month
        this.currentDate = new Date();
        this.currentMonth = 9;
        this.currentYear = 2014;
        //TODO: this.currentDate.getMonth(), 2014);
        this.showMonth(this.currentMonth, this.currentYear);
        this.popup = $('#calendar-popup');
        this.originalDate = this.element.val();

        // Calendar Day Events
        this.days.on('click.datepicker', 'td', function () {
          self.days.find('.selected').removeClass('selected');

          var month = self.header.find('.month').attr('data-month'),
            day = $(this).addClass('selected').text();

          self.currentDate = new Date(2014, month, day);
        });

        // Calendar Footer Events
        this.footer.on('click.datepicker', 'a', function () {
          if ($(this).hasClass('cancel')) {
            self.element.val('');
            self.currentDate = null;
            self.popup.hide();
          } else {
            self.insertDate(self.currentDate);
            self.popup.hide();
          }
          self.element.focus();
        });

        // Change Month Events
        this.header.on('click.datepicker', 'button', function () {
          if ($(this).attr('class') === 'next') {
            self.showMonth(self.currentMonth + 1, self.currentYear);
          } else {
            self.showMonth(self.currentMonth - 1, self.currentYear);
          }
        });
      },

      // Update the calendar to show the month (month is zero based)
      showMonth: function (month, year) {

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
          var th = $(this).removeClass('alt');

          if (i < leadDays) {
            th.addClass('alt').text(lastMonthDays - leadDays + 1 + i);
          }

          if (i >= leadDays && dayCnt <= thisMonthDays) {
            th.text(dayCnt);
            dayCnt++;
            return;
          }

          if (dayCnt >= thisMonthDays + 1) {
            th.addClass('alt').text(nextMonthDayCnt);
            nextMonthDayCnt++;
          }

        });
      },

      // Put the date in the field
      insertDate: function (date) {
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
}));
