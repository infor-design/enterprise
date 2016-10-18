
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

  /**
  * Step Process Control
  */
  $.fn.stepprocess = function(options) {

    // Tab Settings and Options
    var pluginName = 'stepprocess',
        defaults = {
          stepPanels: '.js-step-process-panel', // The selector for elements that are step panels
          stepLinks: '.js-step-link', // The selector for elements that are step links
          btnStepPrev: '.js-step-link-prev', // The selector of the previous step action element
          btnStepNext: '.js-step-link-next', // The selector of the next step action element
          btnToggleStepLinks: '.js-toggle-steps', // The selector of the element to toggle the steps list

          beforeStepChange: function() { },
          afterStepChange: function() { }
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function StepProcess(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    StepProcess.prototype = {

      init: function() {
        return this.setup();
      },

      setup: function() {
        var self = this;

        this.stepLinks = this.element.find(this.settings.stepLinks);
        this.stepPanels = $(this.settings.stepPanels);
        this.keyboardFocusItems = this.element.find('.accordion-header, .step-process-item');
        this.$currentStep = this.stepLinks.first();
        this.$focusedStep = this.$currentStep;

        // Initiate and save access the accordion plugin methods
        this.stepAccordion = this.element.find('.accordion').accordion().data('accordion');

        // Remove accordion events from non-accordion items
        this.stepAccordion.element
          .find('.accordion-header.step-process-item').off()
          .find('a').off('touchend');

        // Setup click events
        this.stepLinks.each(function() {
          $(this)
            .attr({
              'role': 'step',
              'aria-expanded': 'false',
              'aria-selected': 'false',
              'tabindex': '-1'
            })
            .click(function(e) {
              e.preventDefault();
              self.changeSelectedStep(this);
            })
            .on('keydown', function(e) {
              self.handleKeyDown(e);
            });
        });

        $(this.settings.btnStepPrev).click(function(e) {
          e.preventDefault();
          var stepIdx = self.getPrevItem(self.$currentStep, self.stepLinks);
          self.changeSelectedStep.call(self, stepIdx);
        });

        $(this.settings.btnStepNext).click(function(e) {
          e.preventDefault();
          var stepIdx = self.getNextItem(self.$currentStep, self.stepLinks);
          self.changeSelectedStep.call(self, stepIdx);
        });

        $(this.settings.btnToggleStepLinks).click(function(e) {
          e.preventDefault();
          self.hideContentPane.call(self);
        });


        // Set the initial states/vars
        this.stepAccordion.select(this.$currentStep);
        this.stepAccordion.expand(this.$currentStep.parent());
        this.$focusedStep = this.$currentStep.closest('.accordion-header, .step-process-item', this.element);
        this.selectStep(this.$currentStep);

        return this;
      },

      /**
       * Change the selected stepLink
       *
       * @param {object} stepLink - The stepLink element
       */
      changeSelectedStep: function(stepLink) {
        if (typeof this.settings.beforeStepChange === 'function' &&
            this.settings.beforeStepChange() === false) {
          return false;
        }

        if (this.$currentStep.attr('href') !== $(stepLink).attr('href')) {
          this.clearSelectedSteps();
        }

        this.selectStep(stepLink);

        this.focusStep(this.$currentStep.closest('.accordion-header, .step-process-item', this.element), 'next');

        if (typeof this.settings.beforeStepChange === 'function') {
          this.settings.afterStepChange();
        }
      },

      /**
       * Unfocus any keyboard elements and set the default selected
       */
      clearFocusedSteps: function() {
        this.keyboardFocusItems
          .removeClass('is-focused')
          .addClass('hide-focus');
      },

      /**
       * Resets all step elements to be inactive
       */
      clearSelectedSteps: function() {
        this.$currentStep.parent().removeClass('is-selected');
        this.stepPanels.removeClass('step-panel-active');
      },

      /**
       * Remove old focus and set new stepLink to focused
       *
       * @param {object} stepLink - The stepLink element
       * @param {string} direction - (optional) The direction to move in the array
       */
      focusStep: function(focusElem, direction) {
        this.clearFocusedSteps();

        this.$focusedStep = $(focusElem);

        var x = this.$focusedStep.closest('.accordion-pane', this.element);

        if (x.length > 0 && !x.hasClass('is-expanded')) {
          var step;
          if (direction && direction === 'previous') {
            step = this.getPrevItem(this.$focusedStep, this.keyboardFocusItems);
          } else {
            step = this.getNextItem(this.$focusedStep, this.keyboardFocusItems);
          }
          this.focusStep(step, direction);

        } else {
          this.$focusedStep
            .addClass('is-focused')
            .removeClass('hide-focus');
        }

      },

      /**
       * Get the previous item in a jquery collection
       *
       * @param {object} item - An element
       * @param {object} list - A jquery collection of elements
       * @returns {object} The previous stepLink
       */
      getPrevItem: function(item, $list) {
        var idx = $list.index(item);
        if (idx > 0) {
          idx -= 1;
        }
        return $list[idx];
      },

      /**
       * Get the next item in a jquery collection
       *
       * @param {object} item - An element
       * @param {object} list - A jquery collection of elements
       * @returns {object} The previous stepLink
       */
      getNextItem: function(item, $list) {
        var idx = $list.index(item);
        if (idx < $list.length - 1) {
          idx += 1;
        }
        return $list[idx];
      },

      /**
       * Handle certain keyboard shortcuts
       *
       * @param {event} e - The event
       */
      handleKeyDown: function(e) {
        var self = this,
            key = e.which;

        // Left Arrow/Up Arrow
        if (key === 37 || key === 38) {
          e.preventDefault();
          var prevStep = self.getPrevItem(self.$focusedStep, self.keyboardFocusItems);
          self.focusStep.call(self, prevStep, 'previous');
        }

        // Right Arrow/Down Arrow
        if (key === 39 || key === 40) {
          e.preventDefault();
          var nextStep = self.getNextItem(self.$focusedStep, self.keyboardFocusItems);
          self.focusStep.call(self, nextStep, 'next');
        }
      },

      /**
       * Mark the stepLink as selected and show the corresponding stepPanel
       *
       * @param {object} stepLink - The stepLink element
       */
      selectStep: function(stepLink) {
        this.$currentStep = $(stepLink);

        this.stepAccordion.select(this.$currentStep);
        this.stepAccordion.expand(this.$currentStep.parent());

        var self = this,
            stepId = this.$currentStep.attr('href');

        this.showContentPane(); // For mobile

        // NOTE: Hacky but this HAS to come after the showContentPane() - clepore
        setTimeout(function() {
          self.stepPanels.filter(stepId).first().addClass('step-panel-active');
        }, 100);
      },

      /**
       * Adds a class to show the step pane in
       * responsive viewing
       */
      showContentPane: function() {
        $(this.element).addClass('show-main');
      },

      /**
       * Removes a class to hide the step pane in
       * responsive viewing
       */
      hideContentPane: function() {
        $(this.element).removeClass('show-main');
      }
    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new StepProcess(this, settings));
      }
    });
  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
