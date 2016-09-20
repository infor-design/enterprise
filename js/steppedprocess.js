
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
  * Tab Control
  */
  $.fn.stepprocess = function(options) {

    // Tab Settings and Options
    var pluginName = 'stepprocess',
        defaults = {
          panelContainer: '.step-process-container', // Defines a separate element to be used for containing the content panels
          changeTabOnHashChange: false, // If true, will change the selected tab on invocation based on the URL that exists after the hash
          stepLinks: '.js-step-link', // The selector for elements that are step links and change the content
          stepPrevBtn: '.js-step-link-prev', // The selector of the next step action (btn, link, etc)
          stepNextBtn: '.js-step-link-next', // The selector of the next step action element (btn, link, etc)
          toggleStepsBtn: '.js-toggle-steps', // The selector of the element to toggle the nav bar (btn, link)
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

        self.stepLinks = self.element.find(self.settings.stepLinks);
        self.stepPanels = $(self.settings.panelContainer).children();
        self.$currentStep = self.stepLinks.first();

        // Setup click events
        self.stepLinks.each(function() {
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

        $(self.settings.stepPrevBtn).click(function(event) {
          self.selectPrevStep.call(self, event);
        });

        $(self.settings.stepNextBtn).click(function(event) {
          self.selectNextStep.call(self, event);
        });

        $(self.settings.toggleStepsBtn).click(function(event) {
          self.hideContentPane.call(self, event);
        });

        // Initiate and save access the accordion plugin methods
        var accordionParams = {
          rerouteOnLinkClick: false
        };

        self.$stepAccordion = this.element.find('.accordion').accordion(accordionParams).data('accordion');

        // If we are using the hash change setting
        if (this.settings.changeTabOnHashChange) {
          var hash = window.location.hash;

          if (hash && hash.length) {
            var $firstMatchingStep = self.stepLinks.filter('[href="'+ hash +'"]').first();

            if ($firstMatchingStep.length) {
              self.$currentStep = $firstMatchingStep;
            }
          }
        }

        // Set the initial views
        self.$stepAccordion
          .select(self.$currentStep)
          .expand(self.$currentStep.parent());

        self.selectStep(self.$currentStep);

        return this;
      },

      changeSelectedStep: function(step) {
        this.clearSelectedSteps();
        this.selectStep(step);
      },

      clearSelectedSteps: function() {
        this.$currentStep.parent().removeClass('is-selected');
        this.stepPanels.removeClass('step-panel-active');
      },

      getStepIndex: function(step) {
          return this.stepLinks.index(step);
      },

      selectStep: function(step) {
        this.$currentStep = $(step);

        this.$stepAccordion.select(this.$currentStep);
        this.$stepAccordion.expand(this.$currentStep.parent());

        self.showContentPane(); // For mobile

        var stepId = this.$currentStep.attr('href');
        self.stepPanels.filter(stepId).first().addClass('step-panel-active');
      },

      selectPrevStep: function() {
        var newStepIndex = this.getStepIndex(this.$currentStep) - 1;
        if (newStepIndex < 0) {
          return;
        }
        this.changeSelectedStep(this.stepLinks[newStepIndex]);
      },

      selectNextStep: function() {
        var newStepIndex = this.getStepIndex(this.$currentStep) + 1;
        if (newStepIndex > this.stepLinks.length) {
          return;
        }
        this.changeSelectedStep(this.stepLinks[newStepIndex]);
      },

      showContentPane: function() {
        $('.responsive-two-col').addClass('show-main');
      },

      hideContentPane: function() {
        $('.responsive-two-col').removeClass('show-main');
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
