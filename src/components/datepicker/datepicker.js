import * as debug from '../../utils/debug';
import { deprecateMethod } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { dateUtils } from '../../utils/date';
import { stringUtils } from '../../utils/string';
import { Locale } from '../locale/locale';
import { MonthView } from '../monthview/monthview';

// jQuery Components
import '../expandablearea/expandablearea.jquery';
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
 * @param {number} [settings.firstDayOfWeek=0] Set first day of the week. '1' would be Monday.
 * @param {object} [settings.disable] Disable dates in various ways.
 * For example `{minDate: 'M/d/yyyy', maxDate: 'M/d/yyyy'}`. Dates should be in format M/d/yyyy
 * or be a Date() object or string that can be converted to a date with new Date().
 * @param {function} [settings.disable.callback] return true to disable passed dates.
 * @param {array} [settings.disable.dates] Disable specific dates.
 * Example `{dates: ['12/31/2018', '01/01/2019']}`.
 * @param {array} [settings.disable.years] Disable specific years.
 * Example `{years: [2018, 2019]}`.
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
 * @param {boolean} [settings.showMonthYearPicker=true] If false the year and month switcher will be disabled.
 * @param {boolean} [settings.hideDays=false] If true the days portion of the calendar will be hidden.
 *  Usefull for Month/Year only formats.
 * @param {number} [settings.yearsAhead=5] The number of years ahead to show in the month/year picker should total 9 with yearsBack.
 * @param {number} [settings.yearsBack=4] The number of years back to show in the month/year picker should total 9 with yearsAhead.
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
 * @param {boolean} [settings.range.selectWeek=false] If true will act as a week picker.
 * @param {string} [settings.calendarName] The name of the calendar to use in instance of multiple calendars. At this time only ar-SA and ar-EG locales have either 'gregorian' or 'islamic-umalqura' as valid values.
 * @param {string} [settings.locale] The name of the locale to use for this instance. If not set the current locale will be used.
 * @param {string} [settings.language] The name of the language to use for this instance. If not set the current locale will be used or the passed locale will be used.
 * @param {boolean} [settings.useUTC=false] If true the dates will use UTC format. This is only partially
 * implemented https://jira.infor.com/browse/SOHO-3437
 * @param {boolean} [settings.hideButtons=false] If true bottom and next/prev buttons will be not shown.
 * @param {boolean} [settings.showToday=true] If true the today button is shown on the header.
 * @param {function} [settings.onOpenCalendar] Call back for when the calendar is open, allows you to set the date.
 * @param {boolean} [settings.isMonthPicker] Indicates this is a month picker on the month and week view. Has some slight different behavior.
 * @param {string} [settings.attributes] Add extra attributes like id's to the element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 * @param {boolean} [settings.tabbable=true] If true, causes the Datepicker's trigger icon to be focusable with the keyboard.
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
  firstDayOfWeek: 0,
  disable: {
    callback: null,
    dates: [],
    years: [],
    minDate: '',
    maxDate: '',
    dayOfWeek: [],
    isEnable: false,
    restrictMonths: false
  },
  showLegend: false,
  showMonthYearPicker: true,
  hideDays: false,
  yearsAhead: 5,
  yearsBack: 4,
  legend: [
    // Legend Build up exampleazure07
    { name: 'Public Holiday', color: 'azure06', dates: [] },
    { name: 'Weekends', color: 'turquoise06', dayOfWeek: [] }
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
    includeDisabled: false, // if true range will include disable dates in it
    selectWeek: false // if true will act as a week picker
  },
  calendarName: null,
  locale: null,
  language: null,
  useUTC: false,
  hideButtons: false,
  showToday: true,
  onOpenCalendar: null,
  isMonthPicker: false,
  attributes: null,
  tabbable: true
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
    this.element.attr('autocomplete', 'off');

    // Append a trigger button
    const next = this.element.next();
    if (next.is('button.trigger')) {
      this.trigger = next;
    } else {
      this.trigger = $(`<button class="btn-icon trigger">
        <span class="audible"></span>
        ${$.createIcon('calendar')}
      </button>`).insertAfter(this.element);
    }

    // Hide icon if datepicker input is hidden
    if (this.element.hasClass('hidden')) {
      this.trigger.addClass('hidden');
    }

    // Add "is-disabled" css class to closest ".field" if element is disabled
    if (this.element.is(':disabled')) {
      this.disable();
    }

    if (this.element.is(':read-only')) {
      this.readonly();
    }

    this.makeTabbable(this.settings.tabbable);

    // Enable classes and settings for week selection
    if (this.settings.range.selectWeek) {
      this.settings.selectForward = true;
      this.settings.minDays = 6;
      this.settings.maxDays = 7;
    }

    // Set the current calendar
    this.setLocale();
    this.addAria();
    if (!this.settings.locale && !this.settings.language) {
      this.setCurrentCalendar();
    }
  },

  /**
   * Set current locale to be used.
   * @private
   * @returns {void}
   */
  setLocale() {
    const s = this.settings;
    this.locale = Locale.currentLocale;

    if (this.settings.language) {
      Locale.getLocale(this.settings.language);
      this.language = this.settings.language;
    } else {
      this.language = Locale.currentLanguage.name;
    }

    if (s.locale) {
      Locale.getLocale(s.locale).done((locale) => {
        const similarApi = this.getSimilarApi('locale', locale);
        similarApi.forEach((api) => {
          api.locale = Locale.cultures[locale];
          api.language = this.settings.language || api.locale.language;
          api.setCurrentCalendar();
        });
        if (similarApi.length === 0) {
          this.locale = Locale.cultures[locale];
          this.language = this.settings.language || this.locale.language;
          this.setCurrentCalendar();
        }
      });
    }
    if (s.language) {
      Locale.getLocale(s.language).done(() => {
        const similarApi = this.getSimilarApi('language', s.language);
        similarApi.forEach((api) => {
          api.language = s.language;
        });
      });
    }
  },

  /**
   * Get list of similar api elements.
   * @private
   * @param {string} key to check
   * @param {string} value to check
   * @returns {array} list of api elements
   */
  getSimilarApi(key, value) {
    const elems = [].slice.call(document.querySelectorAll('.datepicker'));
    const similarApi = [];
    elems.forEach((node) => {
      const datepickerApi = $(node).data('datepicker');
      if (datepickerApi && datepickerApi.settings[key] === value) {
        similarApi.push(datepickerApi);
      }
    });
    return similarApi;
  },

  /**
   * Sets current calendar information.
   * @private
   * @returns {void}
   */
  setCurrentCalendar() {
    this.currentCalendar = Locale.calendar(
      this.settings.locale || this.locale.name,
      this.settings.language,
      this.settings.calendarName
    );
    this.isIslamic = this.currentCalendar.name === 'islamic-umalqura';
    this.isRTL = (this.locale.direction || this.locale.data.direction) === 'right-to-left';
    this.isFullMonth = this.settings.dateFormat.indexOf('MMMM') > -1;
    this.setFormat();
    this.mask();
  },

  /**
   * Add aria
   * @private
   * @returns {void}
   */
  addAria() {
    this.label = $(`label[for="${this.element.attr('id')}"]`);
    this.label.append(`<span class="audible">${Locale.translate('PressDown', { locale: this.locale.name, language: this.language })}</span>`);

    this.trigger.children('.audible').text(Locale.translate('DatePickerTriggerButton').replace('{0}', this.label.text()));
  },

  /**
   * Handle Keyboard Stuff
   * @private
   * @param {object} elem to handle.
   * @returns {void}
   */
  handleKeys(elem) {
    const s = this.settings;

    // Handle Tab key while popup is open - the rest is handled in monthview.js now
    if (elem.is('#monthview-popup')) {
      elem.off('keydown.datepicker').on('keydown.datepicker', '.monthview-table, .monthview-monthyear-pane', (e) => {
        let handled = false;
        const key = e.keyCode || e.charCode || 0;

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

        // 't' selects today
        if (key === 84) {
          this.closeCalendar();
          this.element.focus();
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
          if (s.range.useRange && $(e.target).is('.next') && !s.range.selectWeek) {
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

    // Handle keys on the input field
    elem.off('keydown.datepicker').on('keydown.datepicker', (e) => {
      let handled = false;
      const key = e.keyCode || e.charCode || 0;
      const hasMinusPattern = this.settings?.dateFormat?.indexOf('-') > -1;

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

      // '-' decrements day
      if (key === 189 && !e.shiftKey && (!hasMinusPattern)) {
        handled = true;
        this.adjustDay(false);
      }

      // '+' increments day
      if (key === 187 && e.shiftKey && (!hasMinusPattern)) {
        handled = true;
        this.adjustDay(true);
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
    let focusables = this.popup.find(':focusable');
    const target = $(e.currentTarget);
    const isMonthViewPane = target.is('.monthview-monthyear-pane, #btn-monthyear-pane') ||
      target.closest('.is-monthyear.is-monthonly').length > 0;
    if (isMonthViewPane) {
      focusables = this.popup.find(':focusable').not('td').not('.picklist-item a').add('.picklist-item.is-selected a:visible, .picklist-item.up a:visible, .picklist-item.down a:visible');
    }
    let index = focusables.index($(':focus'));

    if (!reverse) {
      index = ((index + 1) >= focusables.length ? 0 : (index + 1));
    } else {
      index = ((index - 1) < 0 ? focusables.length - 1 : (index - 1));
    }

    const elem = focusables.eq(index);
    elem.focus();
  },

  /**
   * Parse the Date Format Options
   * @private
   * @returns {void}
   */
  setFormat() {
    const s = this.settings;
    let localeDateFormat = ((typeof Locale === 'object' && this.currentCalendar.dateFormat) ? this.currentCalendar.dateFormat : null);
    let localeTimeFormat = ((typeof Locale === 'object' && this.currentCalendar.timeFormat) ? this.currentCalendar.timeFormat : null);

    if (typeof Locale === 'object' && this.settings.calendarName) {
      localeDateFormat = Locale.calendar(
        this.settings.locale,
        this.settings.language,
        this.settings.calendarName
      ).dateFormat;
      localeTimeFormat = Locale.calendar(
        this.settings.locale,
        this.settings.language,
        this.settings.calendarName
      ).timeFormat;
    }
    if (typeof localeDateFormat === 'object' && localeDateFormat.short !== undefined) {
      localeDateFormat = localeDateFormat.short;
    }

    if (s.dateFormat === 'locale') {
      this.pattern = localeDateFormat + (s.showTime ? ` ${(s.timeFormat || localeTimeFormat)}` : '');
      s.dateFormat = this.pattern;
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
    } else if (this.element.data('mask') === undefined) {
      this.element.mask(maskOptions);
    }

    this.addedValidation = false;
    if (this.element[0] && this.element[0].getAttribute &&
      !this.element[0].getAttribute('data-validate')) {
      this.addedValidation = true;
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
    const formatDate = d => Locale.formatDate(d, {
      pattern: this.pattern,
      locale: this.locale.name
    });
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
    const clearButton = `<button type="button" class="is-cancel btn-tertiary">
      ${Locale.translate(this.settings.isMonthPicker ? 'Cancel' : 'Clear', { locale: this.locale.name, language: this.language })}
    </button>`;
    const applyButton = ` <button type="button" class="is-select btn-primary">
      ${Locale.translate('Apply', { locale: this.locale.name, language: this.language })}
    </button>`;

    this.footer = $('' +
      `<div class="popup-footer">
        ${this.isRTL ? applyButton + clearButton : clearButton + applyButton}
      </div>`);

    if (s.hideDays) {
      this.footer = $('' +
        `<div class="popup-footer">
          <button type="button" class="is-cancel btn-tertiary">
            ${Locale.translate('Clear', { locale: this.locale.name, language: this.language })}
          </button>
          <button type="button" class="is-select-month btn-primary">
            ${Locale.translate('Apply', { locale: this.locale.name, language: this.language })}
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

      let timeFormat = this.settings.timeFormat ? this.settings.timeFormat : null;
      if (!timeFormat) {
        timeFormat = this.isSeconds ?
          this.currentCalendar.dateFormat.timestamp :
          this.currentCalendar.dateFormat.hour;
      }

      timeOptions.parentElement = this.timepickerContainer;
      timeOptions.locale = this.settings.locale;
      timeOptions.language = this.settings.language;
      this.time = Locale.formatDate(this.currentDate, {
        pattern: timeFormat,
        locale: this.locale.name,
        language: this.language
      });

      this.timepicker = this.timepickerContainer.timepicker(timeOptions).data('timepicker');
      this.setUseCurrentTime();
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
      this.todayDateIslamic = Locale.gregorianToUmalqura(this.todayDate);
      this.todayYear = this.todayDateIslamic[0];
      this.todayMonth = this.todayDateIslamic[1];
      this.todayDay = this.todayDateIslamic[2];
    }

    this.settings.year = this.currentYear;
    this.settings.month = this.currentMonth;

    if (this.isIslamic) {
      this.settings.activeDateIslamic = this.activeDate instanceof Date ?
        Locale.gregorianToUmalqura(this.activeDate) : this.activeDate;
    }

    if (this.settings.onOpenCalendar) {
      // In some cases, month picker wants to set a specifc time.
      this.settings.activeDate = this.settings.onOpenCalendar();
      if (this.isIslamic) {
        this.settings.activeDateIslamic = Locale.gregorianToUmalqura(this.settings.activeDate);
        this.settings.year = this.settings.activeDateIslamic[0];
        this.settings.month = this.settings.activeDateIslamic[1];
      } else {
        this.settings.year = this.settings.activeDate.getFullYear();
        this.settings.month = this.settings.activeDate.getMonth();
      }
    } else {
      this.settings.activeDate = this.currentDate || this.todayDate;
      this.settings.activeDateIslamic = this.currentDateIslamic || this.todayDateIslamic;
    }

    this.settings.isPopup = true;
    this.settings.headerStyle = 'simple';

    // Handle day change
    this.settings.onSelected = (node, args) => {
      this.currentDate = new Date(args.year, args.month, args.day);

      if (self.settings.range.useRange && self.settings.range.first &&
        self.settings.range.selectWeek) {
        const first = dateUtils.firstDayOfWeek(new Date(), this.settings.firstDayOfWeek);
        const last = dateUtils.lastDayOfWeek(new Date(), this.settings.firstDayOfWeek);
        self.settings.range.first = {};
        self.settings.range.second = undefined;

        self.setWeekRange(
          { day: first.getDate(), month: first.getMonth(), year: first.getFullYear() },
          { day: last.getDate(), month: last.getMonth(), year: last.getFullYear() }
        );
        self.closeCalendar();
        self.element.focus();
        return;
      }
      if (self.settings.range.useRange && self.settings.range.first &&
        !self.settings.range.selectWeek) {
        return;
      }
      self.insertDate(this.currentDate);

      if (args.close) {
        self.closeCalendar();
        self.element.focus();
      }
    };

    if (this.settings.range.useRange && this.settings.range.selectWeek) {
      this.settings.onKeyDown = (args) => {
        if (args.key === 37 || args.key === 39) {
          return false;
        }
        if (args.key === 38 || args.key === 40) { // up and down a week
          // TODO - Later if this is really needed.
          return false;
        }
        if (args.key === 13) { // select a week
          // TODO - Later if this is really needed.
          return false;
        }
        return true;
      };
    }

    this.calendarAPI = new MonthView(this.calendarContainer, this.settings);
    this.calendar = this.calendarAPI.element;

    if (s.showTime) {
      this.calendar.addClass('is-timepicker');
    }
    if (s.hideDays) {
      this.calendar.addClass('is-monthyear');
      if (s.dateFormat === 'MMMM' || s.dateFormat === 'MMM' || s.dateFormat === 'MM') {
        this.calendar.addClass('is-monthonly');
      }
      if (s.dateFormat === 'yyyy') {
        this.calendar.addClass('is-yearonly');
      }
    }
    this.calendar.append((s.showTime ? this.timepickerContainer : ''), this.footer);

    let placementParent = this.element;
    let placementParentXAlignment = (this.isRTL ? 'right' : 'left');
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
      extraClass: this.settings.range.selectWeek ? 'monthview-popup is-range-week' : 'monthview-popup',
      tooltipElement: '#monthview-popup',
      initializeContent: false
    };

    this.trigger.popover(popoverOpts)
      .off('show.datepicker')
      .on('show.datepicker', () => {
        // Horizontal view on mobile
        if (window.innerHeight < 400 && this.popupClosestScrollable &&
          this.popupClosestScrollable.length === 1) {
          this.popup.find('.arrow').hide();
          this.popup.css({
            'min-height': $('html').hasClass('theme-new-light') ? '' :
              `${(this.popupClosestScrollable[0].scrollHeight - 521)}px`,
            height: ''
          });
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
        if (this.settings.showMonthYearPicker) {
          this.popup.find('.expandable-area').expandablearea({
            animationSpeed: 150,
            trigger: 'btn-monthyear-pane'
          });
          this.popup.find('.btn-monthyear-pane').button();
        }

        // Add range selection for each week
        if (this.settings.range.selectWeek) {
          const tableBody = this.popup.find('tbody');
          this.popup.find('.monthview-table tr')
            .hover((e) => {
              const tr = $(e.currentTarget);
              tableBody.find('td').removeClass('is-selected range-selection end-date');
              tr.find('td').addClass('range-selection');
            });
        }
      })
      .off('hide.datepicker')
      .on('hide.datepicker', () => {
        this.popupClosestScrollable.add(this.popup).css('min-height', '');
        this.closeCalendar();
      });

    this.handleKeys($('#monthview-popup'));
    $('.monthview-footer a', this.calendar).button();

    this.popup = $('#monthview-popup');
    this.popupClosestScrollable = this.popup.closest('.scrollable');
    this.popup.attr('role', 'dialog');
    this.originalDate = this.element.val();
    this.calendarAPI.currentDate = this.currentDate;
    this.calendarAPI.currentDateIslamic = this.currentDateIslamic;
    this.calendarAPI.validatePrevNext();

    // Calendar Day Events
    this.calendarAPI.days.off('click.datepicker').on('click.datepicker', 'td', function () {
      const td = $(this);
      if (td.hasClass('is-disabled')) {
        self.calendarAPI.activeTabindex(td, true);
      } else {
        if (s.range.useRange && (!s.range.first || s.range.second) && !s.range.selectWeek) {
          self.calendarAPI.days.find('.is-selected').removeClass('is-selected range').removeAttr('aria-selected');
        }
        if (s.range.useRange && s.range.selectWeek) {
          const first = self.calendarAPI.getCellDate(self.calendar.find('td.range-selection').first());
          const last = self.calendarAPI.getCellDate(self.calendar.find('td.range-selection').last());

          self.setWeekRange(first, last);
          return;
        }
        if (!s.range.useRange) {
          self.calendarAPI.days.find('.is-selected').removeClass('is-selected').removeAttr('aria-selected').removeAttr('tabindex');
        }

        const cell = $(this);
        cell.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true');
        self.lastValue = null;
        self.insertSelectedDate(cell);

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

      if (btn.hasClass('is-cancel')) {
        /**
        * Fires after the value in the input is changed by any means.
        *
        * @event change
        * @memberof DatePicker
        * @property {object} event - The jquery event object
        */
        if (!self.settings.isMonthPicker) {
          self.element.val('').trigger('change').trigger('input');
          self.currentDate = null;
          self.clearRangeDates();
        }
        self.closeCalendar();
        self.element.focus();
      }

      if (btn.hasClass('is-cancel-month-pane')) {
        self.calendarAPI.monthYearPane.data('expandablearea').close();
      }

      if (btn.hasClass('is-select-month') || btn.hasClass('is-select-month-pane')) {
        const year = parseInt(self.calendarAPI.monthYearPane.find('.is-year .is-selected a').attr('data-year'), 10);
        const month = parseInt(self.calendarAPI.monthYearPane.find('.is-month .is-selected a').attr('data-month'), 10);
        const day = 1;

        self.currentDate = new Date(year, month, day);

        if (self.isIslamic) {
          self.currentDateIslamic[0] = year;
          self.currentDateIslamic[1] = month;
          self.currentDateIslamic[2] = day;
          self.currentYear = year;
          self.currentMonth = month;
          self.currentDay = day;
          self.currentDate = Locale.umalquraToGregorian(year, month, day);
        }

        if (s.range.useRange) {
          self.isFocusAfterClose = false;
        } else if (btn.hasClass('is-select-month')) {
          self.insertDate(self.isIslamic ? self.currentDateIslamic : self.currentDate);
          self.closeCalendar();
        }
        if (btn.hasClass('is-select-month-pane')) {
          self.calendarAPI.showMonth(month, year);
        }
      }

      if (btn.hasClass('is-select')) {
        const status = self.calendarAPI.setRangeSelByClick();
        if (status === 1) {
          self.closeCalendar();
        } else if (status === 2) {
          self.element
            .trigger('change', [s.range.data])
            .trigger('input', [s.range.data]);
          self.closeCalendar();
        } else if (status === 3) {
          e.preventDefault();
          return;
        } else {
          self.insertSelectedDate();
          self.closeCalendar();
        }

        if (!btn.hasClass('is-select-month-pane')) {
          self.element.focus();
        }
      }
      e.preventDefault();

      if (btn.hasClass('is-select-month-pane')) {
        self.calendarAPI.monthYearPane.data('expandablearea').close();
        self.popup.find('.btn-primary.is-select').focus();
      }
    });

    this.popup.off('click.datepicker-today').on('click.datepicker-today', '.hyperlink.today', (e) => {
      e.preventDefault();
      if (s.range.useRange) {
        self.setToday(true);
        if (!s.range.second || (s.range.second && !s.range.second.date)) {
          e.preventDefault();
        }
      } else {
        self.setToday();
        self.closeCalendar();
      }
    });

    setTimeout(() => {
      utils.addAttributes(this.popup.find('.btn-monthyear-pane'), this, this.settings.attributes, 'btn-monthyear');
      utils.addAttributes(this.popup.find('.is-cancel'), this, this.settings.attributes, 'btn-cancel');
      utils.addAttributes(this.popup.find('.is-select'), this, this.settings.attributes, 'btn-select');

      self.calendarAPI.validatePrevNext();
      self.setFocusAfterOpen();
    }, 50);
  },

  /**
   * Set time picker options for `useCurrentTime` setting.
   * @private
   * @returns {void}
   */
  setUseCurrentTime() {
    if (this.settings.useCurrentTime && this.timepicker.minuteSelect.length) {
      const isSeconds = this.isSeconds && this.timepicker.secondSelect.length;
      const leadingZero = n => (n < 10 ? '0' : '') + n;
      const setOption = (elem, value) => {
        if (!elem.find(`option:contains(${value})`).length) {
          elem.find('option:selected').prop('selected', false);
          elem.prepend($(`<option selected >${value}</option>`));
        }
      };
      const d = new Date();
      setOption(this.timepicker.minuteSelect, leadingZero(d.getMinutes()));
      if (isSeconds) {
        setOption(this.timepicker.secondSelect, leadingZero(d.getSeconds()));
      }
      if (typeof this.time === 'string' && this.time !== '' &&
        this.currentDate && this.currentDate.getDate()) {
        setOption(this.timepicker.minuteSelect, leadingZero(this.currentDate.getMinutes()));
        if (isSeconds) {
          setOption(this.timepicker.secondSelect, leadingZero(this.currentDate.getSeconds()));
        }
      }
    }
  },

  /**
   * Clear the dates in settings range object.
   * @private
   * @returns {void}
   */
  clearRangeDates() {
    const s = this.settings;
    if (s.range.useRange) {
      s.range.start = DATEPICKER_DEFAULTS.range.start;
      s.range.end = DATEPICKER_DEFAULTS.range.end;
      if (s.range.data) {
        delete s.range.data;
      }
    }
  },

  /**
   * Inserts the currently selected (higlighted in azure) date.
   * @private
   * @param {object} cell The cell to check otherwise the selected cell is used.
   * @returns {void}
   */
  insertSelectedDate(cell) {
    const self = this;
    const cellDate = self.calendarAPI.getCellDate(cell || self.calendar.find('td.is-selected').last());
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
      self.currentDate = Locale.umalquraToGregorian(year, month, day);
    }

    self.insertDate(self.isIslamic ? self.currentDateIslamic : self.currentDate);
  },

  /**
   * Inserts a week range in the field.
   * @private
   * @param {object} first The first range object.
   * @param {object} last The last range object.
   * @returns {void}
   */
  setWeekRange(first, last) {
    const s = this.settings;
    s.range.first.date = new Date(first.year, first.month, first.day);
    s.range.second = undefined;
    this.setValue(new Date(last.year, last.month, last.day));
    this.calendarAPI.days.find('.is-selected').removeClass('is-selected range').removeAttr('aria-selected');
  },

  /**
   * Close the calendar popup.
   * This method is slated to be removed in a future v4.15.0 or v5.0.0.
   * @deprecated as of v4.9.0. Please use `closeCalendar()` instead.
   * @returns {void}
   */
  close() {
    return deprecateMethod(this.closeCalendar, this.close).apply(this);
  },

  /**
   * Close the calendar in a popup
   * @private
   * @returns {void}
   */
  closeCalendar() {
    // Remove range entries
    const cell = this.calendarAPI && this.calendarAPI.days.length ? this.calendarAPI.days.find('td.is-selected') : null;
    this.resetRange({ cell });

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

    if (this.calendarAPI) {
      delete this.calendarAPI.datepickerApi;
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
    this.calendarAPI.datepickerApi = this;

    if (s.range.useRange && s.range.selectWeek) {
      const tr = this.calendar.find('td.is-selected').first().parent();
      this.calendar.find('td[tabindex]').removeAttr('tabindex');
      tr.attr('tabindex', '0').focus();
      return;
    }
    this.calendarAPI.activeTabindex(this.calendar.find('td.is-selected'), true);
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
    const minCell = this.calendarAPI.days.find('td:visible:first');
    const maxCell = this.calendarAPI.days.find('td:visible:last');
    const key = this.isIslamic ? stringUtils.padDate(date[0], date[1], date[2]) :
      stringUtils.padDate(date.getFullYear(), date.getMonth(), date.getDate());
    const cell = this.calendarAPI.days.find(`[data-key="${key}"]`);
    const row = cell.closest('tr');

    if (this.isIslamic) {
      this.currentDate = Locale.umalquraToGregorian(date[0], date[1], date[2], date[3], date[4], date[5], date[6]);
      this.currentDateIslamic = date;
    } else {
      this.currentDate = date;
    }

    const min = this.calendarAPI.getCellDate(minCell);
    const max = this.calendarAPI.getCellDate(maxCell);
    s.range.first = { date: this.isIslamic ? [...date] : date, cell, row, rowIdx: row.index(), cellIdx: cell.index() };

    s.range.extra = {
      minCell,
      maxCell,
      min: this.isIslamic ? [min.year, min.month, min.day] : dateObj(min),
      max: this.isIslamic ? [max.year, max.month, max.day] : dateObj(max),
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
    let year = '';
    let month = '';
    let day = '';

    if (date instanceof Array) {
      year = date[0];
      month = date[1];
      day = (date[2]).toString();
    } else if (date instanceof Date && !isNaN(this.getTime(date))) {
      year = date.getFullYear();
      month = date.getMonth();
      day = (date.getDate()).toString();
    } else {
      return;
    }

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
      this.calendarAPI.activeTabindex(dateTd, true);
    } else {
      if (this.settings.showTime) {
        if (isReset) {
          this.time = Locale.formatDate(date, {
            pattern: this.currentCalendar.dateFormat.hour,
            locale: this.locale.name,
            language: this.language
          });

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
      this.calendarAPI.activeTabindex(dateTd, true);
    }
  },

  /**
   * Set the Formatted value in the input
   * @private
   * @param {object|string} date The date to set in date format or a valid datestring
   * @param {boolean} trigger If true will trigger the change event.
   * @param {boolean} isTime will pass to set range.
   * @returns {void}
   */
  setValue(date, trigger, isTime) {
    const s = this.settings;
    this.currentDate = date;

    if (date instanceof Array) {
      this.currentDateIslamic = date;
      this.currentDate = Locale.umalquraToGregorian(
        date[0],
        date[1],
        date[2],
        date[3],
        date[4],
        date[5]
      );
    }

    if (s.range.useRange) {
      if (!isTime) {
        this.setRangeToElem(date, false);
      }
    } else {
      this.element.val(Locale.formatDate(date, {
        pattern: this.pattern,
        locale: this.locale.name
      }));
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
    * Get a unqiue and comparable time from the date.
    * @param  {[type]} date [description]
    * @returns {string} comparable time string
    */
  getTime(date) {
    return Array.isArray(date) ? date.join('') : date.getTime();
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
    const formatDate = d => Locale.formatDate(d, {
      pattern: this.pattern,
      locale: this.locale.name
    });
    let value = formatDate(date);
    let handled = false;

    // Closed calendar
    if (!this.isOpen()) {
      if (!isSingleDate) {
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
      }
    } else {
      // Opened calendar
      let key = this.isIslamic ?
        stringUtils.padDate(date[0], date[1], date[2]) :
        stringUtils.padDate(date.getFullYear(), date.getMonth(), date.getDate());
      let cell = this.calendarAPI.days.find(`[data-key="${key}"]`);
      let row = cell.closest('tr');

      if (s.range.second) {
        if (!s.range.second.date) {
          delete s.range.second.date;
          if ($.isEmptyObject(s.range.second)) {
            delete s.range.second;
          }
        } else {
          this.resetRange({ cell });
        }
      }

      const time = {};
      if (s.range.first) {
        time.date = this.getTime(date);
        time.firstdate = this.getTime(s.range.first.date);
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
        this.resetRange({ cell });
        this.setRangeFirstPart(date);
        value = this.getRangeValue();
        this.setPlaceholder();
      } else {
        // Set second part for range
        handled = true;
        if (this.isIslamic) {
          this.currentDate = Locale.umalquraToGregorian(date[0], date[1], date[2], date[3], date[4], date[5], date[6]);
          this.currentDateIslamic = date;
        } else {
          this.currentDate = date;
        }

        // minDays
        if (s.range.minDays > 0) {
          if (time.date >= time.firstdate && time.date < time.min.aftertime) {
            date = time.min.after;
            if (time.date === time.firstdate) {
              time.date = this.getTime(date);
            }
          } else if (time.date < time.firstdate && time.date > time.min.beforetime) {
            date = time.min.before;
          }
          key = this.isIslamic ?
            stringUtils.padDate(date[0], date[1], date[2]) :
            stringUtils.padDate(date.getFullYear(), date.getMonth(), date.getDate());

          cell = this.calendarAPI.days.find(`[data-key="${key}"]`);

          row = cell.closest('tr');
        }
        if (time.date > time.firstdate) {
          s.range.second = { date, cell, row, rowIdx: row.index(), cellIdx: cell.index() };
        } else {
          s.range.second = s.range.first;
          s.range.first = { date, cell, row, rowIdx: row.index(), cellIdx: cell.index() };
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
        dates: !this.calendarAPI ? [s.range.first.date] :
          this.calendarAPI.getDateRange(s.range.first.date, s.range.second.date),
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
   * @param {object} options cell: to keep selection, isData: to delete the data
   * @returns {void}
   */
  resetRange(options) {
    options = options || {};
    if (this.settings.range.useRange) {
      delete this.settings.range.first;
      delete this.settings.range.second;
      delete this.settings.range.extra;
      if (options.isData) {
        delete this.settings.range.data;
      }
      if (this.calendarAPI) {
        delete this.calendarAPI.settings.range.first;
        delete this.calendarAPI.settings.range.second;
        delete this.calendarAPI.settings.range.extra;
        if (options.isData) {
          delete this.calendarAPI.settings.range.data;
        }
      }
      if (this.calendarAPI && this.calendarAPI.days.length) {
        this.calendarAPI.days.find('td').removeClass('range range-next range-prev range-selection end-date is-selected');
      }
      if (options.cell) {
        options.cell.addClass('is-selected');
      }
    }
  },

  /**
   * Set the range value from the field
   * @private
   * @returns {void}
   */
  setRangeValueFromField() {
    const formatDate = d => Locale.formatDate(d, {
      pattern: this.pattern,
      locale: this.locale.name
    });
    const parseDate = d => Locale.parseDate(d, {
      pattern: this.pattern,
      locale: this.locale.name
    }, false);
    const getDateTime = d => ((d && typeof d.getTime === 'function') ? d : (new Date()));
    const alignDates = (dates) => {
      let d1 = parseDate(dates[0]);
      let d2 = parseDate(dates[1]);
      const isAlreadyIslamic = this.isIslamic && Array.isArray(d1);

      if (!isAlreadyIslamic) {
        d1 = Locale.gregorianToUmalqura(new Date(dates[0]));
        d2 = Locale.gregorianToUmalqura(new Date(dates[1]));
      }

      if (d1 && d2) {
        d1 = this.getTime(getDateTime(d1));
        d2 = this.getTime(getDateTime(d2));

        if (this.isIslamic && !isAlreadyIslamic) {
          dates[0] = Locale.gregorianToUmalqura(new Date(dates[0]));
          dates[1] = Locale.gregorianToUmalqura(new Date(dates[1]));
        }

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
    } else if (!field.isEmpty && field.value.indexOf(s.range.separator) === -1) {
      field.dates = [formatDate(field.value)];
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
      s.range.first.date = this.isIslamic && Array.isArray(field.dates[0]) ? field.dates[0] : parseDate(field.dates[0]);
    }

    // End date
    if (s.range.data && s.range.data.endDate) {
      s.range.second.date = s.range.data.endDate;
    } else if (s.range.end && typeof s.range.end === 'string') {
      s.range.second.date = parseDate(s.range.end);
    } else if (field.dates) {
      s.range.second.date = this.isIslamic && Array.isArray(field.dates[1]) ?
        field.dates[1] : parseDate(field.dates[1]);
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

    if (s.range.useRange && this.element.val().trim() === '') {
      this.resetRange({ isData: true });
    }

    if (s.range.useRange && ((this.element.val().trim() !== '') ||
      (s.range.start && s.range.end) ||
      (s.range.data && s.range.data.startDate && s.range.data.endDate))) {
      if (!this.setRangeValueFromField()) {
        if (this.currentDate && typeof this.currentDate.getMonth === 'function') {
          this.currentMonth = this.currentDate.getMonth();
          this.currentYear = this.currentDate.getFullYear();
          this.currentDay = this.currentDate.getDate();
        }
        if (this.currentDate && this.isIslamic) {
          this.currentYear = this.currentDateIslamic[0];
          this.currentMonth = this.currentDateIslamic[1];
          this.currentDay = this.currentDateIslamic[2];
        }
        return;
      }
    }

    const self = this;
    const fieldValue = this.element.val();
    let gregorianValue = fieldValue;

    if (this.isIslamic && fieldValue) {
      const islamicValue = Locale.parseDate(this.element.val(), {
        pattern: this.pattern,
        locale: this.locale.name
      });
      if (islamicValue instanceof Date) {
        gregorianValue = Locale.umalquraToGregorian(
          islamicValue.getFullYear(),
          islamicValue.getMonth(),
          islamicValue.getDate()
        );
      } else if (islamicValue instanceof Array) {
        gregorianValue = Locale.umalquraToGregorian(
          islamicValue[0],
          islamicValue[1],
          islamicValue[2],
          islamicValue[3],
          islamicValue[4],
          islamicValue[5]
        );
      }
    }
    const getSelectedDay = () => {
      let day = (new Date()).getDate();
      if (this.calendarAPI) {
        const selected = this.calendarAPI.dayMap.filter(d => d.elem.is('.is-selected'));
        if (selected.length) {
          day = parseInt(selected[0].key.substr(6), 10);
        }
      }
      return day;
    };
    const selectedDay = getSelectedDay();

    this.currentDate = gregorianValue || new Date();

    if (typeof this.currentDate === 'string') {
      this.currentDate = Locale.parseDate(this.currentDate, {
        pattern: this.pattern,
        locale: this.locale.name,
        calendarName: this.settings.calendarName
      }, false);
      if (this.pattern && this.pattern.indexOf('d') === -1) {
        this.currentDate.setDate(selectedDay);
      }
    }

    if (this.currentDate === undefined) {
      this.currentDate = Locale.parseDate(gregorianValue, {
        pattern: this.pattern,
        locale: this.locale.name,
        calendarName: this.settings.calendarName
      }, false);
    }

    if (this.isIslamic) {
      this.currentDateIslamic = Locale.gregorianToUmalqura(this.currentDate);
      this.currentYear = this.currentDateIslamic[0];
      this.currentMonth = this.currentDateIslamic[1];
      this.currentDay = this.currentDateIslamic[2];
    } else {
      this.currentDate = this.currentDate || new Date();
      this.currentMonth = this.currentDate.getMonth();
      this.currentYear = this.currentDate.getFullYear();
      this.currentDay = this.currentDate.getDate();
    }

    // Check and fix two digit year for main input element
    const dateFormat = self.pattern;
    const isStrict = !(dateFormat.indexOf('MMMM') > -1 || dateFormat.indexOf('MMM') > -1 || dateFormat === 'yyyy' ||
      dateFormat === 'MMMM' || dateFormat === 'MMM' || dateFormat === 'MM');
    const fieldValueTrimmed = self.element.val().trim();

    if (fieldValueTrimmed !== '' && !s.range.useRange) {
      const parsedDate = Locale.parseDate(fieldValueTrimmed, {
        pattern: self.pattern,
        locale: this.locale.name,
        calendarName: this.settings.calendarName
      }, isStrict);

      let hours = 0;
      if (this.isIslamic) {
        hours = parsedDate[3];
      } else {
        hours = parsedDate?.getHours();
      }
      if (!this.isIslamic && parsedDate && hours < 12 &&
        self.element.val().trim().indexOf(this.currentCalendar.dayPeriods[1]) > -1) {
        parsedDate.setHours(hours + 12);
      }
      if (this.isIslamic && parsedDate && hours < 12 &&
        self.element.val().trim().indexOf(this.currentCalendar.dayPeriods[1]) > -1) {
        hours += 12;
      }
      if (!this.isIslamic && self.pattern && self.pattern.indexOf('d') === -1) {
        parsedDate.setDate(selectedDay);
      }
      if (this.isIslamic && self.pattern && self.pattern.indexOf('d') === -1) {
        parsedDate[2] = selectedDay;
      }
      if (parsedDate !== undefined && self.element.val().trim() !== '' && !s.range.useRange) {
        self.setValue(parsedDate);

        if (fieldValueTrimmed !== self.element.val().trim()) {
          this.element.trigger('change').trigger('input');
        }
      }
    }

    if (s.range.useRange && s.range.first && s.range.first.date && s.range.second) {
      if (s.range.second.date) {
        this.element.val(this.getRangeValue());
      } else {
        this.setRangeToElem(this.currentDate, true);
      }
    }
  },

  /**
   * Set input to enabled.
   * @returns {void}
   */
  enable() {
    this.element.removeAttr('disabled readonly').closest('.field').removeClass('is-disabled');
    this.trigger.prop('disabled', false);
  },

  /**
   * Set input to disabled.
   * @returns {void}
   */
  disable() {
    this.element.removeAttr('readonly').attr('disabled', 'disabled').closest('.field').addClass('is-disabled');
    this.trigger.prop('disabled', true);
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
    this.trigger.prop('disabled', true);
  },

  /**
   * Detects whether or not the component is readonly
   * @returns {boolean} whether or not the component is readonly
   */
  isReadonly() {
    return this.element.prop('readonly');
  },

  /**
   * @param {boolean} val if true, sets the trigger button to a focusable tab index
   */
  makeTabbable(val) {
    this.trigger.attr('tabIndex', val ? 0 : -1);
  },

  /**
   * Set to todays date in current format.
   * @private
   * @param {boolean} keepFocus if true keep focus on calendar
   * @returns {void}
   */
  setToday(keepFocus) {
    const s = this.settings;
    this.lastValue = null;
    this.currentDate = new Date();

    if (this.isReadonly() || this.isDisabled()) {
      return;
    }

    if (!this.settings.useCurrentTime) {
      this.currentDate = this.setTime(this.currentDate);
    }

    if (this.isIslamic) {
      const islamicDateParts = Locale.gregorianToUmalqura(this.currentDate);
      this.currentDateIslamic = islamicDateParts;
    }

    const currentDate = this.isIslamic ? this.currentDateIslamic : this.currentDate;

    if (this.isOpen()) {
      if (s.range.useRange) {
        if (!s.range.first || (s.range.first && !s.range.first.date)) {
          this.calendarAPI.days.find('td:visible')
            .removeClass('is-selected').removeAttr('aria-selected');
          this.insertDate(currentDate, true);
          if (keepFocus && this.calendarAPI) {
            const cell = this.calendarAPI.dayMap.filter(d => d.elem.is('.is-selected'));
            if (cell && cell.length) {
              setTimeout(() => {
                cell[0].elem.focus();
              }, 0);
            }
          }
        } else if (s.range.first && s.range.first.date &&
          (!s.range.second || (s.range.second && !s.range.second.date))) {
          this.setRangeToElem(currentDate, false);
        } else if (s.range.first && s.range.first.date &&
          s.range.second && s.range.second.date) {
          this.resetRange({ isData: true });
          this.insertDate(currentDate, true);
        }
      } else {
        this.insertDate(currentDate, true);
      }
    } else {
      if (s.range.useRange) {
        this.setRangeToElem(this.currentDate);
      } else {
        const options = { pattern: this.pattern, locale: this.locale.name };
        const islamicDateText = Locale.formatDate(currentDate, options);
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
   * Set the date to one more or one less day.
   * @param  {boolean} plusMinus True for increment, false for decrement
   */
  adjustDay(plusMinus) {
    if (this.isReadonly() || this.isDisabled()) {
      return;
    }

    if (!this.currentDate) {
      this.setToday();
    }
    const options = { pattern: this.pattern, locale: this.locale.name };
    let currentDate = this.isIslamic ? this.currentDateIslamic : this.currentDate;
    if (this.isIslamic) {
      currentDate[2] += (plusMinus ? 1 : -1);
      currentDate = Locale.umalquraToGregorian(
        this.currentDateIslamic[0],
        this.currentDateIslamic[1],
        this.currentDateIslamic[2],
        this.currentDateIslamic[3],
        this.currentDateIslamic[4],
        this.currentDateIslamic[5],
        this.currentDateIslamic[6]
      );
      currentDate.setDate(currentDate.getDate() + (plusMinus ? 1 : -1));
      currentDate = Locale.gregorianToUmalqura(currentDate);
    } else {
      currentDate.setDate(currentDate.getDate() + (plusMinus ? 1 : -1));
    }
    this.element.val(Locale.formatDate(currentDate, options));
    this.element.trigger('change').trigger('input');
  },

  /**
   * Set time
   * @private
   * @param {object} date .
   * @returns {void}
   */
  setTime(date) {
    const hasPopup = this.popup !== undefined;
    if (!this.timepicker || !hasPopup) {
      if (!this.settings.useCurrentTime) {
        date.setHours(0, 0, 0, 0);
      }
      return date;
    }
    let hours = this.popup.find('.dropdown.hours').val();
    const minutes = this.popup.find('.dropdown.minutes').val();
    const seconds = this.isSeconds ? this.popup.find('.dropdown.seconds').val() : 0;
    const period = this.popup.find('.dropdown.period');
    const periodValue = period.val();

    hours = (period.length && periodValue === this.currentCalendar.dayPeriods[1] && hours < 12) ?
      (parseInt(hours, 10) + 12) : hours;
    hours = (period.length && (periodValue === this.currentCalendar.dayPeriods[0] ||
      !periodValue) && parseInt(hours, 10) === 12) ? 0 : hours;

    if (date instanceof Array) {
      date[3] = hours ? parseInt(hours, 10) : date[3];
      date[4] = minutes ? parseInt(minutes, 10) : date[4];
      date[5] = seconds ? parseInt(seconds, 10) : date[5];
    } else {
      date = new Date(date);
      date.setHours(hours, minutes, seconds);
    }

    return date;
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
    const formatDate = d => Locale.formatDate(d, {
      pattern: this.pattern,
      locale: this.locale.name
    });

    if (s.range.useRange &&
      s.range.first && s.range.first.date &&
      s.range.second && s.range.second.date) {
      return `${formatDate(s.range.first.date) + s.range.separator + formatDate(s.range.second.date)}`;
    } if (s.range.useRange &&
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

    this.element.off('blur.datepicker change.datepicker-rangeclear keyup.datepicker-rangeclear');
    this.trigger.remove();
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
    this.element.removeAttr('data-mask');
    this.element.removeData('mask');

    this.element.off('keydown.datepicker blur.validate change.validate keyup.validate focus.validate');

    if (this.addedValidation) {
      this.element.removeAttr('data-validate').removeData('validate validationEvents');
      delete this.addedValidation;
    }

    return this;
  },

  /**
   * Destroy and remove added markup, reset back to default
   * @returns {void}
   */
  destroy() {
    this.closeCalendar();
    this.teardown();
    if (this.element[0]) {
      $.removeData(this.element[0], COMPONENT_NAME);
    }
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

    this.handleKeys(this.element);

    // Fix two digit year for main input element
    self.element.on('blur.datepicker', () => {
      if (this.element.val().trim() !== '') {
        this.setValueFromField();
      }
    });

    // Clear setting range dates
    this.element.on('change.datepicker-rangeclear keyup.datepicker-rangeclear', () => {
      if (!this.isOpen() && this.element.val().trim() === '') {
        self.clearRangeDates();
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
