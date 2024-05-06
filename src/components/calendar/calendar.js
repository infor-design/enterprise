/* eslint-disable no-underscore-dangle, no-nested-ternary */
import { DOM } from '../../utils/dom';
import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';
import { dateUtils } from '../../utils/date';
import { calendarShared } from './calendar-shared';

import { MonthView } from '../monthview/monthview';
import { WeekView } from '../week-view/week-view';
import { Locale } from '../locale/locale';
import { Tmpl } from '../tmpl/tmpl';

// jQuery Components
import '../popover/popover.jquery';

// Settings and Options
const COMPONENT_NAME = 'calendar';

const COMPONENT_NAME_DEFAULTS = {
  eventTypes: [],
  events: [],
  locale: null,
  language: null,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  day: new Date().getDate(),
  showViewChanger: true,
  onRenderMonth: null,
  template: null,
  mobileTemplate: null,
  upcomingEventDays: 14,
  modalTemplate: null,
  menuId: null,
  menuSelected: null,
  eventTooltip: 'overflow',
  iconTooltip: 'overflow',
  newEventDefaults: {
    title: 'NewEvent',
    subject: '',
    isAllDay: true,
    comments: ''
  },
  onChangeView: null,
  showToday: true,
  hitbox: false,
  weekViewSettings: {
    firstDayOfWeek: 0,
    startHour: 7,
    endHour: 19,
    showAllDay: true,
    showTimeLine: true
  },
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
  showEventLegend: true,
  dayLegend: null,
  displayRange: {
    start: '',
    end: '',
    months: {
      showAbbr: false
    }
  }
};

/**
 * Calendar - Full eventing calendar.
 * @class Calendar
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {array} [settings.eventTypes] An array of objects with data for the event types.
 * @param {array} [settings.events] An array of objects with data for the events.
 * @param {string} [settings.locale] The name of the locale to use for this instance. If not set the current locale will be used.
 * @param {string} [settings.language] The name of the language to use for this instance. If not set the current locale will be used or the passed locale will be used.
 * @param {array} [settings.year] Initial year to show.
 * @param {array} [settings.month] Initial month to show.
 * @param {number} [settings.day] The initial selected day to show.
 * @param {number} [settings.upcomingEventDays=14] How many days in advance should we show in the upcoming events pane.
 * @param {boolean} [settings.showViewChanger] If false the dropdown to change views will not be shown.
 * @param {function} [settings.onRenderMonth] Fires when a month is rendered, allowing you to pass back events or event types to show.
 * @param {function} [settings.onSelected] Fires when a month day is clicked. Allowing you to do something.
 * @param {function} [settings.onChangeView] Call back for when the view changer is changed.
 * @param {string} [settings.template] The ID of the template used for the events.
 * @param {string} [settings.mobileTemplate] The ID of the template on mobile responsive used for the events.
 * @param {string} [settings.modalTemplate] The ID of the template used for the modal dialog on events.
 * @param {string} [settings.menuId=null] ID of the menu to use for an event right click context menu
 * @param {function} [settings.menuSelected=null] Callback for the  right click context menu
 * @param {string} [settings.newEventDefaults] Initial event properties for the new events dialog.
 * @param {string | function} [settings.eventTooltip] The content of event tooltip. Default value is 'overflow'
 * @param {string | function} [settings.iconTooltip] The content of event icon tooltip. Default value is 'overflow'
 * @param {boolean} [settings.showToday=true] Deterimines if the today button should be shown.
 * @param {boolean} [settings.hitbox=false] Enable hitbox in calendar header.
 * @param {object} [settings.weekViewSettings = {}] an object containing settings for the internal weekview component.
 * @param {number} [settings.weekViewSettings.firstDayOfWeek=0] Set first day of the week. '1' would be Monday.
 * @param {number} [settings.weekViewSettings.startHour=7] The hour (0-24) to end on each day.
 * @param {number} [settings.weekViewSettings.endHour=19] The hour (0-24) to end on each day.
 * @param {boolean} [settings.weekViewSettings.showAllDay=true] Detemines if the all day events row should be shown.
 * @param {boolean} [settings.weekViewSettings.showTimeLine=true] Shows a bar across the current time.
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
 * @param {boolean} [settings.showEventLegend=true] Restrict month selections on datepicker.
 * @param {array} [settings.dayLegend] Allows you to set legend for days. This is passed to the legend option in Monthview but only the colors and dates part are used since the calendar already has a legend.
 * @param {array|object} [settings.attributes=null] Add extra attributes like id's to the element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
function Calendar(element, settings) {
  this.settings = utils.mergeSettings(element, settings, COMPONENT_NAME_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
Calendar.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    return this.setLocaleThenBuild();
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  build() {
    this
      .setCurrentCalendar()
      .renderEventTypes()
      .renderMonthView()
      .renderWeekView()
      .handleEvents()
      .renderEventLegend();

    return this;
  },

  /**
   * Set current locale to be used.
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
      this.build().handleEvents();
    });
    return this;
  },

  /**
   * Set current calendar data to to be used.
   * @private
   * @returns {void}
   */
  setCurrentCalendar() {
    this.isRTL = (this.locale.direction || this.locale.data.direction) === 'right-to-left';
    return this;
  },

  /**
   * Display event legends below the calendar table on mobile view.
   * @private
   * @returns {void}
   */
  renderEventLegend() {
    const s = this.settings;

    $('.calendar-event-legend').remove();
    if (!s.showEventLegend) {
      return;
    }

    this.eventLegend = $('<div class="calendar-event-legend"></div>');
    this.monthviewTable = $('.monthview-table');

    for (let i = 0; i < s.eventTypes.length; i++) {
      const event = s.eventTypes[i];
      const color = event.color;

      const legend = $('<div class="calendar-event-legend-item"></div>');
      legend.append(`<span class="calendar-event-legend-swatch ${color}"></span>
          <span class="calendar-event-legend-text">${event.label}</span>`);

      this.eventLegend.append(legend);
      utils.addAttributes(legend, this, this.settings.attributes, `legend-mobile-${event.id}`, true);
    }
    this.monthviewTable.after(this.eventLegend);
  },

  /**
   * Render the eventType Section
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderEventTypes() {
    this.eventTypeContainer = document.querySelector('.calendar-event-types');
    if (!this.eventTypeContainer) {
      return this;
    }

    if (this.settings.isEventTree) {
      $(this.eventTypeContainer).addClass('event-tree');
      const treeNodes = this.settings.eventTypes.map((eventType) => {
        const eventNode = { ...eventType };
        eventNode.text = eventNode.label;
        eventNode.selected = eventNode.checked;
        eventNode.icon = '';
        delete eventNode.checked;
        delete eventNode.label;
        if (eventNode.children) {
          const children = eventNode.children.map(({
            label: text, checked: selected, ...rest
          }) => ({ text, selected, icon: '', ...rest }));
          eventNode.children = children;
        }
        return eventNode;
      });

      this.eventTree = $('<ul role="tree" class="tree"></ul>');
      $(this.eventTypeContainer).append(this.eventTree);
      this.eventTree.tree({
        dataset: treeNodes,
        selectable: 'multiple',
        folderIconOpen: 'caret-down',
        folderIconClosed: Locale.isRTL() ? 'caret-left' : 'caret-right'
      });
    } else {
      for (let i = 0; i < this.settings.eventTypes.length; i++) {
        const eventType = this.settings.eventTypes[i];
        const classColor = eventType.custom ? eventType.color : `${eventType.color}07`;
        const eventTypeMarkup = `<input type="checkbox" class="checkbox ${classColor}" name="${eventType.id}" id="${eventType.id}" ${eventType.checked ? 'checked="true"' : ''} ${eventType.disabled ? 'disabled="true"' : ''} />
            <label for="${eventType.id}" class="checkbox-label">${eventType.translationKey ? Locale.translate(eventType.translationKey, { locale: this.locale.name, language: this.language }) : eventType.label}</label><br/>`;
        this.eventTypeContainer.insertAdjacentHTML('beforeend', eventTypeMarkup);

        // Add attributes to the checkbox, copy the ID to its label's [for] attribute.
        const checkboxEl = $(this.eventTypeContainer).find(`#${eventType.id}`);
        utils.addAttributes($(this.eventTypeContainer).find(`#${eventType.id}`), this, this.settings.attributes, `legend-${eventType.id}`, true);
        checkboxEl.next('label').attr('for', checkboxEl[0].id);
      }
    }
    return this;
  },

  /**
   * Render the monthview calendar
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderMonthView() {
    this.monthViewContainer = this.element[0].querySelector('.calendar-monthview');

    // Handle changing view
    this.activeView = 'month';
    this.onChangeToMonth = (args) => {
      if (this.settings.onChangeView) {
        this.settings.onChangeView(args);
        return;
      }
      this.changeView(args.viewName);
    };

    this.monthView = new MonthView(this.monthViewContainer, {
      onRenderMonth: this.settings.onRenderMonth,
      onSelected: this.settings.onSelected,
      selectable: true,
      locale: this.settings.locale,
      language: this.settings.language,
      month: this.settings.month,
      year: this.settings.year,
      day: this.settings.day,
      eventTooltip: this.eventTooltip,
      iconTooltip: this.iconTooltip,
      showToday: this.settings.showToday,
      showViewChanger: this.settings.showViewChanger,
      onChangeView: this.onChangeToMonth,
      disable: this.settings.disable,
      showLegend: this.settings.dayLegend !== null,
      legend: this.settings.dayLegend,
      hitbox: this.settings.hitbox,
      attributes: this.settings.attributes,
      firstDayOfWeek: this.settings.firstDayOfWeek,
      displayRange: {
        start: this.settings.displayRange.start,
        end: this.settings.displayRange.end,
        months: {
          showAbbr: this.settings.displayRange.months.showAbbr
        }
      }
    });
    this.monthViewHeader = document.querySelector('.calendar .monthview-header');
    this.renderAllEvents();

    utils.addAttributes($('.calendar'), this, this.settings.attributes);
    utils.addAttributes($('.calendar-monthview'), this, this.settings.attributes, 'monthview');
    return this;
  },

  /**
   * Render the weekview calendar
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderWeekView() {
    this.weekViewContainer = document.querySelector('.calendar .calendar-weekview');
    if (!this.weekViewContainer) {
      return this;
    }

    // Handle changing view
    this.weekViewContainer.classList.add('week-view');
    this.weekViewContainer.classList.add('hidden');
    this.onChangeToWeekDay = (args) => {
      if (this.settings.onChangeView) {
        this.settings.onChangeView(args);
        return;
      }
      this.changeView(args.viewName);
    };

    const startDate = dateUtils.firstDayOfWeek(
      new Date(this.currentDate()),
      this.settings.weekViewSettings.firstDayOfWeek
    );
    const endDate = dateUtils.lastDayOfWeek(
      new Date(this.currentDate()),
      this.settings.weekViewSettings.firstDayOfWeek
    );
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    this.weekView = new WeekView(this.weekViewContainer, {
      locale: this.settings.locale,
      language: this.settings.language,
      startDate,
      endDate,
      eventTypes: this.settings.eventTypes,
      events: this.settings.events,
      firstDayOfWeek: this.settings.weekViewSettings.firstDayOfWeek,
      showAllDay: this.settings.weekViewSettings.showAllDay,
      showTimeLine: this.settings.weekViewSettings.showTimeLine,
      startHour: this.settings.weekViewSettings.startHour,
      endHour: this.settings.weekViewSettings.endHour,
      disable: this.settings.disable,
      showLegend: this.settings.dayLegend !== null,
      legend: this.settings.dayLegend,
      showToday: this.settings.showToday,
      showViewChanger: this.settings.showViewChanger,
      hitbox: this.settings.hitbox,
      onChangeView: this.onChangeToWeekDay,
      eventTooltip: this.settings.eventTooltip,
      iconTooltip: this.settings.iconTooltip,
      attributes: this.settings.attributes,
      modalTemplate: this.settings.modalTemplate
    });
    this.weekViewHeader = document.querySelector('.calendar .calendar-weekview .monthview-header');

    this.weekView.settings.filteredTypes = this.filterEventTypes();
    this.weekView.settings.onChangeWeek = (args) => {
      this.monthView.selectDay(args.startDate, false, true);
    };
    this.weekView.renderAllEvents();
    utils.addAttributes($('.calendar-weekview'), this, this.settings.attributes, 'weekview');
    return this;
  },

  /**
   * Set the current view (day, week or month)
   * @param {string} viewName to set selection
   * @returns {void}
   */
  changeView(viewName) {
    if (viewName === this.activeView || !this.weekViewContainer) {
      return;
    }

    const currentDate = this.currentDate();
    let startDate = new Date(currentDate);
    let endDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    switch (viewName) {
      case 'day':
        this.monthViewContainer.classList.add('hidden');
        this.weekViewContainer.classList.remove('hidden');
        this.activeView = 'day';
        this.weekView.settings.filteredTypes = this.filterEventTypes();
        this.weekView.showWeek(startDate, endDate);
        this.clearEventDetails();
        this.weekView.calendarToolbarAPI.setViewChangerValue(this.activeView);
        break;
      case 'week':
        this.monthViewContainer.classList.add('hidden');
        this.weekViewContainer.classList.remove('hidden');
        this.activeView = 'week';
        startDate = dateUtils.firstDayOfWeek(startDate, this.settings.firstDayOfWeek);
        endDate = dateUtils.lastDayOfWeek(startDate, this.settings.firstDayOfWeek);
        this.weekView.settings.filteredTypes = this.filterEventTypes();
        this.weekView.showWeek(startDate, endDate);
        this.weekView.calendarToolbarAPI.setViewChangerValue(this.activeView);
        this.clearEventDetails();
        this.monthView.selectDay(currentDate, false, true);
        this.weekView.selectHeader(currentDate);
        break;
      case 'month':
        this.monthViewContainer.classList.remove('hidden');
        this.weekViewContainer.classList.add('hidden');
        this.activeView = 'month';
        this.monthView.showMonth(this.settings.month, this.settings.year);
        this.monthView.calendarToolbarAPI.setViewChangerValue(this.activeView);
        this.monthView.selectDay(currentDate, false, true);
        break;
      default:
    }
  },

  /**
   * Render the upcoming events view
   * @param {object} event The Calendar event to show.
   * @private
   */
  appendUpcomingEvent(event) {
    this.upcomingEventsContainer = document.querySelector('.calendar-upcoming-events');
    if (!this.upcomingEventsContainer || event.daysUntil > 0) {
      return;
    }

    const daysUntil = Math.abs(event.daysUntil);
    if (daysUntil < 0 || daysUntil > this.settings.upcomingEventDays) {
      return;
    }

    const upcomingEvent = document.createElement('a');
    upcomingEvent.setAttribute('href', '#');
    upcomingEvent.setAttribute('data-key', event.startKey);
    DOM.addClass(upcomingEvent, 'calendar-upcoming-event');

    let upcomingEventsMarkup = '';
    const startDay = Locale.formatDate(event.starts, { pattern: 'd', locale: this.locale.name });
    const endDay = Locale.formatDate(event.ends, { pattern: 'd', locale: this.locale.name });
    let dateRange = `${Locale.formatDate(event.starts, { pattern: 'MMMM', locale: this.locale.name })} ${startDay === endDay ? startDay : `${startDay}-${endDay}`}, ${Locale.formatDate(event.starts, { pattern: 'yyyy', locale: this.locale.name })}`;

    if (parseInt(endDay, 10) < parseInt(startDay, 10)) {
      const nextMonth = new Date(event.starts);
      nextMonth.setDate(1);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const endYear = nextMonth.getFullYear();
      dateRange = `${Locale.formatDate(event.starts, { pattern: 'MMMM', locale: this.locale.name })} ${startDay} - ${Locale.formatDate(nextMonth, { pattern: 'MMMM', locale: this.locale.name })} ${endDay}, ${endYear}`;
    }

    upcomingEventsMarkup += `
      <span class="calendar-upcoming-date">${dateRange}</span>
      <span class="calendar-upcoming-event-color ${event.color || ''}">${event.color || ''}</span>
      <span class="calendar-upcoming-description">${event.subject || ''}</span>
      <span class="calendar-upcoming-status-text">${event.status || ''}</span>
      <span class="calendar-upcoming-duration">${event.isDays ? event.duration : event.durationHours} ${event.durationUnits || ''}</span>`;
    upcomingEvent.innerHTML = upcomingEventsMarkup;
    this.upcomingEventsContainer.appendChild(upcomingEvent);

    utils.addAttributes($(upcomingEvent), this, this.settings.attributes, `upcoming-event-${event.id}`);
  },

  /**
   * Render or re-render the events details section, using on the readonly or default eventTemplate
   * @param {string} eventId The event id
   * @param {number} count The event count
   * @private
   */
  renderEventDetails(eventId, count) {
    if (!this.settings.events || this.activeView !== 'month') {
      return;
    }

    // Find the event data
    const eventData = this.settings.events.filter(event => event.id === eventId);
    if (!eventData || eventData.length === 0) {
      return;
    }

    this.eventDetailsContainer = document.querySelector('.calendar-event-details');
    if (!this.eventDetailsContainer) {
      return;
    }

    const thisEvent = $.extend(true, {}, eventData[0]);
    if (thisEvent.durationHours && !thisEvent.isDays) {
      calendarShared.formateTimeString(thisEvent, this.locale, this.language);
    }
    this.renderTmpl(
      thisEvent,
      this.settings.template,
      this.eventDetailsContainer,
      count > 1
    );

    this.eventDetailsMobileContainer = document.querySelector('.calendar-event-details-mobile.listview');
    if (this.eventDetailsMobileContainer) {
      this.renderTmpl(
        thisEvent,
        this.settings.mobileTemplate,
        this.eventDetailsMobileContainer,
        count > 1
      );
    }

    const api = $(this.eventDetailsContainer).data('accordion');
    if (api) {
      api.destroy();
    }

    if (this.eventDetailsMobileContainer) {
      this.translate(this.eventDetailsMobileContainer);
    }

    this.translate(this.eventDetailsContainer);
  },

  /**
   * Translate elements in a DOM object
   * @private
   * @param  {object} elem The DOM Element
   */
  translate(elem) {
    $(elem).find('[data-translate="text"]').each((i, item) => {
      const obj = $(item);
      obj.text(Locale.translate(obj.attr('data-translate-key') || obj.text(), {
        showAsUndefined: false,
        showBrackets: false,
        language: this.settings.language,
        locale: this.settings.locale
      }));
    });
  },

  /**
   * Render each of the events for the currently selected node
   * @private
   */
  renderSelectedEventDetails() {
    const dayObj = this.getDayEvents();
    this.clearEventDetails();
    if (!dayObj.events || dayObj.events.length === 0) {
      return;
    }

    for (let i = 0; i < dayObj.events.length; i++) {
      this.renderEventDetails(dayObj.events[i].id, dayObj.events.length);
    }

    $('.calendar .list-detail', this.element).css('display', 'block');

    $(this.eventDetailsContainer).accordion();
    if (this.eventDetailsMobileContainer) {
      $(this.eventDetailsMobileContainer).addClass('listview').listview({ selectable: false, hoverable: false });
    }

    if (DOM.hasClass(this.eventDetailsContainer, 'has-only-one')) {
      $(this.eventDetailsContainer).find('.accordion-header, .accordion-header a').off('click');
    }

    $('.accordion-pane.no-transition', this.element).removeClass('no-transition');
  },

  /**
   * If a upcomming day is clicked render that day/year.
   * @private
   * @param {string} key The date as an index key.
   */
  renderDay(key) {
    this.monthView.selectDay(key);

    let startDate = new Date(this.currentDate());
    let endDate = new Date(this.currentDate());
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (this.activeView === 'day') {
      this.weekView.showWeek(startDate, endDate);
    }

    if (this.activeView === 'week') {
      startDate = dateUtils.firstDayOfWeek(startDate, this.settings.firstDayOfWeek);
      endDate = dateUtils.lastDayOfWeek(startDate, this.settings.firstDayOfWeek);
      this.weekView.showWeek(startDate, endDate);
    }
  },

  /**
   * Clear all contents from the event details area.
   * @private
   */
  clearEventDetails() {
    this.eventDetailsContainer = document.querySelector('.calendar-event-details');
    this.eventDetailsMobileContainer = document.querySelector('.calendar-event-details-mobile.listview');

    if (this.eventDetailsContainer) {
      this.eventDetailsContainer.innerHTML = '';
    }

    if (this.eventDetailsMobileContainer) {
      this.eventDetailsMobileContainer.innerHTML = '';
    }
  },

  /**
   * Clear all contents from the upcoming events area.
   * @private
   */
  clearUpcomingEvents() {
    if (this.upcomingEventsContainer) {
      this.upcomingEventsContainer.innerHTML = '';
    }
  },

  /**
   * Get the currently unchecked filter types
   * @returns {array} The active types.
   * @private
   */
  filterEventTypes() {
    let types = [];
    if (!this.eventTypeContainer) {
      return types;
    }

    if (this.eventTree) {
      const treeApi = this.eventTree.data('tree');
      types = treeApi.getUnselectedNodes().map(({ data }) => data.id);
      return types;
    }

    const checkboxes = this.eventTypeContainer.querySelectorAll('.checkbox');

    for (let i = 0; i < checkboxes.length; i++) {
      const input = checkboxes[i];
      if (!input.checked) {
        types.push(input.getAttribute('name'));
      }
    }

    return types;
  },

  /**
   * Render/ReRender the events attached to the settings.
   * @private
   * @param {boolean} isCallback Will be set to true when a callback occurs
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  renderAllEvents(isCallback) {
    if (this.settings.onRenderMonth && !isCallback) {
      this.callOnRenderMonth();
      return this;
    }

    const self = this;
    const filters = this.filterEventTypes();

    // Cleanup from previous renders
    this.removeAllEvents();
    this.clearUpcomingEvents();
    this.clearEventDetails();

    // Clone and sort the array.
    const eventsSorted = this.settings.events.slice(0);
    eventsSorted.sort((a, b) => (a.starts < b.starts ? -1 : (a.starts > b.starts ? 1 : 0)));

    for (let i = 0; i < eventsSorted.length; i++) {
      const event = eventsSorted[i];
      if (filters.indexOf(event.type) > -1) {
        continue;
      }

      self.renderEvent(event);
    }

    this.renderSelectedEventDetails();
    if (this.weekView) {
      this.weekView.settings.filteredTypes = filters;
      this.weekView.settings.events = this.settings.events;
      this.weekView.renderAllEvents();
    }
    return this;
  },

  /**
   * Render/ReRender the events attached for the month.
   * @private
   * @param {object} event Will be the basis for the month
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  renderMonthEvents(event) {
    const monthKey = event.starts.substring(0, 6);
    const monthEvents = this.settings.events.filter(checkEvent => checkEvent.starts.indexOf(monthKey) > -1);

    // Cleanup from previous renders
    this.removeAllEvents();
    this.clearUpcomingEvents();
    this.clearEventDetails();

    const self = this;
    const filters = this.filterEventTypes();

    // Clone and sort the array.
    const eventsSorted = monthEvents.slice(0);
    eventsSorted.sort((a, b) => (a.starts < b.starts ? -1 : (a.starts > b.starts ? 1 : 0)));

    for (let i = 0; i < eventsSorted.length; i++) {
      const eventObj = eventsSorted[i];
      if (filters.indexOf(eventObj.type) > -1) {
        continue;
      }

      self.renderEvent(eventObj);
    }

    this.renderSelectedEventDetails();

    return this;
  },

  /**
   * Render a single event on the ui, use in the loop and other functions.
   * @param {object} event The event object.
   */
  renderEvent(event) {
    const self = this;

    // Check for events starting on this day , or only on this day.
    const startDate = Locale.newDateObj(event.starts);
    const isIslamic = Locale.isIslamic(this.locale.name);
    let startKey = stringUtils.padDate(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    if (isIslamic) {
      const startDateIslamic = Locale.gregorianToUmalqura(startDate);
      startKey = stringUtils.padDate(
        startDateIslamic[0],
        startDateIslamic[1],
        startDateIslamic[2]
      );
    }

    // Check for events extending onto this day
    const endDate = Locale.newDateObj(event.ends);
    let endKey = stringUtils.padDate(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    if (isIslamic) {
      const endDateIslamic = Locale.gregorianToUmalqura(endDate);
      endKey = stringUtils.padDate(
        endDateIslamic[0],
        endDateIslamic[1],
        endDateIslamic[2]
      );
    }

    const days = self.monthView.dayMap.filter(day => day.key >= startKey && day.key <= endKey);
    event.endKey = endKey;
    event.startKey = startKey;
    event = calendarShared.addCalculatedFields(
      event,
      this.locale,
      this.language,
      this.settings.eventTypes
    );
    let idx = -1;
    for (let i = 0; i < self.monthView.dayMap.length; ++i) {
      if (self.monthView.dayMap[i].key >= startKey && self.monthView.dayMap[i].key <= endKey) {
        idx = i;
        break;
      }
    }

    // Event is only on this day
    if (days.length === 1) {
      self.appendEvent(days[0].elem[0], event, 'event-day-start-end', idx);
    }

    // Event extends multiple days
    if (days.length > 1) {
      for (let l = 0; l < days.length; l++) {
        let cssClass = l === 0 ? 'event-day-start' : 'event-day-span';

        if (days.length - 1 === l) {
          cssClass = 'event-day-end';
        }
        self.appendEvent(days[l].elem[0], event, cssClass, idx + l);
      }
    }

    // Event extends multiple days
    this.appendUpcomingEvent(event, days, idx);
  },

  /**
   * Remove all events from the month.
   */
  removeAllEvents() {
    const moreEvents = this.monthViewContainer.querySelectorAll('.calendar-event-more');
    for (let i = 0; i < moreEvents.length; i++) {
      moreEvents[i].parentNode.removeChild(moreEvents[i]);
    }

    const calendarEvents = this.monthViewContainer.querySelectorAll('.calendar-event');
    for (let i = 0; i < calendarEvents.length; i++) {
      calendarEvents[i].parentNode.removeChild(calendarEvents[i]);
    }

    const calendarEventSpacers = this.monthViewContainer.querySelectorAll('.calendar-event-spacer');
    for (let i = 0; i < calendarEventSpacers.length; i++) {
      calendarEventSpacers[i].parentNode.removeChild(calendarEventSpacers[i]);
    }

    for (let i = 0; i < this.monthView.dayMap.length; i++) {
      this.monthView.dayMap[i].events = [];
    }
  },

  /**
   * Add the ui event to the container.
   * @private
   * @param {object} container The container to append to
   * @param {object} event The event data object.
   * @param {string} type Type of event, can be event-day-start, event-day-start-end, event-day-span, event-day-end
   * @param {number} idx The dayMap index
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  appendEvent(container, event, type, idx) {
    const eventCnt = container.querySelectorAll('.calendar-event').length;
    const colorList = ['amber', 'amethyst', 'azure', 'emerald', 'graphite', 'ruby', 'slate', 'turquoise'];
    let node;

    if (idx > -1) {
      if (!this.monthView.dayMap[idx].events) {
        this.monthView.dayMap[idx].events = [];
      }
      this.monthView.dayMap[idx].events.push(event);
    }

    if (eventCnt >= 3) {
      const moreSpan = container.querySelector('.calendar-event-more');
      const setMoreSpan = (elem, count) => {
        elem.setAttribute('data-count', count);
        // Wrap text in extra span here, so link should not expand more than text, because `more span` is styled as block level element
        elem.innerHTML = `<span>+ ${count} ${Locale.translate('More', { locale: this.locale.name, language: this.language }).replace('...', '')}</span>`;
      };
      if (!moreSpan) {
        node = document.createElement('span');
        DOM.addClass(node, 'calendar-event-more');
        setMoreSpan(node, 1);
        container.querySelector('.day-container').appendChild(node);
        // Switch to day view on click
        $(container)
          .off(`click.${COMPONENT_NAME}`)
          .on(`click.${COMPONENT_NAME}`, '.calendar-event-more span', () => {
            const thisDate = this.monthView.dayMap[idx].key;
            this.monthView.selectDay(thisDate, false, true);
            this.changeView('day');
          });
      } else {
        setMoreSpan(moreSpan, parseInt(moreSpan.getAttribute('data-count'), 10) + 1);
      }
      return this;
    }

    node = document.createElement('a');
    DOM.addClass(node, 'calendar-event', event.cssClass ?? event.color, type);
    node.setAttribute('data-id', event.id);
    node.setAttribute('data-key', event.startKey);

    // Let the border color / color be overriden
    if (event.color !== undefined && colorList.filter(color => event.color?.indexOf(color) > -1).length > 0 && event.color.indexOf('0') > -1) {
      DOM.addClass(node, event.color);
    } else if ((event.color?.substr(0, 1) === '#' || event.color) && colorList.indexOf(event.color) < 0) {
      node.style.backgroundColor = event.color;
      node.classList.remove(event.color);
    }

    if (event.borderColor?.substr(0, 1) === '#' || event.borderColor) {
      node.style.borderLeftColor = event.borderColor;
    }

    node.innerHTML = `<div class="calendar-event-content">
      ${event.icon ? `<span class="calendar-event-icon"><svg class="icon ${event.icon}" focusable="false" aria-hidden="true" role="presentation" data-status="${event.status}"><use href="#${event.icon}"></use></svg></span>` : ''}
      <span class="calendar-event-title">${event.shortSubject || event.subject}</span>
    </div>`;

    // Make sure we are on the same "level", when events overlap
    const eventHead = this.monthViewContainer.querySelectorAll(`.calendar-event.event-day-start[data-id="${event.id}"]`);

    if (eventHead[0]) {
      const children = eventHead[0].parentNode.children;
      for (let i = container.querySelector('.day-container').children.length; i < children.length; i++) {
        const dataid = children[i].getAttribute('data-id');
        if (this.getString(dataid) === this.getString(event.id)) {
          break;
        }
        if (!children[i].classList.contains('day-text')) {
          const spacer = document.createElement('span');
          spacer.classList.add('calendar-event-spacer');
          container.querySelector('.day-container').appendChild(spacer);
        }
      }
    }

    container.querySelector('.day-container').appendChild(node);
    utils.addAttributes($(node), this, this.settings.attributes, `event-${event.id}`);

    if (this.settings.iconTooltip !== 'overflow') {
      const icon = node.querySelector('.calendar-event-icon');
      if (icon) {
        if (typeof this.settings.iconTooltip === 'function') {
          this.settings.iconTooltip({
            month: this.settings.month,
            year: this.settings.year,
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
          month: this.settings.month,
          year: this.settings.year,
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
            response(`${title.innerText}${iconStatus ? ` (${Locale.translate(iconStatus, { locale: this.locale.name, language: this.language }, false)})` : ''}`);
            return;
          }
          response(false);
        }
      });
    }

    return this;
  },

  /**
   * Get string value of item
   * @private
   * @param {any} item Item to convert to string
   * @returns {string} String value
   */
  getString(item) {
    if (typeof item === 'string') {
      return item;
    }
    return item ? item.toString() : null;
  },

  /**
   * Find the matching type and get the color.
   * @param {object} id The eventType id to find.
   * @param {object} event The event data object.
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  getEventTypeLabel(id) {
    let type = '';
    if (!id) {
      return type;
    }

    const eventInfo = this.settings.eventTypes.filter(eventType => eventType.id === id);
    if (eventInfo.length === 1) {
      type = eventInfo[0].label;
    }
    return type;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;

    this.element.off(`updated.${COMPONENT_NAME}`).on(`updated.${COMPONENT_NAME}`, () => {
      this.updated();
    });

    this.isSwitchingMonth = false;
    this.element.off(`monthrendered.${COMPONENT_NAME}`).on(`monthrendered.${COMPONENT_NAME}`, (e, args) => {
      this.isSwitchingMonth = true;
      if (this.modalVisible()) {
        this.removeModal();
      }
      this.settings.year = args.year;
      this.settings.month = args.month;
      this.renderAllEvents();

      setTimeout(() => {
        this.isSwitchingMonth = false;
      }, 500);
    });

    this.element.off(`change.${COMPONENT_NAME}`).on(`change.${COMPONENT_NAME}`, '.checkbox', () => {
      this.renderAllEvents(true);
    });

    $(this.monthViewContainer).off(`selected.${COMPONENT_NAME}`).on(`selected.${COMPONENT_NAME}`, () => {
      this.renderSelectedEventDetails();
    });

    if (this.eventTree) {
      this.eventTree.on('selected', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.renderAllEvents(true);
      })
        .on('unselected', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.renderAllEvents(true);
        });
    }

    this.element.off(`click.${COMPONENT_NAME}-upcoming`).on(`click.${COMPONENT_NAME}-upcoming`, '.calendar-upcoming-event', (e) => {
      const key = e.currentTarget.getAttribute('data-key');
      this.renderDay(key);
    });

    this.element.off(`contextmenu.${COMPONENT_NAME}`).on(`contextmenu.${COMPONENT_NAME}`, '.calendar-event', (e) => {
      e.stopPropagation();
      const hasMenu = () => self.settings.menuId && $(`#${self.settings.menuId}`).length > 0;

      const eventId = e.currentTarget.getAttribute('data-id');
      const eventData = this.settings.events.filter(event => event.id === eventId);
      this.element.triggerHandler('contextmenu', { originalEvent: e, month: this.settings.month, year: this.settings.year, event: eventData[0] });

      if (!utils.isSubscribedTo(self.element[0], e, 'contextmenu', 'calendar') && !hasMenu()) {
        return true;
      }
      e.preventDefault();
      self.closePrevPopupmenu();

      if (!hasMenu()) {
        return true;
      }

      const event = $(e.currentTarget);
      event.popupmenu({ attachToBody: true, menuId: this.settings.menuId, eventObj: e, trigger: 'immediate', offset: { y: 5 } });

      event.off('selected.calendar').on('selected.calendar', function (evt, elem) {
        // const eventId = this.getAttribute('data-id');
        if (self.settings.menuSelected) {
          self.settings.menuSelected(evt, elem, eventId);
        }

        if (elem.attr('data-action') === 'delete-event') {
          self.deleteEvent({ id: eventId });
        }
        if (elem.attr('data-action') === 'show-event') {
          const key = this.getAttribute('data-key');
          self.monthView.selectDay(key);
        }
      });

      return false;
    });

    let timer = 0;
    const delay = 100;
    let prevent = false;
    this.element.off(`click.${COMPONENT_NAME}-event`).on(`click.${COMPONENT_NAME}-event`, '.calendar-event', (e) => {
      timer = setTimeout(() => {
        if (!prevent) {
          const eventId = e.currentTarget.getAttribute('data-id');
          const eventData = this.settings.events.filter(event => event.id === eventId);
          if (!eventData || eventData.length === 0) {
            return;
          }
          const target = $(e.currentTarget);
          let eventTarget = target.find('.calendar-event-title');
          if (e.currentTarget.classList.contains('event-day-span') ||
            e.currentTarget.classList.contains('event-day-end')) {
            eventTarget = self.element.find(`.event-day-start[data-id="${target.attr('data-id')}"] .calendar-event-title`);
          }
          this.showModalWithCallback(eventData[0], false, eventTarget);

          if (!self.weekView || self.activeView === 'month') {
            /**
             * Fires when an event in the calendar is clicked.
             * @event eventclick
             * @memberof Calendar
             * @property {number} args.month - The zero based month number.
             * @property {number} args.year - The year currently rendered in the calendar.
             * @property {object} args.event - The data for the event.
             */
            this.element.triggerHandler('eventclick', { month: this.settings.month, year: this.settings.year, event: eventData[0] });
          }
        }
        prevent = false;
      }, delay);
    });

    this.element.off(`dblclick.${COMPONENT_NAME}-event`).on(`dblclick.${COMPONENT_NAME}-event`, '.calendar-event', (e) => {
      clearTimeout(timer);
      prevent = true;
      const eventId = e.currentTarget.getAttribute('data-id');
      const eventData = this.settings.events.filter(event => event.id === eventId);
      if (!eventData || eventData.length === 0) {
        return;
      }
      /**
       * Fires when an event in the calendar is double clicked.
       * @event eventdblclick
       * @memberof Calendar
       * @property {number} args.month - The zero based month number.
       * @property {number} args.year - The year currently rendered in the calendar.
       * @property {object} args.event - The data for the event.
       */
      this.element.trigger('eventdblclick', { month: this.settings.month, year: this.settings.year, event: eventData[0] });
    });

    this.element.off(`dblclick.${COMPONENT_NAME}`).on(`dblclick.${COMPONENT_NAME}`, 'td', (e) => {
      const key = e.currentTarget.getAttribute('data-key');
      if (!key || this.isSwitchingMonth) {
        return;
      }
      const day = new Date(key.substr(0, 4), key.substr(4, 2) - 1, key.substr(6, 2));

      const eventData = utils.extend({ }, this.settings.newEventDefaults);
      eventData.startKey = key;
      eventData.endKey = key;
      eventData.starts = day;
      eventData.ends = day;
      e.stopPropagation();

      calendarShared.cleanEventData(
        eventData,
        false,
        this.currentDate(),
        this.locale,
        this.language,
        this.settings.events,
        this.settings.eventTypes
      );
      this.showModalWithCallback(eventData, true);

      /**
       * Fires when the calendar day is double clicked.
       * @event dblclick
       * @memberof Calendar
       * @param {object} eventData - Information about the calendar date double clicked.
       * @param {object} api - Access to the Calendar API
       */
      this.element.triggerHandler('dblclick', { eventData, api: this });
    });

    // Set up mobile list view events
    this.element.find('.listview')
      .off(`click.${COMPONENT_NAME}-mobile`)
      .on(`click.${COMPONENT_NAME}-mobile`, (e) => {
        const target = $(e.target).closest('li');
        const mobileEventId = target.attr('data-id');
        const mobileEventData = this.settings.events.filter(event => event.id === mobileEventId);
        if (!mobileEventData || mobileEventData.length === 0) {
          return;
        }
        this.showModalWithCallback(mobileEventData[0], false, target);
        this.element.triggerHandler('eventclick', { month: this.settings.month, year: this.settings.year, event: mobileEventData[0] });
      });

    return this;
  },

  /**
   * Close any previous opened popupmenus.
   * @private
   * @returns {void}
   */
  closePrevPopupmenu() {
    const nodes = [].slice.call(this.element[0].querySelectorAll('.is-open:not(.popupmenu)'));
    nodes.forEach((node) => {
      const elem = $(node);
      if (elem.data('popupmenu')) {
        elem.trigger('close');
      }
    });
  },

  /**
   * Execute onRenderMonth and handle the call back.
   * @private
   */
  callOnRenderMonth() {
    const self = this;

    function response(events, eventTypes) {
      if (eventTypes && eventTypes.length > 0) {
        self.settings.eventTypes = eventTypes;

        if (self.weekView) {
          self.weekView.settings.eventTypes = eventTypes;
        }
        self.renderEventLegend();
        self.renderEventTypes();
      }
      if (events && events.length > 0) {
        self.settings.events = events;
        self.renderAllEvents(true);

        if (self.weekView) {
          self.weekView.settings.events = events;
          self.weekView.renderAllEvents(true);
        }
      }
    }

    this.settings.onRenderMonth(this.element, response, {
      api: self,
      month: this.settings.month,
      year: this.settings.year
    });
  },

  /**
   * Get the current selected date on the calendar.
   * @returns {date} the currently selected date on the control.
   */
  currentDate() {
    const ret = this.isIslamic ? this.monthView.currentDateIslamic : this.monthView.currentDate;
    if (!Locale.isValidDate(ret)) {
      return new Date();
    }
    return ret;
  },

  /**
   * Get the events and date for the currently selected calendar day.
   * @param {date} date The date to find the events for.
   * @returns {object} dayEvents An object with all the events and the event date.
   */
  getDayEvents(date) {
    if (!date) {
      date = this.currentDate();
    }

    if (typeof date !== 'string' && !this.isRTL) {
      date = stringUtils.padDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
    }

    if (Locale.isIslamic(this.locale.name)) {
      const dateIslamic = Locale.gregorianToUmalqura(date);
      date = stringUtils.padDate(
        dateIslamic[0],
        dateIslamic[1],
        dateIslamic[2]
      );
    }

    let dayObj = this.monthView.dayMap.filter(dayFilter => dayFilter.key === date);
    if (this.activeView !== 'month') {
      dayObj = this.weekView.dayMap.filter(dayFilter => dayFilter.key === date);
    }

    const dayEvents = {
      date: this.monthView.currentDate,
      events: []
    };

    if (dayObj.length === 0) {
      return [];
    }

    dayEvents.events = dayObj[0].events;
    dayEvents.elem = dayObj[0].elem;
    return dayEvents;
  },

  /**
   * Render the template into the container.
   * @param {object} event The event object with common event properties.
   * @param {object} template The template id.
   * @param {object} container The container to put it in.
   * @param {boolean} append If true we append the template into the container.
  */
  renderTmpl(event, template, container, append) {
    if (typeof Tmpl !== 'object' || !template) {
      return;
    }

    // create a copy of the template
    if (template instanceof $) {
      template = `${template.html()}`;
    } else if (typeof template === 'string') {
      // If a string doesn't contain HTML elments,
      // assume it's an element ID string and attempt to select with jQuery
      if (!stringUtils.containsHTML(template)) {
        template = $(`#${template}`).html();
      }
    }

    event.color = calendarShared.getEventTypeColor(event, this.settings.eventTypes);
    event.startsLong = Locale.formatDate(event.starts, { date: 'long', locale: this.locale.name });
    event.endsLong = Locale.formatDate(event.ends, { date: 'long', locale: this.locale.name });
    event.startsHoursLong = `${Locale.formatDate(event.starts, { date: 'long', locale: this.locale.name })} ${Locale.formatDate(event.starts, { date: 'hour', locale: this.locale.name })}`;
    event.endsHoursLong = `${Locale.formatDate(event.ends, { date: 'long', locale: this.locale.name })} ${Locale.formatDate(event.ends, { date: 'hour', locale: this.locale.name })}`;

    if (Locale.isIslamic(this.locale.name)) {
      const startsIslamic = Locale.gregorianToUmalqura(new Date(event.starts));
      const endsIslamic = Locale.gregorianToUmalqura(new Date(event.ends));
      event.startsLong = Locale.formatDate(startsIslamic, { date: 'long', locale: this.locale.name });
      event.endsLong = Locale.formatDate(endsIslamic, { date: 'long', locale: this.locale.name });
      event.startsHoursLong = `${Locale.formatDate(startsIslamic, { date: 'long', locale: this.locale.name })} ${Locale.formatDate(startsIslamic, { date: 'hour', locale: this.locale.name })}`;
      event.endsHoursLong = `${Locale.formatDate(endsIslamic, { date: 'long', locale: this.locale.name })} ${Locale.formatDate(endsIslamic, { date: 'hour', locale: this.locale.name })}`;
    }
    event.typeLabel = this.getEventTypeLabel(event.type);

    const renderedTmpl = Tmpl.compile(template, { event });
    container.classList.remove('has-only-one');

    if (append) {
      DOM.append(container, renderedTmpl, '*');
      return;
    }
    container.innerHTML = renderedTmpl;
    container.classList.add('has-only-one');

    const colorList = ['amber', 'amethyst', 'azure', 'emerald', 'graphite', 'ruby', 'slate', 'turquoise'];
    if (container?.children[0]?.classList.contains('accordion-header')) {
      const eventTypeColor = this.settings.eventTypes.filter(eventObj => eventObj.id === event.type)[0].color;
      const isColorList = colorList.filter(colorObj => colorObj === eventTypeColor).length > 0;

      if (eventTypeColor !== event.color || !isColorList) {
        container.children[0].style.backgroundColor = event.color;
      }
    }
  },

  /**
   * Add a new event via the event object and show it if it should be visible in the calendar.
   * @param {object} event The event object with common event properties.
   */
  addEvent(event) {
    calendarShared.cleanEventData(
      event,
      true,
      this.currentDate(),
      this.locale,
      this.language,
      this.settings.events,
      this.settings.eventTypes
    );
    this.settings.events.push(event);
    this.renderMonthEvents(event);
    this.renderSelectedEventDetails();

    if (this.weekView) {
      this.weekView.settings.events = this.settings.events;
      this.weekView.renderAllEvents();
    }
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
          this.currentDate(),
          this.locale,
          this.language,
          this.settings.events,
          this.settings.eventTypes
        );
      }
    }

    this.renderAllEvents();

    if (this.weekView) {
      this.weekView.updateEvent(event);
    }
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

    if (this.weekView) {
      this.weekView.deleteEvent(event);
    }
  },

  /**
   * Remove all events from the calendar
   */
  clearEvents() {
    this.settings.events = [];
    this.renderAllEvents();

    if (this.weekView) {
      this.weekView.clearEvents();
    }
  },

  /**
   * Update the calendar settings for the month
   * @param {object} settings The new settings object to use.
   * @returns {void}
   */
  updateMonthDetails(settings) {
    if (!settings || settings === null || settings === undefined) {
      return;
    }

    if (settings.dayLegend) {
      settings.showLegend = settings.dayLegend !== null;
      settings.legend = settings.dayLegend;
    }

    this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    this.monthView.updateMonthDetails(this.settings);
    this.renderEventLegend();
  },

  /**
   * Show a modal used to add/edit events. This uses the modalTemplate setting for the modal contents.
   * @param {object} event The event object with common event properties for defaulting fields in the template.
   * @param {function} done The callback for when the modal closes.
   * @param {object} eventTarget The target element for the popup.
   */
  showEventModal(event, done, eventTarget) {
    if (!this.settings.modalTemplate) {
      return;
    }

    if (this.modalVisible()) {
      this.removeModal();
    }

    this.modalContents = document.createElement('div');
    DOM.addClass(this.modalContents, 'calendar-event-modal', 'hidden');
    document.getElementsByTagName('body')[0].appendChild(this.modalContents);

    event = calendarShared.addCalculatedFields(
      event,
      this.locale,
      this.language,
      this.settings.eventTypes
    );
    this.renderTmpl(event || {}, this.settings.modalTemplate, this.modalContents);
    const dayObj = this.getDayEvents();

    let isCancel = true;
    dayObj.elem = $(dayObj.elem);
    let placementArgs = dayObj.elem.index() === 6 ? this.isRTL ? 'right' : 'left' : this.isRTL ? 'left' : 'right';

    if (!eventTarget && this.activeView === 'day') {
      eventTarget = $('.week-view-header-wrapper');
      placementArgs = this.isRTL ? 'left' : 'right';
    }

    if (!eventTarget) {
      eventTarget = dayObj.elem;
    }

    const modalOptions = this.settings.modalOptions || {
      content: $(this.modalContents),
      closebutton: true,
      popover: true,
      placementOpts: {
        parent: eventTarget,
        strategies: ['flip', 'nudge', 'shrink-y'],
        parentXAlignment: 'center',
        parentYAlignment: 'center',
        placement: placementArgs
      },
      title: event.title || event.subject,
      trigger: 'immediate',
      keepOpen: true,
      extraClass: 'calendar-popup calendar-popup-mobile',
      tooltipElement: '#calendar-popup',
      headerClass: event.color,
      initializeContent: false
    };

    eventTarget
      .off('hide.calendar')
      .on('hide.calendar', () => {
        if (isCancel) {
          this.removeModal();
          return;
        }

        done(this.modalContents, event);
        this.element.trigger('hidemodal', { elem: this.modalContents, event });
        this.removeModal();
        isCancel = true;
      })
      .popover(modalOptions)
      .off('show.calendar')
      .on('show.calendar', (evt, elem) => {
        const colorList = ['amber', 'amethyst', 'azure', 'emerald', 'graphite', 'ruby', 'slate', 'turquoise'];
        const eventTypeColor = this.settings.eventTypes.filter(eventObj => eventObj.id === event.type)[0].color;
        const isColorList = colorList.filter(colorObj => colorObj === eventTypeColor).length > 0;

        if (eventTypeColor !== event.color || !isColorList) {
          elem.find('.tooltip-title').css('backgroundColor', event.color);
          elem.find('.tooltip-title').remove('default');
        }

        this.element.trigger('showmodal', { elem: this.modalContents, event });
        // Wire the click on isAllDay to disable spinbox.
        elem.find('#isAllDay').off().on('click.calendar', (e) => {
          const isDisabled = $(e.currentTarget).prop('checked');
          if (isDisabled) {
            elem.find('#durationHours').prop('disabled', true);
            elem.find('#endsHourLocale').prop('disabled', true);
            elem.find('#startsHourLocale').prop('disabled', true);
          } else {
            elem.find('#durationHours').prop('disabled', false);
            elem.find('#endsHourLocale').prop('disabled', false);
            elem.find('#endsHourLocale + .btn-icon').prop('disabled', false);
            elem.find('#startsHourLocale').prop('disabled', false);
            elem.find('#startsHourLocale + .btn-icon').prop('disabled', false);
          }
        });

        // Wire the correct type selector
        elem.find('#type').val(event.type).dropdown();

        // Wire the correct comments
        elem.find('#comments').val(event.comments);
        elem.find('#subject').focus();

        // Wire the buttons
        elem.find('button').on('click', (e) => {
          const popupApi = eventTarget.data('popover');
          const action = e.currentTarget.getAttribute('data-action');
          isCancel = action !== 'submit';
          if (popupApi) {
            popupApi.hide(true);
          }
        });

        // Init the contents
        elem.find('.datepicker').datepicker({ locale: this.settings.locale, language: this.settings.language });
        elem.find('.timepicker').timepicker({ locale: this.settings.locale, language: this.settings.language });
        this.translate(elem);
      });

    $('#calendar-popup').one('tooltipafterplace.calendar', (e, args) => {
      const arrow = args.element.find('.arrow');
      const topValue = parseInt(arrow.css('margin-top'), 10);
      if (dayObj.elem.parent().index() >= 3) {
        const offsetTop = parseInt(args.element.offset().top, 10);
        const diff = offsetTop + args.element.height();
        const height = $('html').height() + 10;

        if (diff > height) {
          const adjustment = (offsetTop - (diff - height) - 25);
          args.element.css('top', `${adjustment}px`);
          arrow.css('margin-top', `${topValue + (offsetTop - adjustment) - 18}px`);
        }
      } else if (args.element.height() > 580) {
        arrow.css('margin-top', `${topValue - 18}px`);
      }
    });
    this.activeElem = eventTarget;
  },

  /**
   * Show the event modal and run a callback.
   * @private
   * @param {object} eventData Data from the event object
   * @param {boolean} isAdd Open the modal in readnly mode vs edit mode
   * @param {object} eventTarget The element to point the dialog at
   * @returns {void}
   */
  showModalWithCallback(eventData, isAdd, eventTarget) {
    this.showEventModal(eventData, (elem, event) => {
      // Collect the data and popuplate the event object
      const inputs = elem.querySelectorAll('input, textarea, select');
      for (let i = 0; i < inputs.length; i++) {
        event[inputs[i].id] = inputs[i].getAttribute('type') === 'checkbox' ? inputs[i].checked : inputs[i].value;
      }

      // Reset Colors for New Events from Default Event Type (Will be populated later)
      event.color = undefined;
      event.borderColor = undefined;

      if (isAdd) {
        this.addEvent(event);
      } else {
        this.updateEvent(event);
      }
    }, eventTarget);
  },

  /**
   * Used to check if a Modal is currently visible.
   * @returns {boolean} whether or not the Modal is currently being displayed
   */
  modalVisible() {
    return (document.querySelector('.calendar-event-modal') !== null);
  },

  /**
   * Remove and destroy the modal.
   * @private
   */
  removeModal() {
    this.modalContents = null;
    if (this.activeElem) {
      this.activeElem.off();
      if (this.activeElem.data('popover')) {
        this.activeElem.data('popover').destroy();
      }
    }
    DOM.remove(document.getElementById('calendar-popup'));
    DOM.remove(document.querySelector('.calendar-event-modal'));
    $('#timepicker-popup').hide();
  },

  /**
   * Handle updated settings and values.
   * @param {object} settings The new settings object to use.
   * @returns {object} [description]
   */
  updated(settings = {}) {
    if (!settings) {
      settings = {};
    }
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    if (settings.locale || settings.template ||
      settings.upcomingEventDays || settings.mobileTemplate) {
      this.destroy().init();
      return this;
    }

    // Update weekview mapped settings.
    if (this.weekView && settings.events) {
      this.weekView.settings.events = settings.events;
    }
    if (this.weekView && settings.eventTypes) {
      this.weekView.settings.events = settings.events;
    }
    if (this.weekView && settings.weekViewSettings) {
      this.weekView.settings = utils.mergeSettings(
        this.element[0],
        settings.weekViewSettings,
        this.weekViews.settings
      );
    }
    if (this.settings.displayRange.start && this.settings.displayRange.end) {
      this.monthView.showRange(this.settings.displayRange.start, this.settings.displayRange.end);
    } else {
      this.monthView.showMonth(this.settings.month, this.settings.year);
    }
    this.renderAllEvents();

    if (this.weekView && settings.weekViewSettings) {
      this.weekView.renderAllEvents();
    }
    return this;
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    if (this.element) {
      this.element.off();
    }

    $(this.monthViewContainer).off();

    if (this.monthView) {
      this.monthView.destroy();
    }

    if (this.weekView) {
      this.weekView.destroy();
    }
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  destroy() {
    if (this.eventTypeContainer) {
      this.eventTypeContainer.innerHTML = '';
    }
    if (this.monthViewContainer) {
      this.monthViewContainer.innerHTML = '';
    }
    if (this.upcomingEventsContainer) {
      this.upcomingEventsContainer.innerHTML = '';
    }
    if (this.eventDetailsContainer) {
      this.eventDetailsContainer.innerHTML = '';
    }
    if (this.eventDetailsMobileContainer) {
      this.eventDetailsMobileContainer.innerHTML = '';
    }

    this.removeModal();
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
    return this;
  }
};

export { Calendar, COMPONENT_NAME };
