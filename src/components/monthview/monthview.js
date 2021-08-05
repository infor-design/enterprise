import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { stringUtils } from '../../utils/string';
import { Locale } from '../locale/locale';
import { theme } from '../theme/theme';
import { xssUtils } from '../../utils/xss';
import { colorUtils } from '../../utils/color';
import { CalendarToolbar } from '../calendar/calendar-toolbar';
import { dateUtils } from '../../utils/date';

// jQuery Components
import '../expandablearea/expandablearea.jquery';

// Settings and Options
const COMPONENT_NAME = 'monthview';

const COMPONENT_NAME_DEFAULTS = {
  locale: null,
  language: null,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  day: new Date().getDate(),
  activeDate: null,
  activeDateIslamic: null,
  isPopup: false,
  inPage: false,
  inPageTitleAsButton: true,
  inPageToggleable: true,
  inPageExpanded: true,
  headerStyle: 'full',
  firstDayOfWeek: null,
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
  legend: [
    { name: 'Public Holiday', color: 'azure06', dates: [] },
    { name: 'Weekends', color: 'turquoise06', dayOfWeek: [] }
  ],
  hideDays: false, // TODO
  showMonthYearPicker: true,
  yearsAhead: 5,
  yearsBack: 4,
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
  displayRange: {
    start: '', // Start date '03/05/2018'
    end: '', // End date '03/21/2018'
  },
  selectable: true,
  onSelected: null,
  onKeyDown: null,
  showToday: true,
  showNextPrevious: true,
  onChangeView: null,
  isMonthPicker: false
};

/**
 * MonthView - Renders a Month calendar
 * @class MonthView
 * @param {string} element The plugin element for the constuctor
 * @param {object} [settings] The settings element.
 * @param {string} [settings.locale] The name of the locale to use for this instance. If not set the current locale will be used.
 * @param {string} [settings.language] The name of the language to use for this instance. If not set the current locale will be used or the passed locale will be used.
 * @param {number} [settings.month] The month to show.
 * @param {number} [settings.year] The year to show.
 * @param {number} [settings.day] The initial selected day to show.
 * @param {number} [settings.activeDate] The date to highlight as selected/today.
 * @param {number} [settings.activeDateIslamic] The date to highlight as selected/today (as an array for islamic)
 * @param {number} [settings.isPopup] Is it in a popup (datepicker using it)
 * @param {number} [settings.inPage=false] if true, will set it as inPage month view
 * @param {number} [settings.inPageTitleAsButton=true] if true, will set the month-year title as button for inPage
 * @param {number} [settings.inPageToggleable=true] if true, will set to be toggleable
 * @param {number} [settings.inPageExpanded=true] if true, will init as expanded
 * @param {number} [settings.headerStyle] Configure the header, this can be 'simple' or 'full'. Full adds a picker and today link.
 * @param {boolean} [settings.isMonthPicker] Indicates this is a month picker on the month and week view. Has some slight different behavior.
 * @param {number} [settings.firstDayOfWeek=null] Set first day of the week. '1' would be Monday.
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
 * @param {boolean} [settings.hideDays=false] If true the days portion of the calendar will be hidden. Usefull for Month/Year only formats.
 * @param {boolean} [settings.showMonthYearPicker=true] If false the year and month switcher will be disabled.
 * @param {number} [settings.yearsAhead=5] The number of years ahead to show in the month/year picker should total 9 with yearsBack.
 * @param {number} [settings.yearsBack=4] The number of years back to show in the month/year picker should total 9 with yearsAhead.
 * @param {array} [settings.legend]  Legend Build up
 * for example `[{name: 'Public Holiday', color: '#76B051', dates: []},
 * {name: 'Weekends', color: '#EFA836', dayOfWeek: []}]`
 * @param {boolean} [settings.selectable=false] If true the month days can be clicked to select
 * @param {boolean} [settings.onSelected=false] Callback that fires when a month day is clicked.
 * @param {boolean} [settings.onKeyDown=false] Callback that fires when a key is pressed down.
 * @param {boolean} [settings.showToday=true] If true the today button is shown on the header.
 * @param {boolean} [settings.showNextPrevious=true] If true the Next Previous buttons will shown on the header.
 * @param {function} [settings.onChangeView] Call back for when the view changer is changed.
 * @param {string} [settings.attributes] Add extra attributes like id's to the element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
function MonthView(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COMPONENT_NAME_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
MonthView.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    return this.setLocaleThenBuild();
  },

  /**
   * Set current locale to be used
   * @private
   * @returns {void}
   */
  setLocaleThenBuild() {
    const languageDf = Locale.getLocale(this.settings.language);
    const localeDf = Locale.getLocale(this.settings.locale);
    $.when(localeDf, languageDf).done((locale, lang) => {
      this.locale = Locale.cultures[locale] || Locale.currentLocale;
      this.language = lang || this.settings.language || this.locale.language;
      this.settings.language = this.language;
      this.setCurrentCalendar();
      if (this.settings.displayRange.start && this.settings.displayRange.end) {
        this.buildRange().handleEvents();
      } else {
        this.build().handleEvents();
      }
    });
  },

  /**
   * Add any needed markup to the component.
   * @private
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  build() {
    if (this.settings.showMonthYearPicker === 'false') {
      this.settings.showMonthYearPicker = false;
    }
    this.settings.inPage = stringUtils.toBoolean(this.settings.inPage);
    if (this.settings.inPage) {
      const cssClass = `is-inpage${!this.settings.inPageToggleable ? ' not-toggleable' : ''}`;
      this.element.addClass(cssClass);
      this.settings.yearsAhead = 4;
      this.settings.yearsBack = 1;
    }

    this.setCurrentCalendar();

    // Calendar Html in Popups
    this.prevButton = '' +
      `<button type="button" class="btn-icon prev">
        ${$.createIcon('caret-left')}
        <span>${Locale.translate('PreviousMonth', { locale: this.locale.name, language: this.language })}</span>
      </button>`;
    this.nextButton = '' +
      `<button type="button" class="btn-icon next">
        ${$.createIcon('caret-right')}
        <span>${Locale.translate('NextMonth', { locale: this.locale.name, language: this.language })}</span>
      </button>`;

    this.table = $(`<table class="monthview-table" aria-label="${Locale.translate('Calendar', { locale: this.locale.name })}" role="application"></table>`);
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

    this.monthYearPane = $('');

    if (this.settings.showMonthYearPicker && (this.settings.isPopup || this.settings.inPage)) {
      this.monthYearPane = $(`<div class="monthview-monthyear-pane expandable-area ${this.settings.hideDays ? ' is-expanded' : ''}">
        <div class="expandable-pane">
          <div class="content"><div class="picklist-section is-month"></div><div class="picklist-section is-year"></div></div>
        </div>
      </div>`);
    }

    let inPageCalendarPane = '';
    if (this.settings.inPage && this.settings.inPageToggleable) {
      inPageCalendarPane = $(`<div class="monthview-inpage-calendar expandable-area${this.settings.inPageExpanded ? ' is-expanded' : ''}"><div class="expandable-pane"></div></div>`);
      inPageCalendarPane.find('.expandable-pane').append(this.table);
    }

    if (this.settings.hideDays) {
      this.table = '';
    }

    const useElement = this.settings.inPage && this.settings.inPageToggleable && this.table !== '' ? inPageCalendarPane : this.table;

    // Reconfigure the header
    this.header = $('<div class="monthview-header"><div class="calendar-toolbar"></div></div>');
    if (this.settings.headerStyle === 'full') {
      this.monthPicker = this.header.find('#monthview-datepicker-field');
    } else if (this.settings.showToday) {
      this.header.find('.btn-icon.prev').before(`<a class="hyperlink today" href="#">${Locale.translate('Today', { locale: this.locale.name, language: this.language })}</a>`);
    }

    this.showMonth(this.settings.month, this.settings.year);
    this.calendar = this.element.addClass('monthview').append(this.header, this.monthYearPane, useElement);

    if (!(this.settings.isPopup || this.settings.inPage)) {
      this.element.addClass('is-fullsize');
    }

    // Add Legend
    this.addLegend();

    // Invoke the toolbar
    this.calendarToolbarEl = this.header.find('.calendar-toolbar');
    this.calendarToolbarAPI = new CalendarToolbar(this.calendarToolbarEl[0], {
      onOpenCalendar: () => this.currentDate,
      locale: this.settings.locale,
      language: this.settings.language,
      year: this.currentYear,
      month: this.currentMonth,
      showToday: this.settings.showToday,
      showNextPrevious: this.settings.showNextPrevious,
      isMonthPicker: this.settings.headerStyle === 'full',
      isAlternate: this.settings.headerStyle !== 'full',
      isMenuButton: (this.settings.headerStyle !== 'full' || this.settings.inPage) ? this.settings.showMonthYearPicker : false,
      showViewChanger: this.settings.showViewChanger,
      onChangeView: this.settings.onChangeView,
      attributes: this.settings.attributes,
      inPage: this.settings.inPage,
      inPageTitleAsButton: this.settings.inPageTitleAsButton,
    });

    this.handleEvents();
    utils.addAttributes(this.element, this, this.settings.attributes);
    return this;
  },

  /**
   * Add any needed markup to the component.
   * @private
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  buildRange() {
    const dayMilliseconds = 60 * 60 * 24 * 1000;
    const rangeStart = new Date(this.settings.displayRange.start);
    const originalEnd = new Date(this.settings.displayRange.end);
    // add one more day to make the last day inclusive
    const inclusiveEnd = new Date(originalEnd.getTime() + dayMilliseconds);
    const leadDays = dateUtils.firstDayOfWeek(rangeStart);
    const numberOfWeeks = Math.ceil((inclusiveEnd - leadDays) / (7 * dayMilliseconds));
    this.settings.showMonthYearPicker = false;
    this.settings.inPage = stringUtils.toBoolean(this.settings.inPage);
    if (this.settings.inPage) {
      const cssClass = `is-inpage${!this.settings.inPageToggleable ? ' not-toggleable' : ''}`;
      this.element.addClass(cssClass);
      this.settings.yearsAhead = 4;
      this.settings.yearsBack = 1;
    }

    this.setCurrentCalendar();

    this.table = $(`<table class="monthview-table" aria-label="${Locale.translate('Calendar', { locale: this.locale.name })}" role="application"></table>`);

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
    this.day = `
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `;
    this.days = $('' +
      `<tbody>
       ${Array(numberOfWeeks).fill(this.day).join('')}
      </tbody>`).appendTo(this.table);

    this.monthYearPane = $('');

    if (this.settings.showMonthYearPicker && (this.settings.isPopup || this.settings.inPage)) {
      this.monthYearPane = $(`<div class="monthview-monthyear-pane expandable-area ${this.settings.hideDays ? ' is-expanded' : ''}">
        <div class="expandable-pane">
          <div class="content"><div class="picklist-section is-month"></div><div class="picklist-section is-year"></div></div>
        </div>
      </div>`);
    }

    let inPageCalendarPane = '';
    if (this.settings.inPage && this.settings.inPageToggleable) {
      inPageCalendarPane = $(`<div class="monthview-inpage-calendar expandable-area${this.settings.inPageExpanded ? ' is-expanded' : ''}"><div class="expandable-pane"></div></div>`);
      inPageCalendarPane.find('.expandable-pane').append(this.table);
    }

    if (this.settings.hideDays) {
      this.table = '';
    }

    const useElement = this.settings.inPage && this.settings.inPageToggleable && this.table !== '' ? inPageCalendarPane : this.table;

    // Reconfigure the header
    this.header = $('<div class="monthview-header"><div class="calendar-toolbar"></div></div>');
    this.header.addClass('hidden');

    this.showRange(this.settings.displayRange.start, this.settings.displayRange.end);
    this.calendar = this.element.addClass('monthview').append(this.header, this.monthYearPane, useElement);

    if (!(this.settings.isPopup || this.settings.inPage)) {
      this.element.addClass('is-fullsize');
    }

    // Add Legend
    this.addLegend();

    // Invoke the toolbar
    this.calendarToolbarEl = this.header.find('.calendar-toolbar');
    this.calendarToolbarAPI = new CalendarToolbar(this.calendarToolbarEl[0], {
      onOpenCalendar: () => this.currentDate,
      locale: this.settings.locale,
      language: this.settings.language,
      year: this.currentYear,
      month: this.currentMonth,
      showToday: this.settings.showToday,
      showNextPrevious: this.settings.showNextPrevious,
      isMonthPicker: this.settings.headerStyle === 'full',
      isAlternate: this.settings.headerStyle !== 'full',
      isMenuButton: (this.settings.headerStyle !== 'full' || this.settings.inPage) ? this.settings.showMonthYearPicker : false,
      showViewChanger: this.settings.showViewChanger,
      onChangeView: this.settings.onChangeView,
      attributes: this.settings.attributes,
      inPage: this.settings.inPage,
      inPageTitleAsButton: this.settings.inPageTitleAsButton,
    });

    this.handleEvents();
    utils.addAttributes(this.element, this, this.settings.attributes);
    return this;
  },

  /**
   * Set current calendar
   * @private
   * @returns {void}
   */
  setCurrentCalendar() {
    this.currentCalendar = Locale.calendar(
      this.locale.name,
      this.language,
      this.settings.calendarName
    );
    this.isIslamic = this.currentCalendar.name === 'islamic-umalqura';
    this.isRTL = (this.locale.direction || this.locale.data.direction) === 'right-to-left';
    this.conversions = this.currentCalendar.conversions;
  },

  /**
   * Set month year value selected from pane
   * @returns {void}
   */
  setMonthYearFromPane() {
    const year = parseInt(this.monthYearPane.find('.is-year .is-selected a').attr('data-year'), 10);
    const month = parseInt(this.monthYearPane.find('.is-month .is-selected a').attr('data-month'), 10);
    if (!isNaN(month) && !isNaN(year)) {
      this.showMonth(month, year);
    }
    this.monthYearPane.data('expandablearea').close();
  },

  /**
   * Update the calendar to show the given month and year
   * @param {number} month The zero based month to display
   * @param {number} year The year to display
   * @returns {void}
   */
  showMonth(month, year) {
    const self = this;
    const s = this.settings;
    const now = new Date();

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    let elementDate;
    if (this.isIslamic) {
      elementDate = s.activeDate || Locale.gregorianToUmalqura(now);
    } else {
      elementDate = (s.activeDate && s.activeDate.getDate()) ? s.activeDate : now;
    }
    this.setCurrentCalendar();

    if (this.isIslamic) {
      if (!s.activeDateIslamic) {
        const gregorianDate = new Date(year, month, this.currentDay || this.settings.day);
        const islamicDate = Locale.gregorianToUmalqura(gregorianDate);
        this.todayDateIslamic = Locale.gregorianToUmalqura(now);
        s.activeDateIslamic = [];
        s.activeDateIslamic[0] = islamicDate[0];
        s.activeDateIslamic[1] = islamicDate[1];
        s.activeDateIslamic[2] = islamicDate[2];
        year = islamicDate[0];
        month = islamicDate[1];
        elementDate = islamicDate;
        this.currentDay = islamicDate[2];
      } else {
        elementDate = s.activeDateIslamic;
      }
    }

    if (year.toString().length < 4) {
      year = new Date().getFullYear();
    }

    if (month === 12) {
      year++;
      month = 0;
      this.currentMonth = month;
      this.currentYear = year;
      this.currentDate.setFullYear(year);
      this.currentDate.setMonth(month);
    }

    if (month < 0) {
      year--;
      month = 11;
      this.currentMonth = month;
      this.currentYear = year;
      this.currentDate.setFullYear(year);
      this.currentDate.setMonth(month);
    }

    this.currentDay = this.currentDay || this.settings.day;
    if (!this.currentCalendar || !this.currentCalendar.days) {
      this.currentCalendar = Locale.calendar(
        this.locale.name,
        this.language,
        this.settings.calendarName
      );
    }

    let days = this.currentCalendar.days.narrow;
    days = days || this.currentCalendar.days.abbreviated;

    if (!(s.isPopup || s.inPage)) {
      days = this.currentCalendar.days.abbreviated;
    }
    const monthName = this.currentCalendar.months.wide[month];

    this.currentMonth = month;
    this.currentYear = year;

    // Set the Days of the week
    let firstDayofWeek = (this.currentCalendar.firstDayofWeek || 0);

    if (s.firstDayOfWeek) {
      firstDayofWeek = s.firstDayOfWeek;
    }

    this.dayNames.find('th').each(function (i) {
      $(this).text(days[(i + firstDayofWeek) % 7]);
    });

    // Localize Month Name
    this.yearFirst = this.currentCalendar.dateFormat.year && this.currentCalendar.dateFormat.year.substr(1, 1) === 'y';
    this.header.find('.month').attr('data-month', month).text(`${xssUtils.stripTags(monthName)} `);
    this.header.find('.year').text(` ${year}`);

    if (this.yearFirst && !this.isIslamic && !this.isRTL) {
      elementDate.setFullYear(year);
      const translation = Locale.formatDate(elementDate, { date: 'year', locale: this.locale.name });
      const justYear = translation.split(' ')[0];

      this.header.find('.year').text(`${justYear} `);
      this.header.find('.year').insertBefore(this.header.find('.month'));
    }

    if (s.headerStyle === 'full' && this.calendarToolbarAPI) {
      this.calendarToolbarAPI.setInternalDate(this.isIslamic ?
        [year, month, 1] : new Date(year, month, 1));
    }

    this.appendMonthYearPicker(month, year);

    // Adjust days of the week
    // lead days
    const firstDayOfMonth = this.firstDayOfMonth(year, month);
    const leadDays = ((firstDayOfMonth - firstDayofWeek) + 7) % 7;
    const lastMonthDays = this.daysInMonth(year, month + (this.isIslamic ? 1 : 0));
    const thisMonthDays = this.daysInMonth(year, month + (this.isIslamic ? 0 : 1));
    let nextMonthDayCnt = 1;
    let dayCnt = 1;
    let exYear;
    let exMonth;
    let exDay;
    let foundSelected = false;

    // Set selected state
    const setSelected = (el, isFound) => {
      foundSelected = isFound;
      el.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true').attr('tabindex', '0');
    };

    this.dayMap = [];
    this.days.find('td').each(function (i) {
      const th = $(this).removeClass('alternate prev-month next-month is-selected range is-today');
      const isRippleClass = s.inPage ? ' is-ripple' : '';
      th.removeAttr('aria-selected');
      th.removeAttr('tabindex');

      if (i < leadDays) {
        exDay = (lastMonthDays - leadDays) + 1 + i;
        exMonth = (month === 0) ? 11 : month - 1;
        exYear = (month === 0) ? year - 1 : year;

        self.setDisabled(th, exYear, exMonth, exDay);
        self.setLegendColor(th, exYear, exMonth, exDay);
        self.dayMap.push({ key: stringUtils.padDate(exYear, exMonth, exDay), elem: th });
        th.addClass('alternate prev-month').html(`<span class="day-container${isRippleClass}"><span aria-hidden="true" class="day-text">${xssUtils.stripTags(exDay)}</span></span>`);
        th.attr('data-key', stringUtils.padDate(exYear, exMonth, exDay));
      }

      if (i >= leadDays && dayCnt <= thisMonthDays) {
        self.dayMap.push({ key: stringUtils.padDate(year, month, dayCnt), elem: th });
        th.html(`<span class="day-container${isRippleClass}"><span aria-hidden="true" class="day-text">${xssUtils.stripTags(dayCnt)}</span></span>`);
        th.attr('data-key', stringUtils.padDate(year, month, dayCnt));

        // Add Selected Class to Selected Date
        if (self.isIslamic) {
          if (dayCnt === elementDate[2]) {
            setSelected(th, true);
          }
        } else {
          const tHours = elementDate.getHours();
          const tMinutes = elementDate.getMinutes();
          const tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;
          const setHours = el => (el ? el.setHours(tHours, tMinutes, tSeconds, 0) : 0);

          const newDate = setHours(new Date(year, month, dayCnt));
          const comparisonDate = self.currentDate || elementDate;
          if (newDate === setHours(comparisonDate)) {
            setSelected(th, true);
          }
        }

        if (dayCnt === self.todayDay &&
            self.currentMonth === self.todayMonth &&
            self.currentYear === self.todayYear
        ) {
          th.addClass('is-today');
        }

        th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), {
          date: 'full',
          locale: self.locale.name
        }));
        const startKey = stringUtils.padDate(
          self.currentYear,
          self.currentMonth,
          dayCnt
        );
        th.attr('data-key', startKey);

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

        self.dayMap.push({ key: stringUtils.padDate(exYear, exMonth, exDay), elem: th });
        self.setDisabled(th, exYear, exMonth, exDay);
        self.setLegendColor(th, exYear, exMonth, exDay);

        th.addClass('alternate next-month').html(`<span class="day-container${isRippleClass}"><span aria-hidden="true" class="day-text">${nextMonthDayCnt}</span></span>`);
        th.attr('data-key', stringUtils.padDate(exYear, exMonth, exDay));
        nextMonthDayCnt++;
      }
    });

    if (!foundSelected && !s.range.useRange) {
      const firstDay = self.dayMap.filter(d => d.key === stringUtils.padDate(
        year,
        month,
        this.settings.day
      ));
      if (firstDay.length) {
        setSelected(firstDay[0].elem, false);
      }
    }

    // Hide 6th Row if all disabled
    const row = this.days.find('tr').eq(5);
    if (row.find('td.alternate').length === 7) {
      row.hide();
    } else {
      row.show();
    }

    if (!this.currentDate) {
      if (this.isIslamic) {
        this.currentDateIslamic = [this.currentYear, this.currentMonth, this.currentDay];
        this.currentDate = Locale.umalquraToGregorian(
          this.currentYear,
          this.currentMonth,
          this.currentDay
        );
      } else {
        this.currentDate = new Date(this.currentYear, this.currentMonth, this.currentDay);
      }
    }

    this.setRangeSelection();
    this.validatePrevNext();

    // Allow focus on the same day as last month
    if (!s.range.useRange && this.element.find('td.is-selected').length === 0) {
      this.element.find('td[tabindex]').removeAttr('tabindex');
      this.element
        .find('td:not(.alternate) .day-text')
        .first()
        .closest('td')
        .attr('tabindex', '0');
    }

    /**
    * Fires as the calendar popup is opened.
    * @event monthrendered
    * @memberof MonthView
    * @property {object} event - The jquery event object
    * @property {object} args - The event arguments
    * @property {number} args.year - The rendered year
    * @property {object} args.elem - The DOM object
    * @property {object} args.api - The MonthView api
    */
    this.element.trigger('monthrendered', { year, month, elem: this.element, api: this });
  },

  /**
   * Update the calendar to show the given range
   * @param {string} rangeStart The start of the range
   * @param {string} rangeEnd The end of the range
   * @returns {void}
   */
  showRange(rangeStart, rangeEnd) {
    const self = this;
    const now = new Date();
    const startDate = new Date(rangeStart);
    const endDate = new Date(rangeEnd);
    let month = parseInt(startDate.getMonth(), 10);
    let year = parseInt(startDate.getFullYear(), 10);
    const monthDifference = dateUtils.monthDiff(startDate, endDate);
    const s = this.settings;

    // if disable dates not provided, disable dates outside of the range by default
    if (!s.disable.minDate && !s.disable.MaxDate) {
      s.disable.minDate = dateUtils.subtract(startDate, 1, 'days').toISOString();
      s.disable.maxDate = dateUtils.add(endDate, 1, 'days').toISOString();
    }

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    let elementDate;
    if (this.isIslamic) {
      elementDate = s.activeDate || Locale.gregorianToUmalqura(now);
    } else {
      elementDate = (s.activeDate && s.activeDate.getDate()) ? s.activeDate : now;
    }
    this.setCurrentCalendar();

    if (this.isIslamic) {
      if (!s.activeDateIslamic) {
        const gregorianDate = new Date(year, month, this.currentDay || this.settings.day);
        const islamicDate = Locale.gregorianToUmalqura(gregorianDate);
        this.todayDateIslamic = Locale.gregorianToUmalqura(now);
        s.activeDateIslamic = [];
        s.activeDateIslamic[0] = islamicDate[0];
        s.activeDateIslamic[1] = islamicDate[1];
        s.activeDateIslamic[2] = islamicDate[2];
        year = islamicDate[0];
        month = islamicDate[1];
        elementDate = islamicDate;
        this.currentDay = islamicDate[2];
      } else {
        elementDate = s.activeDateIslamic;
      }
    }

    if (year.toString().length < 4) {
      year = new Date().getFullYear();
    }

    if (!this.currentCalendar || !this.currentCalendar.days) {
      this.currentCalendar = Locale.calendar(
        this.locale.name,
        this.language,
        this.settings.calendarName
      );
    }

    let days = this.currentCalendar.days.narrow;
    days = days || this.currentCalendar.days.abbreviated;

    // Set the Days of the week
    let firstDayofWeek = (this.currentCalendar.firstDayofWeek || 0);

    if (s.firstDayOfWeek) {
      firstDayofWeek = s.firstDayOfWeek;
    }

    this.dayNames.find('th').each(function (i) {
      $(this).text(days[(i + firstDayofWeek) % 7]);
    });

    // Adjust days of the week
    // lead days
    const leadDays = dateUtils.firstDayOfWeek(startDate).getDate();
    let dayCnt = leadDays;
    let foundSelected = false;

    // get the number of days in each month for the given range
    let rangeCurrentMonth = month;
    let rangeCurrentYear = year;
    let rangeMonth = month;
    let rangeYear = year;
    const monthDaysMap = {};
    for (let i = 0; i <= monthDifference; i++) {
      rangeMonth = month + i;
      if (rangeMonth > 11) {
        rangeYear += 1;
        rangeMonth = 0;
      }
      monthDaysMap[rangeMonth] = this.daysInMonth(rangeYear, rangeMonth + (this.isIslamic ? 0 : 1));
    }

    // Set selected state
    const setSelected = (el, isFound) => {
      foundSelected = isFound;
      el.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true').attr('tabindex', '0');
    };

    let thisMonthDays = monthDaysMap[rangeCurrentMonth];
    this.dayMap = [];
    this.days.find('td').each(function () {
      // starting index should start from first day of the week that the start date is in
      const th = $(this).removeClass('alternate prev-month next-month is-selected range is-today');
      const isRippleClass = s.inPage ? ' is-ripple' : '';
      th.removeAttr('aria-selected');
      th.removeAttr('tabindex');

      // Add Selected Class to Selected Date
      if (self.isIslamic) {
        if (dayCnt === elementDate[2]) {
          setSelected(th, true);
        }
      } else {
        const tHours = elementDate.getHours();
        const tMinutes = elementDate.getMinutes();
        const tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;
        const setHours = el => (el ? el.setHours(tHours, tMinutes, tSeconds, 0) : 0);

        const newDate = setHours(new Date(year, month, dayCnt));
        const comparisonDate = self.currentDate || elementDate;
        if (newDate === setHours(comparisonDate)) {
          setSelected(th, true);
        }
      }

      if (dayCnt > thisMonthDays) {
        rangeCurrentMonth++;
        if (rangeCurrentMonth > 11) {
          rangeCurrentMonth = 0;
          rangeCurrentYear++;
        }
        thisMonthDays = monthDaysMap[rangeCurrentMonth];
        dayCnt = 1;
      }

      if (dayCnt === self.todayDay &&
        rangeCurrentMonth === self.todayMonth &&
        rangeCurrentYear === self.todayYear
      ) {
        th.addClass('is-today');
      }

      self.dayMap.push({ key: stringUtils.padDate(rangeCurrentYear, rangeCurrentMonth, dayCnt), elem: th });
      th.html(`<span class="day-container${isRippleClass}"><span aria-hidden="true" class="day-text">${xssUtils.stripTags(dayCnt)}</span></span>`);
      th.attr('data-key', stringUtils.padDate(rangeCurrentYear, rangeCurrentMonth, dayCnt));

      // Add Selected Class to Selected Date
      if (self.isIslamic) {
        if (dayCnt === elementDate[2]) {
          setSelected(th, true);
        }
      } else {
        const tHours = elementDate.getHours();
        const tMinutes = elementDate.getMinutes();
        const tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;
        const setHours = el => (el ? el.setHours(tHours, tMinutes, tSeconds, 0) : 0);

        const newDate = setHours(new Date(rangeYear, rangeMonth, dayCnt));
        const comparisonDate = self.currentDate || elementDate;
        if (newDate === setHours(comparisonDate)) {
          setSelected(th, true);
        }
      }

      if (dayCnt === self.todayDay &&
          rangeCurrentMonth === self.todayMonth &&
          rangeCurrentYear === self.todayYear
      ) {
        th.addClass('is-today');
      }

      th.attr('aria-label', Locale.formatDate(new Date(rangeCurrentYear, rangeCurrentMonth, dayCnt), {
        date: 'full',
        locale: self.locale.name
      }));
      const startKey = stringUtils.padDate(
        rangeCurrentYear,
        rangeCurrentMonth,
        dayCnt
      );
      th.attr('data-key', startKey);

      self.setDisabled(th, rangeCurrentYear, rangeCurrentMonth, dayCnt);
      self.setLegendColor(th, rangeCurrentYear, rangeCurrentMonth, dayCnt);
      self.setMonthLabel(th, rangeCurrentYear, rangeCurrentMonth, dayCnt, startDate);
      th.attr('role', 'link');
      dayCnt++;
    });

    if (!foundSelected) {
      const today = self.dayMap.filter(d => d.key === stringUtils.padDate(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ));
      if (today.length) {
        setSelected(today[0].elem, false);
      }
    }

    /**
    * Fires as the calendar popup is opened.
    * @event rangerendered
    * @memberof MonthView
    * @property {object} event - The jquery event object
    * @property {object} args - The event arguments
    * @property {number} args.year - The rendered year
    * @property {object} args.elem - The DOM object
    * @property {object} args.api - The MonthView api
    */
    this.element.trigger('rangerendered', { year, month, elem: this.element, api: this });
  },

  /**
    * Get a unqiue and comparable time from the date.
    * @param  {date|Array} date The arabic array or date
    * @param  {boolean} zeroMinutes set the minutes part to zero
    * @returns {string} comparable time string
    */
  getTime(date, zeroMinutes) {
    if (this.isIslamic) {
      return date[0] + `0${date[1]}`.slice(-2) + `0${date[2]}`.slice(-2);
    }

    if (zeroMinutes) {
      const d = new Date(date);
      d.setHours(0, 0, 0);
      return d.getTime();
    }
    return date.getTime();
  },

  /**
   * Set range selection
   * @private
   * @returns {void}
   */
  setRangeSelection() {
    if (this.settings.range.useRange) {
      const range = {};
      range.date = new Date(this.currentYear, this.currentMonth, 1);
      range.date.setDate(range.date.getDate() - (this.days.find('.prev-month:visible').length + 1));
      const key = stringUtils.padDate(range.date.year ||
        range.date[0], range.date.month ||
        range.date[1], range.date.day || range.date[2]);
      range.cell = this.days.find(`[data-key="${key}"]`);

      this.setRangeOnCell(this.settings.range.second ? false : range.cell);
    }
  },

  /**
   * Append month year picker
   * @private
   * @param {number} month The month to show in the picker
   * @param {number} year The year to show in the picker
   * @returns {void}
   */
  appendMonthYearPicker(month, year) {
    const self = this;

    if (!this.settings.showMonthYearPicker) {
      return;
    }

    let monthList = '<ul class="picklist is-month">';
    const isRippleClass = this.settings.inPage ? ' class="is-ripple"' : '';

    const wideMonths = this.currentCalendar.months.wide;

    if (this.settings.inPage) {
      monthList += `<li class="picklist-item up"><a href="#" tabindex="0"${isRippleClass}><span class="audible">${Locale.translate('PreviousMonth')}</span><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-up"></use></svg></a></li>`;

      const maxMonthsInList = 6; // number of months: (12 / 2 = 6)
      const monthAddition = month < maxMonthsInList ? 0 : maxMonthsInList;
      for (let i = 0; i < maxMonthsInList; i++) {
        const idx = i + monthAddition;
        const monthMap = wideMonths[idx];
        monthList += `<li class="picklist-item${(idx === month ? ' is-selected ' : '')}"><a href="#" tabindex="${idx === month ? '0' : '-1'}" data-month="${idx}"${isRippleClass}>${monthMap}</a></li>`;
      }

      monthList += `<li class="picklist-item down"><a tabindex="0"${isRippleClass}><span class="audible">${Locale.translate('NextMonth')}</span><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-down"></use></svg></a></li>`;
    } else {
      wideMonths.map(function (monthMap, i) { // eslint-disable-line
        monthList += `<li class="picklist-item${(i === month ? ' is-selected ' : '')}"><a href="#" tabindex="${i === month ? '0' : '-1'}" data-month="${i}"${isRippleClass}>${monthMap}</a></li>`;
      });
    }

    monthList += '</ul>';

    this.monthYearPane.find('.picklist-section.is-month').empty().append(monthList);
    const years = [];
    let yearList = '<ul class="picklist is-year">';
    yearList += `<li class="picklist-item up"><a href="#" tabindex="0"${isRippleClass}><span class="audible">${Locale.translate('PreviousYear')}</span><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-up"></use></svg></a></li>`;

    for (let i = this.settings.yearsBack; i >= 1; i--) {
      years.push(parseInt(year, 10) - i);
    }
    years.push(year);
    for (let j = 1; j <= this.settings.yearsAhead; j++) {
      years.push(parseInt(year, 10) + j);
    }

    // eslint-disable-next-line
    years.map(function (yearMap) {
      yearList += `<li class="picklist-item${(year === yearMap ? ' is-selected ' : '')}"><a href="#" tabindex="${year === yearMap ? '0' : '-1'}" data-year="${yearMap}"${isRippleClass}>${yearMap}</a></li>`;
    });
    yearList += `<li class="picklist-item down"><a tabindex="0"${isRippleClass}><span class="audible">${Locale.translate('NextYear')}</span><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-down"></use></svg></a></li>`;
    yearList += '</ul>';

    this.monthYearPane.find('.picklist-section.is-year').empty().append(yearList);
    if (this.yearFirst) {
      this.monthYearPane.addClass('is-yearfirst');
    }

    utils.addAttributes(this.monthYearPane.find('.picklist-section.is-year .picklist-item.up a'), this, this.settings.attributes, 'btn-picklist-year-up');
    utils.addAttributes(this.monthYearPane.find('.picklist-section.is-year .picklist-item.down a'), this, this.settings.attributes, 'btn-picklist-year-down');

    if (this.settings.inPage) {
      // utils.addAttributes(this.popup.find('.btn-monthyear-pane'), this, this.settings.attributes, 'btn-monthyear');
      utils.addAttributes(this.monthYearPane.find('.btn-inpage-cal'), this, this.settings.attributes, 'btn-inpage-cal');
      utils.addAttributes(this.monthYearPane.find('.btn-cal-month-year'), this, this.settings.attributes, 'btn-cal-month-year');
      utils.addAttributes(this.monthYearPane.find('.btn-monthyear-pane'), this, this.settings.attributes, 'btn-monthyear');
      utils.addAttributes(this.monthYearPane.find('.apply'), this, this.settings.attributes, 'btn-apply');
      utils.addAttributes(this.monthYearPane.find('.picklist-section.is-month .picklist-item.up a'), this, this.settings.attributes, 'btn-picklist-month-up');
      utils.addAttributes(this.monthYearPane.find('.picklist-section.is-month .picklist-item.down a'), this, this.settings.attributes, 'btn-picklist-month-down');
    }

    this.monthYearPane.find('.is-year .picklist-item').not('.up, .down').each(function () {
      const elem = $(this).find('a');
      utils.addAttributes(elem, self, self.settings.attributes, `btn-picklist-${elem.text().toLowerCase()}`);
    });

    this.monthYearPane.find('.is-month .picklist-item').not('.up, .down').each(function (i) {
      utils.addAttributes($(this).find('a'), self, self.settings.attributes, `btn-picklist-${i}`);
    });
  },

  /**
   * Find first day of the week for a given month
   * @private
   * @param {number} year The year to use with the month
   * @param {number} month The month to find the first day for
   * @returns {number} day
   */
  firstDayOfMonth(year, month) {
    if (this.isIslamic) {
      const firstDay = Locale.umalquraToGregorian(year, month, 1);
      return (firstDay === null ? 1 : firstDay.getDay());
    }
    return (new Date(year, month, 1)).getDay();
  },

  /**
   * Find the date of the Month (29, 30, 31 ect)
   * @private
   * @param {number} year The year to use with the month
   * @param {number} month The month to find the days in month for
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
   * Get the islamic year index
   * @private
   * @param {number} islamicYear Year to test.
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
   * Set disable Date
   * @private
   * @param {object} elem Node element to set.
   * @param {string} year to check.
   * @param {string} month to check.
   * @param {string} date to check.
   * @returns {void}
   */
  setDisabled(elem, year, month, date) {
    const s = this.settings;
    function makeDisable() {
      elem
        .addClass('is-disabled').attr('aria-disabled', 'true')
        .removeClass('is-selected range').removeAttr('aria-selected');
    }

    // Reset
    elem.removeClass('is-disabled').removeAttr('aria-disabled');

    if (typeof s.disable.callback === 'function') {
      $.when(this.isDateDisabled(year, month, date)).then((dateIsDisabled) => {
        if (dateIsDisabled) {
          makeDisable();
        }
      });
    } else {
      const dateIsDisabled = this.isDateDisabled(year, month, date);
      if ((dateIsDisabled && !s.disable.isEnable) ||
        (!dateIsDisabled && s.disable.isEnable)) {
        makeDisable();
      }
    }
  },

  /**
   * Set month label on first enabled date of each month
   * @private
   * @param {object} elem Node element to set.
   * @param {string} year to check.
   * @param {string} month to check.
   * @param {string} date to check.
   * @param {array} startDate to check.
   * @returns {void}
   */
  setMonthLabel(elem, year, month, date, startDate) {
    const s = this.settings;
    const isRippleClass = s.inPage ? ' class="is-ripple"' : '';
    let minDate;
    // starts labeling month from the first enabled date
    let labelStartDate;
    if (s.disable.minDate) {
      minDate = new Date(s.disable.minDate);
      labelStartDate = new Date(minDate.getTime() + 60 * 60 * 24 * 1000);
    } else {
      labelStartDate = dateUtils.firstDayOfWeek(startDate);
    }
    const dateIsDisabled = this.isDateDisabled(year, month, date);
    if (!dateIsDisabled &&
        (month === startDate.getMonth() && labelStartDate && labelStartDate.getDate() === date || date === 1) ||
      (!s.disable.minDate && (month === labelStartDate.getMonth() && labelStartDate.getDate() === date))) {
      const dateText = elem.text();
      elem
        .html(`<span class="day-container${isRippleClass}"><span aria-hidden="true" class="day-text month-label">${this.currentCalendar.months.wide[month]} ${dateText}</span></span>`);
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
    if (typeof s.disable.callback === 'function') {
      const deferred = $.Deferred();
      $.when(s.disable.callback(year, month, date)).then((results) => {
        deferred.resolve(results);
      });
      return deferred.promise();
    }
    const min = (new Date(s.disable.minDate)).setHours(0, 0, 0, 0);
    const max = (new Date(s.disable.maxDate)).setHours(0, 0, 0, 0);
    let d2 = this.isIslamic ?
      Locale.umalquraToGregorian(year, month, date) : new Date(year, month, date);

    if (!d2) {
      return false;
    }

    // dayOfWeek
    if (s.disable.dayOfWeek.indexOf(d2.getDay()) !== -1) {
      return true;
    }

    const thisYear = d2.getFullYear();

    d2 = d2.setHours(0, 0, 0, 0);

    // min and max
    if ((d2 <= min) || (d2 >= max)) {
      return true;
    }

    // years
    if (/string|number/.test(typeof s.disable.years)) {
      s.disable.years = [s.disable.years];
    }
    for (let i = 0, l = s.disable.years.length; i < l; i++) {
      if (thisYear === Number(s.disable.years[i])) {
        return true;
      }
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
   * Get array of dates between two dates
   * @private
   * @param {object} startDate .
   * @param {object} endDate .
   * @param {boolean} includeDisabled .
   * @returns {array} dates between two dates
   */
  getDateRange(startDate, endDate, includeDisabled) {
    const dates = [];
    const current = this.isIslamic ? [...startDate] : new Date(startDate);

    includeDisabled = typeof includeDisabled !== 'undefined' ? includeDisabled : this.settings.range.includeDisabled;

    while (this.getTime(endDate) >= this.getTime(current)) {
      if (includeDisabled || (!includeDisabled &&
        !this.isDateDisabled(
          this.isIslamic ? current[0] : current.getFullYear(),
          this.isIslamic ? current[1] : current.getMonth(),
          this.isIslamic ? current[2] : current.getDate()
        ))) {
        if (this.isIslamic) {
          dates.push(current);
        } else {
          dates.push(new Date(current));
        }
      }
      if (this.isIslamic) {
        current[2] += 1;
      } else {
        current.setDate(current.getDate() + 1);
      }
    }
    return dates;
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

    const self = this;

    // Set inPage target element
    const el = this.settings.inPage ? elem.find('.day-text') : elem;
    if (!el[0]) {
      return;
    }

    let hex = this.getLegendColor(year, month, date);
    el[0].style.backgroundColor = '';
    el.off('mouseenter.legend mouseleave.legend');

    if (hex) {
      if (hex.indexOf('#') === -1) {
        const name = hex.replace(/[0-9]/g, '');
        const number = hex.substr(hex.length - 2, 2) * 10;
        hex = theme.themeColors().palette[name][number].value;
      }
      // set color on elem at .3 of provided color as per design
      const normalColor = colorUtils.hexToRgba(hex, 0.3);
      const hoverColor = colorUtils.hexToRgba(hex, 0.7);
      const th = this.table[0]?.querySelector('thead th');

      elem.addClass('is-colored');
      el[0].setAttribute('data-hex', hex);
      if (self.settings.inPage) {
        el[0].style.setProperty('--legendcolor', normalColor);
      } else {
        el[0].style.backgroundColor = normalColor;
      }

      // handle hover states
      el.on('mouseenter.legend', function () {
        const thisElem = $(this);
        const span = thisElem.find('span')[0];
        const dayText = thisElem.find('.day-text')[0];
        const textColor = window.getComputedStyle(th).getPropertyValue('color');

        this.style.backgroundColor = hoverColor;

        if (self.settings.inPage) {
          this.style.color = textColor;
        }
        if (span) {
          span.style.backgroundColor = 'transparent';
        }
        if (dayText) {
          dayText.style.backgroundColor = 'transparent';
        }
      }).on('mouseleave.legend', function () {
        const thisElem = $(this);
        const span = thisElem.find('span')[0];
        const dayText = thisElem.find('.day-text')[0];

        if (self.settings.inPage) {
          this.style.color = '';
          this.style.backgroundColor = '';
        } else {
          this.style.backgroundColor = normalColor;
        }
        if (span) {
          span.style.backgroundColor = '';
        }
        if (dayText) {
          dayText.style.backgroundColor = '';
        }
      });
    }
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
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;
    const s = this.settings;

    this.element.off(`updated.${COMPONENT_NAME}`).on(`updated.${COMPONENT_NAME}`, () => {
      this.updated();
    });

    // Change Month Events
    this.header.off('click.monthview').on('click.monthview', '.btn-icon.prev, .btn-icon.next', function () {
      const isNext = $(this).is('.next');
      const range = {};
      const d = { month: self.currentMonth, year: self.currentYear };

      if (s.range.useRange) {
        if (isNext) {
          range.date = new Date(d.year, (d.month + 1), (self.element.find('.next-month:visible').length + 1));
        } else {
          range.date = new Date(d.year, d.month, 1);
          range.date.setDate(range.date.getDate() - (self.days.find('.prev-month:visible').length + 1));
        }
        d.month += isNext ? 1 : -1;
      } else {
        self.currentMonth += isNext ? 1 : -1;
        self.currentDate.setMonth(self.currentMonth);
        self.currentYear = parseInt(self.element[0].querySelector('span.year').innerText, 10);
        self.currentDate.setFullYear(self.currentYear);
        d.month = self.currentMonth;
        d.year = self.currentYear;
      }
      self.showMonth(d.month, d.year);

      if (s.range.useRange) {
        range.formatedDate = Locale.formatDate(range.date, { date: 'full', locale: self.locale.name });
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

      this.days
        .off('mouseover.datepicker')
        .on('mouseover.datepicker', 'td', function () {
          self.setRangeOnCell(this);
        });
    }

    if (this.calendarToolbarEl) {
      this.calendarToolbarEl.off('change-date.monthview').on('change-date.monthview', (e, args) => {
        if (args.isToday && this.settings.isPopup) {
          return;
        }
        if (args.isApply) {
          this.setMonthYearFromPane();
          return;
        }
        if (args.isToday) {
          this.setToday();
          return;
        }
        this.selectDay(args.selectedDate, false, true);
      });
    }

    // Allow dates to be selected
    if (s.selectable) {
      this.element
        .addClass('is-selectable')
        .off('click.monthview-day')
        .on('click.monthview-day', 'td', (e) => {
          const key = e.currentTarget.getAttribute('data-key');
          this.lastClickedKey = key;

          if (e.currentTarget.classList.contains('is-disabled')) {
            return;
          }
          this.selectDay(key, false, true);
        });
    }

    // Inpage actions
    if (s.inPage) {
      // Set expandable area for calendar table
      const inPageCalendarEl = this.element.find('.monthview-inpage-calendar');
      inPageCalendarEl.expandablearea({
        animationSpeed: 150,
        trigger: this.element.find(s.showMonthYearPicker ? '#btn-inpage-cal' : '#btn-cal-month-year')
      });
      const calExpandableareaApi = inPageCalendarEl.data('expandablearea');

      // Set expandable area for month year picker
      if (s.showMonthYearPicker) {
        const monthyearPane = this.element.find('.monthview-monthyear-pane');
        monthyearPane.expandablearea({
          animationSpeed: 150,
          trigger: this.element.find('#btn-monthyear-pane')
        }).on('beforeexpand', () => {
          const isStatic = calExpandableareaApi && !calExpandableareaApi.isExpanded();
          monthyearPane.css('position', isStatic ? 'static' : '');
        });
      }

      // Set the ripple effect to each date click
      this.element
        .off('click.monthview-ripple')
        .on('click.monthview-ripple', '.is-ripple', function (evt) {
          self.setRipple(this, evt);
        });
    }

    this.handleMonthYearPane().handleKeys();
    return this;
  },

  /**
   * set ripple effect on given element
   * https://codepen.io/jakob-e/pen/XZoZWQ
   * @private
   * @param {object} el The element.
   * @param {object|null} evt The optional jquery event.
   * @returns {void}
   */
  setRipple(el, evt) {
    if (!el || !el.classList?.contains('is-ripple')) {
      return;
    }
    const e = evt.touches ? evt.touches[0] : evt;
    const r = el.getBoundingClientRect();
    const d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2;
    const x = e.clientX ? (e.clientX - r.left) : (el.offsetWidth / 2);
    const y = e.clientY ? (e.clientY - r.top) : (el.offsetHeight / 2);
    const orig = el.style.cssText;

    // legend colors
    const hex = el.getAttribute('data-hex');
    const contrast = colorUtils.getContrastColor(hex);
    const bg = {
      ripple: colorUtils.getLuminousColorShade(hex, contrast === 'white' ? '0.3' : '-0.3'),
      elem: colorUtils.hexToRgba(hex, 0.7)
    };
    const legendColor = hex !== null ? `--ripple-background: ${bg.ripple}; background-color: ${bg.elem}; ` : '';

    el.style.cssText = `${legendColor}--s: 0; --o: 1`;
    el.offsetTop; // eslint-disable-line
    el.style.cssText = `${legendColor}--t: 1; --o: 0; --d: ${d}; --x:${x}; --y:${y};`;

    // reset
    $(el).off('transitionend.monthview-ripple').on('transitionend.monthview-ripple', (event) => {
      const prop = event.propertyName || event.originalEvent?.propertyName;
      if (prop === 'transform') {
        el.style.cssText = orig;
      }
    });
  },

  /**
   * Handle events and keys on the month year pane
   * @private
   * @returns {object} The component for chaining.
   */
  handleMonthYearPane() {
    const s = this.settings;
    const isRippleClass = s.inPage ? ' class="is-ripple"' : '';

    const appendMonth = (upDown) => {
      const monthContainer = this.monthYearPane[0].querySelector('.picklist.is-month');
      const wideMonths = this.currentCalendar.months.wide;
      const monthList = monthContainer.children;
      const monthLen = monthList.length - 2;
      const month = monthList[(upDown === 'up' ? 1 : monthLen)].querySelector('a').getAttribute('data-month');
      DOM.remove(monthList[(upDown === 'up' ? monthLen : 1)]);
      const monthContainerJQ = $(monthContainer);

      monthContainerJQ.find('.picklist-item').not('.up, .down').remove();

      const maxMonthsInList = 6; // number of months: (12 / 2 = 6)
      const monthAddition = month >= maxMonthsInList ? 0 : maxMonthsInList;
      for (let i = 0; i < maxMonthsInList; i++) {
        const idx = i + monthAddition;
        const monthMap = wideMonths[idx];
        const a = $(`<a href="#" tabindex="-1" data-month="${idx}"${isRippleClass}>${monthMap}</a>`);
        const li = $('<li class="picklist-item"></li>');
        li.append(a);
        monthContainerJQ.find('.picklist-item.down').before(li);
        utils.addAttributes(a, this, s.attributes, `btn-picklist-${idx}`);
      }

      if (!s.inPage) {
        monthContainerJQ.find('.picklist-item').eq(5)
          .addClass('is-selected')
          .attr('tabindex', '0');
      }
    };

    const appendYear = (upDown) => {
      const yearContainer = this.monthYearPane[0].querySelector('.picklist.is-year');
      const yearList = yearContainer.children;
      const yearsLen = yearList.length - 2;
      const year = yearList[(upDown === 'up' ? 1 : yearsLen)].querySelector('a').getAttribute('data-year');
      DOM.remove(yearList[(upDown === 'up' ? yearsLen : 1)]);
      const yearContainerJQ = $(yearContainer);

      yearContainerJQ.find('.picklist-item').not('.up, .down').remove();

      if (upDown === 'up') {
        for (let i = yearsLen; i > 0; i--) {
          const nextYear = parseInt(year, 10) - i;

          const a = $(`<a href="#" tabindex="-1" data-year="${nextYear}"${isRippleClass}>${nextYear}</a>`);
          const li = $('<li class="picklist-item"></li>');
          li.append(a);

          yearContainerJQ.find('.picklist-item.down').before(li);
          utils.addAttributes(a, this, s.attributes, `btn-picklist-${nextYear}`);
        }
      }

      if (upDown === 'down') {
        for (let i = 1; i < (yearsLen + 1); i++) {
          const nextYear = parseInt(year, 10) + i;
          const a = $(`<a href="#" tabindex="-1" data-year="${nextYear}"${isRippleClass}>${nextYear}</a>`);
          const li = $('<li class="picklist-item"></li>');
          li.append(a);

          yearContainerJQ.find('.picklist-item.down').before(li);
          utils.addAttributes(a, this, s.attributes, `btn-picklist-${nextYear}`);
        }
      }

      if (!s.inPage) {
        yearContainerJQ.find('.picklist-item').eq(5)
          .addClass('is-selected')
          .attr('tabindex', '0');
      }
    };

    // Handle Long Press
    let intervalId = null;
    this.monthYearPane
      .off('touchstart.monthviewpane mousedown.monthviewpane')
      .on('touchstart.monthviewpane mousedown.monthviewpane', '.picklist.is-year li', (e) => {
        const noAction = s.inPage && e.target.tagName.toLowerCase() === 'li';
        if (noAction) {
          return true;
        }

        intervalId = setInterval(() => {
          if (e.currentTarget.classList.contains('up')) {
            appendYear('up');
          }
          if (e.currentTarget.classList.contains('down')) {
            appendYear('down');
          }
          e.stopImmediatePropagation();
          e.stopPropagation();
          return false;
        }, 200);
        return true;
      })
      .off('touchend.monthviewpane touchcancel.monthviewpane mouseup.monthviewpane mouseout.monthviewpane')
      .on('touchend.monthviewpane touchcancel.monthviewpane mouseup.monthviewpane mouseout.monthviewpane', '.picklist.is-year li', () => {
        clearInterval(intervalId);
        return true;
      });

    const selectPicklistItem = (target, cssClass) => {
      const selectedElem = this.monthYearPane[0].querySelector(`.picklist.${cssClass} .is-selected`);

      DOM.removeClass(selectedElem, 'is-selected');
      if (selectedElem) {
        selectedElem.querySelector('a').setAttribute('tabindex', '-1');
      }

      DOM.addClass(target.parentNode, 'is-selected');
      target.setAttribute('tabindex', '0');
    };

    // Set selecting the month or year
    // by click, keyboard from `monthYearPane`
    // target: clicked or keyed element
    // cssClass: target option `is-month` or `is-year`
    const setMonthYearPane = (target, cssClass) => {
      const elem = (sel) => {
        const el = this.monthYearPane[0].querySelector(`.is-${sel} .is-selected a`);
        return (!el && s.inPage) ?
          this.monthYearPane[0].querySelector(`.is-${sel} .picklist-item:last-child a`) : el;
      };
      let d;
      if (s.inPage) {
        d = {
          month: parseInt(elem('month').getAttribute('data-month'), 10),
          year: parseInt(elem('year').getAttribute('data-year'), 10)
        };
      } else {
        d = cssClass === 'is-month' ? {
          month: parseInt(target.getAttribute('data-month'), 10),
          year: parseInt(elem('year').getAttribute('data-year'), 10)
        } : {
          month: parseInt(elem('month').getAttribute('data-month'), 10),
          year: parseInt(target.getAttribute('data-year'), 10)
        };
      }

      if (!s.range.useRange) {
        this.currentMonth = d.month;
        this.currentDate.setMonth(this.currentMonth);
        this.currentYear = d.year;
        this.currentDate.setFullYear(this.currentYear);
        d.month = this.currentMonth;
        d.year = this.currentYear;
      }

      selectPicklistItem(target, cssClass);
      if (this.element.hasClass(`${cssClass}only`)) {
        this.monthYearPane.parent().find('button.is-select-month').click();
      }
    };

    // Handle selecting a year, or month
    this.monthYearPane
      .off('click.picklist-month')
      .on('click.picklist-month', '.picklist.is-month li', (e) => {
        const noAction = s.inPage && e.target.tagName.toLowerCase() === 'li';
        if (noAction) {
          return;
        }

        if (e.currentTarget.classList.contains('up')) {
          appendMonth('up');
          return;
        }
        if (e.currentTarget.classList.contains('down')) {
          appendMonth('down');
          return;
        }

        setMonthYearPane(e.target, 'is-month');
        e.preventDefault();
      });

    this.monthYearPane
      .off('click.picklist-month-a')
      .on('click.picklist-month-a', '.picklist.is-month li a', (e) => {
        e.preventDefault();
      });

    this.monthYearPane
      .off('click.picklist-year')
      .on('click.picklist-year', '.picklist.is-year li', (e) => {
        const noAction = s.inPage && e.target.tagName.toLowerCase() === 'li';
        if (noAction) {
          return;
        }

        if (e.currentTarget.classList.contains('up')) {
          appendYear('up');
          return;
        }
        if (e.currentTarget.classList.contains('down')) {
          appendYear('down');
          return;
        }

        setMonthYearPane(e.target, 'is-year');
        e.preventDefault();
      });

    this.monthYearPane
      .off('click.picklist-year-a')
      .on('click.picklist-year-a', '.picklist.is-year li a', (e) => {
        e.preventDefault();
      });

    // Handle behaviors when expanding and collapsing like disabling buttons and setting height
    this.monthYearPane.on('expand.monthviewpane', () => {
      // Disable the main page buttons for tabbing
      if (!s.hideDays) {
        this.element.find('.btn-icon, td.is-selected').attr('disabled', 'true');
        this.element.find('td.is-selected').removeAttr('tabindex');

        if (s.inPage) {
          this.element.find('.btn-icon.prev, .btn-icon.next').hide();
          const el = this.element.find('.hyperlink.today, .hyperlink.apply');
          const isApply = el.hasClass('is-apply');
          if (isApply) {
            el.removeClass('hidden');
          } else {
            el.removeClass('today is-ripple').addClass('apply').text(Locale.translate('Apply', { locale: this.locale.name, language: this.language }));
          }
        } else {
          // Set the height
          this.monthYearPane.find('.content').css('height', this.header.parent().height() - this.header.height() - 55); // 45 is the footer height
          this.element.find('.hyperlink.today').hide();
        }

        // Rename some buttons
        this.element.find('.is-select').removeClass('is-select').addClass('is-select-month-pane');
        this.element.find('.is-cancel').removeClass('is-cancel').addClass('is-cancel-month-pane').text(Locale.translate('Cancel', { locale: this.locale.name, language: this.language }));
      }
      // Focus the month
      setTimeout(() => {
        const selectedMonth = this.monthYearPane.find('.is-month .is-selected a');
        selectedMonth.focus();
        if (this.monthYearPane.parent().hasClass('is-yearonly')) {
          this.monthYearPane.find('.is-year .is-selected a').focus();
        }
      });
    }).on('collapse.monthviewpane', () => {
      // Enable it all again
      if (!s.hideDays) {
        if (s.inPage) {
          this.element.find('.btn-icon.prev, .btn-icon.next').show();
          const el = this.element.find('.hyperlink.apply');
          const isApply = el.hasClass('is-apply');
          if (isApply) {
            el.addClass('hidden');
          } else {
            el.removeClass('apply').addClass('today').text(Locale.translate('Today', { locale: this.locale.name, language: this.language }));
          }
        } else {
          this.element.find('.hyperlink.today').show();
        }
        this.element.find('.btn-icon').removeAttr('disabled');
        this.element.find('td.is-selected').attr('tabindex', '0');
        this.element.find('.is-select-month-pane').addClass('is-select').removeClass('is-select-month-pane');
        this.element.find('.is-cancel-month-pane').addClass('is-cancel').removeClass('is-cancel-month-pane').text(Locale.translate('Clear', { locale: this.locale.name, language: this.language }));
      }
    }).on('aftercollapse.monthviewpane', () => {
      this.element.find('.hyperlink.today').addClass('is-ripple');
    });

    // Handle keyboard on the month year pane
    const moveToItem = (e, nextPrev) => {
      const a = e.currentTarget;
      const li = e.currentTarget.parentNode;
      let adjacentLi = nextPrev === 'prev' ? li.previousSibling : li.nextSibling;
      if (!adjacentLi) {
        adjacentLi = li.parentNode.children[nextPrev === 'prev' ? li.parentNode.children.length - 1 : 0];
      }
      const adjacentA = adjacentLi.querySelector('a');

      a.setAttribute('tabindex', '-1');
      li.parentNode.querySelector('.is-selected')?.classList.remove('is-selected');
      DOM.addClass(adjacentLi, 'is-selected');
      adjacentA.setAttribute('tabindex', '0');
      adjacentA.focus();
    };

    this.monthYearPane
      .off('keydown.monthviewpane')
      .on('keydown.monthviewpane', '.picklist-item a', (e) => {
        const isUp = e.currentTarget.parentNode.classList.contains('up');
        const isDown = e.currentTarget.parentNode.classList.contains('down');
        const isYear = e.currentTarget.parentNode.parentNode.classList.contains('is-year');
        const isMonth = e.currentTarget.parentNode.parentNode.classList.contains('is-month');
        let handle = false;

        if (e.key === 'ArrowUp' && (isYear || isMonth)) {
          moveToItem(e, 'prev');
          handle = true;
        } else if (e.key === 'ArrowDown' && (isYear || isMonth)) {
          moveToItem(e, 'next');
          handle = true;
        } else if (e.key === 'Enter') {
          if (isUp || isDown) {
            if (isYear) {
              appendYear(isUp ? 'up' : 'down');
            } else if (isMonth) {
              appendMonth(isUp ? 'up' : 'down');
            }
            handle = true;
          } else if (isYear || isMonth) {
            setMonthYearPane(e.target, (isYear ? 'is-year' : 'is-month'));
            handle = true;
          }
        }

        if (handle) {
          e.preventDefault();
          this.setRipple(e.currentTarget, e);
        }
      });

    return this;
  },

  /**
   * Select a specific date visually.
   * @private
   * @param {date | string} date specific date or a date key (hash string of the date)
   * @param {boolean} closePopup Send a flag to close the popup
   * @param {boolean} insertDate Send a flag to insert the date in the field
  */
  selectDay(date, closePopup, insertDate) {
    if (this.isIslamic && typeof date !== 'string') {
      this.currentDateIslamic = Locale.gregorianToUmalqura(date);
      date = stringUtils.padDate(
        this.currentDateIslamic[0],
        this.currentDateIslamic[1],
        this.currentDateIslamic[2]
      );
    }

    if (!this.isIslamic && typeof date !== 'string') {
      date = stringUtils.padDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }

    let dayObj = this.dayMap.filter(dayFilter => dayFilter.key === date);
    const year = parseInt(date.substr(0, 4), 10);
    const month = parseInt(date.substr(4, 2), 10) - 1;
    const day = parseInt(date.substr(6, 2), 10);

    if (this.isIslamic) {
      this.currentDateIslamic = date;
      this.currentDate = Locale.umalquraToGregorian(year, month, day);
    } else {
      this.currentDate = new Date(year, month, day);
    }

    this.currentYear = year;
    this.currentMonth = month;
    this.currentDay = day;

    if (dayObj.length === 0 || dayObj[0].elem.hasClass('alternate')) {
      // Show month
      this.showMonth(month, year);
      dayObj = this.dayMap.filter(dayFilter => dayFilter.key === date);
    }

    // Error - date not found
    if (!dayObj.length === 0) {
      return;
    }

    const node = dayObj[0].elem[0];

    const args = {
      node,
      key: date,
      day,
      month,
      year,
      close: closePopup
    };

    delete this.isKeyClick;
    this.element.find('td.is-selected').removeClass('is-selected').removeAttr('tabindex');
    $(node).addClass('is-selected').attr('tabindex', '0').focus();

    insertDate = this.settings.headerStyle === 'full' ? true : insertDate;
    if (insertDate && this.settings.onSelected) {
      this.settings.onSelected(node, args);
    }
    if (insertDate) {
      this.element.trigger('selected', args);
    }
  },

  /**
   * Select todays date visually.
   */
  setToday() {
    this.selectDay(new Date(), false, true);
  },

  /**
   * Attach keyboard events for the calendar.
   * @private
   */
  handleKeys() {
    const s = this.settings;

    this.element.off('keydown.monthview').on('keydown.monthview', '.monthview-table', (e) => {
      const key = e.keyCode || e.charCode || 0;
      const cell = $(e.target);
      const allCell = this.days.find('td:visible');
      const allCellLength = allCell.length;
      let idx = null;
      let selector = null;
      let handled = false;
      const minDate = new Date(s.disable.minDate);
      const maxDate = new Date(s.disable.maxDate);
      const resetRange = () => {
        if (this.datepickerApi && s.range.useRange &&
            s.range.first && s.range.first.date &&
            s.range.second && s.range.second.date) {
          this.datepickerApi.resetRange({ isData: true });
        }
      };

      if (this.settings.onKeyDown) {
        const callbackResult = this.settings.onKeyDown({ e, key, cell, node: this.element });
        if (callbackResult === false) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      }

      // Arrow Down: select same day of the week in the next week
      if (key === 40) {
        handled = true;
        if (!this.validateDisplayRange(dateUtils.add(this.currentDate, 7, 'days'))) return false;
        if (s.range.useRange) {
          idx = allCell.index(e.target) + 7;
          selector = allCell.eq(idx);
          if (idx < allCellLength) {
            resetRange();
            this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
            this.setRangeSelBeforeFirstSel(selector);
            this.activeTabindex(selector, true);
          }
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() < maxDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
          } else if (maxDate.getDate() - 1 >= this.currentDate.getDate() + 7) {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
          }
          this.selectDay(this.currentDate, false, false);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() + 7);
          this.selectDay(this.currentDate, false, false);
        }
      }

      // Arrow Up: select same day of the week in the previous week
      if (key === 38) {
        handled = true;
        if (!this.validateDisplayRange(dateUtils.subtract(this.currentDate, 7, 'days'))) return false;
        if (s.range.useRange) {
          idx = allCell.index(e.target) - 7;
          selector = allCell.eq(idx);
          if (idx > -1) {
            resetRange();
            this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
            this.setRangeSelBeforeFirstSel(selector);
            this.activeTabindex(selector, true);
          }
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() > minDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
          } else if (minDate.getDate() + 1 <= this.currentDate.getDate() - 7) {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
          }
          this.selectDay(this.currentDate, false, false);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() - 7);
          this.selectDay(this.currentDate, false, false);
        }
      }

      // Arrow Left or - key
      if (key === 37 || (key === 189 && !e.shiftKey)) {
        handled = true;
        if (!this.validateDisplayRange(dateUtils.subtract(this.currentDate, 1, 'days'))) return false;
        if (s.range.useRange) {
          idx = allCell.index(e.target) - 1;
          selector = allCell.eq(idx);
          if (idx > -1) {
            resetRange();
            this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
            this.setRangeSelBeforeFirstSel(selector);
            this.activeTabindex(selector, true);
          }
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() > minDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
          } else if (minDate.getDate() + 1 !== this.currentDate.getDate()) {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
          }
          this.selectDay(this.currentDate, false, false);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() - 1);
          this.selectDay(this.currentDate, false, false);
        }
      }

      // Arrow Right or + key
      if (key === 39 || (key === 187 && e.shiftKey)) {
        handled = true;
        if (!this.validateDisplayRange(dateUtils.add(this.currentDate, 1, 'days'))) return false;
        if (s.range.useRange) {
          idx = allCell.index(e.target) + 1;
          selector = allCell.eq(idx);
          if (idx < allCellLength) {
            resetRange();
            this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
            this.setRangeSelBeforeFirstSel(selector);
            this.activeTabindex(selector, true);
          }
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() < maxDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
          } else if (maxDate.getDate() - 1 !== this.currentDate.getDate()) {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
          }
          this.selectDay(this.currentDate, false, false);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() + 1);
          this.selectDay(this.currentDate, false, false);
        }
      }

      // Page Up Selects Same Day Prev Month
      if (key === 33 && !e.altKey) {
        handled = true;
        resetRange();
        if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (minDate.getMonth() !== this.currentDate.getMonth()) {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.selectDay(this.currentDate, false, false);
          }
        } else {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          this.selectDay(this.currentDate, false, false);
        }
      }

      // Page Down Selects Same Day Next Month
      if (key === 34 && !e.altKey) {
        handled = true;
        resetRange();
        if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() !== maxDate.getMonth()) {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.selectDay(this.currentDate, false, false);
          }
        } else {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          this.selectDay(this.currentDate, false, false);
        }
      }

      // ctrl + Page Up Selects Same Day previous Year
      if (key === 33 && e.ctrlKey) {
        handled = true;
        resetRange();
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.selectDay(this.currentDate, false, false);
      }

      // ctrl + Page Down Selects Same Day next Year
      if (key === 34 && e.ctrlKey) {
        handled = true;
        resetRange();
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.selectDay(this.currentDate, false, false);
      }

      // Home Moves to Start of the month
      if (key === 36) {
        handled = true;
        const d = this.currentDate;
        let firstDay;
        resetRange();

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
        if (this.isIslamic) {
          this.currentDateIslamic = Locale.gregorianToUmalqura(this.currentDate);
        }
        this.selectDay(this.currentDate, false, false);
      }

      // End Moves to End of the month
      if (key === 35) {
        handled = true;
        const d = this.currentDate;
        let lastDay;
        resetRange();

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
        if (this.isIslamic) {
          this.currentDateIslamic = Locale.gregorianToUmalqura(this.currentDate);
        }
        this.selectDay(this.currentDate, false, false);
      }

      // 't' selects today
      if (key === 84) {
        if (s.range.useRange && this.datepickerApi) {
          resetRange();
          const keepFocus = !(s.range.first && s.range.first.date &&
            (!s.range.second || (s.range.second && !s.range.second.date)));
          this.datepickerApi.setToday(keepFocus);
          if (!keepFocus && this.datepickerApi &&
            typeof this.datepickerApi.closeCalendar === 'function') {
            this.datepickerApi.closeCalendar();
          }
        } else {
          this.setToday();
        }
        handled = true;
      }

      // Space or Enter closes Date Picker, selecting the Date
      if (key === 32 || key === 13) {
        handled = true;
        if (s.range.useRange) {
          if (!s.range.first || (s.range.first && !s.range.first.date)) {
            allCell.removeClass('is-selected');
          }
          cell.focus().trigger('click');
          return false;
        }
        const d = this.getCellDate(cell);

        if (this.isIslamic) {
          this.currentDateIslamic = [d.year, d.month, d.day];
          this.currentDate = Locale.umalquraToGregorian(
            this.currentDateIslamic[0],
            this.currentDateIslamic[1],
            this.currentDateIslamic[2]
          );
        } else {
          this.currentDate = new Date(d.year, d.month, d.day);
        }

        this.selectDay(this.currentDate, true, true);
        this.setRipple(e.target?.querySelector('.is-ripple'), e);
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
   * Validate the selected date is within dateRange
   * @private
   * @param {date} selectedDate date to check
   * @returns {boolean} Whether if selected date is within range
   */
  validateDisplayRange(selectedDate) {
    let minDate;
    let maxDate;
    const date = stringUtils.padDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    if (!this.dayMap.map(d => d.key).includes(date)) return false;
    if (this.settings.disable.minDate && this.settings.disable.maxDate) {
      minDate = new Date(this.settings.disable.minDate);
      maxDate = new Date(this.settings.disable.maxDate);
    } else if (this.settings.displayRange.start && this.settings.displayRange.end) {
      minDate = new Date(this.settings.displayRange.start);
      maxDate = new Date(this.settings.displayRange.end);
    }

    if (minDate && maxDate) {
      if ((minDate.getDate() >= selectedDate.getDate() &&
      minDate.getMonth() === selectedDate.getMonth()) ||
      minDate.getMonth() > selectedDate.getMonth()) {
        return false;
      }

      if ((maxDate.getDate() <= selectedDate.getDate() &&
      maxDate.getMonth() === selectedDate.getMonth()) ||
      maxDate.getMonth() < selectedDate.getMonth()) {
        return false;
      }
    }
    return true;
  },

  /**
   * Validate the Previous and Next Button availability.
   * @private
   */
  validatePrevNext() {
    if (!this.settings.disable.restrictMonths ||
      !this.settings.disable.minDate || !this.settings.disable.maxDate) {
      return;
    }
    const minDate = new Date(this.settings.disable.minDate);
    const maxDate = new Date(this.settings.disable.maxDate);

    this.element.find('.prev').prop('disabled', false);
    this.element.find('.next').prop('disabled', false);

    // Wierd edge case, the user probably should use validation.
    if (minDate.getFullYear() > this.currentYear || this.currentYear > maxDate.getFullYear()) {
      this.element.find('.prev').prop('disabled', true);
      this.element.find('.next').prop('disabled', true);
      return;
    }

    if (this.currentMonth - 1 < minDate.getMonth()) {
      this.element.find('.prev').prop('disabled', true);
    }

    if (this.currentMonth + 1 > maxDate.getMonth()) {
      this.element.find('.next').prop('disabled', true);
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

    this.legend = $('<div class="monthview-legend"></div>');

    for (let i = 0; i < s.legend.length; i++) {
      const series = s.legend[i];
      let hex = series.color;

      if (hex.indexOf('#') === -1) {
        const name = hex.replace(/[0-9]/g, '');
        const number = hex.substr(hex.length - 2, 2) * 10;
        hex = theme.themeColors().palette[name][number].value;
      }

      const item = '' +
        `<div class="monthview-legend-item">
          <span class="monthview-legend-swatch" style="background-color: ${colorUtils.hexToRgba(hex, 0.3)}"></span>
          <span class="monthview-legend-text">${series.name}</span>
        </div>`;

      this.legend.append(item);
    }
    this.table.after(this.legend);

    if (s.inPage) {
      // Set is-wrapped css class to use diffrent styles
      const first = this.legend[0].querySelector('.monthview-legend-item:first-child');
      const last = this.legend[0].querySelector('.monthview-legend-item:last-child');
      if (first && last) {
        const top = el => el?.getBoundingClientRect().top;
        this.legend[top(first) !== top(last) ? 'addClass' : 'removeClass']('is-wrapped');
      }
    }
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
      cell = $(cell); // First date selected cell element

      if (cell.length && !cell.is('.is-disabled, .is-selected')) {
        const row = cell.closest('tr');
        const cellIdx = cell.index();
        const rowIdx = row.index();
        const thisCell = rowIdx + cellIdx + (len * rowIdx);
        const d = self.getCellDate(cell);
        const cellDate = this.getTime(this.isIslamic ? [d.year, d.month, d.day] :
          new Date(d.year, d.month, d.day));
        const max = this.getDifferenceToDate(s.range.first.date, s.range.maxDays);

        self.days.find('td:visible').each(function (i) {
          const thisTd = $(this);
          if (cellDate > self.getTime(s.range.first.date) && !s.range.selectBackward &&
            (!s.range.maxDays || (s.range.maxDays > 0 && cellDate <= max.aftertime)) &&
            ((i > firstCell && i <= thisCell) || (cellDate > self.getTime(extra.max) && i <= thisCell))) {
            thisTd.addClass('range-next');
          } else if (cellDate < self.getTime(s.range.first.date) && !s.range.selectForward &&
            (!s.range.maxDays || (s.range.maxDays > 0 && cellDate >= max.beforetime)) &&
            ((i < firstCell && i >= thisCell) || (cellDate < self.getTime(extra.min) && i >= thisCell))) {
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
   * Get Dates with in the min and max range for the range picker.
   * @private
   * @param {object} date Date to focus around
   * @param {number} days Number of days +/-
   * @param {boolean} includeDisabled Use the disabled setting.
   * @returns {object} Dates/and difference before/afterto given date
   */
  getDifferenceToDate(date, days, includeDisabled) {
    const difference = {};
    const move = (d, daystomove, isNext) => {
      d = this.isIslamic ? Locale.umalquraToGregorian(d) : new Date(d);
      while (daystomove > 0) {
        d.setDate(d.getDate() + (isNext ? 1 : -1));
        if (includeDisabled || (!includeDisabled &&
          !this.isDateDisabled(d.getFullYear(), d.getMonth(), d.getDate()))) {
          daystomove--;
          difference[isNext ? 'after' : 'before'] = this.isIslamic ?
            Locale.gregorianToUmalqura(new Date(d)) : new Date(d);
        }
      }

      if (isNext && difference.after) {
        difference.aftertime = this.getTime(difference.after);
      } else if (difference.before) {
        difference.beforetime = this.getTime(difference.before);
      }
    };
    includeDisabled = typeof includeDisabled !== 'undefined' ? includeDisabled : this.settings.range.includeDisabled;
    move(date, days); // previous
    move(date, days, true); // next
    return difference;
  },

  /**
   * Set range selected value
   * @private
   * @returns {void}
   */
  setRangeSelected() {
    const self = this;
    const s = this.settings;
    const dateObj = d => (this.isIslamic ? [d.year, d.month, d.day] : new Date(d.year, d.month, d.day));

    if (s.range.useRange && s.range.second && s.range.second.date &&
      this.days && this.days.length) {
      this.days.find('td').removeClass('range range-next range-prev range-selection end-date is-selected');
      this.days.find('td:visible').each(function () {
        const cell = $(this);
        const isDisabled = cell.is('.is-disabled') && !s.range.includeDisabled;
        const includeDisabled = cell.is('.is-disabled') && s.range.includeDisabled;
        const includeDisableClass = includeDisabled ? ' include-disabled' : '';
        const date = self.getTime(dateObj(self.getCellDate(cell)));
        const d1 = self.getTime(s.range.first.date, true);
        const d2 = self.getTime(s.range.second.date, true);

        if ((date === d1 || date === d2) && !isDisabled) {
          cell.addClass(`is-selected${includeDisableClass}${d1 !== d2 ? ` range-selection${date === d2 && !self.isIslamic ? ' end-date' : ''}` : ''}`);
        } else if (!self.isIslamic && (date > d1 && date < d2) && !isDisabled) {
          cell.addClass(`range-selection${includeDisableClass}`);
        } else if (self.isIslamic && ((d1 > date && d2 < date) || (d1 < date && d2 > date)) && !isDisabled) {
          cell.addClass(`range-selection${includeDisableClass}`);
        }
      });
    }
  },

  /**
   * Set range selection to active cell with click.
   * @private
   * @returns {number} status
   */
  setRangeSelByClick() {
    // 0: cell did not found
    // 1: cell found but not changed and not clicked
    // 2: cell found and changed but not clicked
    // 3: cell found and clicked
    let status = 0;

    const s = this.settings;
    if (s.range.useRange) {
      if (s.range.first && s.range.first.date && s.range.second && s.range.second.date) {
        if (s.showTime && this.datepickerApi) {
          const d = {
            time1: this.getTime(s.range.first.date),
            time2: this.getTime(s.range.second.date),
            first: this.datepickerApi.setTime(s.range.first.date),
            second: this.datepickerApi.setTime(s.range.second.date)
          };
          if (d.time1 !== this.getTime(d.first)) {
            this.datepickerApi.setRangeToElem(d.first, true);
            this.datepickerApi.setRangeToElem(d.second, false);
            status = 2; // 2: cell found and changed but not clicked
          }
        }
        // 1: cell found but not changed and not clicked
        status = (status === 0) ? 1 : status;
      } else {
        let cell;
        if (!s.range.first || (s.range.first && !s.range.first.date)) {
          cell = this.dayMap.filter(d => d.elem.is('.is-selected'));
          if (cell && cell.length) {
            this.days.find('td:visible').removeClass('is-selected').removeAttr('aria-selected');
            cell[0].elem.focus().trigger('click');
            status = 3; // 3: cell found and clicked
          }
        } else if (!s.range.second || (s.range.second && !s.range.second.date)) {
          cell = this.days.find('td.range-prev:visible').first();
          if (!cell.length) {
            cell = this.days.find('td.range-next:visible').last();
          }
          if (!cell.length) {
            cell = this.dayMap.filter(d => d.elem.is('.is-selected'));
          }
          if (cell && cell.length) {
            const elem = cell[0].elem || cell;
            elem.focus().trigger('click');
            status = 3; // 3: cell found and clicked
          }
        }
      }
    }

    return status;
  },

  /**
   * Get date from given cell.
   * @private
   * @param {object} cell to get date.
   * @returns {object} as: year, month, day
   */
  getCellDate(cell) {
    const day = parseInt(cell.text(), 10);
    let month = parseInt(this.header.find('.month').attr('data-month'), 10);
    let year = parseInt(this.header.find('.year').text(), 10);

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
   * Set range selection before first date selected
   * @private
   * @param {object} elem to set selection
   * @returns {void}
   */
  setRangeSelBeforeFirstSel(elem) {
    const s = this.settings;
    if (s.range.useRange && $('#monthview-popup:visible')) {
      if (!s.range.first) {
        $('td', this.element).removeClass('is-selected');
        elem.addClass('is-selected');
      }
    }
  },

  /**
   * Check if file type allowed
   * @private
   * @param {object} elem to set fouus
   * @param {boolean} isFocus true if need to set foucs
   * @returns {object} element passed in
   */
  activeTabindex(elem, isFocus) {
    $('td', this.element).removeAttr('tabindex');
    elem.attr('tabindex', 0);

    if (isFocus) {
      elem.focus();
    }
    return elem;
  },

  /**
   * Handle updated settings and values.
   * @returns {object} [description]
   */
  updated() {
    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.header.off();
    this.days.off();
    this.element.off();
    if (this.monthYearPane) {
      this.monthYearPane.off();
      this.monthYearPane = null;
    }
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   * @returns {object} The prototype.
   */
  destroy() {
    this.teardown();
    if (this.element) {
      this.element.empty();
    }
    if (this.element && this.element[0]) {
      try {
        $.removeData(this.element[0], COMPONENT_NAME);
      } catch (error) {} //eslint-disable-line
    }
    return this;
  }
};

export { MonthView, COMPONENT_NAME };
