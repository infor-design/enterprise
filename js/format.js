/**
* Inline Field Formatter (Mask) Control
* Adds a text-based formatting "mask" to input fields that displays how data should be entered into the field.
* Does not allow text entry that does not match the provided mask.
* @name XYZ TODO: Test Doc Generation
* @param {string} propertyName - The Name of the Property defaults to defaultValue
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
      //Support for Atom/CommonJS - Not Tested TODO
      module.exports = factory;
  } else {
      // Register with Browser globals
      factory(window.jQuery || window.Zepto);
  }
}(function ($) {

  $.fn.format = function( options ) {

    // Tab Settings and Options
    var pluginName = 'format',
        defaults = {
          pattern: '',
          placeholder: '_',
          definitions: {
            '9': /[0-9]/,
            'a': /[A-Za-z]/,
            '*': /[A-Za-z0-9]/
          }
        },
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Plugin(element) {
        this.element = $(element);
        this.init();
    }

    // Actual Plugin Code
    Plugin.prototype = {
      init: function(){
        var self = this;
        self.buffer = '';

        // Order of operations when choosing pattern strings:
        // jQuery Options > HTML5 Pattern Attribute > Generic pattern string based on "type" attribute > nothing.
        //
        // if no pattern is provided in settings, use a pre-determined pattern based
        // on element type, or grab the pattern from the element itself.
        if (!settings.pattern || settings.pattern === '') {
          var elemPattern = settings.pattern = self.element.attr('data-format') || '';
          if (!elemPattern) {
            self.getPatternForType();
          }
        }
        self.element.on('keydown.format', null, function(e) {
          self.keyDownEvent.apply(self, arguments);
        });
        self.element.on('keypress.format', null, function(e) {
          self.initValue = self.element.val();
          self.keyPressEvent.apply(self, arguments);
        });
        self.element.on('focus.format', null, self.focusEvent);
        self.element.on('blur.format', null, self.blurEvent);

        console.log('Input field formatter active on element #' + self.element );
      },

      //Helper Function for Caret positioning
      //from jQuery.maskedInput
      caret: function(begin, end) {
        var self = this,
          range;
        if (self.element.val().length === 0 || self.element.is(':hidden')) {
          return {
            begin: 0,
            end: 0
          };
        }
        if (typeof begin === 'number') {
          end = (typeof end === 'number') ? end : begin;
          return self.element.each(function() {
            if (this.setSelectionRange) {
              this.setSelectionRange(begin, end);
            } else if (this.createTextRange) {
              range = this.createTextRange();
              range.collapse(true);
              range.moveEnd('character', end);
              range.moveStart('character', begin);
              range.select();
            }
          });
        } else {
          if (self.element[0].setSelectionRange) {
            begin = self.element[0].selectionStart;
            end = self.element[0].selectionEnd;
          } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            begin = 0 - range.duplicate().moveStart('character', -100000);
            end = begin + range.text.length;
          }
          return {
            begin: begin,
            end: end
          };
        }
      },

      // used for getting the proper keyCode for cross-browser compatability.
      typedCode: function(event) {
        var code=0;
        if ( event === null && window.event ) {
          event = window.event;
        }
        if( event !== null ) {
          if ( event.keyCode ) {
            code = event.keyCode;
          } else if ( event.which ) {
            code = event.which;
          }
        }
        return code;
      },

      getPatternForType: function() {
        var self = this,
          type = self.element.attr('type');

        // TODO: flesh this out
        switch(type) {
          case 'number':
            settings.pattern = '';
            break;
          case 'tel':
            settings.pattern = '(999) 999-9999';
            break;
          default:
            settings.pattern = '';
        }
      },

      killEvent: function(e) {
        e.returnValue = false;
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      },

      keyPressEvent: function(e) {
        var self = this;
        var key = self.typedCode(e);
        var typedChar = String.fromCharCode(key);
        var el = e.currentTarget.tagName + '#' + e.currentTarget.id;
        var patternChar = self.getCharacter();

        console.log('Detected keypress "' + typedChar + '" + on element #' + el + '.');

        self.processMask( typedChar, patternChar, e );
      },

      isCharacterLiteral: function( patternChar ) {
        return $.inArray( patternChar, Object.keys(settings.definitions) ) === -1;
      },

      resetStorage: function() {
        delete this.originalPos;
        delete this.currentMaskBeginIndex;
        this.buffer = '';
      },

      insertAtIndex: function (string, value, index) {
          return string.substring(0, index) + value + string.substring(index);
      },

      writeInput: function() {
        var val = this.element.val(),
          pos = this.originalPos;

        val = this.insertAtIndex( val, this.buffer, pos.begin );
        val = val.substring( 0, settings.pattern.length );
        this.element.val(val);
      },

      processMask: function( typedChar, patternChar, e ) {
        var self = this;
        self.originalPos = self.caret();
        self.currentMaskBeginIndex = self.currentMaskBeginIndex || self.originalPos.begin;

        // don't do anything if you're at the end of the pattern.  You can't type anymore.
        if ( self.currentMaskBeginIndex >= settings.pattern.length ) {
          self.resetStorage();
          return self.killEvent(e);
        }

        if ( self.isCharacterLiteral(patternChar) ) {
          // if you typed the exact character that's next in the mask, simply print the write buffer.
          if (typedChar === patternChar) {
              //self.caret( self.originalPos.begin, self.originalPos.end );
              self.buffer += typedChar;
              self.writeInput();
              self.resetStorage();
              return self.killEvent(e);
          }

          // get the character in the next position to see if it matches the regex.  If it does, print both characters
          // to the input box.
          self.buffer += patternChar;
          var newPatternChar = self.getCharacter('next', self.currentMaskBeginIndex);
          self.currentMaskBeginIndex++;
          self.processMask( typedChar, newPatternChar, e );
        }
        else {
          // Check the character against its counterpart character in the mask
          var match = self.testCharAgainstRegex(typedChar, patternChar);
          if (!match) {
            self.resetStorage();
            return self.killEvent(e);
          }

          self.buffer += typedChar;
          var len = self.buffer.length;
          var pos = self.caret();

          self.writeInput();
          self.caret( self.originalPos.begin + len, self.originalPos.end + len );
          self.resetStorage();

          return self.killEvent(e);
        }
      },

      testCharAgainstRegex: function(typedChar, patternChar) {
        var regex = settings.definitions[patternChar];
        return regex.test(typedChar);
      },

      moveCursor: function( direction ) {
        var self = this;
        var pos = self.caret();

        var _direction = self.evaluateDirecton(direction);

        switch(_direction) {
          case 'next':
            self.caret( pos.begin + 1 );
            break;
          case 'prev':
            self.caret( pos.begin - 1 );
            break;
          default:
            break;
        }
      },

      // Get the direction in which to position the cursor (if necessary)
      // defaults to 'current', which will not move the cursor.
      evaluateDirecton: function( direction ) {
        var _direction = 'current';
        var directions = ['current', 'next', 'prev'];
        if ( direction ) {
          var i = $.inArray( direction, directions );
          _direction = directions[i];
        }
        return _direction;
      },

      // Returns the character at the current/next/previous cursor position.
      // If no direction is provided, it defaults to the current position.
      // If an optional index is provided, the cursor position will shift to that index value.
      getCharacter: function( direction, maskIndex ) {
        var _direction = this.evaluateDirecton(direction);
        var mask = settings.pattern;
        var index = maskIndex ? maskIndex : this.caret().begin;

        switch(_direction) {
          case 'next':
            return mask.substring( index + 1, index + 2 );
          case 'prev':
            return mask.substring( index - 1, index );
          default:
            return mask.substring( index, index + 1 );
        }
      },

      keyDownEvent: function(e) {

      },

      keyUpEvent: function(e) {

      },

      focusEvent: function(e) {
        var el = e.currentTarget.tagName + '#' + e.currentTarget.id;
        console.log('Element ' + el + ' Focused');
      },

      blurEvent: function(e) {
        var el = e.currentTarget.tagName + '#' + e.currentTarget.id;
        console.log('Element ' + el + ' Blurred');
      },

      destroy: function() {
        this.element.off('keydown keypress keyup focus blur');
        this.element.removeData(pluginName);
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
}));
