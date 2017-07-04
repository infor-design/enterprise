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

  $.fn.textarea = function(options) {

    // Settings and Options
    var pluginName = 'textarea',
        defaults = {
          characterCounter: true, //But needs a maxlength
          printable: true,  //If the text area can be printed
          charRemainingText: null,
          charMaxText: null
        },
        settings = $.extend({}, defaults, options);

    /**
     * @constructor
     * @param {Object} element
     */
    function Textarea(element) {
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    // Plugin Methods
    Textarea.prototype = {

      init: function() {
        this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        this.isSafari = (
          navigator.userAgent.indexOf('Safari')  !== -1 &&
          navigator.userAgent.indexOf('Chrome') === -1 &&
          navigator.userAgent.indexOf('Android') === -1
        );

        this.element.addClass(this.element.is('.textarea-xs') ? 'input-xs' :
            this.element.is('.textarea-sm') ? 'input-sm' :
            this.element.is('.textarea-lg') ? 'input-lg' : '');

        if (settings.characterCounter && this.element.attr('maxlength')) {
          this.counter = $('<span class="textarea-wordcount">Chars Left..</span>').insertAfter(this.element);
        }
        if (settings.printable) {
          this.printarea = $('<span class="textarea-print"></span>').insertBefore(this.element);
        }
        this.handleEvents();
        this.update(this);
      },

      /**
       *  This component fires the following events.
       *
       * @fires Autocomplete#events
       * @param {Object} keyup  &nbsp;-&nbsp; Fires when the button is clicked (if enabled).
       * @param {Object} focus  &nbsp;-&nbsp; Fires when the menu is focused.
       * @param {Object} keypress  &nbsp;-&nbsp;
       * @param {Object} blur  &nbsp;-&nbsp;
       */
      handleEvents: function() {
        var self = this;
        this.element.on('keyup.textarea', function () {
          self.update(self);
        }).on('focus.textarea', function () {
          if (self.counter) {
            self.counter.addClass('focus');
          }
        }).on('keypress.textarea', function (e) {
          var length = self.element.val().length,
          max = self.element.attr('maxlength');

          if ([97, 99, 118, 120].indexOf(e.which) > -1 && (e.metaKey || e.ctrlKey)) {
            self.update(self);
            return;
          }

          if (!self.isPrintable(e.which)) {
            return;
          }

          if (length >= max && !self.isSelected(this)) {
            e.preventDefault();
          }

        })
        .on('blur.textarea', function () {
          self.update(self);
          if (self.counter) {
            self.counter.removeClass('focus');
          }
        });
      },

      /**
       * @private
       */
      // TODO: What does this do?
      isSelected: function (input) {
        if (typeof input.selectionStart === 'number') {
          return input.selectionStart === 0 && input.selectionEnd === input.value.length;
        } else if (typeof document.selection !== 'undefined') {
          input.focus();
          return document.selection.createRange().text === input.value;
        }
      },

      /**
       * Checks a keycode value and determines if it belongs to a printable character.
       * @param {Number} keycode - a number representing an ASCII keycode value
       * @returns {boolean}
       */
      isPrintable: function(keycode) {
        var valid =
          (keycode > 47 && keycode < 58)   || // number keys
          (keycode > 64 && keycode < 91)   || // letter keys
          (keycode > 95 && keycode < 112)  || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
        return valid;
      },

      /**
       * Counts the number of line breaks in a string
       * @param {String} s
       * @returns {Number}
       */
      countLinebreaks: function(s) {
        return (s.match(/\n/g) || []).length;
      },

      /**
       * Updates the descriptive markup (counter, etc) to notify the user how many characters can be typed.
       * @private
       * @param {TextArea} self
       */
      update: function (self) {
        var value = self.element.val(),
          isExtraLinebreaks = this.isChrome || this.isSafari,
          length = value.length + (isExtraLinebreaks ? this.countLinebreaks(value) : 0),
          max = self.element.attr('maxlength'),
          remaining = (parseInt(max)-length),
          text = (settings.charRemainingText ? settings.charRemainingText : (Locale.translate('CharactersLeft') === 'CharactersLeft' ? 'Characters Left' : Locale.translate('CharactersLeft'))).replace('{0}', remaining.toString());

        if (self.counter) {
          if (length === 0) {
            text = (settings.charMaxText ? settings.charMaxText : Locale.translate('CharactersMax')) + max;
            self.counter.text(text);
            self.counter.removeClass('almost-empty');
          } else {
            self.counter.text(text);
            if (remaining < 10) {
              self.counter.addClass('almost-empty');
            } else {
              self.counter.removeClass('almost-empty');
            }
          }
        }

        if (self.printarea) {
          self.printarea.text(self.element.val());
        }
      },

      /**
       * Enables this component instance.
       */
      enable: function () {
        this.element.prop('disable', false).prop('readonly', false);
      },

      /**
       * Disables this component instance.
       */
      disable: function () {
        this.element.prop('disable', true);
      },

      /**
       * Sets this component instance to "readonly"
       */
      readonly: function () {
        this.element.prop('readonly', true);
      },

      /**
       * Destroys this component instance and unlinks it from its element.
       */
      destroy: function() {
        $.removeData(this.element[0], pluginName);
        if (this.printarea && this.printarea.length) {
          this.printarea.remove();
        }
        if (this.counter && this.counter.length) {
          this.counter.remove();
        }
        this.element.off('keyup.textarea');
      }
    };

    // Initialize the plugin (Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, defaults, options);
      } else {
        instance = $.data(this, pluginName, new Textarea(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
