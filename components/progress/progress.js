/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';

// jQuery components
import '../tooltip/tooltip.jquery';

/**
 * Component Name
 */
const COMPONENT_NAME = 'progress';

/**
 * Default Progress Options
 */
const PROGRESS_DEFAULTS = {
};

/**
* A list of items with add/remove/delete and sort functionality.
*
* @class Progress
* @param {String} element The component element.
* @param {String} settings The component settings.
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

  init() {
    this.update();

    this.element.off('updated.progress').on('updated.progress', (e) => {
      e.stopPropagation();
      this.update();
    });
  },

  updateAria(value) {
    this.element.attr({ role: 'progressbar', 'aria-valuenow': value, 'aria-maxvalue': '100' });

    const container = this.element.parent();
    if (container.data('tooltip')) {
      container.data('tooltip').content = `${value}%`;
    } else {
      container.attr('title', `${value}%`).tooltip();
    }
  },

  // Unbind all events
  unbind() {
    this.element.off('updated.progress');
  },

  /**
  * Update the progress bar.
  *
  * @param {string} value  The percent value to use to fill. 0-100
  * @returns {void}
  */
  update(value) {
    let perc = this.element.attr('data-value');

    if (value) {
      perc = value;
      this.element.attr('data-value', value);
    }

    this.element[0].style.width = `${perc}%`;
    this.updateAria(perc);
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, PROGRESS_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Progress, COMPONENT_NAME };
