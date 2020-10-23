import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'stepchart';

// Default component options
const DEFAULT_STEPCHART_OPTIONS = {
  steps: null,
  completed: null,
  inProgress: null,
  iconType: null,
  completedText: null,
  extraText: '',
  completedColor: null,
  allCompletedColor: null,
  inProgressColor: null,
  attributes: null
};

/**
 * The Step Chart Component is displays visual info on step completion.
 * @class StepChart
 * @constructor
 * @param {jQuery[]|HTMLElement} element The base element
 * @param {object} [settings] incoming settings
 * @param {number} [settings.steps = null] The number of steps to show.
 * @param {number} [settings.completed = null] The number of steps complete (linear).
 * @param {number} [settings.inProgress = null] The number of the in progress step (linear).
 * @param {boolean} [settings.iconType = null] The icon to display fx. 'icon-error', 'icon-success'
 * @param {string} [settings.completedText = null] The completed text or uses a localized 'N of N Steps complete'.
 *  You can use {0} and {1} to replace n of n in the string.
 * @param {boolean} [settings.extraText = ''] The additional text to show on the right. Defaults to none. You
 *  can use {0} to replace with the steps remaining count and {1} to replace the number of steps.
 * @param {string} [settings.completedColor = null] The color to show completed steps. Defaults to primary color.
 * @param {string} [settings.allCompletedColor = null] The color to steps when all are completed. Defaults to primary color.
 * @param {string} [settings.inProgressColor = null] The color to show in-progress steps. Defaults to ruby02.
 * @param {string|array} [settings.attributes = null] Add extra attributes like id's to the chart elements. For example `attributes: { name: 'id', value: 'my-unique-id' }`
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

    if (typeof settings === 'object' || this.settings === undefined) {
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
        <use href="#icon-success"></use>
      </svg>
    `;

    const isEmpty = this.settings.completed === null && this.settings.steps === null;
    if (isEmpty) {
      this.settings.completed = 0;
      this.settings.steps = 1;
    }

    if (this.element.attr('data-options')) {
      this.settings = utils.parseSettings(this.element);
    }

    if (this.element.children().length > 0) {
      return this;
    }

    for (let i = 0; i < this.settings.steps; i++) {
      const step = $('<div class="step-chart-step"></div>');
      utils.addAttributes(step, this.settings, this.settings.attributes, `step${i}`);

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

    if (isEmpty) {
      completedText = Locale ? Locale.translate('NoData') : 'No Data Available';
    }
    const label = $(`<span class="step-chart-label">${completedText}</span>`);

    if (this.settings.steps === this.settings.completed) {
      container.addClass('is-complete');
      label.append(icon.replace('{icon-name}', 'icon-success'));
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

    // Add automation attributes
    utils.addAttributes(label, this.settings, this.settings.attributes, 'label');
    utils.addAttributes(label.find('.icon'), this.settings, this.settings.attributes, 'icon');
    utils.addAttributes(label.find('.step-chart-label-small'), this.settings, this.settings.attributes, 'label-small');

    return this;
  },

  /**
   * Handle updated settings and values.
   * @param  {object} settings The new settings to use.
   * @returns {object} The api for chaining.
   */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);
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
