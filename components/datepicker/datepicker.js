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
          timeFormat: undefined,
          minuteInterval: undefined,
          secondInterval: undefined,
          mode: undefined,
          roundToInterval: undefined,
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
          },
          showLegend: false,
          legend: [
            //Legend Build up example
            //Color in level 6 - http://usmvvwdev53:424/controls/colors
            {name: 'Public Holiday', color: '#76B051', dates: []},
            {name: 'Weekends', color: '#EFA836', dayOfWeek: []}
          ]
        },
        settings = $.extend({}, defaults, options);

    /**
    * A component to support date entry.
    *
    * @class DatePicker
    * @param {Boolean} showTime  &nbsp;-&nbsp; If true the time selector will be shown.
    * @param {String} timeFormat  &nbsp;-&nbsp; The format to use on the time section fx HH:mm, defaults to current locale's settings.
    * @param {String} mode  &nbsp;-&nbsp; Time picker mode: options: 'standard', 'range', this controls the avilable selections in the time picker.
    * @param {Boolean} roundToInterval  &nbsp;-&nbsp; In time picker mode, if a non-matching minutes value is entered, rounds the minutes value to the nearest interval when the field is blurred.
    * @param {String} dateFormat  &nbsp;-&nbsp; Defaults to current locale but can be overriden to a specific format
    * @param {Boolean} disable  &nbsp;-&nbsp; Disabled Dates Build up. `{
      'dates'     : [],
      'minDate'   : '',
      'maxDate'   : '',
      'dayOfWeek' : [],
      'isEnable' : false
    }`
    * @param {Boolean} showLegend  &nbsp;-&nbsp; If true a legend is show to associate dates.
    * @param {Array} legend  &nbsp;-&nbsp; Legend Build up for example `[{name: 'Public Holiday', color: '#76B051', dates: []}, {name: 'Weekends', color: '#EFA836', dayOfWeek: []}]`
    *
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

        this.isIslamic = Locale.calendar().name === 'islamic-umalqura';
        this.conversions = Locale.calendar().conversions;
      },

      addAria: function () {
        this.label = $('label[for="'+ this.element.attr('id') + '"]');
        this.label.append('<span class="audible">' + Locale.translate('PressDown') + '</span>');
      },

      // Handle Keyboard Stuff
      handleKeys: function (elem) {
        var self = this;

        if (elem.is('#calendar-popup')) {
          elem.off('keydown.datepicker').on('keydown.datepicker', '.calendar-table', function (e) {
            var handled = false,
              key = e.keyCode || e.charCode || 0;

            //Arrow Down: select same day of the week in the next week
            if (key === 40) {
                handled = true;
                self.currentDate.setDate(self.currentDate.getDate() + 7);
                self.insertDate(self.currentDate);
            }

            //Arrow Up: select same day of the week in the previous week
            if (key === 38) {
              handled = true;
              self.currentDate.setDate(self.currentDate.getDate() - 7);
              self.insertDate(self.currentDate);
            }

            //Arrow Left
            if (key === 37) {
              handled = true;
              self.currentDate.setDate(self.currentDate.getDate() - 1);
              self.insertDate(self.currentDate);
            }

            //Arrow Right
            if (key === 39) {
              handled = true;
              self.currentDate.setDate(self.currentDate.getDate() + 1);
              self.insertDate(self.currentDate);
            }

            //Page Up Selects Same Day Next Month
            if (key === 33 && !e.altKey) {
              handled = true;
              self.currentDate.setMonth(self.currentDate.getMonth() + 1);
              self.insertDate(self.currentDate);
            }

            //Page Down Selects Same Day Prev Month
            if (key === 34 && !e.altKey) {
              handled = true;
              self.currentDate.setMonth(self.currentDate.getMonth() - 1);
              self.insertDate(self.currentDate);
            }

            //ctrl + Page Up Selects Same Day Next Year
            if (key === 33 && e.ctrlKey) {
              handled = true;
              self.currentDate.setFullYear(self.currentDate.getFullYear() + 1);
              self.insertDate(self.currentDate);
            }

            //ctrl + Page Down Selects Same Day Prev Year
            if (key === 34 && e.ctrlKey) {
              handled = true;
              self.currentDate.setFullYear(self.currentDate.getFullYear() - 1);
              self.insertDate(self.currentDate);
            }

            //Home Moves to End of the month
            if (key === 35) {
              handled = true;
              var lastDay =  new Date(self.currentDate.getFullYear(), self.currentDate.getMonth()+1, 0);
              self.currentDate = lastDay;
              self.insertDate(self.currentDate);
            }

            //End Moves to Start of the month
            if (key === 36) {
              var firstDay =  new Date(self.currentDate.getFullYear(), self.currentDate.getMonth(), 1);
              self.currentDate = firstDay;
              self.insertDate(self.currentDate);
            }

            // 't' selects today
            if (key === 84) {
              handled = true;
              self.setToday();
            }

            // Space or Enter closes Date Picker, selecting the Date
            if (key === 32 || key === 13) {
              self.closeCalendar();
              self.element.focus();
              handled = true;
            }

            // Tab closes Date Picker and goes to next field
            if (key === 9) {
              if (!self.settings.showTime) {
                self.element.focus();
                self.closeCalendar();
              }
            }

            // Esc closes Date Picker and goes back to field
            if (key === 27) {
              self.closeCalendar();
              self.element.focus();
            }

            if (handled) {
              e.stopPropagation();
              e.preventDefault();
              return false;
            }

          });
        }
        else {
          elem.off('keydown.datepicker').on('keydown.datepicker', function (e) {
            var handled = false,
              key = e.keyCode || e.charCode || 0,
              focused = $(':focus'),
              focusedlabel = focused.attr('aria-label');

            // Focus did not auto move from readonly
            if (key === 9 && self.element.is('[readonly]')) { //tab
              self.setFocusOnFocusableElement(self.element, (e.shiftKey ? 'prev' : 'next'));
              return;
            }

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

            // 't' selects today
            if (key === 84) {
              handled = true;
              self.setToday();
            }

            if (handled) {
              e.stopPropagation();
              e.preventDefault();
              return false;
            }

          });
        }

      },

      //Parse the Date Format Options
      setFormat: function () {
        var localeDateFormat = ((typeof Locale === 'object' && Locale.calendar().dateFormat) ? Locale.calendar().dateFormat : null),
          localeTimeFormat = ((typeof Locale === 'object' && Locale.calendar().timeFormat) ? Locale.calendar().timeFormat : null);

        if (this.settings.dateFormat === 'locale') {
          this.pattern = localeDateFormat.short + (this.settings.showTime ? ' ' + (this.settings.timeFormat || localeTimeFormat) : '');
        } else {
          this.pattern = this.settings.dateFormat + (this.settings.showTime && this.settings.timeFormat ? ' ' + this.settings.timeFormat : '');
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
                   .replace(/mmmm/g,'*********')
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

      /**
      * Return whether or not the calendar div is open.
      */
      isOpen: function () {
        return (this.popup && this.popup.is(':visible') &&
          !this.popup.hasClass('is-hidden'));
      },

      /**
      * Open the Calendar Popup.
      */
      open: function() {
        return this.openCalendar();
      },

      activeTabindex: function(elem, isFocus) {
        $('td', this.days).removeAttr('tabindex');
        elem.attr('tabindex', 0);

        if (isFocus) {
          elem.focus();
        }
        return elem;
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
        var prevButton = '<button type="button" class="btn-icon prev">' + $.createIcon('caret-left') + '<span>'+ Locale.translate('PreviousMonth') +'</span></button>',
            nextButton = '<button type="button" class="btn-icon next">' + $.createIcon('caret-right') + '<span>'+ Locale.translate('NextMonth') +'</span></button>';

        this.table = $('<table class="calendar-table" aria-label="'+ Locale.translate('Calendar') +'" role="application"></table>');
        this.header = $('<div class="calendar-header"><span class="month">november</span><span class="year">2015</span>'+ (Locale.isRTL() ? prevButton + nextButton : prevButton + nextButton) +'</div>');
        this.dayNames = $('<thead><tr><th>SU</th> <th>MO</th> <th>TU</th> <th>WE</th> <th>TH</th> <th>FR</th> <th>SA</th> </tr> </thead>').appendTo(this.table);
        this.days = $('<tbody> <tr> <td class="alternate">26</td> <td class="alternate">27</td> <td class="alternate">28</td> <td class="alternate">29</td> <td class="alternate" >30</td> <td class="alternate">31</td> <td>1</td> </tr> <tr> <td>2</td> <td>3</td> <td>4</td> <td>5</td> <td>6</td> <td>7</td> <td>8</td> </tr> <tr> <td>9</td> <td>10</td> <td>11</td> <td>12</td> <td>13</td> <td>14</td> <td>15</td> </tr> <tr> <td>16</td> <td>17</td> <td>18</td> <td>19</td> <td class="is-today">20</td> <td>21</td> <td>22</td> </tr> <tr> <td>23</td> <td>24</td> <td>25</td> <td>26</td> <td>27</td> <td>28</td> <td class="alternate">1</td> </tr> <tr> <td class="alternate">2</td> <td class="alternate">3</td> <td class="alternate">4</td> <td class="alternate">5</td> <td class="alternate">6</td> <td class="alternate">7</td> <td class="alternate">8</td> </tr> </tbody>').appendTo(this.table);
        this.timepickerContainer = $('<div class="datepicker-time-container"></div>');
        this.footer = $('<div class="popup-footer"> <button type="button" class="cancel btn-tertiary">'+ Locale.translate('Clear') +'</button> <button type="button" class="is-today btn-tertiary">'+Locale.translate('Today')+'</button> </div>');

        // Timepicker options
        if (this.settings.showTime) {
          if (this.settings.timeFormat === undefined) {
            // Getting time-format from date-format (dateFormat: 'M/d/yyyy HH:mm:ss')
            timeOptions.timeFormat = this.pattern.slice(this.pattern.indexOf(' '));
          }
          else {
            timeOptions.timeFormat = this.settings.timeFormat;
          }
          if (this.settings.minuteInterval !== undefined) {
            timeOptions.minuteInterval = this.settings.minuteInterval;
          }
          if (this.settings.secondInterval !== undefined) {
            timeOptions.secondInterval = this.settings.minuteInterval;
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

        var placementParent = this.element,
          placementParentXAlignment = (Locale.isRTL() ? 'right' : 'left'),
          parent = this.element.parent();

        if (parent.is('.datagrid-cell-wrapper')) {
          placementParentXAlignment = 'center';
          placementParent = this.element.next('.icon');
        }

        var popoverOpts = {
          content: this.calendar,
          placementOpts: {
            parent: placementParent,
            parentXAlignment: placementParentXAlignment,
            strategies: ['flip', 'nudge', 'shrink']
          },
          placement : 'bottom',
          popover: true,
          trigger: 'immediate',
          tooltipElement: '#calendar-popup'
        };

        this.trigger.popover(popoverOpts)
        .off('show.datepicker').on('show.datepicker', function () {
          if (Soho.env.os.name === 'ios') {
            $('head').triggerHandler('disable-zoom');
          }
          // Horizontal view on mobile
          if (window.innerHeight < 400) {
            self.popup.find('.arrow').hide();
            self.popup.css('min-height', (self.popupClosestScrollable[0].scrollHeight + 2) +'px');
            self.popupClosestScrollable.css('min-height', '375px');
          }
        })
        .off('hide.datepicker').on('hide.datepicker', function () {
          if (Soho.env.os.name === 'ios') {
            self.trigger.one('hide', function() {
              $('head').triggerHandler('enable-zoom');
            });
          }
          self.popupClosestScrollable.add(self.popup).css('min-height', 'inherit');
          self.closeCalendar();
        });

        this.handleKeys($('#calendar-popup'));
        $('.calendar-footer a', this.calendar).button();

        // Show Month
        this.setValueFromField();

        // Set timepicker
        if (this.settings.showTime) {

          //Set to 12:00
          if (this.element.val() === '') {
            this.currentDate.setHours(0);
            this.currentDate.setMinutes(0);
            this.currentDate.setSeconds(0);
          }

          timeOptions.parentElement = this.timepickerContainer;
          this.time = self.getTimeString(this.currentDate, self.show24Hours);
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

        if (this.isIslamic) {
          this.todayDateIslamic = this.conversions.fromGregorian(this.todayDate);
          this.todayYear = this.todayDateIslamic[0];
          this.todayMonth = this.todayDateIslamic[1];
          this.todayDay = this.todayDateIslamic[2];
        }

        this.showMonth(this.currentMonth, this.currentYear);
        this.popup = $('#calendar-popup');
        this.popupClosestScrollable = this.popup.closest('.scrollable');
        this.popup.attr('role', 'dialog');
        this.originalDate = this.element.val();

        // Calendar Day Events
        this.days.off('click.datepicker').on('click.datepicker', 'td', function () {
          var td = $(this);
          if (td.hasClass('is-disabled')) {
            self.activeTabindex(td, true);
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

            if (self.isIslamic) {
              self.currentDateIslamic[0] = year;
              self.currentDateIslamic[1] = month;
              self.currentDateIslamic[2] = day;
              self.currentYear = self.currentDateIslamic[0];
              self.currentMonth = self.currentDateIslamic[1];
              self.currentDay = self.currentDateIslamic[2];
              self.currentDate = self.conversions.toGregorian(self.currentDateIslamic[0], self.currentDateIslamic[1], self.currentDateIslamic[2]);
            }

            self.insertDate(self.isIslamic ? self.currentDateIslamic : self.currentDate);
            self.closeCalendar();
            self.element.focus();
          }
        });

        // Calendar Footer Events
        this.footer.off('click.datepicker').on('click.datepicker', 'button', function (e) {
          var btn = $(this);

          if (btn.hasClass('cancel')) {
            self.element.val('').trigger('change').trigger('input');
            self.currentDate = null;
            self.closeCalendar();
          }

          if (btn.hasClass('is-today')) {
            self.setToday();
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

      /**
      * Close the calendar popup.
      */
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

        if (this.element.hasClass('is-active')) {
          this.element.trigger('listclosed');
          this.element.removeClass('is-active');
        }
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

      //Add a Legend below the table
      addLegend: function () {
        if (!this.settings.showLegend) {
          return;
        }

        //Remove Legend
        if (this.legend && this.legend.length) {
          this.legend.remove();
        }

        this.legend = $('<div class="calendar-legend"></div>');

        for (var i = 0; i < this.settings.legend.length; i++) {
          var series = this.settings.legend[i],
            item = '<div class="calendar-legend-item">' +
              '<span class="calendar-legend-swatch" style="background-color:' + this.hexToRgba(series.color, 0.3) + '"></span>' +
              '<span class="calendar-legend-text">' + series.name + '</span></div>';

          this.legend.append(item);
        }

        this.table.after(this.legend);
      },

      // Set Color for the Legend settings
      setLegendColor: function (elem, year, month, date) {
        if (!this.settings.showLegend || !elem[0]) {
          return;
        }

        var hex = this.getLegendColor(year, month, date),
          self = this;

        elem[0].style.backgroundColor = '';

        if (hex) {
          //set color on elem at .3 of provided color as per design
          elem.addClass('is-colored');
          elem[0].style.backgroundColor = this.hexToRgba(hex, 0.3);

          var normalColor = self.hexToRgba(hex, 0.3),
            hoverColor = self.hexToRgba(hex, 0.7);

          //handle hover states
          elem.on('mouseenter', function () {
            var elem = $(this);
            elem[0].style.backgroundColor = hoverColor;
            elem.find('span')[0].style.backgroundColor = 'transparent';
          }).on('mouseleave', function () {
            var elem = $(this);
            elem[0].style.backgroundColor = normalColor;
            elem.find('span')[0].style.backgroundColor = '';
          });

        }
      },

      //This maybe can be later moved into a colors file along with getLuminousColorShade
      ///But convert the provided hex to an RGBA for states
      hexToRgba: function(hex, opacity) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');

            if (c.length === 3) {
              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }

            c = '0x' + c.join('');
            return 'rgba(' + [(c>>16)&255, (c>>8)&255, c&255].join(',') + ',' + opacity.toString() +')';
        }
        return '';
      },

      // Process Color Options to get the date color
      getLegendColor: function (year, month, date) {
        if (!this.settings.showLegend) {
          return;
        }

        var checkDate = new Date(year, month, date),
          checkHours = checkDate.setHours(0,0,0,0);

        for (var i = 0; i < this.settings.legend.length; i++) {
          var series = this.settings.legend[i];

          //Check Day of week
          if (series.dayOfWeek && series.dayOfWeek.indexOf(checkDate.getDay()) !== -1) {
            return series.color;
          }

          //Check for dates that match
          if (series.dates) {
            for (var j = 0; j < series.dates.length; j++) {
              var d = new Date(series.dates[j]);
              if (checkHours === d.setHours(0,0,0,0)) {
                return series.color;
              }
            }
          }

        }

        return '';
      },

      // Set focus after opening the calendar
      setFocusAfterOpen: function () {
        if (!this.calendar) {
          return;
        }
        this.activeTabindex(this.calendar.find('.is-selected'), true);
      },

      // Update the calendar to show the month (month is zero based)
      showMonth: function (month, year) {
        var self = this;

        var elementDate = this.currentDate.getDate() ?
          this.currentDate : (new Date()).setHours(0,0,0,0);

        if (this.isIslamic) {
          elementDate = this.currentDateIslamic;
        }

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
        var firstDayofWeek = (Locale.calendar().firstDayofWeek || 0);
        this.dayNames.find('th').each(function (i) {
          $(this).text(days[(i + firstDayofWeek) % 7]);
        });

        //Localize Month Name
        this.yearFist = Locale.calendar().dateFormat.year && Locale.calendar().dateFormat.year.substr(1, 1) === 'y';
        this.header.find('.month').attr('data-month', month).text(monthName + ' ');
        this.header.find('.year').text(' ' + year);

        if (this.yearFist) {
          var translation = Locale.formatDate(elementDate, {date: 'year'}),
            justYear = translation.split(' ')[0];

          this.header.find('.year').text(justYear + ' ');
          this.header.find('.year').insertBefore(this.header.find('.month'));
        }

        //Adjust days of the week
        //lead days
        var firstDayOfMonth = this.firstDayOfMonth(year, month),
          leadDays = (firstDayOfMonth - (Locale.calendar().firstDayofWeek || 0) + 7) % 7,
          lastMonthDays = this.daysInMonth(year, month + (this.isIslamic ? 1 : 0)),
          thisMonthDays = this.daysInMonth(year, month+ (this.isIslamic ? 0 : 1)),
          dayCnt = 1, nextMonthDayCnt = 1, exYear, exMonth, exDay;

        this.days.find('td').each(function (i) {
          var th = $(this).removeClass('alternate prev-month next-month is-selected is-today');
          th.removeAttr('aria-selected');

          if (i < leadDays) {
            exDay = lastMonthDays - leadDays + 1 + i;
            exMonth = (month === 0) ? 11 : month - 1;
            exYear = (month === 0) ? year - 1 : year;

            self.setDisabled(th, exYear, exMonth, exDay);
            self.setLegendColor(th, exYear, exMonth, exDay);
            th.addClass('alternate prev-month').html('<span aria-hidden="true">' + exDay + '</span>');
          }

          if (i >= leadDays && dayCnt <= thisMonthDays) {
            th.html('<span aria-hidden="true">' + dayCnt + '</span>');

            //Add Selected Class to Selected Date
            if (self.isIslamic) {
              if (year === elementDate[0] && month === elementDate[1] && dayCnt === elementDate[2]) {
                th.addClass('is-selected').attr('aria-selected', 'true');
              }
            } else {
              var tHours = elementDate.getHours(),
                tMinutes = elementDate.getMinutes(),
                tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;

              if ((new Date(year, month, dayCnt)).setHours(tHours, tMinutes, tSeconds,0) === elementDate.setHours(tHours, tMinutes, tSeconds, 0)) {
                th.addClass('is-selected').attr('aria-selected', 'true');
              }
            }

            if (dayCnt === self.todayDay && self.currentMonth === self.todayMonth &&
              self.currentYear === self.todayYear) {
              th.addClass('is-today');
            }

            th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), {date: 'full'}));

            self.setDisabled(th, year, month, dayCnt);
            self.setLegendColor(th, year, month, dayCnt);

            th.attr('role', 'link');
            dayCnt++;
            return;
          }

          if (dayCnt >= thisMonthDays + 1) {
            exDay = nextMonthDayCnt;
            exMonth = (month === 11) ? 0 : month + 1;
            exYear = (month === 11) ? year + 1 : year;

            self.setDisabled(th, exYear, exMonth, exDay);
            self.setLegendColor(th, exYear, exMonth, exDay);

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

        //Add Legend
        self.addLegend();
      },

      // Put the date in the field and select on the calendar
      insertDate: function (date, isReset) {
        var month = (date instanceof Array ? date[1] : date.getMonth()),
            year  = (date instanceof Array ? date[0] : date.getFullYear()),
            day = (date instanceof Array ? date[2] : date.getDate()).toString();

        // Make sure Calendar is showing that month
        if (this.currentMonth !== month || this.currentYear !== year) {
          this.showMonth(month, year);
        }

        if (!this.isOpen()) {
          return;
        }

        // Show the Date in the UI
        var dateTd = this.days.find('td:not(.alternate)').filter(function() {
          return $(this).text().toLowerCase() === day;
        });

        if (dateTd.hasClass('is-disabled')) {
          this.activeTabindex(dateTd, true);
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

          this.setValue(date, true);
          this.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected').removeAttr('tabindex');
          dateTd.addClass('is-selected').attr({'aria-selected': true});
          this.activeTabindex(dateTd, true);
        }
      },

      // Convert a string to boolean
      getBoolean: function(val) {
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
      },

      // Find the day of the week of the first of a given month
      firstDayOfMonth: function (year, month) {

        if (this.isIslamic) {
		      var firstDay = this.conversions.toGregorian(year, month, 1);
			    return (firstDay === null ? 1 : firstDay.getDay());
        }
        return  (new Date(year, month, 1)).getDay();
      },

      islamicYearIndex: function (islamicYear) {
        var yearIdx = islamicYear - 1318;
        if (yearIdx < 0 || yearIdx >= this.conversions.yearInfo.length) {
          return 0; // for an out-of-range year, simply returns 0
        } else {
          return yearIdx;
        }
      },

      // Find the date of the Month (29, 30, 31 ect)
      daysInMonth: function (year, month) {

        if (this.isIslamic) {
		      var monthLengthBitmap = this.conversions.yearInfo[this.islamicYearIndex(year)][0];
    			var monthDayCount = 0;
    			for (var M = 0; M <= month; M++) {
    				monthDayCount = 29 + (monthLengthBitmap & 1);
    				if (M === month) {
    					return monthDayCount;
    				}
    				monthLengthBitmap = monthLengthBitmap >> 1;
    			}
    			return 0;
        }
        return  (new Date(year, month, 0)).getDate();
      },

      /**
      * Set the Formatted value in the input
      * @param {Date} date  &nbsp;-&nbsp; The date to set in date format.
      * @param {Boolean} trigger  &nbsp;-&nbsp; If true will trigger the change event.
      */
      setValue: function(date, trigger) {
        //TODO Document this as the way to get the date
        this.currentDate = date;

        if (date instanceof Array) {
          this.currentIslamicDate = date;
          this.currentDate = this.conversions.toGregorian(date[0], date[1], date[2]);
          date = new Date(date[0], date[1], date[2]);
        }

        this.element.val(Locale.formatDate(date, {pattern: this.pattern}));

        if (trigger) {
          this.element.trigger('change').trigger('input');
        }

      },

      //Get the value from the field and set the internal variables or use current date
      setValueFromField: function() {
        var fieldValue = this.element.val(),
          gregorianValue = fieldValue;

        if (this.isIslamic && fieldValue) {
          var islamicValue = Locale.parseDate(this.element.val(), this.pattern);
          gregorianValue = this.conversions.toGregorian(islamicValue.getFullYear(), islamicValue.getMonth(),  islamicValue.getDate());
        }

        this.currentDate = gregorianValue || new Date();
        if (typeof this.currentDate === 'string') {
          this.currentDate = Locale.parseDate(this.currentDate, this.pattern, false);
        }

        if (this.currentDate === undefined) {
          this.currentDate = Locale.parseDate(gregorianValue, this.pattern, false);
        }

        this.currentDate = this.currentDate || new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.currentDay = this.currentDate.getDate();

        if (this.isIslamic) {
          this.currentDateIslamic = this.conversions.fromGregorian(this.currentDate);
          this.currentYear = this.currentDateIslamic[0];
          this.currentMonth = this.currentDateIslamic[1];
          this.currentDay = this.currentDateIslamic[2];
        }
      },

      /**
      * Set input to enabled.
      */
      enable: function() {
        this.element.removeAttr('disabled readonly').closest('.field').removeClass('is-disabled');
      },

      /**
      * Set input to disabled.
      */
      disable: function() {
        this.enable();
        this.element.attr('disabled', 'disabled').closest('.field').addClass('is-disabled');
      },

      /**
      * Set input to readonly.
      */
      readonly: function() {
        this.enable();
        this.element.attr('readonly', 'readonly');
      },

      /**
      * Set to todays date in current format.
      */
      setToday: function() {
        this.currentDate = new Date();

        if (this.element.val() === '') {
          this.currentDate.setHours(0);
          this.currentDate.setMinutes(0);
          this.currentDate.setSeconds(0);
        } else {
          if (this.timepicker && this.timepicker.hourSelect) {
            this.currentDate.setHours(this.timepicker.hourSelect.val());
          }

          if (this.timepicker && this.timepicker.minuteSelect) {
            this.currentDate.setMinutes(this.timepicker.minuteSelect.val());
          }

          if (this.timepicker && this.timepicker.secondSelect) {
            this.currentDate.setSeconds(this.timepicker.secondSelect.val());
          }
        }

        if (this.isIslamic) {
          this.currentDateIslamic = this.conversions.fromGregorian(this.currentDate);
        }

        if (this.isOpen()) {
          this.insertDate(this.isIslamic ? this.currentDateIslamic : this.currentDate, true);
        } else {
          this.element.val(Locale.formatDate(this.currentDate, {pattern: this.pattern})).trigger('change').trigger('input');
        }

      },

      // Set time
      setTime: function(date) {
        var hours = $('#timepicker-hours').val(),
          minutes = $('#timepicker-minutes').val(),
          seconds = this.isSeconds ? $('#timepicker-seconds').val() : 0,
          period = $('#timepicker-period');


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

      // Set focus on (opt: next|prev) focusable element
      setFocusOnFocusableElement: function(element, opt) {
        var canfocus = $(':focusable'),
          index = canfocus.index(element);

        index = (opt === 'next') ?
          ((index+1) >= canfocus.length ? 0 : (index+1)) :
          ((index-1) < 0 ? canfocus.length : (index-1));

        canfocus.eq(index).focus();
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

      /**
      * Remove all events and reset back to default.
      */
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      },

      /**
       *  This component fires the following events.
       *
       * @fires Datepicker#events
       * @param {Object} listopened  &nbsp;-&nbsp; Fires as the calendar popup is opened
       * @param {Object} listclosed  &nbsp;-&nbsp; Fires as the calendar popup is closed
       * @param {Object} change  &nbsp;-&nbsp; Fires after the value in the input is changed by any means.
       * @param {Object} input  &nbsp;-&nbsp; Fires after the value in the input is changed by user interaction.
       *
       */
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
