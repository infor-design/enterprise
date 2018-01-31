import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'stepchart';

/**
 * StepChart Default Options
 * @namespace
 * @property {number} steps The number of steps to show.
 * @property {number} completed The number of steps complete (linear).
 * @property {number} inProgress The number of the in progress step (linear).
 * @property {boolean} iconType The icon to display fx. 'icon-error', 'icon-confirm'
 * @property {string} completedText The completed text or uses a localized 'N of N Steps complete'.
 *  You can use {0} and {1} to replace n of n in the string.
 * @property {boolean} extraText The additional text to show on the right. Defaults to none. You
 *  can use {0} to replace with the steps remaining count and {1} to replace the number of steps.
 * @property {string} completedColor The color to show completed steps. Defaults to primary color.
 * @property {string} allCompletedColor The color to steps when all are completed. Defaults to
 *  primary color.
 * @property {string} inProgressColor The color to show in-progress steps. Defaults to ruby02.
 */
const DEFAULT_STEPCHART_OPTIONS = {
  steps: 7,
  completed: 0,
  inProgress: null,
  iconType: null,
  completedText: null,
  extraText: '',
  completedColor: null,
  allCompletedColor: null,
  inProgressColor: null
};

/**
 * The Step Chart Component is displays visual info on step completion.
 * @class StepChart
 * @constructor
 * @param {jQuery[]|HTMLElement} element The base element
 * @param {object} [settings] incoming settings
 * @returns {this} component instance
 */
function StepChart(element, settings) {
  return this.init(element, settings);
}

StepChart.prototype = {

  /**
   * Initialize and render the chart
   * @private
   * @param {jQuery[]|HTMLElement} element The base element
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  init(element, settings) {
    if (!this.element && element instanceof HTMLElement) {
      this.element = $(element);
    }

    if (typeof settings === 'object') {
      const previousSettings = this.settings || DEFAULT_STEPCHART_OPTIONS;
      this.settings = utils.mergeSettings(this.element[0], settings, previousSettings);
    }

    return this.render();
  },

  /**
   * Initialize and render the from the options
   * @private
   * @returns {this} component instance
   */
  render() {
    const container = $('<div class="step-chart-steps"></div>');
    const icon = `
      <svg class="icon {icon-name}" focusable="false" aria-hidden="true" role="presentation">
        <use xlink:href="#icon-confirm"></use>
      </svg>
    `;

    if (this.element.attr('data-options')) {
      this.settings = utils.parseSettings(this.element);
    }

    if (this.element.children().length > 0) {
      return this;
    }

    for (let i = 0; i < this.settings.steps; i++) {
      const step = $('<div class="step-chart-step"></div>');

      // Set up ticks
      if (i < this.settings.completed) {
        step.addClass('is-complete');

        if (this.settings.completedColor) {
          step.css('background-color', this.settings.completedColor);
        }
      }

      if (i === this.settings.inProgress - 1) {
        step.addClass('is-inprogress');

        if (this.settings.inProgressColor) {
          step.css('background-color', this.settings.inProgressColor);
        }
      }

      container.append(step);
    }

    // Set up labels and alerts
    let completedText = this.settings.completedText || Locale.translate('StepsCompleted');
    completedText = completedText.replace('{0}', this.settings.completed);
    completedText = completedText.replace('{1}', this.settings.steps);

    const label = $(`<span class="step-chart-label">${completedText}</span>`);

    if (this.settings.steps === this.settings.completed) {
      container.addClass('is-complete');
      label.append(icon.replace('{icon-name}', 'icon-confirm'));
    }

    if (this.settings.iconType) {
      label.append(icon.replace('{icon-name}', this.settings.iconType));
    }

    if (this.settings.extraText) {
      let extraText = this.settings.extraText;
      extraText = (extraText === '{0} Days Remaining' ? Locale.translate('DaysRemaining') : extraText);
      extraText = (extraText === '{1} Days Overdue' ? Locale.translate('DaysOverdue') : extraText);
      extraText = extraText.replace('{0}', this.settings.steps - this.settings.completed);
      extraText = extraText.replace('{1}', this.settings.completed);
      label.append(`<span class="step-chart-label-small">${extraText}</span>`);
    }

    this.element.append(label, container);

    // Adjust completed color
    if (this.settings.steps === this.settings.completed && this.settings.allCompletedColor) {
      container.find('.step-chart-step').css('background-color', this.settings.allCompletedColor);
      label.find('.icon').attr('style', `fill: ${this.settings.allCompletedColor}!important`);
    }

    return this;
  },

  /**
   * Update the chart with the current options.
   * @returns {this} component instance
   */
  updated() {
    this.element.empty();
    return this.render();
  },

  /**
   * Tear down and remove.
   * @returns {this} component instance
   */
  destroy() {
    this.element.empty();
    this.settings = null;
    $.removeData(this.element[0], COMPONENT_NAME);

    return this;
  }
};

export { StepChart, COMPONENT_NAME };
