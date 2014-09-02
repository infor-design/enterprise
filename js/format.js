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
        // HTML5 'data-format' attribute > Generic pattern string based on "type" attribute > nothing.
        //
        // if no pattern is provided in settings, use a pre-determined pattern based
        // on element type, or grab the pattern from the element itself.
        self.pattern = self.element.attr('data-format') || settings.pattern || '';
        if (!self.pattern || self.pattern === '') {
          self.getPatternForType();
        }

        // Point all keyboard related events to the handleKeyEvents() method, which knows how to
        // deal with key syphoning and event propogation.
        self.element.on('keydown.format keypress.format ' + self.env.pasteEvent, null, function(e) {
          self.handleKeyEvents.apply(self, arguments);
        });

        // when the element is focused, store its initial value.
        self.element.on('focus.format', null, function(e) {
          self.initValue = self.element.val();
        });

        // remove the value when blurred
        self.element.on('blur.format', null, function(e) {
          delete this.initValue;
        });

        // Test contents of the input field.  If there are characters, run them
        // against the mask and fill them in as necessary.
        var val = self.element.val();
        if ( val.length > 0 ) {
          self.processStringAgainstMask( val );
        }

      },

      // Builds a fake element and gets the name of the event that will be used for "paste"
      // Used for cross-browser compatability.
      getPasteEvent: function() {
        var el = document.createElement('input'),
            name = 'onpaste';
        el.setAttribute(name, '');
        return ((typeof el[name] === 'function') ? 'paste' : 'input') + '.format';
      },

      // Gets rid of event firing and bubbling in all browsers.
      killEvent: function(e) {
        e.returnValue = false;
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      },

      // used for getting the proper keyCode ID number with cross-browser compatability.
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

      // Uses the "type" attribute on an element to determine a default pattern.
      // This is called when "$.format" is invoked on a field that contains an empty "data-format" attribute.
      getPatternForType: function() {
        var self = this,
          type = self.element.attr('type');

        // TODO: flesh this out
        switch(type) {
          case 'number':
            self.pattern = '99.99';
            break;
          case 'tel':
            self.pattern = '(999) 999-9999';
            break;
          default:
            self.pattern = '**********';
        }
      },

      // Helper Function for Caret positioning.  If you provide "begin" and "end" arguments, the caret position
      // will change.  If you simply call the method with no arguments, it returns an object containing the cursor's
      // beginning and ending posititons.
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

      // Moves the text input cursor a specified distance in a specified direction
      moveCursor: function( direction, distance ) {
        var self = this;
        var pos = self.caret();

        var _direction = self.evaluateDirecton(direction);
        var _d = distance || 1;

        switch(_direction) {
          case 'next':
            self.caret( pos.begin + _d );
            break;
          case 'prev':
            self.caret( pos.begin - _d );
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

      // The catch-all event for handling keyboard events within this input field. Grabs information about the keys
      // being pressed, event type, matching pattern characters, and determines what to do with them.
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
            this.element.trigger('blur', evt);
          } else if (key === 27) { // escape
            this.handleEscape(evt);
          } else if (36 < key && key < 41) { // arrow keys (in Firefox)
            return;
          } else if ( evt.shiftKey && 36 < key && key < 41 ) { // arrow keys AND shift key (for moving the cursor)
            return;
          }
        }

        if ( eventType === 'keypress' ) {
          console.log('KEYPRESS!');
          // Ignore all of these keys or combinations containing these keys
          if (evt.ctrlKey || evt.altKey || evt.metaKey || key < 32) {
            return;
          // Need to additionally check for arrow key combinations here because some browsers
          // Will fire keydown and keypress events for arrow keys.
          } else if ( evt.shiftKey  && 36 < key && key < 41) {
            return;
          } else if ( 36 < key && key < 41 ) {
            return;
          }
          this.processMask( typedChar, patternChar, evt );
        }

        if ( eventType === 'paste' ) {
          this.handlePaste(evt);
        }

        if ( eventType === 'input') {
          console.log('INPUT!');
        }
      },

      // When using Backspace, correctly remove the intended text content and place the caret
      // in the correct place.
      handleBackspace: function(e) {
        var val = this.element.val();
        if ( 0 < val.length ) {
          var pos = this.caret();
          var dCaret = pos.end - pos.begin;
          var trueCaretPosBegin = dCaret > 0 ? pos.begin : pos.begin - 1;
          var selectedText = val.slice(trueCaretPosBegin, pos.end);

          val = this.deleteAtIndex(val, selectedText, trueCaretPosBegin);
          this.element.val( val );
          this.caret( trueCaretPosBegin );
        }
        return this.killEvent(e);
      },

      // When escaping from a modified field, place the initial value of the field
      // back in place of the discarded edits.
      handleEscape: function(e) {
        var self = this;
        self.element.val( self.initValue );
        self.caret(0, self.initValue.length);
        delete self.initValue;
        return self.killEvent(e);
      },

      // Intercepts the Paste event, modifies the contents of the clipboard to fit within the size
      // and character limits of the mask, and writes the result to the input field.
      handlePaste: function(e) {
        console.log('Paste Intercepted on element #' + this.element.attr('id') );

        var paste = e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData ?
          e.originalEvent.clipboardData.getData('text/plain') : // Standard
          window.clipboardData && window.clipboardData.getData ?
          window.clipboardData.getData('Text') : // MS
          false;

        console.log('Original Pasted Content: ' + paste);

        if (paste) {
          // cut down the total size of the paste input to only be as long as the pattern allows.
          var maxPasteInput = paste.substring( 0, this.pattern.length );
          console.log('working with subsection of pasted content: ' + maxPasteInput);
          this.processStringAgainstMask(maxPasteInput, e);
        }

        this.killEvent(e);
      },

      // Attempts to match the character provided from a pattern against the array of
      // pattern matching characters ("definitions"). If the character is not in the array,
      // it is considered "literal", and will be placed into the input field as part of the mask.
      isCharacterLiteral: function( patternChar ) {
        return $.inArray( patternChar, Object.keys(settings.definitions) ) === -1;
      },

      // The following methods are used for modifying the contents of strings based on caret position.
      // TODO: Move these to a more global space for use in other plugins?
      insertAtIndex: function(string, value, index) {
          return string.substring(0, index) + value + string.substring(index);
      },
      replaceAtIndex: function(string, value, index) {
        return string.substr(0, index) + value + string.substr(index+value.length);
      },
      deleteAtIndex: function(string, value, index) {
        return string.substr(0, index) + string.substr(index + value.length);
      },

      // Resets properties used for internal storage between keypresses to their default values
      resetStorage: function() {
        delete this.originalPos;
        delete this.currentMaskBeginIndex;
        this.buffer = '';
      },

      // Writes the current value of the internal text buffer out to the Input Field.
      // Additionally, resets the Caret to the right position.
      writeInput: function() {
        var val = this.element.val(),
          pos = this.originalPos,
          buffSize = this.buffer.length,
          pattSize = this.pattern.length;

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

      // Filter the character that was just typed into the mask to determine if it belongs.
      // In some cases, extra characters that belong in the correctly-masked text will be added before
      // The typed character is placed.  If the character doesn't belong, stop the event and reset.
      processMask: function( typedChar, patternChar, e ) {
        var self = this;
        self.originalPos = self.caret();
        self.currentMaskBeginIndex = self.currentMaskBeginIndex || self.originalPos.begin;

        // don't do anything if you're at the end of the pattern.  You can't type anymore.
        if ( self.currentMaskBeginIndex >= self.pattern.length ) {
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

      // Takes an entire string of characters and runs it against the processMask() method until it's complete
      processStringAgainstMask: function( string, originalEvent ) {
        var charArray = string.split('');
        for(var i = 0; i < charArray.length; i++) {
          var patternChar = this.getCharacter();
          this.processMask( charArray[i], patternChar, originalEvent );
        }
      },

      // Takes a character from the pattern string in Settings, gets the corresponding Regex string
      // from the definitions array in Settings, and tests the character against the Regex.
      testCharAgainstRegex: function(typedChar, patternChar) {
        var regex = settings.definitions[patternChar];
        return regex.test(typedChar);
      },

      // Returns the character at the current/next/previous cursor position.
      // If no direction is provided, it defaults to the current position.
      // If an optional index is provided, the cursor position will shift to that index value.
      getCharacter: function( direction, maskIndex ) {
        var _direction = this.evaluateDirecton(direction);
        var mask = this.pattern;
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
