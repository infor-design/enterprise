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
          showEmptyGroupHeaders: false,
          showSelectAll: false,
          source: undefined
        },
        settings = $.extend({}, defaults, options);

    /**
    * The MultiSelect Component allows selecting multiple items from a list
    *
    * @class MultiSelect
    * @param {String} filterMode  &nbsp;-&nbsp; The search mode to use, can be 'contains' or 'startsWith'
    * @param {Number} maxSelected  &nbsp;-&nbsp; The max number of items which can be selected
    * @param {String} moveSelected  &nbsp;-&nbsp;  Move selected options in each group to just underneath their corresponding group headers.
    * @param {Boolean} showEmptyGroupHeaders  &nbsp;-&nbsp; If true groups with no items will still show the empty group header.
    * @param {Boolean} showSelectAll  &nbsp;-&nbsp; Show the select all text/option.
    * @param {Function} source  &nbsp;-&nbsp; The calback for ajax.
    *
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

        if (this.settings.showEmptyGroupHeaders) {
          ddOpts.showEmptyGroupHeaders = this.settings.showEmptyGroupHeaders;
        }

        if (this.settings.showSelectAll) {
          ddOpts.showSelectAll = this.settings.showSelectAll;
        }

        this.element.dropdown(ddOpts);
        this.dropdown = this.element.data('dropdown');

        return this;
      },

      /**
      * Enable the multiselect input
      */
      enable: function() {
        this.dropdown.enable();
      },

      /**
      * Disable the multiselect input
      */
      disable: function() {
        this.dropdown.disable();
      },

      /**
      * Trigger a rebuild due to settings change
      */
      updated: function() {
        this.build();
      },

      /**
      * Remove added markup and events
      */
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
