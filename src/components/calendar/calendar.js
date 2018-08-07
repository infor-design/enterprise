import { utils } from '../../utils/utils';

// Settings and Options
const COMPONENT_NAME = 'calendar';

const COMPONENT_NAME_DEFAULTS = {
  legend: [
    { id: 'pto', label: 'Paid Time Off', color: 'emerald07', checked: true, click: null },
    { id: 'admin', label: 'Admin Leave', color: 'amethyst07', checked: true, click: null },
    { id: 'team', label: 'HCM Team Event Calendar', color: 'azure07', checked: true, click: null },
    { id: 'sick', label: 'Sick Time', color: 'amber07', checked: true, click: null },
    { id: 'comp', label: 'Company Holiday', color: 'ruby07', checked: true, click: null, disabled: true },
  ],
  legendContainer: '.calendar-legend'
};

/**
 * Calendar - Full eventing calendar.
 * @class Calendar
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {array} [settings.legend] An array of objects with data for the legend.
 * @param {string} [settings.legendContainer] The (unique on the page), containter for the legend items.
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
      .renderLegend();
    return this;
  },

  /**
   * Render the Legend Section
   * @returns {object} The Calendar prototype, useful for chaining.
   * @private
   */
  renderLegend() {
    this.legendContainer = document.querySelector(this.settings.legendContainer);
    if (!this.legendContainer) {
      return false;
    }

    let legendMarkup = '';
    for (let i = 0; i < this.settings.legend.length; i++) {
      const legend = this.settings.legend[i];
      legendMarkup += `<input type="checkbox" class="checkbox ${legend.color}" name="${legend.id}" id="${legend.id}" checked="${legend.checked ? 'true' : 'false'}" ${legend.disabled ? 'disabled="true"' : ''} />
        <label for="${legend.id}" class="checkbox-label">${legend.label}</label><br/>`;
    }
    this.legendContainer.innerHTML = legendMarkup;
    return this;
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
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Calendar, COMPONENT_NAME };
