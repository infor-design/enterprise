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

  $.fn.stepchart = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'steps',
      defaults = {
        steps: 7,
        completed: 0,
        inProgress: null,
        iconType: null,
        completedText: null,
        extraText: '',
        completedColor: null,
        allCompletedColor: null,
        inProgressColor: null
      },
      settings = $.extend({}, defaults, options);

    /**
    * The Step Chart Component is displays visual info on step completion.
    *
    * @class StepChart
    * @param {Number} steps The number of steps to show.
    * @param {Number} completed The number of steps complete (linear).
    * @param {Number} inProgress The number of the in progress step (linear).
    * @param {Boolean} iconType The icon to display fx. 'icon-error', 'icon-confirm'
    * @param {String} completedText The completed text or uses a localized 'N of N Steps complete'. You can use {0} and {1} to replace n of n in the string.
    * @param {Boolean} extraText The additional text to show on the right. Defaults to none. You can use {0} to replace with the steps remaining count and {1} to replace the number of steps.
    * @param {String} completedColor The color to show completed steps. Defaults to primary color.
    * @param {String} allCompletedColor The color to steps when all are completed. Defaults to primary color.
    * @param {String} inProgressColor The color to show in-progress steps. Defaults to ruby02.
    *
    */
    function StepChart(element, options) {
      this.settings = $.extend({}, defaults, options);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    StepChart.prototype = {

      /**
      * Initialize and render the chart
      * @private
      */
      init: function() {
        this.render();
      },

      /**
      * Initialize and render the from the settings
      * @private
      */
      render: function() {
        var container = $('<div class="step-chart-steps"></div>'),
          icon = '<svg class="icon {icon-name}" focusable="false" aria-hidden="true" role="presentation">'+
                  '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-confirm"></use>'+
                  '</svg>';

        if (this.element.attr('data-options')) {
          this.settings = $.fn.parseOptions(this.element);
        }

        if (this.element.children().length > 0) {
          return;
        }

        for (var i = 0; i < this.settings.steps; i++) {
          var step = $('<div class="step-chart-step"></div>');

          // Set up ticks
          if (i < this.settings.completed) {
            step.addClass('is-complete');

            if (this.settings.completedColor) {
              step.css('background-color', this.settings.completedColor);
            }
          }

          if (i === this.settings.inProgress-1) {
            step.addClass('is-inprogress');

            if (this.settings.inProgressColor) {
              step.css('background-color', this.settings.inProgressColor);
            }
          }

          container.append(step);
        }

        // Set up labels and alerts
        var completedText = this.settings.completedText || Locale.translate('StepsCompleted');
        completedText = completedText.replace('{0}', this.settings.completed);
        completedText = completedText.replace('{1}', this.settings.steps);

        var label = $('<span class="step-chart-label">'+ completedText +'</span>');

        if (this.settings.steps === this.settings.completed) {
          container.addClass('is-complete');
          label.append(icon.replace('{icon-name}', 'icon-confirm'));
        }

        if (this.settings.iconType) {
          label.append(icon.replace('{icon-name}', this.settings.iconType));
        }

        if (this.settings.extraText) {
          var extraText = this.settings.extraText;
          extraText = (extraText === '{0} Days Remaining' ? Locale.translate('DaysRemaining') : extraText);
          extraText = (extraText === '{1} Days Overdue' ? Locale.translate('DaysOverdue') : extraText);
          extraText = extraText.replace('{0}', this.settings.steps-this.settings.completed);
          extraText = extraText.replace('{1}', this.settings.completed);
          label.append('<span class="step-chart-label-small">' + extraText + '</span>');
        }

        this.element.append(label, container);

        // Adjust completed color
        if (this.settings.steps === this.settings.completed && this.settings.allCompletedColor) {
          container.find('.step-chart-step').css('background-color',  this.settings.allCompletedColor);
          label.find('.icon').attr('style', 'fill: '+ this.settings.allCompletedColor + '!important');
        }

      },

      /**
      * Update the chart with the current settings.
      */
      updated: function() {
        this.element.empty();
        this.render();
      },

      /**
      * Tear down and remove.
      */
      destroy: function() {
        this.element.empty();
        this.settings = null;
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initializing the Control Once or Call Methods.
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new StepChart(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
