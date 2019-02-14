import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';
import { Locale } from '../locale/locale';
import { xssUtils } from '../../utils/xss';

// Settings and Options
const COMPONENT_NAME = 'monthview';

const COMPONENT_NAME_DEFAULTS = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  activeDate: null,
  activeDateIslamic: null,
  isPopup: false,
  headerStyle: 'full',
  firstDayOfWeek: null,
  disable: {
    dates: [],
    minDate: '',
    maxDate: '',
    dayOfWeek: [],
    isEnable: false,
    restrictMonths: false
  },
  legend: [
    { name: 'Public Holiday', color: '#76B051', dates: [] },
    { name: 'Weekends', color: '#EFA836', dayOfWeek: [] }
  ],
  hideDays: false,
  showMonthYearPicker: false,
  advanceMonths: 5,
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
  selectable: true,
  onSelected: null
};

/**
 * MonthView - Renders a Month calendar
 * @class MonthView
 * @param {string} element The plugin element for the constuctor
 * @param {object} [settings] The settings element.
 * @param {number} [settings.month] The month to show.
 * @param {number} [settings.year] The year to show.
 * @param {number} [settings.activeDate] The date to highlight as selected/today.
 * @param {number} [settings.activeDateIslamic] The date to highlight as selected/today (as an array for islamic)
 * @param {number} [settings.isPopup] Is it in a popup (datepicker using it)
 * @param {number} [settings.headerStyle] Configure the header, this can be 'simple' or 'full'. Full adds a picker and today link.
 * @param {number} [settings.firstDayOfWeek=null] Set first day of the week. '1' would be Monday.
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
 * @param {boolean} [settings.showMonthYearPicker=false] If true the month and year will render as dropdowns.
 * @param {number} [settings.advanceMonths=5] The number of months in each direction to show in
 *  the dropdown for months (when initially opening)
 * @param {array} [settings.legend]  Legend Build up
 * for example `[{name: 'Public Holiday', color: '#76B051', dates: []},
 * {name: 'Weekends', color: '#EFA836', dayOfWeek: []}]`
 * @param {boolean} [settings.selectable=false] If true the month days can be clicked to select
 * @param {boolean} [settings.onSelected=false] Call back that fires when a month day is clicked.
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
    // Do initialization. Build or Events ect
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @private
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  build() {
    // Calendar Html in Popups
    this.prevButton = '' +
      `<button type="button" class="btn-icon prev">
        ${$.createIcon('caret-left')}
        <span>${Locale.translate('PreviousMonth')}</span>
      </button>`;
    this.nextButton = '' +
      `<button type="button" class="btn-icon next">
        ${$.createIcon('caret-right')}
        <span>${Locale.translate('NextMonth')}</span>
      </button>`;

    this.header = $('' +
      `<div class="monthview-header">
        <span class="month">november</span>
        <span class="year">2015</span>
        ${(Locale.isRTL() ? this.nextButton + this.prevButton : this.prevButton + this.nextButton)}
      </div>`);
    this.table = $(`<table class="monthview-table" aria-label="${Locale.translate('Calendar')}" role="application"></table>`);
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

    if (this.settings.hideDays) {
      this.table = '';
    }

    // Reconfigure the header
    if (this.settings.headerStyle === 'full') {
      this.header = $('' +
        `<div class="monthview-header full">
          ${(Locale.isRTL() ? this.nextButton + this.prevButton : this.prevButton + this.nextButton)}
          <span class="monthview-datepicker">
            <input aria-label="${Locale.translate('Today')}" id="monthview-datepicker-field" readonly data-init="false" class="datepicker" name="monthview-datepicker-field" type="text"/>
          </span>
          <a class="hyperlink today" href="#">${Locale.translate('Today')}</a>
        </div>`);
      this.monthPicker = this.header.find('#monthview-datepicker-field');
      this.todayLink = this.header.find('.hyperlink.today');
    }

    this.showMonth(this.settings.month, this.settings.year);
    this.calendar = this.element.addClass('monthview').append(this.header, this.table);

    if (!this.settings.isPopup) {
      this.element.addClass('is-fullsize');
    }

    // Add Legend
    this.addLegend();

    if (this.settings.headerStyle === 'full') {
      this.monthPicker.datepicker({
        autoSize: true,
        dateFormat: Locale.calendar().dateFormat.year,
        showMonthYearPicker: true,
        hideButtons: true,
        onOpenCalendar: () => this.currentDate
      });
      this.header.find('button, a').hideFocus();
    }

    return this;
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
    this.isIslamic = this.currentCalendar.name === 'islamic-umalqura';
    this.conversions = this.currentCalendar.conversions;
  },

  /**
   * Update the calendar to show the given month and year
   * @param {number} month The zero based month to display
   * @param {number} year The year to display
   * @returns {void}
   */
  showMonth(month, year) {
    const self = this;
    const now = new Date();

    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    let elementDate = (this.settings.activeDate && this.settings.activeDate.getDate()) ?
      this.settings.activeDate : now;

    this.setCurrentCalendar();

    if (this.isIslamic) {
      if (!this.settings.activeDateIslamic) {
        const gregorianDate = new Date();
        this.todayDateIslamic = this.conversions.fromGregorian(gregorianDate);
        this.settings.activeDateIslamic = [];
        this.settings.activeDateIslamic[0] = this.todayDateIslamic[0];
        this.settings.activeDateIslamic[1] = this.todayDateIslamic[1];
        this.settings.activeDateIslamic[2] = this.todayDateIslamic[2];
        year = this.settings.activeDateIslamic[0];
        month = this.settings.activeDateIslamic[1];
        elementDate = this.conversions.fromGregorian(now);
      } else {
        elementDate = this.settings.activeDateIslamic;
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
    }

    if (month < 0) {
      year--;
      month = 11;
      this.currentMonth = month;
      this.currentYear = year;
    }

    this.currentDay = now.getDate();

    let days = this.currentCalendar.days.narrow;
    days = days || this.currentCalendar.days.abbreviated;

    if (!this.settings.isPopup) {
      days = this.currentCalendar.days.abbreviated;
    }
    const monthName = this.currentCalendar.months.wide[month];

    this.currentMonth = month;
    this.currentYear = year;

    // Set the Days of the week
    let firstDayofWeek = (this.currentCalendar.firstDayofWeek || 0);

    if (this.settings.firstDayOfWeek) {
      firstDayofWeek = this.settings.firstDayOfWeek;
    }

    this.dayNames.find('th').each(function (i) {
      $(this).text(days[(i + firstDayofWeek) % 7]);
    });

    // Localize Month Name
    this.yearFirst = this.currentCalendar.dateFormat.year && this.currentCalendar.dateFormat.year.substr(1, 1) === 'y';
    this.header.find('.month').attr('data-month', month).text(`${xssUtils.stripTags(monthName)} `);
    this.header.find('.year').text(` ${year}`);

    if (this.yearFirst && !this.isIslamic && !Locale.isRTL()) {
      elementDate.setFullYear(year);
      const translation = Locale.formatDate(elementDate, { date: 'year' });
      const justYear = translation.split(' ')[0];

      this.header.find('.year').text(`${justYear} `);
      this.header.find('.year').insertBefore(this.header.find('.month'));
    }

    if (this.settings.headerStyle === 'full' && this.monthPicker) {
      this.monthPicker.val(Locale.formatDate(new Date(year, month, 1), { date: 'year' }));
      if (this.monthPicker.data('datepicker')) {
        this.monthPicker.data('datepicker').setSize();
      }
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

    const s = this.settings;
    this.dayMap = [];
    this.days.find('td').each(function (i) {
      const th = $(this).removeClass('alternate prev-month next-month is-selected range is-today');
      th.removeAttr('aria-selected');

      if (i < leadDays) {
        exDay = (lastMonthDays - leadDays) + 1 + i;
        exMonth = (month === 0) ? 11 : month - 1;
        exYear = (month === 0) ? year - 1 : year;

        self.setDisabled(th, exYear, exMonth, exDay);
        self.setLegendColor(th, exYear, exMonth, exDay);
        self.dayMap.push({ key: stringUtils.padDate(exYear, exMonth, exDay), elem: th });
        th.addClass('alternate prev-month').html(`<span class="day-container"><span aria-hidden="true" class="day-text">${xssUtils.stripTags(exDay)}</span></span>`);
        th.attr('data-key', stringUtils.padDate(exYear, exMonth, exDay));
      }

      if (i >= leadDays && dayCnt <= thisMonthDays) {
        self.dayMap.push({ key: stringUtils.padDate(year, month, dayCnt), elem: th });
        th.html(`<span class="day-container"><span aria-hidden="true" class="day-text">${xssUtils.stripTags(dayCnt)}</span></span>`);
        th.attr('data-key', stringUtils.padDate(year, month, dayCnt));

        // Add Selected Class to Selected Date
        if (self.isIslamic) {
          if (year === elementDate[0] && month === elementDate[1] && dayCnt === elementDate[2]) {
            th.addClass(`is-selected${(s.range.useRange ? ' range' : '')}`).attr('aria-selected', 'true').attr('tabindex', '0');
          }
        } else {
          const tHours = elementDate.getHours();
          const tMinutes = elementDate.getMinutes();
          const tSeconds = self.isSeconds ? elementDate.getSeconds() : 0;

          const newDate = (new Date(year, month, dayCnt)).setHours(tHours, tMinutes, tSeconds, 0);

          if (newDate === elementDate.setHours(tHours, tMinutes, tSeconds, 0)) {
            th
              .addClass(`is-selected${(s.range.useRange ? ' range' : '')}`)
              .attr('aria-selected', 'true').attr('tabindex', '0');
          }
        }

        if (dayCnt === self.todayDay
            && self.currentMonth === self.todayMonth
            && self.currentYear === self.todayYear
        ) {
          th.addClass('is-today');
        }

        th.attr('aria-label', Locale.formatDate(new Date(self.currentYear, self.currentMonth, dayCnt), { date: 'full' }));
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

        th.addClass('alternate next-month').html(`<span class="day-container"><span aria-hidden="true" class="day-text">${nextMonthDayCnt}</span></span>`);
        th.attr('data-key', stringUtils.padDate(exYear, exMonth, exDay));
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

    if (!this.currentDate) {
      if (this.isIslamic) {
        this.currentIslamicDate = [self.currentYear, self.currentMonth, self.currentDay];
        this.currentDate = this.conversions.toGregorian(
          self.currentYear,
          self.currentMonth,
          self.currentDay
        );
      } else {
        this.currentDate = new Date(self.currentYear, self.currentMonth, self.currentDay);
      }
    }

    this.setRangeSelection();
    this.validatePrevNext();

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
   * Set range selection
   * @private
   * @returns {void}
   */
  setRangeSelection() {
    if (this.settings.range.useRange) {
      const range = {};
      range.date = new Date(this.currentYear, this.currentMonth, 1);
      range.date.setDate(range.date.getDate() - (this.days.find('.prev-month:visible').length + 1));
      range.formatedDate = Locale.formatDate(range.date, { date: 'full' });
      range.cell = this.days.find(`[aria-label="${range.formatedDate}"]`);
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
    monthSpan.find('select.dropdown').dropdown().off('change.monthview')
      .on('change.monthview', function () {
        const elem = $(this);
        self.currentMonth = parseInt(elem.val(), 10);
        self.showMonth(self.currentMonth, self.currentYear);
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
   * Find first day of the week for a given month
   * @private
   * @param {number} year The year to use with the month
   * @param {number} month The month to find the first day for
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
    const dateIsDisabled = this.isDateDisabled(year, month, date);
    elem.removeClass('is-disabled').removeAttr('aria-disabled');

    if ((dateIsDisabled && !s.disable.isEnable) || (!dateIsDisabled && s.disable.isEnable)) {
      elem
        .addClass('is-disabled').attr('aria-disabled', 'true')
        .removeClass('is-selected range').removeAttr('aria-selected');
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
    elem.off('mouseenter.legend mouseleave.legend');

    if (hex) {
      // set color on elem at .3 of provided color as per design
      elem.addClass('is-colored');
      elem[0].style.backgroundColor = this.hexToRgba(hex, 0.3);

      const normalColor = self.hexToRgba(hex, 0.3);
      const hoverColor = self.hexToRgba(hex, 0.7);

      // handle hover states
      elem.on('mouseenter.legend', function () {
        const thisElem = $(this);
        thisElem[0].style.backgroundColor = hoverColor;
        thisElem.find('span')[0].style.backgroundColor = 'transparent';
      }).on('mouseleave.legend', function () {
        const thisElem = $(this);
        thisElem[0].style.backgroundColor = normalColor;
        thisElem.find('span')[0].style.backgroundColor = '';
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

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    // Change Month Events
    this.header.off('click.monthview').on('click.monthview', 'button', function () {
      const isNext = $(this).is('.next');
      const range = {};

      if (self.settings.range.useRange) {
        if (isNext) {
          range.date = new Date(self.currentYear, (self.currentMonth + 1), (self.element.find('.next-month:visible').length + 1));
        } else {
          range.date = new Date(self.currentYear, self.currentMonth, 1);
          range.date.setDate(range.date.getDate() - (self.days.find('.prev-month:visible').length + 1));
        }
      }

      self.showMonth(self.currentMonth + (isNext ? 1 : -1), self.currentYear);

      if (self.settings.range.useRange) {
        range.formatedDate = Locale.formatDate(range.date, { date: 'full' });
        range.cell = self.days.find(`[aria-label="${range.formatedDate}"]`);
        self.setRangeOnCell(self.settings.range.second ? false : range.cell);
      }
    });

    if (self.settings.range.useRange) {
      this.header
        .off('mouseover.datepicker')
        .on('mouseover.datepicker', 'button', function () {
          if (self.settings.range.extra) {
            self.setRangeOnCell($(this).is('.next') ? self.settings.range.extra.maxCell : self.settings.range.extra.minCell);
          }
        })
        .off('focus.datepicker')
        .on('focus.datepicker', 'button:not(.hide-focus)', function () {
          if (self.settings.range.extra) {
            self.setRangeOnCell($(this).is('.next') ? self.settings.range.extra.maxCell : self.settings.range.extra.minCell);
          }
        });

      this.days
        .off('mouseover.datepicker')
        .on('mouseover.datepicker', 'td', function () {
          self.setRangeOnCell(this);
        });
    }

    if (self.settings.headerStyle === 'full' && this.monthPicker) {
      this.monthPicker.off('change.monthview').on('change.monthview', function () {
        const picker = $(this).data('datepicker');
        self.selectDay(picker.currentDate);
      });

      this.todayLink.off('click.monthview').on('click.monthview', () => {
        self.selectToday();
      });
    }

    // Allow dates to be selected
    if (self.settings.selectable) {
      self.element.addClass('is-selectable').off('click.monthview-day').on('click.monthview-day', 'td', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        self.lastClickedKey = key;

        if (e.currentTarget.classList.contains('is-disabled')) {
          return;
        }
        self.selectDay(key);
      });
    }

    this.handleKeys();
    return this;
  },

  /**
   * Select a specific date visually.
   * @param {date | string} date specific date or a date key (hash string of the date)
   * @param {boolean} closePopup Send a flag to close the popup
  */
  selectDay(date, closePopup) {
    if (this.isIslamic && typeof date !== 'string') {
      this.currentIslamicDate = this.currentCalendar.conversions.fromGregorian(date);
      date = stringUtils.padDate(
        this.currentIslamicDate[0],
        this.currentIslamicDate[1],
        this.currentIslamicDate[2]
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
      this.currentIslamicDate = date;
      this.currentDate = this.conversions.toGregorian(year, month, day);
    } else {
      this.currentDate = new Date(year, month, day);
    }

    if (dayObj.length === 0 || dayObj[0].elem.hasClass('alternate')) {
      // Show month
      this.showMonth(month, year);
      dayObj = this.dayMap.filter(dayFilter => dayFilter.key === date);
    }

    // Error - date not found
    if (!dayObj.lenth === 0) {
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

    if (this.settings.onSelected) {
      this.settings.onSelected(node, args);
    }
    this.element.trigger('selected', args);
  },

  /**
   * Select todays date visually.
   */
  selectToday() {
    this.selectDay(new Date());
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

      // Arrow Down: select same day of the week in the next week
      if (key === 40) {
        handled = true;
        if (this.settings.range.useRange) {
          idx = allCell.index(e.target) + 7;
          selector = allCell.eq(idx);
          if (idx < allCellLength) {
            this.setRangeOnCell(selector.is('.is-selected') ? null : selector);
            this.activeTabindex(selector, true);
          }
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() < maxDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
          } else if (maxDate.getDate() - 1 >= this.currentDate.getDate() + 7) {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
          }
          this.selectDay(this.currentDate);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() + 7);
          this.selectDay(this.currentDate);
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
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() > minDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
          } else if (minDate.getDate() + 1 <= this.currentDate.getDate() - 7) {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
          }
          this.selectDay(this.currentDate);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() - 7);
          this.selectDay(this.currentDate);
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
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() > minDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
          } else if (minDate.getDate() + 1 !== this.currentDate.getDate()) {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
          }
          this.selectDay(this.currentDate);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() - 1);
          this.selectDay(this.currentDate);
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
        } else if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() < maxDate.getMonth()) {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
          } else if (maxDate.getDate() - 1 !== this.currentDate.getDate()) {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
          }
          this.selectDay(this.currentDate);
        } else {
          this.currentDate.setDate(this.currentDate.getDate() + 1);
          this.selectDay(this.currentDate);
        }
      }

      // Page Up Selects Same Day Prev Month
      if (key === 33 && !e.altKey) {
        handled = true;
        if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (minDate.getMonth() !== this.currentDate.getMonth()) {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.selectDay(this.currentDate);
          }
        } else {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          this.selectDay(this.currentDate);
        }
      }

      // Page Down Selects Same Day Next Month
      if (key === 34 && !e.altKey) {
        handled = true;
        if (s.disable.restrictMonths && s.disable.minDate && s.disable.maxDate) {
          if (this.currentDate.getMonth() !== maxDate.getMonth()) {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.selectDay(this.currentDate);
          }
        } else {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          this.selectDay(this.currentDate);
        }
      }

      // ctrl + Page Up Selects Same Day previous Year
      if (key === 33 && e.ctrlKey) {
        handled = true;
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.selectDay(this.currentDate);
      }

      // ctrl + Page Down Selects Same Day next Year
      if (key === 34 && e.ctrlKey) {
        handled = true;
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.selectDay(this.currentDate);
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
        if (this.isIslamic) {
          this.currentIslamicDate = this.conversions.fromGregorian(this.currentDate);
        }
        this.selectDay(this.currentDate);
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
        if (this.isIslamic) {
          this.currentIslamicDate = this.conversions.fromGregorian(this.currentDate);
        }
        this.selectDay(this.currentDate);
      }

      // 't' selects today
      if (key === 84) {
        this.selectToday();
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
          this.currentIslamicDate = [d.year, d.month, d.day];
          this.currentDate = this.conversions.toGregorian(
            this.currentIslamicDate[0],
            this.currentIslamicDate[1],
            this.currentIslamicDate[2]
          );
        } else {
          this.currentDate = new Date(d.year, d.month, d.day);
        }

        this.selectDay(this.currentDate, true);
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
   * Validate the Previous and Next Button availability.
   * @private
   */
  validatePrevNext() {
    if (!this.settings.disable.restrictMonths
      || !this.settings.disable.minDate || !this.settings.disable.maxDate) {
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
      const item = '' +
        `<div class="monthview-legend-item">
          <span class="monthview-legend-swatch" style="background-color: ${this.hexToRgba(series.color, 0.3)}"></span>
          <span class="monthview-legend-text">${series.name}</span>
        </div>`;

      this.legend.append(item);
    }
    this.table.after(this.legend);
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
      .destroy()
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
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   * @returns {object} The prototype.
   */
  destroy() {
    this.teardown();
    this.element.empty();
    this.element.off('keydown.monthview');
    $.removeData(this.element[0], COMPONENT_NAME);
    return this;
  }
};

export { MonthView, COMPONENT_NAME };
