import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';
import { MonthView } from '../monthview/monthview';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'calendar';

const COMPONENT_NAME_DEFAULTS = {
  eventTypes: [
    { id: 'example', label: 'Example', color: 'emerald07', checked: true, click: () => {} },
  ],
  events: [],
  showViewChanger: true
};

/**
 * Calendar - Full eventing calendar.
 * @class Calendar
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {array} [settings.eventTypes] An array of objects with data for the event types.
 * @param {array} [settings.events] An array of objects with data for the events.
 * @param {array} [settings.showViewChanger] If false the dropdown to change views will not be shown.
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
    // Do initialization. Build or Events ect
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  build() {
    this
      .renderEventTypes()
      .renderMonthView()
      .renderViewChanger();
    return this;
  },

  /**
   * Render the eventType Section
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderEventTypes() {
    this.eventTypeContainer = document.querySelector('.calendar-event-types');
    if (!this.eventTypeContainer) {
      return false;
    }

    let eventTypeMarkup = '';
    for (let i = 0; i < this.settings.eventTypes.length; i++) {
      const eventType = this.settings.eventTypes[i];
      eventTypeMarkup += `<input type="checkbox" class="checkbox ${eventType.color}07" name="${eventType.id}" id="${eventType.id}" checked="${eventType.checked ? 'true' : 'false'}" ${eventType.disabled ? 'disabled="true"' : ''} />
        <label for="${eventType.id}" class="checkbox-label">${eventType.label}</label><br/>`;
    }
    this.eventTypeContainer.innerHTML = eventTypeMarkup;
    this.element.initialize();
    return this;
  },

  /**
   * Render the monthview calendar
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderMonthView() {
    this.monthViewContainer = document.querySelector('.calendar .calendar-monthview');
    this.monthView = new MonthView(this.monthViewContainer, {});
    this.monthViewHeader = document.querySelector('.calendar .monthview-header');
    this.renderEvents();
    return this;
  },

  /**
   * Render the dropdown to change views.
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderViewChanger() {
    if (!this.settings.showViewChanger) {
      return this;
    }
    const viewChangerHtml = `<label for="calendar-view-changer" class="label audible">${Locale.translate('ChangeView')}</label>
      <select id="calendar-view-changer" name="calendar-view-changer" class="dropdown">
        <option value="month" selected>${Locale.translate('Month')}</option>
        <option value="week" disabled>${Locale.translate('Week')}</option>
        <option value="day" disabled>${Locale.translate('Day')}</option>
        <option value="schedule" disabled>${Locale.translate('Schedule')}</option>
      </select>
    </div>`;
    $(this.monthViewHeader).append(viewChangerHtml);
    this.viewChangerHtml = $('#calendar-view-changer');
    this.viewChangerHtml.dropdown();
    return this;
  },

  /**
   * Get the currently unchecked filter types
   * @returns {array} The active types.
  * @private
   */
  filterEventTypes() {
    const checkboxes = this.eventTypeContainer.querySelectorAll('.checkbox');
    const types = [];

    for (let i = 0; i < checkboxes.length; i++) {
      const input = checkboxes[i];
      if (!input.checked) {
        types.push(input.getAttribute('id'));
      }
    }
    return types;
  },

  /**
   * Render/ReRender the events attached to the settings.
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  renderEvents() {
    const self = this;
    const filters = this.filterEventTypes();
    this.visibleEvents = [];
    this.removeAllEvents();

    for (let i = 0; i < this.settings.events.length; i++) {
      const event = this.settings.events[i];
      if (filters.indexOf(event.type) > -1) {
        continue;
      }

      const startDate = new Date(event.starts);
      const startKey = stringUtils.padDate(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const container = self.monthView.dayMap.filter(day => day.key === startKey);

      if (container.length === 1) {
        const color = self.getColorFromStyles(event.type);
        self.appendEvent(container[0].elem[0], event, color);
      }
    }
    return this;
  },

  /**
   * Remove all events from the month.
   */
  removeAllEvents() {
    this.monthViewContainer.querySelectorAll('.calendar-event-more').forEach(e => e.parentNode.removeChild(e));
    this.monthViewContainer.querySelectorAll('.calendar-event').forEach(e => e.parentNode.removeChild(e));
  },

  /**
   * Add the ui event to the container.
   * @param {object} container The container to append to
   * @param {object} event The event data object.
   * @param {string} color The color to shade
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  appendEvent(container, event, color) {
    let node;
    const eventCnt = container.querySelectorAll('.calendar-event').length;

    if (eventCnt >= 2) {
      const moreSpan = container.querySelector('.calendar-event-more');
      const moreText = Locale.translate('More').replace('...', '');
      if (!moreSpan) {
        node = document.createElement('span');
        node.classList.add('calendar-event-more');
        node.innerHTML = `+ 1 ${moreText}`;
        node.setAttribute('data-count', 1);
        container.querySelector('.day-container').appendChild(node);
      } else {
        let cnt = moreSpan.getAttribute('data-count');
        cnt++;
        moreSpan.setAttribute('data-count', cnt);
        moreSpan.innerHTML = `+ ${cnt} ${moreText}`;
      }

      this.visibleEvents.push({ id: event.id, type: event.type, elem: node });
      return this;
    }

    node = document.createElement('a');
    node.classList.add('calendar-event', color);
    node.innerHTML = `<div class="calendar-event-content"><span class="calendar-event-title">${event.shortSubject || event.subject}</span></div>`;
    container.querySelector('.day-container').appendChild(node);

    this.visibleEvents.push({ id: event.id, type: event.type, elem: node });
    return this;
  },

  /**
   * Find the matching type and get the color.
   * @param {object} type The type to find.
   * @param {object} event The event data object.
   * @returns {object} The Calendar prototype, useful for chaining.
   */
  getColorFromStyles(type) {
    let color = 'azure';
    if (!type) {
      return color;
    }

    const eventInfo = this.settings.eventTypes.filter(eventType => eventType.id === type);
    if (eventInfo.length === 1) {
      color = eventInfo[0].color || 'azure';
    }
    return color;
  },

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

    this.element.on(`monthrendered.${COMPONENT_NAME}`, () => {
      self.renderEvents();
    });

    this.element.on(`change.${COMPONENT_NAME}`, '.checkbox', () => {
      self.renderEvents();
    });

    return this;
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
    this.element.off(`updated.${COMPONENT_NAME}`);
    this.element.off(`monthrendered.${COMPONENT_NAME}`);
    this.element.off(`click.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   */
  destroy() {
    this.eventTypeContainer.innerHTML = '';
    this.monthViewContainer.innerHTML = '';

    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Calendar, COMPONENT_NAME };
