import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { stringUtils } from '../../utils/string';

// jQuery Components
import '../../utils/behaviors'; // hidefocus
import '../dropdown/dropdown.jquery';
import '../toolbar-flex/toolbar-flex.jquery';
import { breakpoints } from '../../utils/breakpoints';

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
 * @param {boolean} [settings.showNextPrevious=true] If true the Next Previous buttons will shown on the header.
 * @param {function} [settings.onOpenCalendar] Call back for when the calendar is open on the toolbar datepicker, allows you to set the date.
 * @param {function} [settings.onChangeView] Call back for when the view changer is changed.
 * @param {boolean} [settings.isAlternate] Alternate style for the datepicker popup.
 * @param {boolean} [settings.isMenuButton] Show the month/year as a menu button object, works if isAlternate is true.
 * @param {boolean} [settings.isMonthPicker] Indicates this is a month picker on the month and week view. Has some slight different behavior.
 * @param {boolean} [settings.showViewChanger=false] If false the dropdown to change views will not be shown.
 * @param {string} [settings.viewChangerValue='month'] The value to show selected in the view changer. Can be month, week, day or schedule.
 * @param {string} [settings.attributes] Add extra attributes like id's to the element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 * @param {boolean} [settings.inPage=false] If true, will set inPage style for the month view in page option.
 * @param {boolean} [settings.inPageTitleAsButton=true] if true, will set the month-year title as button for inPage.
*/
const COMPONENT_DEFAULTS = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  locale: null,
  showToday: true,
  showNextPrevious: true,
  onOpenCalendar: null,
  onChangeView: null,
  isAlternate: false,
  isMenuButton: true,
  showViewChanger: false,
  viewChangerValue: 'month',
  isMonthPicker: false,
  inPage: false,
  inPageTitleAsButton: true
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
      .handleEvents()
      .handleResize();
  },

  /**
   * Set up the toolbar to the settings.
   * @private
   * @returns {void}
   */
  build() {
    const s = this.settings;
    const translate = str => Locale.translate(str, { locale: this.locale.name, language: this.language });
    this.element[0].classList.add('flex-toolbar');
    this.element[0].setAttribute('data-init', 'false');

    const todayLink = { text: translate('Today'), class: 'today' };
    let isRippleClass = s.inPage ? ' is-ripple' : '';

    // inPage setup
    s.inPage = stringUtils.toBoolean(s.inPage);
    s.inPageTitleAsButton = stringUtils.toBoolean(s.inPageTitleAsButton);
    if (s.inPage) {
      this.element.addClass('is-inpage');
      if (!s.showToday) {
        isRippleClass = '';
        todayLink.text = translate('Apply');
        todayLink.class = 'apply is-apply hidden';
      }
    }

    todayLink.class += ` hyperlink${isRippleClass}`;
    const todayStr = s.showToday || s.inPage ? `<br id="today-break" style="display: none;"><a id="today-link" class="${todayLink.class}}" href="#">${todayLink.text}</a>` : '';

    // Next Previous Buttons
    const nextPrevClass = s.showNextPrevious ? '' : ' no-next-previous';
    const nextPrevButtonsHtml = !s.showNextPrevious ? '' :
      `<button type="button" class="btn-icon prev">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-caret-left"></use>
        </svg>
        <span>${translate('PreviousMonth')}</span>
      </button>
      <button type="button" class="btn-icon next">
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-caret-right"></use>
          </svg>
          <span>${translate('NextMonth')}</span>
      </button>`;

    if (s.isAlternate || s.inPage) {
      if (s.isAlternate) {
        this.element[0].classList.add('is-alternate');
      }

      const monthYearPaneButton = `
        <button type="button" class="btn btn-monthyear-pane expandable-area-trigger" id="btn-monthyear-pane">
          <span class="month">november</span>
          <span class="year">2019</span>
          <svg class="icon icon-closed" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-dropdown"></use>
          </svg>
          <svg class="icon icon-opened" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-dropdown"></use>
          </svg>
        </button>`;

      const menuBtnOrHtml = s.isMenuButton ? monthYearPaneButton : '<span class="month">november</span><span class="year">2015</span>';

      const endSectionHtml = `
        <div class="toolbar-section buttonset l-align-${this.isRTL ? 'left' : 'right'}${nextPrevClass}">
          ${todayStr}
          ${nextPrevButtonsHtml}
        </div>`;

      let inPageHtml = '';
      if (s.inPage) {
        const calMonthYearButton = `
          <button type="button" class="btn btn-cal-month-year" id="btn-cal-month-year">
            ${$.createIcon('calendar')}
            <span class="month">november</span>
            <span class="year">2019</span>
          </button>`;

        const calButton = `
          <button class="btn-icon btn-inpage-cal" type="button" id="btn-inpage-cal">
            <span class="audible"></span>
            ${$.createIcon('calendar')}
          </button>`;

        if (!s.inPageTitleAsButton) {
          inPageHtml = `${calButton} <span class="month">november</span><span class="year">2015</span>`;
        } else if (s.isMenuButton) {
          inPageHtml = `${calButton} ${monthYearPaneButton}`;
        } else {
          inPageHtml = calMonthYearButton;
        }
      }

      this.element[0].innerHTML = `
        <div class="toolbar-section">
          ${s.inPage ? inPageHtml : menuBtnOrHtml}
        </div>
        ${endSectionHtml}`;
    } else {
      this.element[0].innerHTML = `
        <div class="toolbar-section${nextPrevClass}">
          ${nextPrevButtonsHtml}
          <span class="monthview-datepicker">
            <span class="hidden month" data-month="9">9</span>
            <span class="hidden year">2019</span>
            <span class="audible">${translate('SelectDay')}</span>
            <span tabindex="0" aria-label="${translate('Today')}" id="monthview-datepicker-field" class="datepicker input-auto" data-validation="">October 2019</span>
          </span>
          ${todayStr}
        </div>
        <div class="toolbar-section buttonset l-align-right">
          ${!s.showViewChanger ? '' : `<label for="${s.viewChangerValue}-calendar-view-changer" class="label audible">${translate('ChangeView')}</label>
            <select id="${s.viewChangerValue}-calendar-view-changer" name="${s.viewChangerValue}-calendar-view-changer" class="dropdown">
              <option value="month"${s.viewChangerValue === 'month' ? ' selected' : ''}>${translate('Month')}</option>
              <option value="week"${s.viewChangerValue === 'week' ? ' selected' : ''}>${translate('Week')}</option>
              <option value="day" ${s.viewChangerValue === 'day' ? ' selected' : ''}>${translate('Day')}</option>
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
        s.language,
        s.calendarName
      ).dateFormat.year,
      locale: s.locale,
      language: s.language,
      onOpenCalendar: s.onOpenCalendar,
      isMonthPicker: s.isMonthPicker,
      showToday: s.showToday
    });

    if (s.showViewChanger) {
      this.viewChanger = this.element.find(`#${s.viewChangerValue}-calendar-view-changer`).dropdown();
    }
    this.todayLink = this.element.find('.hyperlink.today, .hyperlink.is-apply');
    this.monthPickerApi = this.monthPicker.data('datepicker');

    // Hide focus on buttons
    this.element.find('button, a').hideFocus();
    this.setInternalDate(this.isIslamic ? [s.year, s.month, 1] : new Date(s.year, s.month, 1));

    utils.addAttributes(this.element.find('.next'), this, s.attributes, `${s.viewChangerValue}-view-btn-next`);
    utils.addAttributes(this.element.find('.prev'), this, s.attributes, `${s.viewChangerValue}-view-btn-prev`);
    utils.addAttributes(this.element.find('.today'), this, s.attributes, `${s.viewChangerValue}-view-today`);
    utils.addAttributes(this.element.find('#monthview-datepicker-field + .trigger'), this, s.attributes, `${s.viewChangerValue}-view-datepicker-trigger`, true);
    utils.addAttributes(this.element.find('#monthview-datepicker-field'), this, s.attributes, `${s.viewChangerValue}-view-datepicker`, true);

    utils.addAttributes($('.monthview-header #month-calendar-view-changer [value="month"]'), this, s.attributes, 'month-view-changer-month');
    utils.addAttributes($('.monthview-header #month-calendar-view-changer [value="week"]'), this, s.attributes, 'month-view-changer-week');
    utils.addAttributes($('.monthview-header #month-calendar-view-changer [value="day"]'), this, s.attributes, 'month-view-changer-day');
    utils.addAttributes($('.monthview-header #month-calendar-view-changer'), this, s.attributes, 'month-view-changer');
    utils.addAttributes($('.week-view-header #week-calendar-view-changer [value="month"]'), this, s.attributes, 'week-view-changer-month');
    utils.addAttributes($('.week-view-header #week-calendar-view-changer [value="week"]'), this, s.attributes, 'week-view-changer-week');
    utils.addAttributes($('.week-view-header #week-calendar-view-changer [value="day"]'), this, s.attributes, 'week-view-changer-day');
    utils.addAttributes($('.week-view-header #week-calendar-view-changer'), this, s.attributes, 'week-view-changer');

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
      const args = { selectedDate: this.currentDate, isToday: true };
      if (!e.target.classList.contains('today') && e.target.classList.contains('apply')) {
        args.isToday = false;
        args.isApply = true;
      }
      this.element.trigger('change-date', args);
      e.preventDefault();
    });

    this.element.find('.prev').off('click.calendar-toolbar-b').on('click.calendar-toolbar-b', () => {
      this.element.trigger('change-prev', { selectedDate: this.currentDate, isToday: false });
    });
    this.element.find('.next').off('click.calendar-toolbar-b').on('click.calendar-toolbar-b', () => {
      this.element.trigger('change-next', { selectedDate: this.currentDate, isToday: false });
    });

    if (this.settings.onChangeView && this.viewChanger) {
      this.viewChanger.off('change.calendar-toolbar-v').on('change.calendar-toolbar-v', (e) => {
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
   * Handle resize of calendar.
   * @private
   * @returns {void}
   */
  handleResize() {
    const resize = () => {
      if (breakpoints.isBelow('slim')) {
        this.viewChanger.next().addClass('dropdown-wrapper-small');
        this.viewChanger.next().find('.dropdown').css({
          width: `${breakpoints.isBelow('phone') ? '60' : '80'}px`
        });
        $('#today-link').removeAttr('style');
        $('#today-break').removeAttr('style');
        $('#today-link').addClass('today-small');
      } else {
        this.viewChanger.next().removeClass('dropdown-wrapper-small');
        this.viewChanger.next().find('.dropdown').removeAttr('style');
        $('#today-link').removeAttr('style');
        $('#today-break').css({ display: 'none' });
        $('#today-link').removeClass('today-small');
      }
    };

    resize();

    $(window).on('resize', () => {
      resize();
    });

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
