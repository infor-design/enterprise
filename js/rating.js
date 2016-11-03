/**
* Rating Control
*/

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

  $.fn.rating = function(options) {

     // Tab Settings and Options
    var pluginName = 'rating',
        defaults = {},
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Plugin(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function() {
        this.handleEvents();
        this.allInputs = this.element.find('input');
        this.readonly();
      },
      handleEvents: function () {
        var self = this;

        $('input', self.element).each(function(index) {
          $(this).on('change', function () {
            if (!self.element.hasClass('is-readonly')) {
              self.val(index + 1);
            }
          });
        });
      },
      val: function(value) {
        var i, chkIdx, self = this;
        if (!value) {
          return this.currentValue;
        }

        this.currentValue = parseFloat(value, 10);
        chkIdx = Math.round(this.currentValue);

        for (i = 0; i < this.allInputs.length; i++) {
          var input = $(this.allInputs[i]),
            svgSelector = input.parent().is('.inline') ? 'svg' : 'label';

          if (i < value) {
            input.addClass('is-filled').removeClass('is-half');
          } else {
            input.removeClass('is-filled').removeClass('is-half');
          }

          //Handle Half Star
          input.next(svgSelector).find('svg').changeIcon('star-filled');

          if (i+1 === chkIdx) {
            input.prop('checked', true);
          }

          if (chkIdx !== self.currentValue && i+1 === chkIdx) {
           input.addClass('is-half').next(svgSelector).find('svg').changeIcon('star-half');
          }
        }
        if (chkIdx <= 0) {
          $(this.allInputs[0]).prop('checked', true);
        }

        return this.currentValue;
      },
      readonly: function() {
        var elem = $(this.element);
        if (elem.hasClass('is-readonly')) {
          elem.find('input').attr('disabled','');
        }
      },
      enable: function() {
        var elem = $(this.element);
        elem.removeClass('is-readonly').find('input').removeAttr('disabled');
      }
    };

    // Keep the Chaining while Initializing the Control (Only Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Plugin(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
