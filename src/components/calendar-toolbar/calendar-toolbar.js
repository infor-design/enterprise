import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../../utils/behaviors'; // hidefocus
import '../dropdown/dropdown.jquery';
import '../toolbar-flex/toolbar-flex.jquery';

// Default Settings
const COMPONENT_NAME = 'calendartoolbar';

/**
 * The Calendar Toolbar Displays a toolbar above calendars and week views.
 * @class CalendarToolbar
 * @constructor
 *
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {string} [settings.locale] The name of the locale to use for this instance. If not set the current locale will be used.
 * @param {string} [settings.language] The name of the language to use for this instance. If not set the current locale's language will be used.
 * @param {number} [settings.month] The month to show.
 * @param {number} [settings.year] The year to show.
 * @param {boolean} [settings.showToday=true] If true the today button is shown on the header.
 * @param {function} [settings.onOpenCalendar] Call back for when the calendar is open on the toolbar datepicker, allows you to set the date.
 * @param {function} [settings.onChangeView] Call back for when the view changer is changed.
 * @param {boolean} [settings.isAlternate] Alternate style for the datepicker popup.
 * @param {boolean} [settings.isMenuButton] Show the month/year as a menu button object, works if isAlternate is true.
 * @param {boolean} [settings.isMonthPicker] Indicates this is a month picker on the month and week view. Has some slight different behavior.
 * @param {boolean} [settings.showViewChanger=false] If false the dropdown to change views will not be shown.
 * @param {string} [settings.viewChangerValue='month'] The value to show selected in the view changer. Can be month, week, day or schedule.
*/
const COMPONENT_DEFAULTS = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  locale: null,
  showToday: true,
  onOpenCalendar: null,
  onChangeView: null,
  isAlternate: false,
  isMenuButton: true,
  showViewChanger: false,
  viewChangerValue: 'month',
  isMonthPicker: false
};

function CalendarToolbar(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, COMPONENT_DEFAULTS);
  this.init();
}

// CalendarToolbar Methods
CalendarToolbar.prototype = {

  init() {
    this
      .setLocale()
      .build()
      .handleEvents();
  },

  /**
   * Set up the toolbar to the settings.
   * @private
   * @returns {void}
   */
  build() {
    this.element[0].classList.add('flex-toolbar');
    this.element[0].setAttribute('data-init', 'false');

    if (this.settings.isAlternate) {
      this.element[0].classList.add('is-alternate');
      const monthYearPaneButton = `<button type="button" class="btn btn-monthyear-pane expandable-area-trigger" id="btn-monthyear-pane">
        <span class="month">november</span>
        <span class="year">2019</span>
        <svg class="icon icon-closed" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-dropdown"></use>
        </svg>
        <svg class="icon icon-opened" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-dropdown"></use>
        </svg>
      </button>`;

      this.element[0].innerHTML = `
        <div class="toolbar-section">
          ${this.settings.isMenuButton ? monthYearPaneButton : '<span class="month">november</span><span class="year">2015</span>'}
        </div>
        <div class="toolbar-section buttonset l-align-${this.isRTL ? 'left' : 'right'}">
          ${this.settings.showToday ? `<a class="hyperlink today" href="#">${Locale.translate('Today', { locale: this.locale.name, language: this.language })}</a>` : ''}
          <button type="button" class="btn-icon prev">
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-left"></use></svg>
            <span>${Locale.translate('PreviousMonth', { locale: this.locale.name, language: this.language })}</span>
            </button>
          <button type="button" class="btn-icon next">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-right"></use></svg>
              <span>${Locale.translate('NextMonth', { locale: this.locale.name, language: this.language })}</span>
          </button>
        </div>
      `;
    } else {
      this.element[0].innerHTML = `
        <div class="toolbar-section">
          <button type="button" class="btn-icon prev">
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-left"></use></svg>
            <span>${Locale.translate('PreviousMonth', { locale: this.locale.name, language: this.language })}</span>
            </button>
          <button type="button" class="btn-icon next">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-caret-right"></use></svg>
              <span>${Locale.translate('NextMonth', { locale: this.locale.name, language: this.language })}</span>
          </button>
          <span class="monthview-datepicker">
            <span class="hidden month" data-month="9">9</span>
            <span class="hidden year">2019</span>
            <span class="audible">${Locale.translate('SelectDay')}</span>
            <span tabindex="0" aria-label="${Locale.translate('Today', { locale: this.locale.name, language: this.language })}" id="monthview-datepicker-field" class="datepicker input-auto" data-validation="">October 2019</span>
          </span>
          ${this.settings.showToday ? `<a class="hyperlink today" href="#">${Locale.translate('Today', { locale: this.locale.name, language: this.language })}</a>` : ''}
        </div>
        <div class="toolbar-section buttonset l-align-right">
          ${!this.settings.showViewChanger ? '' : `<label for="calendar-view-changer" class="label audible">${Locale.translate('ChangeView', { locale: this.locale.name, language: this.language })}</label>
            <select id="calendar-view-changer" name="calendar-view-changer" class="dropdown">
              <option value="month"${this.settings.viewChangerValue === 'month' ? ' selected' : ''}>${Locale.translate('Month', { locale: this.locale.name, language: this.language })}</option>
              <option value="week"${this.settings.viewChangerValue === 'week' ? ' selected' : ''}>${Locale.translate('Week', { locale: this.locale.name, language: this.language })}</option>
              <option value="day" ${this.settings.viewChangerValue === 'day' ? ' selected' : ''}>${Locale.translate('Day', { locale: this.locale.name, language: this.language })}</option>
            </select>
          </div>`}
        </div>
      `;
    }

    // Invoke the toolbar
    this.element.toolbarflex({ allowTabs: true });

    // Setup the datepicker
    this.monthPicker = this.element.find('#monthview-datepicker-field').datepicker({
      dateFormat: Locale.calendar(
        this.locale.name,
        this.settings.language,
        this.settings.calendarName
      ).dateFormat.year,
      locale: this.settings.locale,
      language: this.settings.language,
      onOpenCalendar: this.settings.onOpenCalendar,
      isMonthPicker: this.settings.isMonthPicker,
      showToday: this.settings.showToday
    });

    if (this.settings.showViewChanger) {
      this.viewChanger = this.element.find('#calendar-view-changer').dropdown();
    }
    this.todayLink = this.element.find('.hyperlink.today');
    this.monthPickerApi = this.monthPicker.data('datepicker');

    // Hide focus on buttons
    this.element.find('button, a').hideFocus();
    this.setInternalDate(this.isIslamic ? [this.settings.year, this.settings.month, 1] :
      new Date(this.settings.year, this.settings.month, 1));
    return this;
  },

  /**
   * Set the internal date state.
   * @private
   * @param {date} date The date to set.
   * @returns {void}
   */
  setInternalDate(date) {
    if (Locale.isIslamic(this.locale.name)) {
      this.currentYear = date[0];
      this.currentMonth = date[1];
      this.currentDay = date[2];
      this.currentDateIslamic = date;
    } else {
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth();
      this.currentDay = date.getDate();
      this.currentDate = date;
    }

    this.monthPicker.text(Locale.formatDate(
      new Date(this.currentYear, this.currentMonth, this.currentDay),
      { date: 'year', locale: this.locale.name, language: this.settings.language }
    ));
    if (!this.currentCalendar || !this.currentCalendar.months) {
      this.currentCalendar = Locale.calendar(
        this.locale.name,
        this.settings.language,
        this.settings.calendarName
      );
    }

    const monthName = this.currentCalendar.months ? this.currentCalendar.months.wide[this.currentMonth] : '';
    this.element.find('span.month').attr('data-month', this.currentMonth).text(monthName);
    this.element.find('span.year').text(` ${this.currentYear}`);

    // Some locales set the year first
    const yearFirst = this.currentCalendar.dateFormat.year && this.currentCalendar.dateFormat.year.substr(1, 1) === 'y';
    if (yearFirst) {
      const translation = Locale.formatDate(this.currentDate, { date: 'year', locale: this.locale.name });
      const split = translation.split(' ');
      const justYear = split[0];

      if (split.length === 3) {
        this.element.find('span.month').attr('data-month', this.currentMonth).text(`${split[1]} ${split[2]}`);
      }
      this.element.find('span.year').text(`${justYear} `);
      this.element.find('span.year').insertBefore(this.element.find('span.month'));
    }
    return this;
  },

  /**
   * Set current calendar
   * @private
   * @returns {this} Rhe object for chaining
   */
  setCurrentCalendar() {
    this.currentCalendar = Locale.calendar(
      this.locale.name,
      this.settings.language,
      this.settings.calendarName
    );
    this.isIslamic = this.currentCalendar.name === 'islamic-umalqura';
    this.isRTL = (this.locale.direction || this.locale.data.direction) === 'right-to-left';
    return this;
  },

  /**
   * Set current locale to be used if different than the set locale.
   * @private
   * @returns {void}
   */
  setLocale() {
    if (this.settings.language) {
      Locale.getLocale(this.settings.language);
      this.language = this.settings.language;
    } else {
      this.language = Locale.currentLanguage.name;
    }

    if (this.settings.locale && (!this.locale || this.locale.name !== this.settings.locale)) {
      Locale.getLocale(this.settings.locale).done((locale) => {
        this.locale = Locale.cultures[locale];
        this.language = this.settings.language || this.locale.language;
        this.setCurrentCalendar();
      });
    } else if (!this.settings.locale) {
      this.locale = Locale.currentLocale;
      this.setCurrentCalendar();
    }
    return this;
  },

  /**
   * Set the view changer dropdown value
   * @private
   * @param {string} viewChangerValue The view changer value to use (month, day or week)
   * @returns {void}
   */
  setViewChangerValue(viewChangerValue) {
    this.settings.viewChangerValue = viewChangerValue;
    this.viewChanger.val(viewChangerValue).trigger('updated');
  },

  /**
   * Attach Events used by the Component.
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    this.monthPicker.off('change.calendar-toolbar-p').on('change.calendar-toolbar-p', function () {
      const picker = $(this).data('datepicker');
      self.setInternalDate(picker.isIslamic ? picker.currentDateIslamic : picker.currentDate);
      self.element.trigger('change-date', { selectedDate: picker.currentDate, isToday: false });
    });

    this.todayLink.off('click.calendar-toolbar-t').on('click.calendar-toolbar-t', (e) => {
      this.element.trigger('change-date', { selectedDate: this.currentDate, isToday: true });
      e.preventDefault();
    });

    this.element.find('.prev').off('click.calendar-toolbar-b').on('click.calendar-toolbar-b', () => {
      this.element.trigger('change-prev', { selectedDate: this.currentDate, isToday: false });
    });
    this.element.find('.next').off('click.calendar-toolbar-b').on('click.calendar-toolbar-b', () => {
      this.element.trigger('change-next', { selectedDate: this.currentDate, isToday: false });
    });

    if (this.settings.onChangeView) {
      this.element.find('#calendar-view-changer').off('change.calendar-toolbar-v').on('change.calendar-toolbar-v', (e) => {
        this.settings.onChangeView({
          viewName: e.currentTarget.value,
          elem: e.currentTarget,
          api: this
        });
      });
    }
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, COMPONENT_DEFAULTS);
    }
    return this
      .teardown()
      .init();
  },

  /**
   * Teardown all event handles.
   * @returns {void}
   */
  teardown() {
    this.element.off();
    this.monthPicker.off();
    this.todayLink.off();
    this.element.find('.prev .next').off();
    return this;
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }

};

export { CalendarToolbar, COMPONENT_NAME };
