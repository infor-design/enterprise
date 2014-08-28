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

        // environment strings
        self.env = {
          pasteEvent: self.getPasteEvent(),
          ua: navigator.userAgent,
          iPhone: /iphone/i.test(this.ua),
          chrome: /chrome/i.test(this.ua),
          firefox: /firefox/i.test(this.ua),
          android: /android/i.test(this.ua)
        };

        // Order of operations when choosing pattern strings:
        // jQuery Options > HTML5 'data-format' attribute > Generic pattern string based on "type" attribute > nothing.
        //
        // if no pattern is provided in settings, use a pre-determined pattern based
        // on element type, or grab the pattern from the element itself.
        if (!settings.pattern || settings.pattern === '') {
          var elemPattern = settings.pattern = self.element.attr('data-format') || '';
          if (!elemPattern) {
            self.getPatternForType();
          }
        }
        self.element.on('keydown.format keypress.format ' + self.env.pasteEvent, null, function(e) {
          self.handleKeyEvents.apply(self, arguments);
        });
        self.element.on('focus.format', null, function(e) {
          self.focusEvent.apply( self, arguments );
        });
        self.element.on('blur.format', null, function(e) {
          self.handleEnter.apply( self, arguments );
        });

        console.log('Input field formatter active on element #' + self.element );
      },

      getPasteEvent: function() {
        var el = document.createElement('input'),
            name = 'onpaste';
        el.setAttribute(name, '');
        return ((typeof el[name] === 'function') ? 'paste' : 'input') + '.format';
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
            settings.pattern = '99.99';
            break;
          case 'tel':
            settings.pattern = '(999) 999-9999';
            break;
          default:
            settings.pattern = '**********';
        }
      },

      killEvent: function(e) {
        e.returnValue = false;
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      },

      handleKeyEvents: function(e) {
        var evt = e || window.event;
        var eventType = evt.originalEvent.type;
        var key = this.typedCode(evt);
        var typedChar = String.fromCharCode(key);
        var patternChar = this.getCharacter();

        // set the original value if it doesn't exist.
        if (!this.initValue) {
          this.initValue = this.element.val();
        }

        console.log( '"' + typedChar + '" from keycode "' + key + '" was pressed!' );

        if ( eventType === 'keydown' ) {
          console.log('KEYDOWN!');
          // backspace || delete
          if (key === 8 || key === 46 || (this.env.iPhone && key === 127)) {
            this.handleBackspace(evt);
          } else if (key === 13) { // enter
            this.handleEnter(evt);
          } else if (key === 27) { // escape
            this.handleEscape(evt);
          } else if (36 < key && key < 41) { // arrow keys (in Firefox)
            return;
          } else if ( e.shiftKey && 36 < key && key < 41 ) { // arrow keys AND shift key (for moving the cursor)
            return;
          }
        }

        if ( eventType === 'keypress' ) {
          console.log('KEYPRESS!');
          // Ignore all of these keys or combinations containing these keys
          if (e.ctrlKey || e.altKey || e.metaKey || key < 32) {
            return;
          // Need to additionally check for arrow key combinations here because some browsers
          // Will fire keydown and keypress events for arrow keys.
          } else if ( e.shiftKey  && 36 < key && key < 41) {
            return;
          } else if ( 36 < key && key < 41 ) {
            return;
          }
          this.processMask( typedChar, patternChar, evt );
        }

        if ( eventType === 'paste' ) {
          console.log('PASTE!');
        }

        if ( eventType === 'input') {
          console.log('INPUT!');
        }
      },

      // Handles the backspace key
      handleBackspace: function(e) {
        var val = this.element.val();
        if ( 0 < val.length ) {
          var pos = this.caret();
          var dCaret = pos.end - pos.begin;
          var sliceLength = dCaret > 0 ? dCaret : 1;
          this.element.val( val.slice(0, -sliceLength) );
        }
        return this.killEvent(e);
      },

      handleEnter: function(e) {
        var el = e.currentTarget.tagName + '#' + e.currentTarget.id;
        console.log('Element ' + el + ' Blurred');
      },

      handleEscape: function(e) {
        var self = this;
        self.element.val( self.initValue );
        self.caret(0, self.initValue.length);
        delete self.initValue;
        return self.killEvent(e);
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

      // Writes the current value of the internal text buffer out to the Input Field.
      // Additionally, resets the Caret to the right position.
      writeInput: function() {
        var val = this.element.val(),
          pos = this.originalPos,
          buffSize = this.buffer.length,
          pattSize = settings.pattern.length;

        // insert the buffer's contents
        val = this.insertAtIndex( val, this.buffer, pos.begin );

        // strip out the portion of the text that would be selected by the caret
        var selectedText = val.substring( pos.begin + buffSize, pos.end + buffSize );
        val = val.replace(selectedText, '');

        // cut down the total length of the string to make it no larger than the pattern mask
        val = val.substring( 0, pattSize );

        // put it back!
        this.element.val(val);

        // reposition the caret to be in the correct spot (after the content we just added).
        var totalCaretPos = pos.begin + buffSize;
        var actualCaretPos = totalCaretPos >= pattSize ? pattSize : totalCaretPos;
        this.caret( actualCaretPos );
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
          self.writeInput();
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

      pasteEvent: function(e) {
        console.log('Paste Intercepted on element #' + this.element.attr('id') );
      },

      keyDownEvent: function(e) {

      },

      keyUpEvent: function(e) {

      },

      focusEvent: function(e) {
        var el = e.currentTarget.tagName + '#' + e.currentTarget.id;
        this.initValue = this.element.val();
        console.log('Element ' + el + ' Focused');
      },

      destroy: function() {
        this.element.off('keydown keypress keyup focus blur ' + this.env.pasteEvent);
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
