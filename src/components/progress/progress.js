import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';

// jQuery components
import '../tooltip/tooltip.jquery';

// Component Name
const COMPONENT_NAME = 'progress';

// Default Progress Options
const PROGRESS_DEFAULTS = {
  value: 0
};

/**
* A list of items with add/remove/delete and sort functionality.
* @class Progress
* @constructor
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
* @param {string|number} [settings.value] The value to set.
*/
function Progress(element, settings) {
  this.settings = utils.mergeSettings(element, settings, PROGRESS_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Actual Progress Code
Progress.prototype = {

  /**
   * Init this component.
   * @private
   * @returns {object} The object for chaining.
   */
  init() {
    this.update(this.settings.value || this.element.attr('data-value'));

    this.element.off('updated.progress').on('updated.progress', (e) => {
      e.stopPropagation();
      this.update();
    });
    return this;
  },

  /**
   * Update the aria on this component
   * @private
   * @param  {string} value The progress value.
   */
  updateAria(value) {
    this.element.attr({ role: 'progressbar', 'aria-valuenow': value, 'aria-valuemax': '100' });

    const container = this.element.parent();
    this.tooltipApi = this.tooltipApi || container.data('tooltip');
    if (this.tooltipApi) {
      this.tooltipApi.content = `${value}%`;
      if (this.tooltipApi.visible && value <= 100 && this.tooltipApi.tooltip.hasClass(`process${this.tooltipId}`)) {
        this.tooltipApi.tooltip.find('.tooltip-content').text(this.tooltipApi.content);
      }
    } else {
      container[0].setAttribute('title', `${value}%`);
      container.tooltip();
      this.tooltipApi = container.data('tooltip');
      this.tooltipId = this.tooltipApi.uniqueId;
      container
        .on('aftershow.progress', () => {
          this.tooltipApi.tooltip.addClass(`process${this.tooltipId}`);
        })
        .on('hide.progress mouseout.progress', () => {
          this.tooltipApi.tooltip.removeClass(`process${this.tooltipId}`);
        });
    }
  },

  /**
   * Unbind all events.
   * @private
   * @returns {object} The object for chaining.
   */
  unbind() {
    const container = this.element.parent();
    container.off('aftershow.progress hide.progress mouseout.progress');
    this.tooltipApi = this.tooltipApi || container.data('tooltip');
    if (this.tooltipApi) {
      this.tooltipApi.destroy();
      delete this.tooltipApi;
    }
    if (this.tooltipId) {
      delete this.tooltipId;
    }

    this.element.off('updated.progress');
    return this;
  },

  /**
  * Update the progress bar.
  * @param {string} value  The percent value to use to fill. 0-100
  * @returns {void}
  */
  update(value) {
    let percent = this.element[0].getAttribute('data-value') || 0;
    if (/number|string/.test(typeof value)) {
      this.element[0].setAttribute('data-value', value);
      percent = value;
    }
    this.element[0].style.width = `${percent}%`;
    this.updateAria(percent);
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined' && settings.value) {
      this.settings.value = settings.value;
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Teardown and remove any added markup and events.
  */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Progress, COMPONENT_NAME };
