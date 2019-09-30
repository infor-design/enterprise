import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { dateUtils } from '../../utils/date';

// Settings and Options
const COMPONENT_NAME = 'weekview';
const current = new Date();
const first = current.getDate() - current.getDay();
const last = first + 6;

const COMPONENT_NAME_DEFAULTS = {
  eventTypes: [
    { id: 'example', label: 'Example', color: 'emerald07', checked: true, click: () => {} },
  ],
  events: [],
  locale: null,
  startDate: new Date(current.setDate(first)),
  endDate: new Date(current.setDate(last)),
  showAllDay: true,
  startHour: 7,
  endHour: 19
};

/**
 * WeekView - Renders a Week View Calendar
 * @class WeekView
 * @param {string} element The plugin element for the constuctor
 * @param {object} [settings] The settings element.
 * @param {array} [settings.eventTypes] An array of objects with data for the event types.
 * @param {array} [settings.events] An array of objects with data for the events.
 * @param {string} [settings.locale] The name of the locale to use for this instance. If not set the current locale will be used.
 * @param {date} [settings.startDate] Start of the week to show.
 * @param {date} [settings.endDate] End of the week to show.
 * @param {boolean} [settings.showAllDay=true] Detemines if the all day events row should be shown.
 * @param {number} [settings.startHour=7] The hour (0-24) to end on each day.
 * @param {number} [settings.endHour=19] The hour (0-24) to end on each day.
 */
function WeekView(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COMPONENT_NAME_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
WeekView.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    return this.build();
  },

  /**
   * Set current locale to be used
   * @private
   * @returns {void}
   */
  setLocale() {
    if (this.settings.locale && (!this.locale || this.locale.name !== this.settings.locale)) {
      Locale.getLocale(this.settings.locale).done((locale) => {
        this.locale = Locale.cultures[locale];
        this.setCurrentCalendar();
        this.build().handleEvents();
      });
    } else if (!this.settings.locale) {
      this.locale = Locale.currentLocale;
    }
  },

  /**
   * Add any needed markup to the component.
   * @private
   * @returns {object} The WeekView prototype, useful for chaining.
   */
  build() {
    this.setLocale();
    if (this.rendered ||
      (this.settings.locale && (!this.locale || this.locale.name !== this.settings.locale))) {
      // Defer loading
      this.rendered = false;
      return this;
    }

    this.showWeek(this.settings.startDate, this.settings.endDate);
    this.handleEvents();
    return this;
  },

  /**
   * Update the weekview to show the given range of days.
   * @param {date} startDate The start of the week or range.
   * @param {date} endDate The end of the week or range.
   * @returns {void}
   */
  showWeek(startDate, endDate) {
    // Create the header consisting of days in the range
    this.weekHeader = `<thead class="week-view-table-header"><tr><th><div class="week-view-header-wrapper"><span class="audible">${Locale.translate('Hour')}</span></div>`;
    if (this.settings.showAllDay) {
      this.weekHeader += `<div class="week-view-all-day-wrapper">${Locale.translate('AllDay', this.locale.name)}</div>`;
    }
    this.weekHeader += '</th>';

    for (let day = new Date(startDate.getTime()); day <= endDate; day.setDate(day.getDate() + 1)) {
      this.weekHeader += `<th><div class="week-view-header-wrapper${dateUtils.isToday(day) ? ' is-today' : ''}">${Locale.formatDate(day, { pattern: 'dd EEEE', locale: this.locale.name })}</div>`;
      if (this.settings.showAllDay) {
        this.weekHeader += '<div class="week-view-all-day-wrapper"></div>';
      }
      this.weekHeader += '</th>';
    }
    this.weekHeader += '</tr></thead>';

    // Show the hours in the days
    this.weekBody = '<tbody>';
    for (let hour = this.settings.startHour; hour <= this.settings.endHour; hour++) {
      let weekRow = `<tr class="week-view-hour-row" data-hour="${hour}"><td><div class="week-view-cell-wrapper">${Locale.formatHour(hour)}</div></td>`;
      let halfHourRow = '<tr class="week-view-half-hour-row"><td><div class="week-view-cell-wrapper"></div></td>';

      for (let day = new Date(startDate.getTime()); day <= endDate; day.setDate(day.getDate() + 1)) { //eslint-disable-line
        weekRow += `<td><div class="week-view-cell-wrapper">&nbsp;</div></td>`;
        halfHourRow += `<td><div class="week-view-cell-wrapper">&nbsp;</div></td>`;
      }
      weekRow += '</tr>';
      halfHourRow += '</tr>';
      this.weekBody += weekRow + halfHourRow;
    }
    this.weekBody += '</tbody>';

    // Render the table and show the event
    this.weekContainer = `<div class="week-view-container"><table class="week-view-table">${this.weekHeader}${this.weekBody}</table></div>`;
    this.element
      .empty()
      .append(this.weekContainer)
      .trigger('weekrendered', { startDate, endDate, elem: this.element, api: this });

    // Add the time line
    this.addTimeLine();
  },

  /**
   * Add a time line on the weekview which moves.
   * @private
   */
  addTimeLine() {
    const setTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const diff = hours - this.settings.startHour + (mins / 60);
      this.markers.css('top', ((diff) * 50) - 5);
    };

    if (!this.timeMarker) {
      this.element.find('.week-view-hour-row:nth-child(1) td').prepend('<div class="week-view-time-marker"></div>');
      this.markers = $('.week-view-time-marker');
      setTime();

      this.timer = setInterval(() => {
        setTime();
      }, 30 * 1000);
    }
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    this.element.off(`updated.${COMPONENT_NAME}`).on(`updated.${COMPONENT_NAME}`, () => {
      this.updated();
    });

    return this;
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
    this.element.off();
    return this;
  },

  /**
   * Destroy - Remove added markup and events.
   * @private
   * @returns {object} The prototype.
   */
  destroy() {
    this.teardown();
    this.element.empty();
    $.removeData(this.element[0], COMPONENT_NAME);
    return this;
  }
};

export { WeekView, COMPONENT_NAME };
