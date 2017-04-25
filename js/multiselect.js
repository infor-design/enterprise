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

  $.fn.multiselect = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'multiselect',
        defaults = {
          filterMode: 'contains',
          maxSelected: undefined,
          moveSelected: 'all',
          source: undefined
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function MultiSelect(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    MultiSelect.prototype = {

      init: function() {
        this.build();
      },

      build: function() {
        var ddOpts = {
            closeOnSelect: false,
            empty: true,
            moveSelected: 'all',
            multiple: true
          };

        if (this.settings.filterMode) {
          ddOpts.filterMode = this.settings.filterMode;
        }

        if (this.settings.source) {
          ddOpts.source = this.settings.source;
        }

        if (this.settings.maxSelected) {
          ddOpts.maxSelected = this.settings.maxSelected;
        }

        if (this.settings.moveSelected) {
          ddOpts.moveSelected = this.settings.moveSelected;
        }

        this.element.dropdown(ddOpts);
        this.dropdown = this.element.data('dropdown');

        return this;
      },

      enable: function() {
        this.dropdown.enable();
      },

      disable: function() {
        this.dropdown.disable();
      },

      updated: function() {
        this.build();
      },

      // Teardown - Remove added markup and events
      destroy: function() {
        this.dropdown.destroy();
        this.element.off();
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
        instance = $.data(this, pluginName, new MultiSelect(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
