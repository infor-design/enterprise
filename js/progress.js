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
     * Progress Indicator Control
     * @constructor
     * @param {Object} element
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

      update: function (value) {

        var perc = this.element.attr('data-value');

        if (value) {
          perc = value;
          this.element.attr('data-value', value);
        }

        this.element.css('width', perc + '%');
        this.updateAria(perc);
      },

      //Teardown
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
