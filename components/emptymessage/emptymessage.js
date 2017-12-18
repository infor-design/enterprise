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

  $.fn.emptymessage = function(options) {

    'use strict';

    // Settings and Options
    var pluginName = 'emptymessage',
        defaults = {
          title: null,
          info: null,
          icon: null,
          button: null
        },
        settings = $.extend({}, defaults, options);

    /**
    * The Empty Message is a message with an icon that can be used when no data is present.
    * @class EmptyMessage
    */
    function EmptyMessage(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    EmptyMessage.prototype = {

      init: function() {
        this
          .setup()
          .build();
      },

      setup: function() {
        this.element.addClass('empty-message');
        return this;
      },

      build: function() {
        var opts = this.settings;

        if (opts.icon) {
          $('<div class="empty-icon">'+
              '<svg class="icon-empty-state" focusable="false" aria-hidden="true" role="presentation">'+
                '<use xlink:href="#'+opts.icon+'"></use>'+
              '</svg>'+
            '</div>'
          ).appendTo(this.element);
        }

        if (opts.title) {
          $('<div class="empty-title">'+ opts.title +'</div>').appendTo(this.element);
        }

        if (opts.button) {
          $('<div class="empty-actions">'+
              '<button type="button" class="btn-secondary hide-focus '+ opts.button.cssClass +'" id="'+ opts.button.id +'">'+
                '<span>'+ opts.button.text +'</span>'+
              '</button>'+
            '</div>').appendTo(this.element);
        }

        return this;
      },

      /**
       * Teardown - Remove added markup and events
       */
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        this.element.empty();
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new EmptyMessage(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
