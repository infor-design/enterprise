import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';
import { Locale } from '../locale/locale';
import { MonthView } from '../monthview/monthview';
import { Environment as env } from '../../utils/environment';

// jQuery Components
import '../mask/mask-input.jquery';
import '../popover/popover.jquery';
import '../timepicker/timepicker.jquery';
import '../validation/validation.jquery';
import '../validation/validation.utils';

// Component Name
const COMPONENT_NAME = 'datepicker';

/**
 * A component to support date entry.
 * @class DatePicker
 * @constructor
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {boolean} [settings.showTime=false] If true the time selector will be shown.
 * @param {boolean} [settings.useCurrentTime=false] If true current time will be used for the time portion otherwise 12:00 midnight is used
 * @param {string} [settings.timeFormat] Format to use time section fx HH:mm,
 *  defaults current locale settings.
 * @param {number} [settings.minuteInterval]
 * @param {number} [settings.secondInterval]
 * @param {string} [settings.mode] Time picker options: 'standard', 'range',
 *  this controls the time picker.
 * @param {boolean} [settings.roundToInterval] In time picker mode, if a non-matching
 *  minutes value is entered,
 *  rounds the minutes value to the nearest interval when the field is blurred.
 * @param {string} [settings.dateFormat='locale'] Defaults to current locale but can be
 * @param {string} [settings.placeholder=false] Text to show in input element while empty.
 * @param {object} [settings.disable] Disable dates in various ways.
 * For example `{minDate: 'M/d/yyyy', maxDate: 'M/d/yyyy'}`. Dates should be in format M/d/yyyy
 * or be a Date() object or string that can be converted to a date with new Date().
 * @param {array} [settings.disable.dates] Disable specific dates.
 * Example `{dates: ['12/31/2018', '01/01/2019'}`.
 * @param {string|date} [settings.disable.minDate] Disable up to a minimum date.
 * Example `{minDate: '12/31/2016'}`.
 * @param {string|date} [settings.disable.maxDate] Disable up to a maximum date.
 * Example `{minDate: '12/31/2019'}`.
 * @param {array} [settings.disable.dayOfWeek] Disable a specific of days of the week 0-6.
 * Example `{dayOfWeek: [0,6]}`.
 * @param {boolean} [settings.disable.isEnable=false] Inverse the disable settings.
 * If true all the disable settings will be enabled and the rest will be disabled.
 * So you can inverse the settings.
 * @param {boolean} [settings.disable.retrictMonths=false] Restrict month selections on datepicker.
 * It requires minDate and maxDate for the feature to activate.
 * For example if you have more non specific dates to disable then enable ect.
 * @param {boolean} [settings.showLegend=false] If true a legend is show to associate dates.
 * @param {boolean} [settings.showMonthYearPicker=false] If true the month and year will render as dropdowns.
 * @param {boolean} [settings.hideDays=false] If true the days portion of the calendar will be hidden.
 *  Usefull for Month/Year only formats.
 * @param {number} [settings.advanceMonths=5] The number of months in each direction to show in
 *  the dropdown for months (when initially opening)
 * @param {array} [settings.legend]  Legend Build up
 * for example `[{name: 'Public Holiday', color: '#76B051', dates: []},
 * {name: 'Weekends', color: '#EFA836', dayOfWeek: []}]`
 * @param {object} [settings.range] Range between two dates with various options.
 * @param {boolean} [settings.range.useRange=false] Use range of two dates options.
 * @param {string|date} [settings.range.start] Start date in range.
 * @param {string|date} [settings.range.end] End date in range.
 * @param {string} [settings.range.separator=' - '] Visual separator between two dates.
 * @param {number} [settings.range.minDays=0] Minimum days to be in range.
 * @param {number} [settings.range.maxDays=0] Maximum days to be in range.
 * @param {boolean} [settings.range.selectForward=false] Range only in forward direction.
 * @param {boolean} [settings.range.selectBackward=false] Range only in backward direction.
 * @param {boolean} [settings.range.includeDisabled=false] Include disable dates in range of dates.
 * @param {string} [settings.calendarName] The name of the calendar to use in instance of
 * multiple calendars. At this time only ar-SA and ar-EG locales have either
 * 'gregorian' or 'islamic-umalqura' as valid values.
 * @param {boolean} [settings.useUTC=false] If true the dates will use UTC format. This is only partially
 * implemented https://jira.infor.com/browse/SOHO-3437
 * @param {boolean} [settings.autoSize=false] If true the field will be sized to the width of the date.
 * @param {boolean} [settings.hideButtons=false] If true bottom and next/prev buttons will be not shown.
 */
const DATEPICKER_DEFAULTS = {
  showTime: false,
  useCurrentTime: false,
  timeFormat: undefined,
  minuteInterval: undefined,
  secondInterval: undefined,
  mode: undefined,
  roundToInterval: undefined,
  dateFormat: 'locale', // or can be a specific format
  placeholder: false,
  disable: {
    dates: [],
    minDate: '',
    maxDate: '',
    dayOfWeek: [],
    isEnable: false,
    restrictMonths: false
  },
  showLegend: false,
  showMonthYearPicker: false,
  hideDays: false,
  advanceMonths: 5,
  legend: [
    // Legend Build up example
    // Color in level 6 - http://usmvvwdev53:424/controls/colors
    { name: 'Public Holiday', color: '#76B051', dates: [] },
    { name: 'Weekends', color: '#EFA836', dayOfWeek: [] }
  ],
  range: {
    useRange: false, // true - if datepicker using range dates
    start: '', // Start date '03/05/2018'
    end: '', // End date '03/21/2018'
    separator: ' - ', // separator string between two dates
    minDays: 0, // Minimum days
    maxDays: 0, // Maximum days
    selectForward: false, // Only in forward direction
    selectBackward: false, // Only in backward direction
    includeDisabled: false // if true range will include disable dates in it
  },
  calendarName: null,
  useUTC: false,
  autoSize: false,
  hideButtons: false
};

function DatePicker(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, DATEPICKER_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
DatePicker.prototype = {

  init() {
    this.build();
    this.handleEvents();
  },

  /**
   * Add markup
   * @private
   * @returns {void}
   */
  build() {
    // Add "is-disabled" css class to closest ".field" if element is disabled
    if (this.element.is(':disabled')) {
      this.element.closest('.field').addClass('is-disabled');
    }

    // Append a trigger button
    this.trigger = $.createIconElement('calendar').insertAfter(this.element);
    this.addAria();

    // Set the current calendar
    this.setCurrentCalendar();
    this.isIslamic = this.currentCalendar.name === 'islamic-umalqura';
    this.conversions = this.currentCalendar.conversions;
    this.isFullMonth = this.settings.dateFormat.indexOf('MMMM') > -1;
    this.setSize();
  },

  /**
   * Set current calendar
   * @private
   * @returns {void}
   */
  setCurrentCalendar() {
    if (this.settings.calendarName) {
      this.currentCalendar = Locale.getCalendar(this.settings.calendarName) || Locale.calendar();
    } else {
      this.currentCalendar = Locale.calendar();
    }
  },

  /**
   * Set size attribute based on current contents
   * @private
   * @returns {void}
   */
  setSize() {
    if (!this.settings.autoSize) {
      return;
    }
    const elem = this.element[0];
    const padding = 45;
    elem.classList.add('input-auto');
    elem.style.width = `${stringUtils.textWidth(elem.value, 16) + padding}px`;
  },

  /**
   * Add aria
   * @private
   * @returns {void}
   */
  addAria() {
    this.label = $(`label[for="${this.element.attr('id')}"]`);
    this.label.append(`<span class="audible">${Locale.translate('PressDown')}</span>`);
  },

  /**
   * Handle Keyboard Stuff
   * @private
   * @param {object} elem to handle.
   * @returns {void}
   */
  handleKeys(elem) {
    const s = this.settings;
    const self = this;
    // Handle Keys while popup is open
    if (elem.is('#monthview-popup')) {
      elem.off('keydown.datepicker').on('keydown.datepicker', '.monthview-table', (e) => {
        const key = e.keyCode || e.charCode || 0;
        const cell = $(e.target);
        const allCell = this.calendarAPI.days.find('td:visible');
        const allCellLength = allCell.length;
        let idx = null;
        let selector = null;
        let handled = false;
        const minDate = new Date(s.disable.minDate);
        const maxDate = new Date(s.disable.maxDate);

        self.calendarAPI.validatePrevNext();

        // Arrow Down: select same day of the week in the next week
        if (key === 40) {
          handled = true;
          if (s.range.useRange) {
            idx = allCell.index(e.target) + 7;
            selector = allCell.eq(idx);
            if (idx < allCellLength) {
              this.calendarAPI.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
          } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (this.currentDate.getMonth() < maxDate.getMonth()) {
              this.currentDate.setDate(this.currentDate.getDate() + 7);
            } else if (maxDate.getDate() - 1 >= this.currentDate.getDate() + 7) {
              this.currentDate.setDate(this.currentDate.getDate() + 7);
            }
            this.insertDate(this.currentDate);
          } else {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
            this.insertDate(this.currentDate);
          }
        }

        // Arrow Up: select same day of the week in the previous week
        if (key === 38) {
          handled = true;
          if (s.range.useRange) {
            idx = allCell.index(e.target) - 7;
            selector = allCell.eq(idx);
            if (idx > -1) {
              this.calendarAPI.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
          } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (this.currentDate.getMonth() > minDate.getMonth()) {
              this.currentDate.setDate(this.currentDate.getDate() - 7);
            } else if (minDate.getDate() + 1 <= this.currentDate.getDate() - 7) {
              this.currentDate.setDate(this.currentDate.getDate() - 7);
            }
            this.insertDate(this.currentDate);
          } else {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
            this.insertDate(this.currentDate);
          }
        }

        // Arrow Left
        if (key === 37) {
          handled = true;
          if (s.range.useRange) {
            idx = allCell.index(e.target) - 1;
            selector = allCell.eq(idx);
            if (idx > -1) {
              this.calendarAPI.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
          } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (this.currentDate.getMonth() > minDate.getMonth()) {
              this.currentDate.setDate(this.currentDate.getDate() - 1);
            } else if (minDate.getDate() + 1 !== this.currentDate.getDate()) {
              this.currentDate.setDate(this.currentDate.getDate() - 1);
            }
            this.insertDate(this.currentDate);
          } else {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.insertDate(this.currentDate);
          }
        }

        // Arrow Right
        if (key === 39) {
          handled = true;
          if (s.range.useRange) {
            idx = allCell.index(e.target) + 1;
            selector = allCell.eq(idx);
            if (idx < allCellLength) {
              this.calendarAPI.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
          } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (this.currentDate.getMonth() < maxDate.getMonth()) {
              this.currentDate.setDate(this.currentDate.getDate() + 1);
            } else if (maxDate.getDate() - 1 !== this.currentDate.getDate()) {
              this.currentDate.setDate(this.currentDate.getDate() + 1);
            }
            this.insertDate(this.currentDate);
          } else {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.insertDate(this.currentDate);
          }
        }

        // Page Up Selects Same Day Prev Month
        if (key === 33 && !e.altKey) {
          handled = true;
          if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (minDate.getMonth() !== this.currentDate.getMonth()) {
              this.currentDate.setMonth(this.currentDate.getMonth() - 1);
              this.insertDate(this.currentDate);
            }
          } else {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.insertDate(this.currentDate);
          }
        }

        // Page Down Selects Same Day Next Month
        if (key === 34 && !e.altKey) {
          handled = true;
          if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (this.currentDate.getMonth() !== maxDate.getMonth()) {
              this.currentDate.setMonth(this.currentDate.getMonth() + 1);
              this.insertDate(this.currentDate);
            }
          } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.insertDate(this.currentDate);
          }
        }

        // ctrl + Page Up Selects Same Day Next Year
        if (key === 33 && e.ctrlKey) {
          handled = true;
          this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
          this.insertDate(this.currentDate);
        }

        // ctrl + Page Down Selects Same Day Prev Year
        if (key === 34 && e.ctrlKey) {
          handled = true;
          this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
          this.insertDate(this.currentDate);
        }

        // Home Moves to Start of the month
        if (key === 36) {
          handled = true;
          const d = this.currentDate;
          let firstDay;

          if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (minDate.getMonth() !== this.currentDate.getMonth()) {
              firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
            } else {
              firstDay = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
              firstDay.setDate(firstDay.getDate() + 1);
            }
          } else {
            firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
          }

          this.currentDate = firstDay;
          this.insertDate(this.currentDate);
        }

        // End Moves to End of the month
        if (key === 35) {
          handled = true;
          const d = this.currentDate;
          let lastDay;
          if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
            if (this.currentDate.getMonth() !== maxDate.getMonth()) {
              lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            } else {
              lastDay = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
              lastDay.setDate(lastDay.getDate() - 1);
            }
          } else {
            lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          }

          this.currentDate = lastDay;
          this.insertDate(this.currentDate);
        }

        // 't' selects today
        if (key === 84) {
          handled = true;
          this.setToday();
        }

        // Space or Enter closes Date Picker, selecting the Date
        if (key === 32 || key === 13) {
          handled = true;
          if (s.range.useRange) {
            if (!s.range.first || (s.range.first && !s.range.first.date)) {
              allCell.removeClass('is-selected');
            }
            const d = this.calendarAPI.getCellDate(cell);
            this.currentDate = new Date(d.year, d.month, d.day);
            this.insertDate(this.currentDate);
          } else {
            this.closeCalendar();
            this.element.focus();
          }
        }

        // Tab closes Date Picker and goes to next field on the modal
        if (key === 9) {
          this.containFocus(e);
          handled = true;
        }

        // Esc closes Date Picker and goes back to field
        if (key === 27) {
          this.closeCalendar();
          this.element.focus();
          e.stopImmediatePropagation();
          handled = true;
        }

        if (handled) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        return true;
      });

      elem.off('keydown.datepicker-tab').on('keydown.datepicker-tab', 'td, input, div.dropdown, button', (e) => {
        const key = e.keyCode || e.charCode || 0;

        // Tab closes Date Picker and goes to next field on the modal
        if (key === 9) {
          if (s.range.useRange && $(e.target).is('.next')) {
            this.calendarAPI.days.find('td:visible:last').attr('tabindex', 0).focus();
          } else {
            this.containFocus(e);
          }
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        return true;
      });

      return;
    }

    // Handle input keys
    elem.off('keydown.datepicker').on('keydown.datepicker', (e) => {
      let handled = false;
      const key = e.keyCode || e.charCode || 0;
      const focused = $(':focus');
      const focusedlabel = focused.attr('aria-label');

      // TODO: With new mask the code around key === 9 should not be needed.

      if (focusedlabel) {
        const focusedDate = new Date(focusedlabel);
        this.currentDate = new Date(focusedDate.getTime());
      } else if (focused.hasClass('alternate')) {
        let year = parseInt(this.calendarAPI.header.find('.year').text(), 10);
        let month = parseInt(this.calendarAPI.header.find('.month').attr('data-month'), 10);
        const day = parseInt(focused.text(), 10);

        if (this.settings.showMonthYearPicker) {
          month = parseInt(this.calendarAPI.header.find('.month select').val(), 10);
          year = parseInt(this.calendarAPI.header.find('.year select').val(), 10);
        }

        if (focused.hasClass('prev-month')) {
          if (month === 0) {
            month = 11;
            year--;
          } else {
            month--;
          }
        } else if (focused.hasClass('next-month')) {
          if (month === 11) {
            month = 0;
            year++;
          } else {
            month++;
          }
        }
        this.currentDate = new Date(year, month, day);
      }

      // Arrow Down or Alt first opens the dialog
      if (key === 40 && !this.isOpen()) {
        handled = true;
        this.openCalendar();

        setTimeout(() => {
          this.setFocusAfterOpen();
        }, 200);
      }

      // 't' selects today
      if (key === 84) {
        handled = true;
        this.setToday();
      }

      if (handled) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      return true;
    });
  },

  /**
   * Focus the next prev focusable element on the popup
   * @private
   * @param {object} e event.
   * @returns {void}
   */
  containFocus(e) {
    const reverse = e.shiftKey;

    // Set focus on (opt: next|prev) focusable element
    const focusables = this.popup.find(':focusable');
    let index = focusables.index($(':focus'));

    if (!reverse) {
      index = ((index + 1) >= focusables.length ? 0 : (index + 1));
    } else {
      index = ((index - 1) < 0 ? focusables.length : (index - 1));
    }

    const elem = focusables.eq(index);
    elem.focus();

    if (elem.is('td')) {
      elem.addClass(`is-selected${(this.settings.range.useRange ? ' range' : '')}`);
      this.currentDate.setDate(elem.text());
      this.currentDate.setMonth(this.calendar.find('.month').attr('data-month'));
      this.insertDate(this.currentDate);
    }
  },

  /**
   * Parse the Date Format Options
   * @private
   * @returns {void}
   */
  setFormat() {
    const s = this.settings;
    let localeDateFormat = ((typeof Locale === 'object' && this.currentCalendar.dateFormat) ? this.currentCalendar.dateFormat : null);
    const localeTimeFormat = ((typeof Locale === 'object' && this.currentCalendar.timeFormat) ? this.currentCalendar.timeFormat : null);

    if (typeof localeDateFormat === 'object' && localeDateFormat.short !== undefined) {
      localeDateFormat = localeDateFormat.short;
    }

    if (s.dateFormat === 'locale') {
      this.pattern = localeDateFormat + (s.showTime ? ` ${(s.timeFormat || localeTimeFormat)}` : '');
    } else {
      this.pattern = s.dateFormat + (s.showTime && s.timeFormat ? ` ${s.timeFormat}` : '');
    }

    this.show24Hours = (this.pattern.match('H') || []).length > 0;
    this.isSeconds = (this.pattern.match('ss') || []).length > 0;
  },

  /**
   * Add masking with the mask function
   * @private
   * @returns {void}
   */
  mask() {
    this.setFormat();
    const s = this.settings;
    const maskOptions = {
      process: 'date',
      keepCharacterPositions: true,
      patternOptions: {
        format: this.pattern
      }
    };
    let validation = 'date availableDate';
    let events = { date: 'change blur enter', availableDate: 'change blur' };

    if (s.range.useRange) {
      maskOptions.process = 'rangeDate';
      maskOptions.patternOptions.delimeter = s.range.separator;
      validation = 'rangeDate';
      events = { rangeDate: 'change blur' };
    }

    maskOptions.processOnInitialize = false;

    if (this.isFullMonth) {
      this.pattern = this.settings.dateFormat;
    } else {
      this.element.mask(maskOptions);
    }

    if (!this.element[0].getAttribute('data-validate')) {
      this.element.attr({
        'data-validate': validation,
        'data-validation-events': JSON.stringify(events)
      }).validate();
    }

    this.setPlaceholder();
  },

  /**
   * Set placeholder
   * @private
   * @returns {void}
   */
  setPlaceholder() {
    const formatDate = d => Locale.formatDate(d, { pattern: this.pattern });
    const s = this.settings;
    let placeholder = this.pattern;

    if (s.placeholder && (!this.element.attr('placeholder') ||
      this.element.attr('placeholder') === 'M / D / YYYY')) {
      if (s.range.useRange) {
        placeholder = s.range.first && s.range.first.date ?
          formatDate(s.range.first.date) + s.range.separator + this.pattern :
          this.pattern + s.range.separator + this.pattern;
      }
      this.element[0].setAttribute('placeholder', placeholder);
    }
  },

  /**
   * Check if the calendar div is open or not
   * @private
   * @returns {boolean} whether or not the calendar div is open.
   */
  isOpen() {
    return (this.popup && this.popup.is(':visible') &&
      !this.popup.hasClass('is-hidden'));
  },

  /**
   * Open the Calendar Popup.
   * @private
   * @deprecated
   * @returns {void}
   */
  open() {
    this.openCalendar();
  },

  /**
   * Check if file type allowed
   * @private
   * @param {object} elem to set fouus
   * @param {boolean} isFocus true if need to set foucs
   * @returns {object} element passed in
   */
  activeTabindex(elem, isFocus) {
    $('td', this.calendarAPI).removeAttr('tabindex');
    elem.attr('tabindex', 0);

    if (isFocus) {
      elem.focus();
    }
    return elem;
  },

  /**
   * Open the calendar in a popup
   * @private
   * @returns {void}
   */
  openCalendar() {
    const self = this;
    const s = this.settings;
    const timeOptions = {};

    if ((this.element.is(':disabled') || this.element.attr('readonly')) && this.element.closest('.monthview').length === 0) {
      return;
    }

    $('#validation-tooltip').addClass('is-hidden');

    /**
    * Fires as the calendar popup is opened.
    * @event listopened
    * @memberof DatePicker
    * @property {object} event - The jquery event object
    */
    this.element.addClass('is-active is-open').trigger('listopened');
    this.timepickerContainer = $('<div class="datepicker-time-container"></div>');
    this.footer = $('' +
      `<div class="popup-footer">
        <button type="button" class="cancel btn-tertiary">
          ${Locale.translate('Clear')}
        </button>
        <button type="button" class="is-today btn-tertiary">
          ${Locale.translate('Today')}
        </button>
      </div>`);

    if (s.hideDays) {
      this.footer = $('' +
        `<div class="popup-footer">
          <button type="button" class="select-month btn-tertiary">
            ${Locale.translate('Select')}
          </button>
        </div>`);
    }

    if (s.hideButtons) {
      this.footer = $('');
    }

    // Timepicker options
    if (s.showTime) {
      if (s.timeFormat === undefined) {
        // Getting time-format from date-format (dateFormat: 'M/d/yyyy HH:mm:ss')
        timeOptions.timeFormat = this.pattern.slice(this.pattern.indexOf(' ')).trim();
      } else {
        timeOptions.timeFormat = s.timeFormat;
      }
      if (s.minuteInterval !== undefined) {
        timeOptions.minuteInterval = s.minuteInterval;
      }
      if (s.secondInterval !== undefined) {
        timeOptions.secondInterval = s.minuteInterval;
      }
      if (s.mode !== undefined) {
        timeOptions.mode = s.mode;
      }
      if (s.roundToInterval !== undefined) {
        timeOptions.roundToInterval = s.roundToInterval;
      }
    }

    this.calendarContainer = $('<div class="monthview-container"></div>');

    // Show Month
    this.setValueFromField();

    // Set timepicker
    if (this.settings.showTime) {
      // Set to 12:00
      if (this.element.val() === '' && this.currentDate && this.currentDate.getDate() && !this.settings.useCurrentTime) {
        this.currentDate.setHours(0);
        this.currentDate.setMinutes(0);
        this.currentDate.setSeconds(0);
      }

      timeOptions.parentElement = this.timepickerContainer;
      this.time = this.getTimeString(this.currentDate, this.show24Hours);
      this.timepicker = this.timepickerContainer.timepicker(timeOptions).data('timepicker');
      this.timepickerContainer.find('.dropdown').dropdown();

      this.timepickerContainer.on('change.datepicker', () => {
        this.currentDate = this.setTime(this.currentDate);
        this.setValue(this.currentDate, true, true);
      });

      // Wait for timepicker to initialize
      setTimeout(() => {
        this.timepicker.initValues = this.timepicker.getTimeFromField(this.time);
        this.timepicker.afterShow(this.timepickerContainer);
        return; // eslint-disable-line
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

    this.settings.month = this.currentMonth;
    this.settings.year = this.currentYear;
    this.settings.activeDate = this.currentDate;

    this.settings.activeDateIslamic = this.currentIslamicDate || this.todayDateIslamic;
    this.settings.isPopup = true;
    this.settings.headerStyle = 'simple';
    this.calendarAPI = new MonthView(this.calendarContainer, this.settings);
    this.calendar = this.calendarAPI.element;

    if (s.showTime) {
      this.calendar.addClass('is-timepicker');
    }
    if (s.hideDays) {
      this.calendar.addClass('is-monthyear');
    }
    this.calendar.append((s.showTime ? this.timepickerContainer : ''), this.footer);

    let placementParent = this.element;
    let placementParentXAlignment = (Locale.isRTL() ? 'right' : 'left');
    const parent = this.element.parent();

    if (parent.is('.datagrid-cell-wrapper')) {
      placementParentXAlignment = 'center';
      placementParent = this.element.next('.icon');
    }

    const popoverOpts = {
      content: this.calendar,
      placementOpts: {
        parent: placementParent,
        parentXAlignment: placementParentXAlignment,
        strategies: ['flip', 'nudge', 'shrink']
      },
      placement: 'bottom',
      popover: true,
      trigger: 'immediate',
      extraClass: 'monthview-popup',
      tooltipElement: '#monthview-popup',
      initializeContent: false
    };

    this.trigger.popover(popoverOpts)
      .off('show.datepicker')
      .on('show.datepicker', () => {
        if (env.os.name === 'ios') {
          $('head').triggerHandler('disable-zoom');
        }

        // Horizontal view on mobile
        if (window.innerHeight < 400 && this.popupClosestScrollable) {
          this.popup.find('.arrow').hide();
          this.popup.css('min-height', `${(this.popupClosestScrollable[0].scrollHeight + 2)}px`);
          this.popupClosestScrollable.css('min-height', '375px');
        }

        // Hide calendar until range to be pre selected
        if (s.range.useRange &&
            s.range.first && s.range.first.date &&
            s.range.second && s.range.second.date) {
          this.popup.addClass('is-hidden');
        }

        if (this.settings.hideButtons) {
          this.popup.addClass('hide-buttons');
        }
      })
      .off('hide.datepicker')
      .on('hide.datepicker', () => {
        if (env.os.name === 'ios') {
          this.trigger.one('hide', () => {
            $('head').triggerHandler('enable-zoom');
          });
        }

        this.popupClosestScrollable.add(this.popup).css('min-height', '');
        this.closeCalendar();
      });

    this.handleKeys($('#monthview-popup'));
    $('.monthview-footer a', this.calendar).button();

    this.popup = $('#monthview-popup');
    this.popupClosestScrollable = this.popup.closest('.scrollable');
    this.popup.attr('role', 'dialog');
    this.originalDate = this.element.val();

    // Calendar Day Events
    this.calendarAPI.days.off('click.datepicker').on('click.datepicker', 'td', function () {
      const td = $(this);
      if (td.hasClass('is-disabled')) {
        self.activeTabindex(td, true);
      } else {
        if (!(s.range.useRange && s.range.first)) {
          self.calendarAPI.days.find('.is-selected').removeClass('is-selected range').removeAttr('aria-selected');
        }

        const cell = $(this);
        cell.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true');

        const cellDate = self.calendarAPI.getCellDate(cell);
        const day = cellDate.day;
        const month = cellDate.month;
        const year = cellDate.year;

        self.currentDate = new Date(year, month, day);

        if (self.isIslamic) {
          self.currentDateIslamic[0] = year;
          self.currentDateIslamic[1] = month;
          self.currentDateIslamic[2] = day;
          self.currentYear = year;
          self.currentMonth = month;
          self.currentDay = day;
          self.currentDate = self.conversions.toGregorian(year, month, day);
        }

        self.insertDate(self.isIslamic ? self.currentDateIslamic : self.currentDate);

        if (s.range.useRange) {
          self.isFocusAfterClose = true;
        } else {
          self.closeCalendar();
          self.element.focus();
        }
      }
    });

    // Calendar Footer Events
    this.footer.off('click.datepicker').on('click.datepicker', 'button', function (e) {
      const btn = $(this);

      if (btn.hasClass('cancel')) {
        /**
        * Fires after the value in the input is changed by any means.
        *
        * @event change
        * @memberof DatePicker
        * @property {object} event - The jquery event object
        */
        self.element.val('').trigger('change').trigger('input');
        self.currentDate = null;
        self.closeCalendar();
      }

      if (btn.hasClass('select-month')) {
        const year = parseInt(self.calendarAPI.header.find('.year select').val(), 10);
        const month = parseInt(self.calendarAPI.header.find('.month select').val(), 10);

        self.currentDate = new Date(year, month, 1);

        if (self.isIslamic) {
          self.currentDateIslamic[0] = year;
          self.currentDateIslamic[1] = month;
          self.currentDateIslamic[2] = 1;
          self.currentYear = year;
          self.currentMonth = month;
          self.currentDay = 1;
          self.currentDate = self.conversions.toGregorian(year, month, 1);
        }

        self.insertDate(self.isIslamic ? self.currentDateIslamic : self.currentDate);
        if (s.range.useRange) {
          self.isFocusAfterClose = false;
        } else {
          self.closeCalendar();
        }
      }

      if (btn.hasClass('is-today')) {
        self.setToday();
        if (!s.range.useRange) {
          self.closeCalendar();
        }
      }
      self.element.focus();
      e.preventDefault();
    });

    setTimeout(() => {
      self.setFocusAfterOpen();
    }, 50);
  },

  /**
   * Close the calendar popup.
   * @private
   * @deprecated
   * @returns {void}
   */
  close() {
    this.closeCalendar();
  },

  /**
   * Close the calendar in a popup
   * @private
   * @returns {void}
   */
  closeCalendar() {
    // Remove range entries
    const cell = this.calendarAPI && this.calendarAPI.days.length ? this.calendarAPI.days.find('td.is-selected') : null;
    this.resetRange(cell);

    // Close timepicker
    if (this.settings.showTime && this.timepickerControl && this.timepickerControl.isOpen()) {
      this.timepickerControl.closeTimePopup();
    }

    if (this.popup && this.popup.length) {
      this.popup.hide().remove();
    }

    const popoverAPI = this.trigger.data('tooltip');
    if (popoverAPI) {
      popoverAPI.destroy();
    }

    if (this.element.hasClass('is-active')) {
      /**
      * Fires as the calendar popup is closed.
      *
      * @event listclosed
      * @memberof DatePicker
      * @property {object} event - The jquery event object
      */
      this.element.trigger('listclosed');
      this.element.removeClass('is-active is-open');
    }
  },

  /**
   * Set focus after opening the calendar
   * @private
   * @returns {void}
   */
  setFocusAfterOpen() {
    const s = this.settings;
    if (!this.calendar) {
      return;
    }

    if (s.hideDays) {
      this.calendar.find('div.dropdown:first').focus();
      return;
    }

    if (s.range.useRange) {
      if (s.range.first && s.range.first.label &&
        (!s.range.second || s.range.second && !s.range.second.date)) {
        this.setRangeFirstPart(s.range.first.date);
      }
      this.calendarAPI.setRangeSelected();
      if (s.range.second && s.range.first.date && s.range.second.date) {
        this.element.val(this.getRangeValue());
      }
      // Pre selection compleated now show the calendar
      this.popup.removeClass('is-hidden');
    }
    this.activeTabindex(this.calendar.find('.is-selected'), true);
  },

  /**
   * Set range first part
   * @private
   * @param {object} date .
   * @returns {void}
   */
  setRangeFirstPart(date) {
    const s = this.settings;
    const dateObj = d => new Date(d.year, d.month, d.day);
    const labelDate = d => Locale.formatDate(d, { date: 'full' });
    const minCell = this.calendarAPI.days.find('td:visible:first');
    const maxCell = this.calendarAPI.days.find('td:visible:last');
    const label = labelDate(date);
    const cell = this.calendarAPI.days.find(`[aria-label="${label}"]`);
    const row = cell.closest('tr');
    this.currentDate = date;

    s.range.first = { date, label, cell, row, rowIdx: row.index(), cellIdx: cell.index() };
    s.range.extra = {
      minCell,
      maxCell,
      min: dateObj(this.calendarAPI.getCellDate(minCell)),
      max: dateObj(this.calendarAPI.getCellDate(maxCell)),
      cellLength: row.children('td').length
    };
    this.calendarAPI.settings.range.first = s.range.first;
    this.calendarAPI.settings.range.extra = s.range.extra;
  },

  /**
   * Put the date in the field and select on the calendar
   * @private
   * @param {object} date .
   * @param {boolean} isReset .
   * @returns {void}
   */
  insertDate(date, isReset) {
    const s = this.settings;
    const month = (date instanceof Array ? date[1] : date.getMonth());
    const year = (date instanceof Array ? date[0] : date.getFullYear());
    const day = (date instanceof Array ? date[2] : date.getDate()).toString();

    // Make sure Calendar is showing that month
    if (this.calendarAPI.currentMonth !== month || this.calendarAPI.currentYear !== year) {
      this.calendarAPI.showMonth(month, year);
    }

    if (!this.isOpen()) {
      return;
    }

    // Show the Date in the UI
    const dateTd = this.calendarAPI.days.find('td:not(.alternate)').filter(function () {
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
        } else {
          date = this.setTime(date);
        }
      }

      this.setValue(date, true);
      if (s.range.useRange) {
        this.calendarAPI.days.find('.is-selected').removeAttr('aria-selected').removeAttr('tabindex');
      } else {
        this.calendarAPI.days.find('.is-selected').removeClass('is-selected range').removeAttr('aria-selected').removeAttr('tabindex');
      }
      dateTd.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr({ 'aria-selected': true });
      this.activeTabindex(dateTd, true);
    }
  },

  /**
   * Set the Formatted value in the input
   * @private
   * @param {object} date The date to set in date format.
   * @param {boolean} trigger If true will trigger the change event.
   * @param {boolean} isTime will pass to set range.
   * @returns {void}
   */
  setValue(date, trigger, isTime) {
    const s = this.settings;
    this.currentDate = date;

    if (date instanceof Array) {
      this.currentIslamicDate = date;
      this.currentDate = this.conversions.toGregorian(date[0], date[1], date[2]);
      date = new Date(date[0], date[1], date[2]);
    }

    if (s.range.useRange) {
      if (!isTime) {
        this.setRangeToElem(date, false);
      }
    } else {
      this.element.val(Locale.formatDate(date, { pattern: this.pattern }));
    }

    if (trigger) {
      if (s.range.useRange) {
        if (!isTime) {
          this.element
            .trigger('change', [s.range.data])
            .trigger('input', [s.range.data]);
        }
      } else {
        this.element.trigger('change').trigger('input');
      }
    }

    this.setSize();
  },

  /**
   * Set range value to element
   * @private
   * @param {object} date .
   * @param {boolean} isSingleDate .
   * @returns {void}
   */
  setRangeToElem(date, isSingleDate) {
    const s = this.settings;
    const formatDate = d => Locale.formatDate(d, { pattern: this.pattern });
    const labelDate = d => Locale.formatDate(d, { date: 'full' });
    let value = formatDate(date);
    let handled = false;

    // Closed calendar
    if (!this.isOpen() && !isSingleDate) {
      handled = true;
      const d = date || new Date();
      this.currentMonth = d.getMonth();
      this.currentYear = d.getFullYear();
      this.currentDay = d.getDate();
      this.currentDate = d;

      s.range.first = s.range.first || {};
      s.range.second = s.range.second || {};
      s.range.first.date = d;
      s.range.second.date = d;
      value = this.getRangeValue();
    } else {
      // Opened calendar
      const label = labelDate(date);
      let cell = this.calendarAPI.days.find(`[aria-label="${label}"]`);
      let row = cell.closest('tr');

      if (s.range.second) {
        this.resetRange(cell);
      }

      const time = {};
      if (s.range.first) {
        time.date = date.getTime();
        time.firstdate = s.range.first.date.getTime();
        time.min = this.calendarAPI.getDifferenceToDate(s.range.first.date, s.range.minDays);
        time.max = this.calendarAPI.getDifferenceToDate(s.range.first.date, s.range.maxDays);
      }

      if (!s.range.first || isSingleDate) {
        this.setRangeFirstPart(date);
        value = this.getRangeValue();
        this.setPlaceholder();
      } else if (!s.range.second &&
        (s.range.selectBackward && time.date > time.firstdate) ||
        (s.range.selectForward && time.date < time.firstdate) ||
        ((s.range.maxDays > 0) && (time.date > time.max.aftertime) ||
        (time.date < time.max.beforetime))) {
        this.resetRange(cell);
        this.setRangeFirstPart(date);
        value = this.getRangeValue();
        this.setPlaceholder();
      } else {
        // Set second part for range
        handled = true;
        this.currentDate = date;
        // minDays
        if (s.range.minDays > 0) {
          if (time.date > time.firstdate && time.date < time.min.aftertime) {
            date = time.min.after;
          } else if (time.date < time.firstdate && time.date > time.min.beforetime) {
            date = time.min.before;
          }
          cell = this.calendarAPI.days.find(`[aria-label="${label}"]`);
          row = cell.closest('tr');
        }
        if (time.date > time.firstdate) {
          s.range.second = { date, label, cell, row, rowIdx: row.index(), cellIdx: cell.index() };
        } else {
          s.range.second = s.range.first;
          s.range.first = { date, label, cell, row, rowIdx: row.index(), cellIdx: cell.index() };
        }
        value = this.getRangeValue();
      }
    }

    // Set range value(first only or both parts) on element
    this.element.val(value);

    // Set data to use in triggerHandler
    if (!handled) {
      s.range.data = {
        value,
        dates: [s.range.first.date],
        startDate: s.range.first.date,
        start: formatDate(s.range.first.date)
      };
    } else {
      s.range.data = {
        value,
        dates: this.calendarAPI.getDateRange(s.range.first.date, s.range.second.date),
        startDate: s.range.first.date,
        start: formatDate(s.range.first.date),
        endDate: s.range.second.date,
        end: formatDate(s.range.second.date)
      };

      this.closeCalendar();
      if (this.isFocusAfterClose) {
        delete this.isFocusAfterClose;
        this.element.focus();
      }
    }
  },

  /**
   * Reset range values
   * @private
   * @param {object} cell to keep selection.
   * @returns {void}
   */
  resetRange(cell) {
    if (this.settings.range.useRange) {
      delete this.settings.range.first;
      delete this.settings.range.second;
      delete this.settings.range.extra;
      if (this.calendarAPI) {
        delete this.calendarAPI.settings.range.first;
        delete this.calendarAPI.settings.range.second;
        delete this.calendarAPI.settings.range.extra;
      }
      if (this.calendarAPI && this.calendarAPI.days.length) {
        this.calendarAPI.days.find('td').removeClass('range range-next range-prev range-selection end-date is-selected');
      }
      if (cell) {
        cell.addClass('is-selected');
      }
    }
  },

  /**
   * Set the range value from the field
   * @private
   * @returns {void}
   */
  setRangeValueFromField() {
    const formatDate = d => Locale.formatDate(d, { pattern: this.pattern });
    const parseDate = d => Locale.parseDate(d, this.pattern, false);
    const getTime = d => ((d && typeof d.getTime === 'function') ? d.getTime() : (new Date()).getTime());
    const alignDates = (dates) => {
      let d1 = parseDate(dates[0]);
      let d2 = parseDate(dates[1]);
      if (d1 && d2) {
        d1 = getTime(d1);
        d2 = getTime(d2);
        return (d1 > d2) ? [dates[1], dates[0]] : [dates[0], dates[1]];
      }
      return dates;
    };
    const s = this.settings;
    const field = {};

    field.value = s.range.value || this.element.val().trim();
    field.isEmpty = field.value === '';

    // Field value dates
    if (!field.isEmpty && field.value.indexOf(s.range.separator) > -1) {
      field.dates = alignDates(field.value.split(s.range.separator));
    } else if (!field.isEmpty && field.value.indexOf(s.range.separator.slice(0, -1)) > -1) {
      field.dates = field.value.split(s.range.separator.slice(0, -1));
    }

    // Start/End dates
    if (!s.range.data && s.range.start && s.range.end && field.isEmpty) {
      let dates;
      if (typeof s.range.start === 'string' && typeof s.range.end === 'string') {
        dates = alignDates([s.range.start, s.range.end]);
      } else if (typeof s.range.start !== 'string' && typeof s.range.end === 'string') {
        dates = alignDates([formatDate(s.range.start), s.range.end]);
      } else if (typeof s.range.start === 'string' && typeof s.range.end !== 'string') {
        dates = alignDates([s.range.start, formatDate(s.range.end)]);
      } else {
        dates = alignDates([formatDate(s.range.start), formatDate(s.range.end)]);
      }
      s.range.start = formatDate(dates[0]);
      s.range.end = formatDate(dates[1]);
    }

    s.range.first = s.range.first || {};
    s.range.second = s.range.second || {};

    // Start date
    if (s.range.data && s.range.data.startDate) {
      s.range.first.date = s.range.data.startDate;
    } else if (s.range.start && typeof s.range.start === 'string') {
      s.range.first.date = parseDate(s.range.start);
    } else if (field.dates) {
      s.range.first.date = parseDate(field.dates[0]);
    }

    // End date
    if (s.range.data && s.range.data.endDate) {
      s.range.second.date = s.range.data.endDate;
    } else if (s.range.end && typeof s.range.end === 'string') {
      s.range.second.date = parseDate(s.range.end);
    } else if (field.dates) {
      s.range.second.date = parseDate(field.dates[1]);
    }

    if (this.calendarAPI) {
      this.calendarAPI.setRangeSelected();
    }

    if (field.isEmpty || (!field.isEmpty && !s.range.data)) {
      const value = formatDate(s.range.first.date);
      if (value) {
        this.element.val(value);
      }
    } else {
      return false;
    }
    return true;
  },

  /**
   * Get the value from the field and set the internal variables or use current date
   * @private
   * @returns {void}
   */
  setValueFromField() {
    const s = this.settings;
    this.setCurrentCalendar();

    if (s.range.useRange && ((this.element.val().trim() !== '') ||
      (s.range.start && s.range.end) ||
      (s.range.data && s.range.data.startDate && s.range.data.endDate))) {
      if (!this.setRangeValueFromField()) {
        return;
      }
    }

    const self = this;
    const fieldValue = this.element.val();
    let gregorianValue = fieldValue;

    if (this.isIslamic && fieldValue) {
      const islamicValue = Locale.parseDate(this.element.val(), this.pattern);
      gregorianValue = this.conversions.toGregorian(
        islamicValue.getFullYear(),
        islamicValue.getMonth(),
        islamicValue.getDate()
      );
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

    // Check and fix two digit year for main input element
    const dateFormat = self.pattern;
    const isStrict = !(dateFormat === 'MMMM d' || dateFormat === 'yyyy');
    const parsedDate = Locale.parseDate(self.element.val().trim(), dateFormat, isStrict);

    if (parsedDate !== undefined && self.element.val().trim() !== '' && !s.range.useRange) {
      self.setValue(Locale.parseDate(self.element.val().trim(), self.pattern, false));
    }

    if (s.range.useRange && s.range.first && s.range.first.date
      && s.range.second && !s.range.second.date) {
      this.setRangeToElem(this.currentDate, true);
    }
  },

  /**
   * Set input to enabled.
   * @returns {void}
   */
  enable() {
    this.element.removeAttr('disabled readonly').closest('.field').removeClass('is-disabled');
  },

  /**
   * Set input to disabled.
   * @returns {void}
   */
  disable() {
    this.enable();
    this.element.attr('disabled', 'disabled').closest('.field').addClass('is-disabled');
  },

  /**
   * Detects whether or not the component is disabled
   * @returns {boolean} whether or not the component is disabled
   */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
   * Set input to readonly.
   * @returns {void}
   */
  readonly() {
    this.enable();
    this.element.attr('readonly', 'readonly');
  },

  /**
   * Set to todays date in current format.
   * @private
   * @returns {void}
   */
  setToday() {
    const s = this.settings;
    this.currentDate = new Date();

    if (!this.settings.useCurrentTime) {
      this.currentDate.setHours(0, 0, 0, 0);
    }

    if (this.element.val() !== '') {
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
      const islamicDateParts = this.conversions.fromGregorian(this.currentDate);
      this.currentDateIslamic = new Date(
        islamicDateParts[0],
        islamicDateParts[1],
        islamicDateParts[2],
        this.currentDate.getHours(),
        this.currentDate.getMinutes(),
        this.currentDate.getSeconds(),
      );
    }

    if (this.isOpen()) {
      this.insertDate(this.isIslamic ? this.currentDateIslamic : this.currentDate, true);
    } else {
      if (s.range.useRange) {
        this.setRangeToElem(this.currentDate);
      } else {
        const options = { pattern: this.pattern };
        const islamicDateText =
          Locale.formatDate(this.isIslamic ? this.currentDateIslamic : this.currentDate, options);
        this.element.val(islamicDateText);
      }
      /**
      * Fires after the value in the input is changed by user interaction.
      *
      * @event input
      * @memberof DatePicker
      * @property {object} event - The jquery event object
      */
      if (s.range.useRange) {
        this.element
          .trigger('change', [s.range.data])
          .trigger('input', [s.range.data]);
      } else {
        this.element.trigger('change').trigger('input');
      }
    }
  },

  /**
   * Set time
   * @private
   * @param {object} date .
   * @returns {void}
   */
  setTime(date) {
    let hours = this.popup.find('.dropdown.hours').val();
    const minutes = this.popup.find('.dropdown.minutes').val();
    const seconds = this.isSeconds ? this.popup.find('.dropdown.seconds').val() : 0;
    const period = this.popup.find('.dropdown.period');

    hours = (period.length && period.val() === 'PM' && hours < 12) ? (parseInt(hours, 10) + 12) : hours;
    hours = (period.length && period.val() === 'AM' && parseInt(hours, 10) === 12) ? 0 : hours;

    date = new Date(date);
    date.setHours(hours, minutes, seconds);
    return date;
  },

  /**
   * Get Time String
   * @private
   * @param {object} date .
   * @param {boolean} isHours24 .
   * @returns {string} time
   */
  getTimeString(date, isHours24) {
    const twodigit = function (number) {
      return (number < 10 ? '0' : '') + number;
    };
    const d = (date || new Date());
    const h = d.getHours();
    const m = twodigit(d.getMinutes());
    const s = twodigit(d.getSeconds());
    const h12 = `${(h % 12 || 12)}:${m}${(this.isSeconds ? `:${s}` : '')} ${(h < 12 ? 'AM' : 'PM')}`;
    const h24 = `${h}:${m} + ${(this.isSeconds ? `:${s}` : '')}`;

    return isHours24 ? h24 : h12;
  },

  /**
   * Get the current date from the field. In date format
   * @returns {Date} the set date object
   */
  getCurrentDate() {
    return this.currentDate;
  },

  /**
   * Updates the component instance. Can be used after being passed new settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, DATEPICKER_DEFAULTS);
    }
    return this
      .teardown()
      .init();
  },

  /**
   * Get range value to insert in element
   * @private
   * @returns {string} range dates to display in element
   */
  getRangeValue() {
    const s = this.settings;
    const formatDate = d => Locale.formatDate(d, { pattern: this.pattern });

    if (s.range.useRange &&
      s.range.first && s.range.first.date &&
      s.range.second && s.range.second.date) {
      return `${formatDate(s.range.first.date) + s.range.separator + formatDate(s.range.second.date)}`;
    } else if (s.range.useRange &&
      s.range.first && s.range.first.date) {
      return s.placeholder ?
        `${formatDate(s.range.first.date) + s.range.separator + this.pattern}` :
        formatDate(s.range.first.date);
    }
    return '';
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {void}
   */
  teardown() {
    if (this.isOpen()) {
      this.closeCalendar();
    }

    this.element.off('blur.datepicker');
    this.trigger.remove();
    this.element.attr('data-mask', '');
    this.element.removeAttr('placeholder');
    if (this.calendarAPI) {
      this.calendarAPI.destroy();
    }
    if (this.calendar && this.calendar.length) {
      this.calendar.remove();
    }

    if (this.popup && this.popup.length) {
      this.popup.remove();
    }

    const maskApi = this.element.data('mask');
    if (maskApi) {
      maskApi.destroy();
    }

    this.element.off('keydown.datepicker blur.validate change.validate keyup.validate focus.validate');

    this.element.removeAttr('data-validate').removeData('validate validationEvents');

    return this;
  },

  /**
   * Destroy and remove added markup, reset back to default
   * @returns {void}
   */
  destroy() {
    this.closeCalendar();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const s = this.settings;

    this.trigger.on('click.datepicker', () => {
      if (self.isOpen()) {
        self.closeCalendar();
      } else {
        self.openCalendar();
      }
    });

    self.mask();
    this.handleKeys(this.element);

    // Fix two digit year for main input element
    self.element.on('blur.datepicker', () => {
      if (self.element.val().trim() !== '') {
        self.setValueFromField();
      }
    });

    // Set initialize value
    if (!this.isOpen() && s.range.useRange && !s.range.first) {
      this.setRangeValueFromField();
      const value = this.getRangeValue();
      if (value) {
        this.element.val(value);
      }
    }
  }

};

export { DatePicker, COMPONENT_NAME };
