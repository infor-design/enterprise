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

  //NOTE: Just this part will show up in SoHo Xi Builds.

  $.fn.compositeform = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'compositeform',
        defaults = {
          breakpoint: 'phone-to-tablet',
          trigger: null,
          expandedText: Locale.translate('ShowLess'),
          collapsedText: Locale.translate('ShowMore'),
        },
        settings = $.extend({}, defaults, options);

    /**
    * The About Dialog Component is displays information regarding the application.
    *
    * @class CompositeForm
    * @param {String} breakpoint  &nbsp;-&nbsp; Defines the breakpoint at which the composite form will change into its responsive mode
    * @param {String} trigger  &nbsp;-&nbsp; Expandable area trigger selector. Passed to expandable area.
    * @param {String} expandedText  &nbsp;-&nbsp; Text to use for the expand button (Default localized)
    * @param {String} collapsedText  &nbsp;-&nbsp; Text to use for the collapse button (Default localized)
    *
    */
    function CompositeForm(element, settings) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    CompositeForm.prototype = {
      init: function() {
        return this
          .build()
          .handleEvents();
      },

      /**
       * Adds markup to the control and stores references to some sub-elements
       * @returns {this}
       */
      build: function() {
        var classList = this.element[0].classList;
        if (!classList.contains('composite-form')) {
          classList.add('composite-form');
        }

        // Get expandable area reference, if applicable
        var expandableArea = this.element.find('.expandable-area');
        if (expandableArea.length) {
          this.hasSummary = true;
          this.expandableArea = expandableArea;
          this.expandableAreaAPI = this.expandableArea.data('expandablearea');
          if (!this.expandableAreaAPI) {
            this.expandableArea.expandablearea({ trigger: this.settings.trigger });
            this.expandableAreaAPI = this.expandableArea.data('expandablearea');
          }

          // Get expandable trigger
          this.expander = this.expandableAreaAPI.expander;
          this.setExpanderText(this.settings.expandedText);
        } else {
          this.hasSummary = false;
        }

        // Check size and append class, if necessary
        this.checkResponsive();

        return this;
      },

      /**
       * Sets up event handlers for this control and its sub-elements
       * @param {string} expanderText - the text content
       * @returns {undefined}
       */
      handleEvents: function() {
        var self = this;

        $('body').on('resize.' + pluginName, function(e) {
          self.checkResponsive(e);
        });

        this.element.on('updated.' + pluginName, function() {
          self.updated();
        });

        function changeExpanderText() {
          var isExpanded = self.expandableAreaAPI.isExpanded();
          self.setExpanderText(self.settings[isExpanded ? 'expandedText' : 'collapsedText']);
        }

        if (this.hasSummary) {
          this.expandableArea
            .on('expand.' + pluginName, changeExpanderText)
            .on('collapse.' + pluginName, changeExpanderText);
        }

        return this;
      },

      /**
       * Checks if we've passed the breakpoint for switching into Responsive mode.
       * @returns {undefined}
       */
      checkResponsive: function() {
        var cl = this.element[0].classList;

        if (Soho.breakpoints.isBelow(this.settings.breakpoint)) {
          cl.add('is-in-responsive-mode');
        } else {
          cl.remove('is-in-responsive-mode');
          if (this.isSideOriented() && !this.expandableAreaAPI.isExpanded()) {
            this.expandableAreaAPI.open();
          }
        }
      },

      /**
       * Sets the text content of the Composite Form's Expandable Area Expander.
       * @param {string} expanderText - the text content
       * @returns {undefined}
       */
      setExpanderText: function(expanderText) {
        if (!this.hasSummary) {
          return;
        }

        if (!(expanderText instanceof String) || !expanderText.length) {
          return;
        }

        var textSpan = this.expander.find('span');
        if (!textSpan) {
          textSpan = this.expander;
        }
        textSpan.text(expanderText);
      },

      /***
       * Determines if this component is configured for "on-side" orientation of the Summary area.
       * @returns {boolean}
       */
      isSideOriented: function() {
        return this.element[0].classList.contains('on-side');
      },

      /**
       * Re-invokes the Composite Form
       * @returns {this}
       */
      updated: function() {
        return this
          .teardown()
          .init();
      },

      /**
       * Simple Teardown - remove events & rebuildable markup.
       * @returns {this}
       */
      teardown: function() {
        $('body').off('resize.' + pluginName);
        this.element.off('updated.' + pluginName);

        if (this.hasSummary) {
          this.expandableArea.off('expand.' + pluginName + ' collapse.' + pluginName);
        }

        return this;
      },

      /**
       * Destroys the component instance by removing it from its associated element.
       * @returns {this}
       */
      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new CompositeForm(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
