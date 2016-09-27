
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
          changeTabOnHashChange: false, // If true, will change the selected tab on invocation based on the URL that exists after the hash
          stepPanels: '.js-step-process-panel', // Defines a separate element to be used for containing the content panels
          stepLinks: '.js-step-link', // The selector for elements that are step links
          stepPrevBtn: '.js-step-link-prev', // The selector of the next step action (btn, link, etc)
          stepNextBtn: '.js-step-link-next', // The selector of the next step action element (btn, link, etc)
          toggleStepsBtn: '.js-toggle-steps' // The selector of the element to toggle the nav bar (btn, link)
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
        this.$currentStep = this.stepLinks.first();

        // Setup click events
        this.stepLinks.each(function() {
          $(this)
            .attr({
              'role': 'step',
              'aria-expanded': 'false',
              'aria-selected': 'false',
              'tabindex': '-1'
            })
            .click(function() {
              self.changeSelectedStep(this);
            });
        });

        $(this.settings.stepPrevBtn).click(function(event) {
          self.selectPrevStep.call(self, event);
        });

        $(this.settings.stepNextBtn).click(function(event) {
          self.selectNextStep.call(self, event);
        });

        $(this.settings.toggleStepsBtn).click(function(event) {
          self.hideContentPane.call(self, event);
        });

        // Initiate and save access the accordion plugin methods
        var accordionParams = {
          rerouteOnLinkClick: true
        };

        this.$stepAccordion = this.element.find('.accordion').accordion(accordionParams).data('accordion');

        // If we are using the hash change setting
        if (this.settings.changeTabOnHashChange) {
          var hash = window.location.hash;

          if (hash && hash.length) {
            var $firstMatchingStep = this.stepLinks.filter('[href="'+ hash +'"]').first();

            if ($firstMatchingStep.length) {
              this.$currentStep = $firstMatchingStep;
            }
          }
        }

        // Set the initial views
        this.$stepAccordion.select(this.$currentStep);
        this.$stepAccordion.expand(this.$currentStep.parent());
        this.selectStep(this.$currentStep);

        return this;
      },

      /**
       * Change the selected step link
       *
       * @param {object} stepLink - The step element
       */
      changeSelectedStep: function(stepLink) {
        this.clearSelectedSteps();
        this.selectStep(stepLink);
      },

      /**
       * Resets all step elements to be inactive
       */
      clearSelectedSteps: function() {
        this.$currentStep.parent().removeClass('is-selected');
        this.stepPanels.removeClass('step-panel-active');
      },

      /**
       * Get the index of the specified step link in the step array
       *
       * @param {object} stepLink - The step element
       * @returns {number} The index
       */
      getStepIndex: function(stepLink) {
          return this.stepLinks.index(stepLink);
      },


      /**
       * Mark the step as selected and show the corresponding step panel
       *
       * @param {object} step - The step element
       */
      selectStep: function(step) {
        this.$currentStep = $(step);

        this.$stepAccordion.select(this.$currentStep);
        this.$stepAccordion.expand(this.$currentStep.parent());


        var stepId = this.$currentStep.attr('href');

        this.showContentPane(); // For mobile

        var self = this;
        setTimeout(function() {
          // NOTE: Hacky but this HAS to come after the showContentPane() - clepore
          self.stepPanels.filter(stepId).first().addClass('step-panel-active');
        }, 100);
      },


      /**
       * Selects the previous steplink in the list
       */
      selectPrevStep: function() {
        var newStepIndex = this.getStepIndex(this.$currentStep) - 1;
        if (newStepIndex < 0) {
          newStepIndex = this.stepLinks.length - 1;
        }
        this.changeSelectedStep(this.stepLinks[newStepIndex]);
      },

      /**
       * Selects the next steplink in the list
       */
      selectNextStep: function() {
        var newStepIndex = this.getStepIndex(this.$currentStep) + 1;
        if (newStepIndex >= this.stepLinks.length) {
          newStepIndex = 0;
        }
        this.changeSelectedStep(this.stepLinks[newStepIndex]);
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
