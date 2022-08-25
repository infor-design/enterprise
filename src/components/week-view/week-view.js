import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { Locale } from '../locale/locale';
import { colorUtils } from '../../utils/color';
import { stringUtils } from '../../utils/string';
import { dateUtils } from '../../utils/date';
import { theme } from '../theme/theme';
import { CalendarToolbar } from '../calendar/calendar-toolbar';
import { calendarShared } from '../calendar/calendar-shared';

// Settings and Options
const COMPONENT_NAME = 'weekview';

const COMPONENT_NAME_DEFAULTS = {
  eventTypes: [
    { id: 'example', label: 'Example', color: 'emerald07', checked: true, click: () => {} },
  ],
  filteredTypes: [],
  events: [],
  locale: null,
  language: null,
  firstDayOfWeek: 0,
  startDate: null,
  endDate: null,
  showAllDay: true,
  showTimeLine: true,
  startHour: 7,
  endHour: 19,
  disable: {
    dayOfWeek: [],
  },
  showToday: true,
  showViewChanger: true,
  hitbox: false,
  onChangeView: null,
  onChangeWeek: null,
  onRenderWeek: null,
  eventTooltip: 'overflow',
  iconTooltip: 'overflow'
};

/**
 * WeekView - Renders a Week View Calendar
 * @class WeekView
 * @param {string} element The plugin element for the constuctor
 * @param {object} [settings] The settings element.
 * @param {array} [settings.eventTypes] An array of objects with data for the event types.
 * @param {array} [settings.events] An array of objects with data for the events.
 * @param {string} [settings.locale] The name of the locale to use for this instance. If not set the current locale will be used.
 * @param {string} [settings.language] The name of the language to use for this instance. If not set the current locale will be used or the passed locale will be used.
 * @param {date} [settings.startDate] Start of the week to show.
 * @param {date} [settings.endDate] End of the week to show.
 * @param {boolean} [settings.firstDayOfWeek=0] Set first day of the week. '1' would be Monday.
 * @param {boolean} [settings.showAllDay=true] Detemines if the all day events row should be shown.
 * @param {boolean} [settings.showTimeLine=true] Shows a bar across the current time.
 * @param {number} [settings.startHour=7] The hour (0-24) to end on each day.
 * @param {number} [settings.endHour=19] The hour (0-24) to end on each day.
 * @param {boolean} [settings.showToday=true] Deterimines if the today button should be shown.
 * @param {boolean} [settings.showViewChanger] If false the dropdown to change views will not be shown.
 * @param {boolean} [settings.hitbox=false] Enable hitbox for toolbar buttons.
 * @param {function} [settings.onChangeView] Call back for when the view changer is changed.
 * @param {function} [settings.onChangeWeek] Call back for when the week is changed.
 * @param {function} [settings.onRenderMonth] Fires when a week is rendered, allowing you to pass back events or event types to show.
 * @param {string | function} [settings.eventTooltip] The content of event tooltip. Default value is 'overflow'
 * @param {string | function} [settings.iconTooltip] The content of event icon tooltip. Default value is 'overflow'
 * @param {string} [settings.attributes] Add extra attributes like id's to the element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
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
    if (!this.settings.startDate) {
      this.settings.startDate = dateUtils.firstDayOfWeek(new Date(), this.settings.firstDayOfWeek);
    }

    if (!this.settings.endDate) {
      this.settings.endDate = dateUtils.lastDayOfWeek(new Date(), this.settings.firstDayOfWeek);
    }

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
      this.build();
    });
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
      this.settings.language,
      this.settings.calendarName
    );

    this.isRTL = (this.locale.direction || this.locale.data.direction) === 'right-to-left';
    this.conversions = this.currentCalendar.conversions;
    return this;
  },

  /**
   * Add any needed markup to the component.
   * @private
   * @returns {object} The WeekView prototype, useful for chaining.
   */
  build() {
    this.addToolbar();
    this.showWeek(this.settings.startDate, this.settings.endDate);
    this.handleEvents();
    utils.addAttributes(this.element, this, this.settings.attributes);
    return this;
  },

  /**
   * Render all the events in the current view.
   * @param {boolean} isCallback Will be set to true when a callback occurs
   * @private
   */
  renderAllEvents(isCallback) {
    if (this.settings.onRenderWeek && !isCallback) {
      this.callOnRenderWeek();
      return;
    }

    // Clone and sort the array
    const eventsSorted = this.settings.events.slice(0);
    eventsSorted.sort((a, b) => (a.starts < b.starts ? -1 : (a.starts > b.starts ? 1 : 0))); // eslint-disable-line
    this.removeAllEvents();

    for (let i = 0; i < eventsSorted.length; i++) {
      const event = eventsSorted[i];
      if (this.settings.filteredTypes.indexOf(event.type) > -1) {
        continue;
      }
      this.renderEvent(event);
    }
  },

  /**
   * Execute onRenderWeek and handle the call back.
   * @private
   */
  callOnRenderWeek() {
    const self = this;

    function response(events, eventTypes) {
      if (eventTypes && eventTypes.length > 0) {
        self.settings.eventTypes = eventTypes;
      }
      if (events && events.length > 0) {
        self.settings.events = events;
        self.renderAllEvents(true);
      }
    }

    this.settings.onRenderWeek(this.element, response, {
      api: self,
      settings: this.settings
    });
  },

  /**
   * Remove all events from the month.
   * @private
   */
  removeAllEvents() {
    const events = this.element[0].querySelectorAll('.calendar-event');
    for (let i = 0; i < events.length; i++) {
      events[i].parentNode.removeChild(events[i]);
    }

    for (let i = 0; i < this.dayMap.length; i++) {
      this.dayMap[i].events = [];
    }
  },

  /**
   * Render a single event on the ui, use in the loop and other functions.
   * @private
   * @param  {object} event The event object.
   */
  renderEvent(event) {
    const startDate = new Date(event.starts);
    let startKey = stringUtils.padDate(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );

    if (Locale.isIslamic(this.locale.name)) {
      const startDateIslamic = Locale.gregorianToUmalqura(startDate);
      startKey = stringUtils.padDate(
        startDateIslamic[0],
        startDateIslamic[1],
        startDateIslamic[2]
      );
    }

    const endDate = new Date(event.ends);
    let endKey = stringUtils.padDate(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    if (Locale.isIslamic(this.locale.name)) {
      const endDateIslamic = Locale.gregorianToUmalqura(endDate);
      endKey = stringUtils.padDate(
        endDateIslamic[0],
        endDateIslamic[1],
        endDateIslamic[2]
      );
    }

    const days = this.dayMap.filter(day => day.key >= startKey && day.key <= endKey);
    event.endKey = endKey;
    event.startKey = startKey;
    event = calendarShared.addCalculatedFields(
      event,
      this.locale,
      this.language,
      this.settings.eventTypes
    );

    // Event is only on this day
    if (days.length === 1 && !event.isAllDay) {
      this.appendEventToHours(days[0].elem, event);
    }

    if (days.length === 1 && event.isAllDay) {
      this.appendEventToAllDay(days[0].elem, event);
    }

    // Event extends multiple days or is all day
    if (days.length > 1) {
      // TODO
      for (let i = 0; i < days.length; i++) {
        let cssClass = i === 0 ? 'calendar-event-start' : 'calendar-event-continue';
        if (i === days.length - 1) {
          cssClass = 'calendar-event-ends';
        }
        this.appendEventToAllDay(days[i].elem, event, cssClass);
      }
    }
  },

  /*
   * Add the ui event to the container event day
   * @private
   * @param {object} container The container to append to
   * @param {object} event The event data object.
   * @param {string} cssClass An extra css class
   */
  appendEventToAllDay(container, event, cssClass) {
    const allDayContainer = container.querySelector('.week-view-all-day-wrapper');
    if (!allDayContainer) {
      return;
    }

    const node = document.createElement('a');
    DOM.addClass(node, 'calendar-event', event.color, cssClass);
    node.setAttribute('data-id', event.id);
    node.setAttribute('data-key', event.startKey);
    node.setAttribute('href', '#');

    if (cssClass === 'calendar-event-continue' || cssClass === 'calendar-event-ends') {
      node.setAttribute('tabindex', '-1');
    }

    node.innerHTML = `<div class="calendar-event-content">
      ${event.icon ? `<span class="calendar-event-icon"><svg class="icon ${event.icon}" focusable="false" aria-hidden="true" role="presentation" data-status="${event.status}"><use href="#${event.icon}"></use></svg></span>` : ''}
      <span class="calendar-event-title">${event.shortSubject || event.subject}</span>
    </div>`;

    const containerEvents = allDayContainer.querySelectorAll('.calendar-event');
    const eventCount = containerEvents.length;

    if (eventCount >= 1) {
      node.style.top = `${22 * eventCount}px`;
    }
    if (eventCount > 2) {
      const nodes = this.element[0].querySelectorAll('.week-view-all-day-wrapper');
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].style.height = `${44 + ((eventCount - 1) * 23)}px`;
      }
    }
    allDayContainer.appendChild(node);

    utils.addAttributes($(node), this, this.settings.attributes, `week-view-event-${event.id}`);
    this.attachTooltip(node, event);
  },

  /**
   * Add the ui event to the container spanning hours
   * @private
   * @param {object} container The container to append to
   * @param {object} event The event data object.
   */
  appendEventToHours(container, event) {
    const dayHourContainers = this.element[0].querySelectorAll(`td:nth-child(${container.cellIndex + 1})`);
    for (let i = 0; i < dayHourContainers.length; i++) {
      const tdEl = dayHourContainers[i];
      const hour = parseFloat(tdEl.parentNode.getAttribute('data-hour'), 10);
      const rStartsHour = Math.round(event.startsHour);
      const isUp = rStartsHour > event.startsHour;
      const startsHere = isUp ? hour === (rStartsHour - 0.5) : hour === rStartsHour;

      if (startsHere) {
        let duration = event.endsHour - event.startsHour;
        let displayedTime = '';
        const node = document.createElement('a');
        DOM.addClass(node, 'calendar-event', event.color);
        node.setAttribute('data-id', event.id);
        node.setAttribute('data-key', event.startKey);
        node.setAttribute('href', '#');

        if (duration < 0.5) {
          DOM.addClass(node, 'reduced-padding', event.color);
        }

        if (duration < 1.5) {
          DOM.addClass(node, 'is-ellipsis');
        }

        if (duration > 2) {
          displayedTime = ` ${Locale.formatHourRange(event.startsHour, event.endsHour, { locale: this.locale })}`;
        }

        // Max out at the bottom and show the time
        if (event.startsHour + duration > this.settings.endHour) {
          DOM.addClass(node, 'is-cutoff', event.color);
          duration = this.settings.endHour + 1 - event.startsHour;
        }

        if (duration < 0.25) {
          duration = 0.25;
        }

        // Set css top property if there extra starting time
        if (event.startsHour > hour) {
          const unit = 0.016666666666666784; // unit for one minute
          const extra = event.startsHour - hour; // extract extra minutes
          const height = tdEl.parentNode.offsetHeight; // container height

          // calculate top value
          node.style.top = `${(extra / unit) * (height / 30)}px`; // 30-minutes each row
        }

        // Add one per half hour + 1 px for each border crossed
        node.style.height = `${25 * (duration * 2) + (1.5 * duration)}px`;

        node.innerHTML = `<div class="calendar-event-content">
          ${event.icon ? `<span class="calendar-event-icon"><svg class="icon ${event.icon}" focusable="false" aria-hidden="true" role="presentation" data-status="${event.status}"><use href="#${event.icon}"></use></svg></span>` : ''}
          <span class="calendar-event-title">${event.shortSubject || event.subject}${displayedTime}</span>
        </div>`;

        const containerWrapper = tdEl.querySelector('.week-view-cell-wrapper');
        const containerEvents = tdEl.querySelectorAll('.calendar-event');
        const eventCount = containerEvents.length;

        if (eventCount > 0) {
          const width = (100 / (eventCount + 1));
          let j = 0;

          for (j = 0; j < eventCount; j++) {
            containerEvents[j].style.width = `${width}%`;
            if (j > 0 && this.isRTL) {
              containerEvents[j].style.right = `${width * j}%`;
            }
            if (j > 0 && !this.isRTL) {
              containerEvents[j].style.left = `${width * j}%`;
            }
          }
          node.style.width = `${width}%`;

          if (this.isRTL) {
            node.style.right = `${width * j}%`;
          } else {
            node.style.left = `${width * j}%`;
          }
        }
        containerWrapper.appendChild(node);
        utils.addAttributes($(node), this, this.settings.attributes, `week-view-event-${event.id}`);
        this.attachTooltip(node, event);
      }
    }
  },

  /**
   * Add the tooltip functionality.
   * @private
   * @param {object} node The dom element.
   * @param {object} event The event data object.
   */
  attachTooltip(node, event) {
    if (this.settings.iconTooltip !== 'overflow') {
      const icon = node.querySelector('.calendar-event-icon');
      if (icon) {
        if (typeof this.settings.iconTooltip === 'function') {
          this.settings.iconTooltip({
            settings: this.settings,
            event
          });
        } else if (event[this.settings.iconTooltip]) {
          icon.setAttribute('title', event[this.settings.iconTooltip]);
          $(icon).tooltip({
            content: icon.innerText
          });
        }
      }
    }

    if (this.settings.eventTooltip !== 'overflow') {
      if (typeof this.settings.eventTooltip === 'function') {
        this.settings.eventTooltip({
          settings: this.settings,
          event
        });
      } else if (event[this.settings.eventTooltip]) {
        node.setAttribute('title', event[this.settings.eventTooltip]);
        $(node).tooltip({
          content: node.innerText
        });
      }
    }

    if (!event.shortSubject && (this.settings.eventTooltip === 'overflow' || this.settings.iconToolTip === 'overflow')) {
      // Show the full text if cut off
      node.setAttribute('title', event.subject);
      $(node).tooltip({
        beforeShow: (response, ui) => {
          const title = ui[0].querySelector('.calendar-event-title');
          const icon = ui[0].querySelector('.calendar-event-icon');
          const iconStatus = icon ? icon.querySelector('.icon').getAttribute('data-status') : '';

          if (title.offsetWidth > ui[0].scrollWidth - (icon ? icon.offsetWidth : 0)) {
            response(`${title.innerText}${iconStatus ? ` (${Locale.translate(iconStatus, { locale: this.locale.name }, false)})` : ''}`);
            return;
          }
          response(false);
        }
      });
    }
  },

  /**
   * Update the weekview to show the given range of days.
   * @param {date} startDate The start of the week or range.
   * @param {date} endDate The end of the week or range.
   * @returns {void}
   */
  showWeek(startDate, endDate) {
    this.numberOfDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

    const gregStartDate = new Date(startDate.getTime());
    const gregEndDate = new Date(endDate.getTime());

    if (Locale.isIslamic(this.locale.name)) {
      startDate = Locale.gregorianToUmalqura(startDate);
      startDate = new Date(
        startDate[0],
        startDate[1],
        startDate[2],
        startDate[3],
        startDate[4],
        startDate[5],
        startDate[6]
      );
      endDate = Locale.gregorianToUmalqura(endDate);
      endDate = new Date(
        endDate[0],
        endDate[1],
        endDate[2],
        endDate[3],
        endDate[4],
        endDate[5],
        endDate[6]
      );
    }

    this.dayMap = [];
    this.isDayView = false;
    this.element.removeClass('is-day-view');

    if (this.numberOfDays === 0 || this.numberOfDays === 1) {
      this.element.addClass('is-day-view');
      this.isDayView = true;
      this.element.find('#calendar-view-changer').val('day').trigger('updated');
    }
    this.hasIrregularDays = this.numberOfDays !== 7;

    // Create the header consisting of days in the range
    this.weekHeader = `<thead class="week-view-table-header"><tr><th><div class="week-view-header-wrapper"><span class="audible">${Locale.translate('Hour')}</span></div>`;
    if (this.settings.showAllDay) {
      this.weekHeader += `<div class="week-view-all-day-wrapper">${Locale.translate('AllDay', this.locale.name)}</div>`;
    }
    this.weekHeader += '</th>';

    for (let day = new Date(startDate.getTime()); day <= endDate; day.setDate(day.getDate() + 1)) {
      // TODO if this is 'dd EEEE' has wierd overflow
      const dayValue = Locale.formatDate(day, { pattern: 'd', locale: this.locale.name });
      const dayNameValue = Locale.formatDate(day, { pattern: 'EEE', locale: this.locale.name });
      const dayOfWeekSetting = this.currentCalendar.dateFormat.dayOfWeek;
      const emphasis = dayOfWeekSetting ? dayOfWeekSetting.split(' ')[0] === 'EEE' : 'd EEE';
      this.weekHeader += `<th data-key="${stringUtils.padDate(day.getFullYear(), day.getMonth(), day.getDate())}"><div class="week-view-header-wrapper${dateUtils.isToday(day) ? ' is-today' : ''}"><span class="week-view-header-day-of-week${emphasis ? '' : ' is-emphasis'}">${emphasis ? dayNameValue : dayValue}</span><span class="week-view-header-day-of-week${emphasis ? ' is-emphasis' : ''}">${emphasis ? dayValue : dayNameValue}</span></div>`;
      if (this.settings.showAllDay) {
        this.weekHeader += '<div class="week-view-all-day-wrapper"></div>';
      }
      this.weekHeader += '</th>';
    }
    this.weekHeader += '</tr></thead>';

    // Show the hours in the days
    this.weekBody = '<tbody>';
    for (let hour = this.settings.startHour; hour <= this.settings.endHour; hour++) {
      let weekRow = `<tr class="week-view-hour-row" data-hour="${hour}"><td><div class="week-view-cell-wrapper">${Locale.formatHour(hour, { locale: this.locale })}</div></td>`;
      let halfHourRow = `<tr class="week-view-half-hour-row" data-hour="${hour}.5"><td><div class="week-view-cell-wrapper"></div></td>`;

      for (let day = new Date(startDate.getTime()); day <= endDate; day.setDate(day.getDate() + 1)) { //eslint-disable-line
        weekRow += '<td><div class="week-view-cell-wrapper"></div></td>';
        halfHourRow += '<td><div class="week-view-cell-wrapper"></div></td>';
      }
      weekRow += '</tr>';
      halfHourRow += '</tr>';
      this.weekBody += weekRow + halfHourRow;
    }
    this.weekBody += '</tbody>';

    // Render the table and show the event
    this.weekContainer = `<div class="week-view-container"><table class="week-view-table">${this.weekHeader}${this.weekBody}</table></div>`;
    this.element.find('.week-view-container').remove();

    const args = {
      isDayView: this.isDayView,
      startDate: Locale.isIslamic(this.locale.name) ? gregStartDate : startDate,
      endDate: Locale.isIslamic(this.locale.name) ? gregEndDate : endDate,
      elem: this.element,
      api: this
    };

    /**
    * Fires as the calendar popup is opened.
    * @event weekrendered
    * @memberof WeekView
    * @property {object} event - The jquery event object
    * @property {object} args - The event arguments
    * @property {boolean} args.isDayView - True if one day is showing.
    * @property {object} args.startDate - The start date of the event
    * @property {object} args.endDate - The start date of the event
    * @property {object} args.elem - The current element.
    * @property {object} args.api - The WeekView api
    */
    this.element
      .append(this.weekContainer)
      .trigger('weekrendered', args);

    if (this.settings.onChangeWeek) {
      this.settings.onChangeWeek(args);
    }

    this.element.find('th').each((i, elem) => {
      const key = elem.getAttribute('data-key');
      if (key) {
        this.dayMap.push({ key, elem });
      }
    });

    // Add the time line and update the text on the month
    this.addTimeLine();
    this.showToolbarMonth(startDate, endDate);
    this.renderDisable();
    this.renderLegend();
    this.renderAllEvents();

    // Update currently set start and end date
    this.settings.startDate = Locale.isIslamic(this.locale.name) ? gregStartDate : startDate;
    this.settings.endDate = Locale.isIslamic(this.locale.name) ? gregEndDate : endDate;
  },

  renderDisable() {
    if (!this.settings.disable.dayOfWeek.length > 0) {
      return;
    }

    const dayOfWeek = this.settings.disable.dayOfWeek;
    if (this.dayMap.length === 1) {
      const dayMap = this.dayMap[0];
      const dString = dayMap.key;
      const year = dString.substring(0, 4);
      const month = dString.substring(4, 6);
      const day = dString.substring(6, 8);
      const startDate = new Date(year, month - 1, day);
      
      if (dayOfWeek.includes(startDate.getDay())) {
        const container = dayMap.elem;
        this.renderDisableToContainer(container);
      }
    } else {
      for (let j = 0; j < dayOfWeek.length; j++) {
        const day = this.dayMap[dayOfWeek[j]];
        const container = day.elem;
        this.renderDisableToContainer(container);
      }
    }
  },

  renderDisableToContainer(container) {
    const dayHourContainers = this.element[0].querySelectorAll(`td:nth-child(${container.cellIndex + 1})`);
    for (let i = 0; i < dayHourContainers.length; i++) {
      const tdEl = dayHourContainers[i];
      const hourWrapper = $(tdEl.querySelector('.week-view-cell-wrapper'));
      hourWrapper.addClass('is-disabled');
    }

    const allDayContainer = container.querySelector('.week-view-all-day-wrapper');
    if (allDayContainer) {
      allDayContainer.classList.add('is-disabled');
    }
  },

  renderLegend() {
    if (!this.settings.showLegend) {
      return;
    }

    const legends = this.settings.legend;
    for (let i = 0; i < legends.length; i++) {
      const dates = legends[i].dates;
      for (let j = 0; j < dates.length; j++) {
        const startDate = new Date(dates[j]);
        let startKey = stringUtils.padDate(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        );
    
        if (Locale.isIslamic(this.locale.name)) {
          const startDateIslamic = Locale.gregorianToUmalqura(startDate);
          startKey = stringUtils.padDate(
            startDateIslamic[0],
            startDateIslamic[1],
            startDateIslamic[2]
          );
        }
    
        const endDate = new Date(dates[j]);
        let endKey = stringUtils.padDate(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );
    
        if (Locale.isIslamic(this.locale.name)) {
          const endDateIslamic = Locale.gregorianToUmalqura(endDate);
          endKey = stringUtils.padDate(
            endDateIslamic[0],
            endDateIslamic[1],
            endDateIslamic[2]
          );
        }

        const days = this.dayMap.filter(day => day.key >= startKey && day.key <= endKey);
        if (days.length > 0) {
          let legendColor = legends[i].color;

          if (legendColor.indexOf('#') === -1) {
            const name = legendColor.replace(/[0-9]/g, '');
            const number = legendColor.substr(legendColor.length - 2, 2) * 10;
            legendColor = theme.themeColors().palette[name][number].value;
          }

          const normalColor = colorUtils.hexToRgba(legendColor, 0.3);
          const container = days[0].elem;
          const dayHourContainers = this.element[0].querySelectorAll(`td:nth-child(${container.cellIndex + 1})`);
          for (let k = 0; k < dayHourContainers.length; k++) {
            const tdEl = dayHourContainers[k];
            const hourWrapper = $(tdEl.querySelector('.week-view-cell-wrapper'));
            hourWrapper.addClass('is-colored');
            hourWrapper[0].setAttribute('data-hex', legendColor);
            hourWrapper[0].style.backgroundColor = normalColor;
          }

          const allDayContainer = $(container.querySelector('.week-view-all-day-wrapper'));
          if (allDayContainer) {
            allDayContainer.addClass('is-colored');
            allDayContainer[0].setAttribute('data-hex', legendColor);
            allDayContainer[0].style.backgroundColor = normalColor;
          }
        }
      }
    }
  },

  /**
   * Update the weekview toolbar to show month(s) being show.
   * @private
   * @param {date} startDate The start of the week or range.
   * @param {date} endDate The end of the week or range.
   * @returns {void}
   */
  showToolbarMonth(startDate, endDate) {
    const startMonth = Locale.formatDate(startDate, { pattern: 'MMMM', locale: this.locale.name });
    const endMonth = Locale.formatDate(endDate, { pattern: 'MMMM', locale: this.locale.name });
    const startYear = Locale.formatDate(startDate, { pattern: 'yyyy', locale: this.locale.name });
    const endYear = Locale.formatDate(endDate, { pattern: 'yyyy', locale: this.locale.name });
    let monthStr = Locale.formatDate(endDate, { date: 'year', locale: this.locale.name });

    if (endMonth !== startMonth) {
      monthStr = `${Locale.formatDate(startDate, { pattern: 'MMM', locale: this.locale.name })} - ${Locale.formatDate(endDate, { pattern: 'MMMM yyyy', locale: this.locale.name })}`;
    }
    if (endYear !== startYear) {
      monthStr = `${Locale.formatDate(startDate, { pattern: 'MMM yyyy', locale: this.locale.name })} - ${Locale.formatDate(endDate, { pattern: 'MMM yyyy', locale: this.locale.name })}`;
    }

    this.monthField.text(monthStr);
  },

  /**
   * Add a time line on the weekview which moves.
   * @private
   */
  addTimeLine() {
    if (!this.settings.showTimeLine) {
      return;
    }

    const setTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const diff = hours - this.settings.startHour + (mins / 60);
      // 53 is the size of one whole hour (25 + two borders)
      this.markers.css('top', ((diff) * 52));
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
   * Add and invoke the toolbar
   * @private
   */
  addToolbar() {
    // Invoke the toolbar
    const view = !this.isDayView ? 'week' : 'day';
    this.header = $('<div class="week-view-header"><div class="calendar-toolbar"></div></div>').appendTo(this.element);
    this.calendarToolbarEl = this.header.find('.calendar-toolbar');
    this.calendarToolbarAPI = new CalendarToolbar(this.calendarToolbarEl[0], {
      onOpenCalendar: () => this.settings.startDate,
      locale: this.settings.locale,
      language: this.settings.language,
      year: this.currentYear,
      month: this.currentMonth,
      showToday: this.settings.showToday,
      isAlternate: false,
      isMenuButton: true,
      showViewChanger: this.settings.showViewChanger,
      hitbox: this.settings.hitbox,
      onChangeView: this.settings.onChangeView,
      viewChangerValue: view,
      attributes: this.settings.attributes
    });
    this.monthField = this.header.find(this.settings.attributes ? `#${this.settings.attributes[0].value}-${view}-view-datepicker` : '#monthview-datepicker-field');
  },

  /**
   * Select todays date visually.
   * @private
   */
  setToday() {
    let date = new Date();

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

    const year = parseInt(date.substr(0, 4), 10);
    const month = parseInt(date.substr(4, 2), 10) - 1;

    this.calendarToolbarAPI.setInternalDate(this.isIslamic ?
      [year, month, 1] : new Date(year, month, 1));
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

    this.element.off(`change-date.${COMPONENT_NAME}`).on(`change-date.${COMPONENT_NAME}`, (e, args) => {
      const startDate = args.isToday ? new Date() : args.selectedDate;

      if (this.isDayView) {
        this.settings.startDate = startDate;
        this.settings.endDate = startDate;
      } else {
        this.settings.startDate = this.hasIrregularDays ? startDate :
          dateUtils.firstDayOfWeek(startDate, this.settings.firstDayOfWeek);
        this.settings.startDate.setHours(0, 0, 0, 0);

        this.settings.endDate = new Date(this.settings.startDate);
        this.settings.endDate.setDate(this.settings.endDate.getDate() + this.numberOfDays - 1);
        this.settings.endDate.setHours(23, 59, 59, 59);
      }
      this.showWeek(this.settings.startDate, this.settings.endDate);

      if (args.isToday) {
        this.setToday();
      }
    });

    this.element.off(`change-next.${COMPONENT_NAME}`).on(`change-next.${COMPONENT_NAME}`, () => {
      this.advanceDays(true);
    });

    this.element.off(`change-prev.${COMPONENT_NAME}`).on(`change-prev.${COMPONENT_NAME}`, () => {
      this.advanceDays(false);
    });

    const fireEvent = (target, eventName) => {
      const eventId = target.getAttribute('data-id');
      const eventData = this.settings.events.filter(event => event.id === eventId);
      if (!eventData || eventData.length === 0) {
        return;
      }
      /**
      * Fires as the calendar popup is opened.
      * @event eventclick
      * @memberof WeekView
      * @property {object} event - The jquery event object
      * @property {object} args - The event arguments
      * @property {object} args.settings - The current settings including start and end date.
      * @property {object} args.event - The event data.
      */
      /**
      * Fires as the calendar popup is opened.
      * @event eventdblclick
      * @memberof WeekView
      * @property {object} event - The jquery event object
      * @property {object} args - The event arguments
      * @property {object} args.settings - The current settings including start and end date.
      * @property {object} args.event - The event data.
      */
      this.element.trigger(eventName, { settings: this.settings, event: eventData[0] });
    };

    this.element.off(`click.${COMPONENT_NAME}`).on(`click.${COMPONENT_NAME}`, '.calendar-event', (e) => {
      fireEvent(e.currentTarget, 'eventclick');
      e.preventDefault();
    });

    this.element.off(`dblclick.${COMPONENT_NAME}`).on(`dblclick.${COMPONENT_NAME}`, '.calendar-event', (e) => {
      fireEvent(e.currentTarget, 'eventdblclick');
    });
    return this;
  },

  /**
   * Handle updated settings and values.
   * @param {boolean} advance Whether to go up or down in days.
   */
  advanceDays(advance) {
    let diff = (this.isDayView ? 1 : this.numberOfDays);
    if (!advance) {
      diff = -diff;
    }
    this.settings.startDate.setDate(this.settings.startDate.getDate() + diff);
    if (this.isDayView) {
      this.settings.endDate = new Date(this.settings.startDate);
      this.settings.startDate.setHours(0, 0, 0, 0);
      this.settings.endDate.setHours(23, 59, 59, 999);
    } else {
      this.settings.endDate.setDate(this.settings.endDate.getDate() + diff);
    }
    this.showWeek(this.settings.startDate, this.settings.endDate);
  },

  /**
   * Add a new event via the event object and show it if it should be visible in the calendar.
   * @param {object} event The event object with common event properties.
   */
  addEvent(event) {
    if (!event.startsLocale) {
      event = calendarShared.addCalculatedFields(
        event,
        this.locale,
        this.language,
        this.settings.eventTypes
      );
    }

    calendarShared.cleanEventData(
      event,
      true,
      this.settings.startDate,
      this.locale,
      this.language,
      this.settings.events,
      this.settings.eventTypes
    );

    this.settings.events.push(event);
    this.renderEvent(event);
  },

  /**
   * Select header for given date
   * @private
   * @param {object|string} d The date or key use for attribute in header `data-kay`.
   * @returns {void}
   */
  selectHeader(d) {
    const key = d instanceof Date ?
      stringUtils.padDate(d.getFullYear(), d.getMonth(), d.getDate()) : d;
    const selector = { all: '.week-view-table-header th' };
    selector.current = `${selector.all}[data-key="${key}"]`;
    const headers = [].slice.call(this.element[0].querySelectorAll(selector.all));
    headers.forEach((header) => {
      header.classList.remove('is-selected');
    });
    const thisHeader = this.element[0].querySelector(selector.current);
    if (thisHeader) {
      thisHeader.classList.add('is-selected');
    }
  },

  /**
   * Remove all events from the calendar
   */
  clearEvents() {
    this.settings.events = [];
    this.renderAllEvents();
  },

  /**
   * Update an event via the event object and show it if it should be visible in the calendar.
   * It uses the event id to do this.
   * @param {object} event The event object with common event properties.
   */
  updateEvent(event) {
    const eventId = event.id;
    for (let i = this.settings.events.length - 1; i >= 0; i--) {
      if (this.settings.events[i].id === eventId) {
        this.settings.events[i] = utils.extend(true, this.settings.events[i], event);
        calendarShared.cleanEventData(
          this.settings.events[i],
          true,
          this.settings.startDate,
          this.locale,
          this.language,
          this.settings.events,
          this.settings.eventTypes
        );
      }
    }

    this.renderAllEvents();
  },

  /**
   * Remove an event from the dataset and page. It uses the id property.
   * @param {object} event The event object with common event properties.
   */
  deleteEvent(event) {
    const eventId = event.id;

    for (let i = this.settings.events.length - 1; i >= 0; i--) {
      if (this.settings.events[i].id === eventId) {
        this.settings.events.splice(i, 1);
      }
    }
    this.renderAllEvents();
  },

  /**
   * Handle updated settings and values.
   * @param {object} settings The new settings object to use.
   * @returns {object} [description]
   */
  updated(settings) {
    if (!settings) {
      settings = {};
    }
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    if (settings.locale) {
      this.destroy().init();
      return this;
    }

    this.renderAllEvents();
    return this;
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off();
    clearInterval(this.timer);
    this.timer = null;
    return this;
  },

  /**
   * Destroy - Remove added markup and events.
   * @returns {object} The prototype.
   */
  destroy() {
    this.teardown();
    this.element.empty();
    $.removeData(this.element[0], COMPONENT_NAME);
    $.removeData(this.element[0], 'init');
    $.removeData(this.element[0], 'automationId');
    return this;
  }
};

export { WeekView, COMPONENT_NAME };
