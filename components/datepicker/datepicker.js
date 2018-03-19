import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';
import { Environment as env } from '../utils/environment';

// jQuery Components
import '../mask/masked-input.jquery';
import '../popover/popover.jquery';
import '../validation/validation.jquery';

// Component Name
const COMPONENT_NAME = 'datepicker';

/**
 * A component to support date entry.
 * @class DatePicker
 * @constructor
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {boolean} [settings.showTime=false] If true the time selector will be shown.
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
 * For example if you have more non specific dates to disable then enable ect.
 * @param {boolean} [settings.showLegend=false] If true a legend is show to associate dates.
 * @param {boolean} [settings.customValidation=false] If true the internal validation is disabled.
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
 */
const DATEPICKER_DEFAULTS = {
  showTime: false,
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
    isEnable: false
  },
  showLegend: false,
  customValidation: false,
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
  useUTC: false
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
    // Handle Keys while popup is open
    if (elem.is('#calendar-popup')) {
      elem.off('keydown.datepicker').on('keydown.datepicker', '.calendar-table', (e) => {
        const key = e.keyCode || e.charCode || 0;
        const cell = $(e.target);
        const allCell = this.days.find('td:visible');
        const allCellLength = allCell.length;
        let idx = null;
        let selector = null;
        let handled = false;

        // Arrow Down: select same day of the week in the next week
        if (key === 40) {
          handled = true;
          if (s.range.useRange) {
            idx = allCell.index(e.target) + 7;
            selector = allCell.eq(idx);
            if (idx < allCellLength) {
              this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
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
              this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
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
              this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
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
              this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
              this.activeTabindex(selector, true);
            }
          } else {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.insertDate(this.currentDate);
          }
        }

        // Page Up Selects Same Day Prev Month
        if (key === 33 && !e.altKey) {
          handled = true;
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          this.insertDate(this.currentDate);
        }

        // Page Down Selects Same Day Next Month
        if (key === 34 && !e.altKey) {
          handled = true;
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          this.insertDate(this.currentDate);
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

        // Home Moves to End of the month
        if (key === 35) {
          handled = true;
          const d = this.currentDate;
          const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          this.currentDate = lastDay;
          this.insertDate(this.currentDate);
        }

        // End Moves to Start of the month
        if (key === 36) {
          const d = this.currentDate;
          const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
          this.currentDate = firstDay;
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
            const d = this.getCellDate(cell);
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
            this.days.find('td:visible:last').attr('tabindex', 0).focus();
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
        let year = parseInt(this.header.find('.year').text(), 10);
        let month = parseInt(this.header.find('.month').attr('data-month'), 10);
        const day = parseInt(focused.text(), 10);

        if (this.settings.showMonthYearPicker) {
          month = parseInt(this.header.find('.month select').val(), 10);
          year = parseInt(this.header.find('.year select').val(), 10);
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

    this.show24Hours = (this.pattern.match('HH') || []).length > 0;
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
    const customValidation = this.element.attr('data-validate');
    const customEvents = this.element.attr('data-validation-events');
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

    if (customValidation === 'required' && !customEvents) {
      validation = `${customValidation} ${validation}`;
      $.extend(events, { required: 'change blur' });
    } else if (!!customValidation && !!customEvents) {
      // Remove default validation, if found "no-default-validation" string in "data-validate" attr
      if (customValidation.indexOf('no-default-validation') > -1) {
        validation = customValidation.replace(/no-default-validation/g, '');
        events = $.fn.parseOptions(this.element, 'data-validation-events');
      } else {
        // Keep default validation along custom validation
        validation = `${customValidation} ${validation}`;
        $.extend(events, $.fn.parseOptions(this.element, 'data-validation-events'));
      }
    }

    if (this.isFullMonth) {
      this.pattern = this.settings.dateFormat;
    } else {
      this.element.mask(maskOptions);
    }

    if (!s.customValidation) {
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
      this.element.attr('placeholder', placeholder);
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
    $('td', this.days).removeAttr('tabindex');
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

    if (this.element.is(':disabled') || this.element.attr('readonly')) {
      return;
    }

    $('#validation-tooltip').addClass('is-hidden');

    /**
    * Fires as the calendar popup is opened.
    *
    * @event listopened
    * @memberof DatePicker
    * @property {object} event - The jquery event object
    */
    this.element.addClass('is-active is-open').trigger('listopened');

    // Calendar Html in Popups
    const prevButton = '' +
      `<button type="button" class="btn-icon prev">
        ${$.createIcon('caret-left')}
        <span>${Locale.translate('PreviousMonth')}</span>
      </button>`;

    const nextButton = '' +
      `<button type="button" class="btn-icon next">
        ${$.createIcon('caret-right')}
        <span>${Locale.translate('NextMonth')}</span>
      </button>`;

    this.table = $(`<table class="calendar-table" aria-label="${Locale.translate('Calendar')}" role="application"></table>`);

    this.header = $('' +
      `<div class="calendar-header">
        <span class="month">november</span>
        <span class="year">2015</span>
        ${(Locale.isRTL() ? nextButton + prevButton : prevButton + nextButton)}
      </div>`);

    this.dayNames = $('' +
      `<thead>
        <tr>
          <th>SU</th>
          <th>MO</th>
          <th>TU</th>
          <th>WE</th>
          <th>TH</th>
          <th>FR</th>
          <th>SA</th>
        </tr>
      </thead>`).appendTo(this.table);

    this.days = $('' +
      `<tbody>
        <tr>
          <td class="alternate">26</td>
          <td class="alternate">27</td>
          <td class="alternate">28</td>
          <td class="alternate">29</td>
          <td class="alternate" >30</td>
          <td class="alternate">31</td>
          <td>1</td>
        </tr><tr>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td>7</td>
          <td>8</td>
        </tr><tr>
          <td>9</td>
          <td>10</td>
          <td>11</td>
          <td>12</td>
          <td>13</td>
          <td>14</td>
          <td>15</td>
        </tr><tr>
          <td>16</td>
          <td>17</td>
          <td>18</td>
          <td>19</td>
          <td class="is-today">20</td>
          <td>21</td>
          <td>22</td>
        </tr><tr>
          <td>23</td>
          <td>24</td>
          <td>25</td>
          <td>26</td>
          <td>27</td>
          <td>28</td>
          <td class="alternate">1</td>
        </tr><tr>
          <td class="alternate">2</td>
          <td class="alternate">3</td>
          <td class="alternate">4</td>
          <td class="alternate">5</td>
          <td class="alternate">6</td>
          <td class="alternate">7</td>
          <td class="alternate">8</td>
        </tr>
      </tbody>`).appendTo(this.table);

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
      this.table = '';
      this.footer = $('' +
        `<div class="popup-footer">
          <button type="button" class="select-month btn-tertiary">
            ${Locale.translate('Select')}
          </button>
        </div>`);
    }

    // Timepicker options
    if (s.showTime) {
      if (s.timeFormat === undefined) {
        // Getting time-format from date-format (dateFormat: 'M/d/yyyy HH:mm:ss')
        timeOptions.timeFormat = this.pattern.slice(this.pattern.indexOf(' '));
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

    this.calendar = $(`<div class="calendar${(s.showTime ? ' is-timepicker' : '')}${(s.hideDays ? ' is-monthyear' : '')}"></div>`)
      .append(
        this.header,
        this.table,
        (s.showTime ? this.timepickerContainer : ''),
        this.footer
      );

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
      tooltipElement: '#calendar-popup'
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

    this.handleKeys($('#calendar-popup'));
    $('.calendar-footer a', this.calendar).button();

    // Show Month
    this.setValueFromField();

    // Set timepicker
    if (this.settings.showTime) {
      // Set to 12:00
      if (this.element.val() === '' && this.currentDate && this.currentDate.getDate()) {
        this.currentDate.setHours(0);
        this.currentDate.setMinutes(0);
        this.currentDate.setSeconds(0);
      }

      timeOptions.parentElement = this.timepickerContainer;
      this.time = this.getTimeString(this.currentDate, this.show24Hours);
      this.timepicker = this.timepickerContainer.timepicker(timeOptions).data('timepicker');
      this.timepickerContainer.find('dropdown').dropdown();

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

    this.showMonth(this.currentMonth, this.currentYear);
    this.popup = $('#calendar-popup');
    this.popupClosestScrollable = this.popup.closest('.scrollable');
    this.popup.attr('role', 'dialog');
    this.originalDate = this.element.val();

    // Calendar Day Events
    this.days.off('click.datepicker').on('click.datepicker', 'td', function () {
      const td = $(this);
      if (td.hasClass('is-disabled')) {
        self.activeTabindex(td, true);
      } else {
        if (!(s.range.useRange && s.range.first)) {
          self.days.find('.is-selected').removeClass('is-selected range').removeAttr('aria-selected');
        }

        const cell = $(this);
        cell.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true');

        const cellDate = self.getCellDate(cell);
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

    if (s.range.useRange) {
      this.days
        .off('mouseover.datepicker')
        .on('mouseover.datepicker', 'td', function () {
          self.setRangeOnCell(this);
        });
    }

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
        const year = parseInt(self.header.find('.year select').val(), 10);
        const month = parseInt(self.header.find('.month select').val(), 10);

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

    // Change Month Events
    this.header.off('click.datepicker').on('click.datepicker', 'button', function () {
      const isNext = $(this).is('.next');
      const range = {};

      if (s.range.useRange) {
        if (isNext) {
          range.date = new Date(self.currentYear, (self.currentMonth + 1), (self.days.find('.next-month:visible').length + 1));
        } else {
          range.date = new Date(self.currentYear, self.currentMonth, 1);
          range.date.setDate(range.date.getDate() - (self.days.find('.prev-month:visible').length + 1));
        }
      }

      self.showMonth(self.currentMonth + (isNext ? 1 : -1), self.currentYear);

      if (s.range.useRange) {
        range.formatedDate = Locale.formatDate(range.date, { date: 'full' });
        range.cell = self.days.find(`[aria-label="${range.formatedDate}"]`);
        self.setRangeOnCell(s.range.second ? false : range.cell);
      }
    });

    if (s.range.useRange) {
      this.header
        .off('mouseover.datepicker')
        .on('mouseover.datepicker', 'button', function () {
          if (s.range.extra) {
            self.setRangeOnCell($(this).is('.next') ? s.range.extra.maxCell : s.range.extra.minCell);
          }
        })
        .off('focus.datepicker')
        .on('focus.datepicker', 'button:not(.hide-focus)', function () {
          if (s.range.extra) {
            self.setRangeOnCell($(this).is('.next') ? s.range.extra.maxCell : s.range.extra.minCell);
          }
        });
    }

    setTimeout(() => {
      self.setFocusAfterOpen();
    }, 200);
  },

  /**
   * Set range on given cell -or- current month/year.
   * @private
   * @param {object} cell to set range.
   * @returns {void}
   */
  setRangeOnCell(cell) {
    const self = this;
    const s = this.settings;

    if (s.range.useRange && s.range.first && !s.range.second) {
      const first = s.range.first;
      const extra = s.range.extra;
      const len = extra.cellLength - 1;
      const firstCell = first.rowIdx + first.cellIdx + (len * first.rowIdx);
      cell = $(cell);// First date selected cell element

      if (cell.length && !cell.is('.is-disabled, .is-selected')) {
        const row = cell.closest('tr');
        const cellIdx = cell.index();
        const rowIdx = row.index();
        const thisCell = rowIdx + cellIdx + (len * rowIdx);
        const d = self.getCellDate(cell);
        const cellDate = new Date(d.year, d.month, d.day);
        const max = this.getDifferenceToDate(s.range.first.date, s.range.maxDays);

        self.days.find('td:visible').each(function (i) {
          const thisTd = $(this);
          if (cellDate > s.range.first.date && !s.range.selectBackward &&
            (!s.range.maxDays || (s.range.maxDays > 0 && cellDate.getTime() <= max.aftertime)) &&
            ((i > firstCell && i <= thisCell) || (cellDate > extra.max && i <= thisCell))) {
            thisTd.addClass('range-next');
          } else if (cellDate < s.range.first.date && !s.range.selectForward &&
            (!s.range.maxDays || (s.range.maxDays > 0 && cellDate.getTime() >= max.beforetime)) &&
            ((i < firstCell && i >= thisCell) || (cellDate < extra.min && i >= thisCell))) {
            thisTd.addClass('range-prev');
          } else {
            thisTd.removeClass('range-next range-prev');
          }
        });
      } else if (!cell.length) {
        self.days.find('td').removeClass('range-next range-prev');
      }
    }
    if (!cell && s.range.second) {
      self.setRangeSelected();
    }
  },

  /**
   * Get date from given cell.
   * @private
   * @param {object} cell to get date.
   * @returns {object} as: year, month, day
   */
  getCellDate(cell) {
    const s = this.settings;
    const day = parseInt(cell.text(), 10);
    let month = parseInt(this.header.find('.month').attr('data-month'), 10);
    let year = parseInt(this.header.find('.year').text(), 10);

    if (s.showMonthYearPicker) {
      year = parseInt(this.header.find('.year select').val(), 10);
      month = parseInt(this.header.find('.month select').val(), 10);
    }

    if (cell.hasClass('prev-month')) {
      if (month === 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
    } else if (cell.hasClass('next-month')) {
      if (month === 11) {
        month = 0;
        year++;
      } else {
        month++;
      }
    }

    return { year, month, day };
  },

  /**
   * Close the calendar popup.
   * @private
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
    const cell = this.days && this.days.length ? this.days.find('td.is-selected') : null;
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
   * Check through the options to see if the date is disabled
   * @private
   * @param {string} year to check.
   * @param {string} month to check.
   * @param {string} date to check.
   * @returns {boolean} true if the date is disabled
   */
  isDateDisabled(year, month, date) {
    const s = this.settings;
    const min = (new Date(s.disable.minDate)).setHours(0, 0, 0, 0);
    const max = (new Date(s.disable.maxDate)).setHours(0, 0, 0, 0);
    let d2 = new Date(year, month, date);

    // dayOfWeek
    if (s.disable.dayOfWeek.indexOf(d2.getDay()) !== -1) {
      return true;
    }

    d2 = d2.setHours(0, 0, 0, 0);

    // min and max
    if ((d2 <= min) || (d2 >= max)) {
      return true;
    }

    // dates
    if (s.disable.dates.length && typeof s.disable.dates === 'string') {
      s.disable.dates = [s.disable.dates];
    }

    for (let i = 0, l = s.disable.dates.length; i < l; i++) {
      const d = new Date(s.disable.dates[i]);
      if (d2 === d.setHours(0, 0, 0, 0)) {
        return true;
      }
    }

    return false;
  },

  /**
   * Set disable Date
   * @private
   * @param {object} elem to set.
   * @param {string} year to check.
   * @param {string} month to check.
   * @param {string} date to check.
   * @returns {void}
   */
  setDisabled(elem, year, month, date) {
    const s = this.settings;
    const dateIsDisabled = this.isDateDisabled(year, month, date);
    elem.removeClass('is-disabled').removeAttr('aria-disabled');

    if ((dateIsDisabled && !s.disable.isEnable) || (!dateIsDisabled && s.disable.isEnable)) {
      elem
        .addClass('is-disabled').attr('aria-disabled', 'true')
        .removeClass('is-selected range').removeAttr('aria-selected');
    }
  },

  /**
   * Add a Legend below the table
   * @private
   * @returns {void}
   */
  addLegend() {
    const s = this.settings;
    if (!s.showLegend) {
      return;
    }

    // Remove Legend
    if (this.legend && this.legend.length) {
      this.legend.remove();
    }

    this.legend = $('<div class="calendar-legend"></div>');

    for (let i = 0; i < s.legend.length; i++) {
      const series = s.legend[i];
      const item = '' +
        `<div class="calendar-legend-item">
          <span class="calendar-legend-swatch" style="background-color: ${this.hexToRgba(series.color, 0.3)}"></span>
          <span class="calendar-legend-text">${series.name}</span>
        </div>`;

      this.legend.append(item);
    }
    this.table.after(this.legend);
  },

  /**
   * Set Color for the Legend settings
   * @private
   * @param {object} elem to set.
   * @param {string} year to check.
   * @param {string} month to check.
   * @param {string} date to check.
   * @returns {void}
   */
  setLegendColor(elem, year, month, date) {
    if (!this.settings.showLegend || !elem[0]) {
      return;
    }

    const hex = this.getLegendColor(year, month, date);
    const self = this;

    elem[0].style.backgroundColor = '';

    if (hex) {
      // set color on elem at .3 of provided color as per design
      elem.addClass('is-colored');
      elem[0].style.backgroundColor = this.hexToRgba(hex, 0.3);

      const normalColor = self.hexToRgba(hex, 0.3);
      const hoverColor = self.hexToRgba(hex, 0.7);

      // handle hover states
      elem.on('mouseenter', function () {
        const thisElem = $(this);
        thisElem[0].style.backgroundColor = hoverColor;
        thisElem.find('span')[0].style.backgroundColor = 'transparent';
      }).on('mouseleave', function () {
        const thisElem = $(this);
        thisElem[0].style.backgroundColor = normalColor;
        thisElem.find('span')[0].style.backgroundColor = '';
      });
    }
  },

  /**
   * Convert the provided hex to an RGBA for states
   * This may be later moved into a colors file along with getLuminousColorShade
   * @private
   * @param {string} hex to set.
   * @param {string} opacity to check.
   * @returns {string} converted rgba
   */
  hexToRgba(hex, opacity) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');

      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }

      c = `0x${c.join('')}`;
      // eslint-disable-next-line
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${opacity.toString()})`;
    }
    return '';
  },

  /**
   * Process Color Options to get the date color
   * @private
   * @param {string} year .
   * @param {string} month .
   * @param {string} date .
   * @returns {string} date color
   */
  /* eslint-disable consistent-return */
  getLegendColor(year, month, date) {
    const s = this.settings;
    if (!s.showLegend) {
      return;
    }

    const checkDate = new Date(year, month, date);
    const checkHours = checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < s.legend.length; i++) {
      const series = s.legend[i];

      // Check Day of week
      if (series.dayOfWeek && series.dayOfWeek.indexOf(checkDate.getDay()) !== -1) {
        return series.color;
      }

      // Check for dates that match
      if (series.dates) {
        for (let j = 0; j < series.dates.length; j++) {
          const d = new Date(series.dates[j]);
          if (checkHours === d.setHours(0, 0, 0, 0)) {
            return series.color;
          }
        }
      }
    }

    return '';
  },
  /* eslint-enable consistent-return */

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
      this.setRangeSelected();
      if (s.range.second && s.range.first.date && s.range.second.date) {
        this.element.val(this.getRangeValue());
      }
    }
    this.activeTabindex(this.calendar.find('.is-selected'), true);
  },

  /**
   * Update the calendar to show the month
   * @private
   * @param {number} month zero based.
   * @param {number} year .
   * @param {number} skipYear .
   * @returns {void}
   */
  showMonth(month, year, skipYear) {
    const self = this;
    const now = new Date();

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    let elementDate = (this.currentDate && this.currentDate.getDate()) ?
      this.currentDate : now;

    this.setCurrentCalendar();

    if (this.isIslamic) {
      elementDate = this.currentDateIslamic;
    }

    if (year.toString().length < 4) {
      year = new Date().getFullYear();
    }

    if (month === 12) {
      year++;
      month = 0;
      this.currentMonth = month;
      this.currentYear = year;
      this.header.find('.year').text(` ${year}`);
    }

    if (month < 0) {
      year--;
      month = 11;
      this.currentMonth = month;
      this.currentYear = year;
      this.header.find('.year').text(` ${year}`);
    }

    if (!skipYear) {
      let days = this.currentCalendar.days.narrow || this.currentCalendar.days.narrow;
      days = days || this.currentCalendar.days.abbreviated;

      const monthName = this.currentCalendar.months.wide[month];

      this.currentMonth = month;
      this.currentYear = year;

      // Set the Days of the week
      const firstDayofWeek = (this.currentCalendar.firstDayofWeek || 0);
      this.dayNames.find('th').each(function (i) {
        $(this).text(days[(i + firstDayofWeek) % 7]);
      });

      // Localize Month Name
      this.yearFirst = this.currentCalendar.dateFormat.year && this.currentCalendar.dateFormat.year.substr(1, 1) === 'y';
      this.header.find('.month').attr('data-month', month).text(`${monthName} `);
      this.header.find('.year').text(` ${year}`);

      if (this.yearFirst && !this.isIslamic && !Locale.isRTL()) {
        elementDate.setFullYear(year);
        const translation = Locale.formatDate(elementDate, { date: 'year' });
        const justYear = translation.split(' ')[0];

        this.header.find('.year').text(`${justYear} `);
        this.header.find('.year').insertBefore(this.header.find('.month'));
      }

      this.appendMonthYearPicker(month, year);
    }

    // Adjust days of the week
    // lead days
    const firstDayOfMonth = this.firstDayOfMonth(year, month);
    const leadDays = ((firstDayOfMonth - (this.currentCalendar.firstDayofWeek || 0)) + 7) % 7;
    const lastMonthDays = this.daysInMonth(year, month + (this.isIslamic ? 1 : 0));
    const thisMonthDays = this.daysInMonth(year, month + (this.isIslamic ? 0 : 1));
    let nextMonthDayCnt = 1;
    let dayCnt = 1;
    let exYear;
    let exMonth;
    let exDay;

    const s = this.settings;
    this.days.find('td').each(function (i) {
      const th = $(this).removeClass('alternate prev-month next-month is-selected range is-today');
      th.removeAttr('aria-selected');

      if (i < leadDays) {
        exDay = (lastMonthDays - leadDays) + 1 + i;
        exMonth = (month === 0) ? 11 : month - 1;
        exYear = (month === 0) ? year - 1 : year;

        self.setDisabled(th, exYear, exMonth, exDay);
        self.setLegendColor(th, exYear, exMonth, exDay);
        th.addClass('alternate prev-month').html(`<span aria-hidden="true">${exDay}</span>`);
      }

      if (i >= leadDays && dayCnt <= thisMonthDays) {
        th.html(`<span aria-hidden="true">${dayCnt}</span>`);

        // Add Selected Class to Selected Date
        if (self.isIslamic) {
          if (year === elementDate[0] && month === elementDate[1] && dayCnt === elementDate[2]) {
            th.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true');
          }
        } else {
          const tHours = elementDate.getHours();
          const tMinutes = elementDate.getMinutes();
          const tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;

          if ((new Date(year, month, dayCnt))
            .setHours(tHours, tMinutes, tSeconds, 0) === elementDate
              .setHours(tHours, tMinutes, tSeconds, 0)) {
            th.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true');
          }
        }

        if (dayCnt === self.todayDay && self.currentMonth === self.todayMonth &&
          self.currentYear === self.todayYear) {
          th.addClass('is-today');
        }

        th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), { date: 'full' }));

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

        th.addClass('alternate next-month').html(`<span aria-hidden="true">${nextMonthDayCnt}</span>`);
        nextMonthDayCnt++;
      }
    });

    // Hide 6th Row if all disabled
    const row = this.days.find('tr').eq(5);
    if (row.find('td.alternate').length === 7) {
      row.hide();
    } else {
      row.show();
    }

    // Add Legend
    self.addLegend();
  },

  /**
   * Append month year picker
   * @private
   * @param {number} month .
   * @param {number} year .
   * @returns {void}
   */
  appendMonthYearPicker(month, year) {
    const self = this;

    if (!this.settings.showMonthYearPicker) {
      return;
    }

    this.header.addClass('is-monthyear');

    let monthDropdown = '' +
      `<label for="month-dropdown" class="audible">
        ${Locale.translate('Month')}
      </label>
      <select id="month-dropdown" class="dropdown">`;

    const wideMonths = this.currentCalendar.months.wide;
    // eslint-disable-next-line
    wideMonths.map(function (monthMap, i) {
      monthDropdown += `<option ${(i === month ? ' selected ' : '')} value="${i}">${monthMap}</option>`;
    });
    monthDropdown += '</select>';

    const monthSpan = this.header.find('.month').empty().append(monthDropdown);
    monthSpan.find('select.dropdown').dropdown().off('change.datepicker')
      .on('change.datepicker', function () {
        const elem = $(this);
        self.currentMonth = parseInt(elem.val(), 10);
        self.showMonth(self.currentMonth, self.currentYear, true);
      });

    let yearDropdown = '' +
      `<label for="year-dropdown" class="audible">
        ${Locale.translate('Year')}
      </label>
      <select id="year-dropdown" class="dropdown year">`;

    const years = [];

    for (let i = this.settings.advanceMonths; i >= 1; i--) {
      years.push(parseInt(year, 10) - i);
    }
    years.push(year);
    for (let j = 1; j <= this.settings.advanceMonths; j++) {
      years.push(parseInt(year, 10) + j);
    }

    // eslint-disable-next-line
    years.map(function (yearMap) {
      yearDropdown += `<option ${(year === yearMap ? ' selected ' : '')} value="${yearMap}">${yearMap}</option>`;
    });
    yearDropdown += '</select>';

    const yearSpan = this.header.find('.year').empty().append(yearDropdown);
    yearSpan.find('select.dropdown').dropdown().off('change.datepicker')
      .on('change.datepicker', function () {
        const elem = $(this);
        self.currentYear = parseInt(elem.val(), 10);
        self.showMonth(self.currentMonth, self.currentYear, true);
      });

    if (this.yearFirst) {
      yearSpan.find('.dropdown-wrapper').css('left', '0');
      monthSpan.find('.dropdown-wrapper').css('left', '10px');
    }
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
    if (this.currentMonth !== month || this.currentYear !== year) {
      this.showMonth(month, year);
    }

    if (!this.isOpen()) {
      return;
    }

    // Show the Date in the UI
    const dateTd = this.days.find('td:not(.alternate)').filter(function () {
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
        this.days.find('.is-selected').removeAttr('aria-selected').removeAttr('tabindex');
      } else {
        this.days.find('.is-selected').removeClass('is-selected range').removeAttr('aria-selected').removeAttr('tabindex');
      }
      dateTd.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr({ 'aria-selected': true });
      this.activeTabindex(dateTd, true);
    }
  },

  /**
   * Convert a string to boolean
   * @private
   * @param {string} val .
   * @returns {boolean} Converted value
   */
  getBoolean(val) {
    const num = +val;
    return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
  },

  /**
   * Find first day of the week for a given month
   * @private
   * @param {number} year .
   * @param {number} month .
   * @returns {number} day
   */
  firstDayOfMonth(year, month) {
    if (this.isIslamic) {
      const firstDay = this.conversions.toGregorian(year, month, 1);
      return (firstDay === null ? 1 : firstDay.getDay());
    }
    return (new Date(year, month, 1)).getDay();
  },

  /**
   * Get islamic year index
   * @private
   * @param {number} islamicYear .
   * @returns {number} index
   */
  islamicYearIndex(islamicYear) {
    const yearIdx = islamicYear - 1318;
    if (yearIdx < 0 || yearIdx >= this.conversions.yearInfo.length) {
      return 0; // for an out-of-range year, simply returns 0
    }
    return yearIdx;
  },

  /**
   * Find the date of the Month (29, 30, 31 ect)
   * @private
   * @param {number} year .
   * @param {number} month .
   * @returns {number} date
   */
  daysInMonth(year, month) {
    if (this.isIslamic) {
      let monthLengthBitmap = this.conversions.yearInfo[this.islamicYearIndex(year)][0];
      let monthDayCount = 0;
      for (let M = 0; M <= month; M++) {
        // eslint-disable-next-line
        monthDayCount = 29 + (monthLengthBitmap & 1);
        if (M === month) {
          return monthDayCount;
        }
        // eslint-disable-next-line
        monthLengthBitmap = (monthLengthBitmap >> 1);
      }
      return 0;
    }
    return (new Date(year, month, 0)).getDate();
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
    // TODO Document this as the way to get the date
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

    this.setRangeSelected();

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

    if (s.range.useRange && s.range.first.date && !s.range.second.date) {
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
      if (s.range.useRange) {
        this.setRangeToElem(this.currentDate);
      } else {
        this.element.val(Locale.formatDate(this.currentDate, { pattern: this.pattern }));
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
    let hours = $('#timepicker-hours').val();
    const minutes = $('#timepicker-minutes').val();
    const seconds = this.isSeconds ? $('#timepicker-seconds').val() : 0;
    const period = $('#timepicker-period');

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
      if (this.days && this.days.length) {
        this.days.find('td').removeClass('range range-next range-prev range-selection end-date is-selected');
      }
      if (cell) {
        cell.addClass('is-selected');
      }
    }
  },

  /**
   * Set range selected value
   * @private
   * @returns {void}
   */
  setRangeSelected() {
    const self = this;
    const s = this.settings;
    const dateObj = d => new Date(d.year, d.month, d.day);

    if (s.range.useRange && s.range.second && s.range.second.date &&
      this.days && this.days.length) {
      this.days.find('td').removeClass('range range-next range-prev range-selection end-date is-selected');
      this.days.find('td:visible').each(function () {
        const cell = $(this);
        const isDisabled = cell.is('.is-disabled') && !s.range.includeDisabled;
        const includeDisabled = cell.is('.is-disabled') && s.range.includeDisabled;
        const includeDisableClass = includeDisabled ? ' include-disabled' : '';
        const getTime = (d) => {
          d = new Date(d);
          d.setHours(0, 0, 0);
          return d.getTime();
        };
        const date = getTime(dateObj(self.getCellDate(cell)));
        const d1 = getTime(s.range.first.date);
        const d2 = getTime(s.range.second.date);

        if ((date === d1 || date === d2) && !isDisabled) {
          cell.addClass(`is-selected${includeDisableClass}${d1 !== d2 ? ` range-selection${date === d2 ? ' end-date' : ''}` : ''}`);
        } else if ((date > d1 && date < d2) && !isDisabled) {
          cell.addClass(`range-selection${includeDisableClass}`);
        }
      });
    }
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
    const minCell = this.days.find('td:visible:first');
    const maxCell = this.days.find('td:visible:last');
    const label = labelDate(date);
    const cell = this.days.find(`[aria-label="${label}"]`);
    const row = cell.closest('tr');
    this.currentDate = date;

    s.range.first = { date, label, cell, row, rowIdx: row.index(), cellIdx: cell.index() };
    s.range.extra = {
      minCell,
      maxCell,
      min: dateObj(this.getCellDate(minCell)),
      max: dateObj(this.getCellDate(maxCell)),
      cellLength: row.children('td').length
    };
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
      let cell = this.days.find(`[aria-label="${label}"]`);
      let row = cell.closest('tr');

      if (s.range.second) {
        this.resetRange(cell);
      }

      const time = {};
      if (s.range.first) {
        time.date = date.getTime();
        time.firstdate = s.range.first.date.getTime();
        time.min = this.getDifferenceToDate(s.range.first.date, s.range.minDays);
        time.max = this.getDifferenceToDate(s.range.first.date, s.range.maxDays);
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
          cell = this.days.find(`[aria-label="${label}"]`);
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
        dates: this.getDateRange(s.range.first.date, s.range.second.date),
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
   * Get array of dates between two dates
   * @private
   * @param {object} startDate .
   * @param {object} endDate .
   * @param {boolean} includeDisabled .
   * @returns {array} dates between two dates
   */
  getDateRange(startDate, endDate, includeDisabled) {
    const dates = [];
    const current = new Date(startDate);

    includeDisabled = typeof includeDisabled !== 'undefined' ? includeDisabled : this.settings.range.includeDisabled;

    while (endDate.getTime() >= current.getTime()) {
      if (includeDisabled || (!includeDisabled &&
        !this.isDateDisabled(current.getFullYear(), current.getMonth(), current.getDate()))) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  },

  /**
   * Get difference to given date
   * @private
   * @param {object} date .
   * @param {number} days .
   * @param {boolean} includeDisabled .
   * @returns {object} before/after difference to given date
   */
  getDifferenceToDate(date, days, includeDisabled) {
    const difference = {};
    const move = (d, daystomove, isNext) => {
      d = new Date(d);
      while (daystomove > 0) {
        d.setDate(d.getDate() + (isNext ? 1 : -1));
        if (includeDisabled || (!includeDisabled &&
          !this.isDateDisabled(d.getFullYear(), d.getMonth(), d.getDate()))) {
          daystomove--;
          difference[isNext ? 'after' : 'before'] = new Date(d);
        }
      }
      if (isNext && difference.after) {
        difference.aftertime = difference.after.getTime();
      } else if (difference.before) {
        difference.beforetime = difference.before.getTime();
      }
    };
    includeDisabled = typeof includeDisabled !== 'undefined' ? includeDisabled : this.settings.range.includeDisabled;
    move(date, days); // previous
    move(date, days, true); // next
    return difference;
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
   * Change the order for execution jquery events were bound
   * http://stackoverflow.com/questions/2360655/jquery-event-handlers-always-execute-in-order-they-were-bound-any-way-around-t
   * @private
   * @param {object} elements .
   * @param {string} names .
   * @param {number} newIndex .
   * @returns {void}
   */
  changeEventOrder(elements, names, newIndex) {
    // Allow for multiple events.
    // eslint-disable-next-line
    $.each(names.split(' '), function (idx, name) {
      elements.each(function () {
        // eslint-disable-next-line
        const handlers = $._data(this, 'events')[name.split('.')[0]];
        // Validate requested position.
        newIndex = Math.min(newIndex, handlers.length - 1);
        handlers.splice(newIndex, 0, handlers.pop());
      });
    });
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
      self.element.one('isvalid.datepicker', (e, isValid) => {
        if (isValid && self.element.val().trim() !== '') {
          self.setValueFromField();
        }
      });
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
