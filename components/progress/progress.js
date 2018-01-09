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

  $.fn.progress = function(options) {

    // Settings and Options
    var pluginName = 'progress',
        defaults = {
        },
        settings = $.extend({}, defaults, options);

    /**
    * The Progress Component displays loading information.
    *
    * @class Progress
    * @param None
    */
    function Progress(element) {
      this.element = $(element);
      this.settings = settings;
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Actual Progress Code
    Progress.prototype = {

      init: function() {
        var self = this;
        self.update();

        this.element.off('updated.progress').on('updated.progress', function (e) {
          e.stopPropagation();
          self.update();
        });
      },

      updateAria: function (value) {
        this.element.attr({'role': 'progressbar', 'aria-valuenow': value, 'aria-maxvalue':'100'});

        var container = this.element.parent();
        if (container.data('tooltip')) {
          container.data('tooltip').content = value + '%';
        } else {
          container.attr('title', value + '%').tooltip();
        }
      },

      /**
      * Update the progress bar.
      *
      * @param {String} value  The percent value to use to fill. 0-100
      */
      update: function (value) {

        var perc = this.element.attr('data-value');

        if (value) {
          perc = value;
          this.element.attr('data-value', value);
        }

        this.element[0].style.width = perc + '%';
        this.updateAria(perc);
      },

      /**
      * Teardown and remove any added markup and events.
      */
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.off('updated.progress');
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Progress(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
