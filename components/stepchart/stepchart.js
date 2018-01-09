/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  var DEFAULT_STEPCHART_OPTIONS = {
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
  *
  * @class StepChart
  * @param {number} steps The number of steps to show.
  * @param {number} completed The number of steps complete (linear).
  * @param {number} inProgress The number of the in progress step (linear).
  * @param {boolean} iconType The icon to display fx. 'icon-error', 'icon-confirm'
  * @param {string} completedText The completed text or uses a localized 'N of N Steps complete'. You can use {0} and {1} to replace n of n in the string.
  * @param {boolean} extraText The additional text to show on the right. Defaults to none. You can use {0} to replace with the steps remaining count and {1} to replace the number of steps.
  * @param {string} completedColor The color to show completed steps. Defaults to primary color.
  * @param {string} allCompletedColor The color to steps when all are completed. Defaults to primary color.
  * @param {string} inProgressColor The color to show in-progress steps. Defaults to ruby02.
  *
  */
  function StepChart(element, options) {
    return this.init(element, options);
  }

  StepChart.prototype = {

    /**
    * Initialize and render the chart
    * @private
    */
    init: function(element, options) {

      if (!this.element && element instanceof HTMLElement) {
        this.element = $(element);
      }

      if (typeof options === 'object') {
        var previousOptions = this.options || DEFAULT_STEPCHART_OPTIONS;
        this.options = $.extend({}, previousOptions, options);
      }

      return this.render();
    },

    /**
    * Initialize and render the from the options
    * @private
    */
    render: function() {
      var container = $('<div class="step-chart-steps"></div>'),
        icon = '<svg class="icon {icon-name}" focusable="false" aria-hidden="true" role="presentation">'+
                '<use xlink:href="#icon-confirm"></use>'+
                '</svg>';

      if (this.element.attr('data-options')) {
        this.options = $.fn.parseOptions(this.element);
      }

      if (this.element.children().length > 0) {
        return;
      }

      for (var i = 0; i < this.options.steps; i++) {
        var step = $('<div class="step-chart-step"></div>');

        // Set up ticks
        if (i < this.options.completed) {
          step.addClass('is-complete');

          if (this.options.completedColor) {
            step.css('background-color', this.options.completedColor);
          }
        }

        if (i === this.options.inProgress-1) {
          step.addClass('is-inprogress');

          if (this.options.inProgressColor) {
            step.css('background-color', this.options.inProgressColor);
          }
        }

        container.append(step);
      }

      // Set up labels and alerts
      var completedText = this.options.completedText || Locale.translate('StepsCompleted');
      completedText = completedText.replace('{0}', this.options.completed);
      completedText = completedText.replace('{1}', this.options.steps);

      var label = $('<span class="step-chart-label">'+ completedText +'</span>');

      if (this.options.steps === this.options.completed) {
        container.addClass('is-complete');
        label.append(icon.replace('{icon-name}', 'icon-confirm'));
      }

      if (this.options.iconType) {
        label.append(icon.replace('{icon-name}', this.options.iconType));
      }

      if (this.options.extraText) {
        var extraText = this.options.extraText;
        extraText = (extraText === '{0} Days Remaining' ? Locale.translate('DaysRemaining') : extraText);
        extraText = (extraText === '{1} Days Overdue' ? Locale.translate('DaysOverdue') : extraText);
        extraText = extraText.replace('{0}', this.options.steps-this.options.completed);
        extraText = extraText.replace('{1}', this.options.completed);
        label.append('<span class="step-chart-label-small">' + extraText + '</span>');
      }

      this.element.append(label, container);

      // Adjust completed color
      if (this.options.steps === this.options.completed && this.options.allCompletedColor) {
        container.find('.step-chart-step').css('background-color',  this.options.allCompletedColor);
        label.find('.icon').attr('style', 'fill: '+ this.options.allCompletedColor + '!important');
      }

      return this;
    },

    /**
    * Update the chart with the current options.
    */
    updated: function() {
      this.element.empty();
      return this.render();
    },

    /**
    * Tear down and remove.
    */
    destroy: function() {
      this.element.empty();
      this.options = null;
      $.removeData(this.element[0], 'stepchart');

      return this;
    }
  };

  // Add to the Soho object
  window.Soho.components.stepchart = StepChart;

  $.fn.stepchart = function(options) {
    'use strict';

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, 'stepchart');
      if (instance) {
        instance.updated(options);
      } else {
        instance = $.data(this, 'stepchart', new StepChart(this, options));
        instance.destroy = function destroy() {
          this.teardown();
          $.removeData(this, 'stepchart');
        };
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
