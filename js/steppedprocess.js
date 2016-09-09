
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
  $.fn.steppedprocess = function(options) {

    // Tab Settings and Options
    var pluginName = 'steppedprocess',
        defaults = {
          containerElement: null, // Defines a separate element to be used for containing the tab panels.  Defaults to the Tab Container itself
          changeTabOnHashChange: false, // If true, will change the selected tab on invocation based on the URL that exists after the hash
          hashChangeCallback: null, // If defined as a function, provides an external method for adjusting the current page hash used by these tabs
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function SteppedProcess(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      this.init();
    }

    // Actual Plugin Code
    SteppedProcess.prototype = {

      init: function(){
        return this
          .setup()
          .build();
      },

      setup: function() {
        return this;
      },

      build: function() {
        var self = this;

        self.stepLinks = self.element.find('.steppedprocess-link');
        self.stepPanels = self.element.find('.steppedprocess-container').children();

        self.stepLinks.each(function() {
          $(this)
            .attr({
              'role': 'step',
              'aria-expanded': 'false',
              'aria-selected': 'false',
              'tabindex': '-1'
            })
            .click(function() {
              self.changeStep(this);
            });
        });


        var $initialStep = self.stepLinks.first();

        // If we are using the hash change setting
        if (this.settings.changeTabOnHashChange) {
          var hash = window.location.hash;

          if (hash && hash.length) {
            var $firstMatchingStep = self.stepLinks.filter('[href="'+ hash +'"]').first();

            if (firstMatchingStep.length) {
              $initialStep = $firstMatchingStep;
            }
          }
        }

        self.activateStep($initialStep);

        return this;
      },


      changeStep: function(step) {
        var self = this;
        self.clearActiveSteps();
        self.activateStep(step);
      },

      activateStep: function(step) {
        var self = this;

        self.$currentStep = $(step).addClass('step-link-active');

        var panelId = self.$currentStep.attr('href');
        self.stepPanels.filter(panelId).first().addClass('step-panel-active');

        console.log('Activate Step: ', $(step).attr('href'));
      },

      clearActiveSteps: function() {
        var self = this;
        self.stepLinks.removeClass('step-link-active');
        self.stepPanels.removeClass('step-panel-active');
      }

    };

    // Keep the Chaining and Init the Controls or Settings
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new SteppedProcess(this, settings));
      }
    });
  };


/* start-amd-strip-block */
}));
/* end-amd-strip-block */
