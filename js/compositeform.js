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
          trigger: null,
          expandedText: Locale.translate('ShowLess'),
          collapsedText: Locale.translate('ShowMore'),
        },
        settings = $.extend({}, defaults, options);

    /**
     * Composite Form Control
     * @constructor
     * @param {Object} element
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

        // Get expandable area reference
        this.expandableArea = this.element.find('.expandable-area');
        this.expandableAreaAPI = this.expandableArea.data('expandablearea');
        if (!this.expandableAreaAPI) {
          this.expandableArea.expandablearea({ trigger: this.settings.trigger });
          this.expandableAreaAPI = this.expandableArea.data('expandablearea');
        }

        // Get expandable trigger
        this.expander = this.expandableAreaAPI.expander;
        this.setExpanderText(this.settings.expandedText);

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

        this.expandableArea
          .on('expand.' + pluginName, changeExpanderText)
          .on('collapse.' + pluginName, changeExpanderText);

        return this;
      },

      /**
       * Checks if we've passed the breakpoint for switching into Responsive mode.
       * @returns {undefined}
       */
      checkResponsive: function() {
        var cl = this.element[0].classList;

        if (Soho.breakpoints.isBelow('phone-to-tablet')) {
          cl.add('is-in-responsive-mode');
        } else {
          cl.remove('is-in-responsive-mode');
        }
      },

      /**
       * Sets the text content of the Composite Form's Expandable Area Expander.
       * @param {string} expanderText - the text content
       * @returns {undefined}
       */
      setExpanderText: function(expanderText) {
        if (!(expanderText instanceof String) || !expanderText.length) {
          return;
        }

        var textSpan = this.expander.find('span');
        if (!textSpan) {
          textSpan = this.expander;
        }
        textSpan.text(expanderText);
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
        this.expandableArea.off('expand.' + pluginName + ' collapse.' + pluginName);
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
