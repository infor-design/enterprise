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

  $.fn.trackdirty = function(options) {
    'use strict';

    // Settings and Options
    var pluginName = 'trackdirty',
        defaults = {
        },
        settings = $.extend({}, defaults, options);

    /**
     * Track changes on the inputs passed in the jQuery selector and show a dirty indicator
     * @constructor
     * @param {Object} element
     */
    function Trackdirty(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Trackdirty Methods
    Trackdirty.prototype = {

      init: function () {
        this.handleEvents();
      },

      /**
       * Get the value or checked if checkbox or radio
       * @private
       * @param {Object} element .
       * @returns {String} element value
       */
      valMethod: function (element) {
        switch (element.attr('type')) {
          case 'checkbox':
          case 'radio':
            return element.prop('checked');
          default:
            return element.val();
        }
      },

      /**
       * Get absolute position for an element
       * @private
       * @param {Object} element .
       * @returns {Object} position for given element
       */
      getAbsolutePosition: function (element) {
        var pos = element.position();
        element.parents().each(function() {
          var el = this;
          if (window.getComputedStyle(el, null).position === 'relative') {
            return false;
          }
          pos.left += el.scrollLeft;
          pos.top += el.scrollTop;
        });
        return { left:pos.left, top:pos.top };
      },

      /**
       * Removes event bindings from the instance.
       * @private
       * @returns {Object} The api
       */
      unbind: function () {
        this.element
          .removeClass('dirty')
          .off('resetdirty.dirty change.dirty doresetdirty.dirty');

        if (this.settings && typeof this.settings.d === 'object') {
          var d = this.settings.d;
          $('.icon-dirty, .msg-dirty', d.field).add(d.icon).add(d.msg).remove();
        }

        $.removeData(this.element[0], 'original');
        return this;
      },

      /**
       * Resync the UI and Settings.
       * @param {Object} settings The settings to apply.
       * @returns {Object} The api
       */
      updated: function () {
        return this
          .unbind()
          .init();
      },

      /**
       * Destroy this component instance and remove the link from its base element.
       * @returns {void}
       */
      destroy: function () {
        this.unbind();
        $.removeData(this.element[0], pluginName);
      },

      /**
       * Attach Events used by the Control
       * @private
       * @returns {void}
       */
      handleEvents: function () {
        var self = this;
        var input = this.element;

        input.data('original', self.valMethod(input))
          .on('resetdirty.dirty', function () {
            /**
            * Fires when reset dirty.
            *
            * @event resetdirty
            * @type {Object}
            * @property {Object} event - The jquery event object
            */
            input.data('original', self.valMethod(input))
              .triggerHandler('doresetdirty.dirty');
          })
          .on('change.dirty doresetdirty.dirty', function (e) {
            var el = input;
            var field = input.closest('.field, .radio-group');
            var label = $('label:visible', field);
            var d = { class: '', style: '' };

            if (field.is('.field-fileupload')) {
              el = label.prev('input');
            }

            if (field.is('.editor-container')) {
              el = field.closest('textarea');
            }

            // Used element without .field wrapper
            if (!label[0]) {
              label = input.next('label');
            }
            if (input.attr('data-trackdirty') !== 'true') {
              return;
            }

            // Add class to element
            input.addClass('dirty');

            // Set css class
            if (input.is('[type="checkbox"], [type="radio"]')) {
              d.class += ' dirty-'+ input.attr('type');
              d.class += input.is(':checked') ? ' is-checked' : '';
            }
            if (input.is('select')) {
              d.class += ' is-select';
              el = input.next('.dropdown-wrapper').find('.dropdown');
            }

            // Add class and icon
            d.icon = el.prev();
            if (!d.icon.is('.icon-dirty')) {
              if (input.is('[type="checkbox"]')) {
                d.rect = self.getAbsolutePosition(label);
                d.style = ' style="left:'+ d.rect.left +'px; top:'+ d.rect.top +'px;"';
              }
              d.icon = '<span class="icon-dirty'+ d.class +'"'+ d.style +'></span>';
              d.msg = Locale.translate('MsgDirty') || '';
              d.msg = '<span class="audible msg-dirty">'+ d.msg +'</span>';

              // Add icon and msg
              var firstInput = $($(el[0].parentElement).find('input')[0]);
              el = input.is('[type="radio"]') ? firstInput : el;

              if ($(el[0].parentElement).find('.icon-dirty').length === 0) {
                el.before(d.icon);
                label.append(d.msg);
              }

              // Cache icon and msg
              d.icon = el.prev();
              d.msg = label.find('.msg-dirty');
            }

            // Handle resetting value back
            var original = input.data('original');
            var current = self.valMethod(input);

            d.field = field;
            self.settings.d = d;

            if (field.is('.editor-container')) {
              // editors values are further down it's tree in a textarea,
              // so get the elements with the value
              var textArea = field.find('textarea');
              original = textArea[0].defaultValue;
              current = self.valMethod(textArea);
            }
            if (current === original) {
              input.removeClass('dirty');
              $('.icon-dirty, .msg-dirty', field).add(d.icon).add(d.msg).remove();
              input.trigger(e.type === 'doresetdirty' ? 'afterresetdirty' : 'pristine');
              return;
            }

            /**
            * Fires when trackdirty added.
            *
            * @event dirty
            * @type {Object}
            * @property {Object} event - The jquery event object
            */
            input.trigger('dirty');
          });
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Trackdirty(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
