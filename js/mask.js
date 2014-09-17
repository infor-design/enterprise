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

  $.fn.mask = function(options) {

    // Tab Settings and Options
    var pluginName = 'mask',
        defaults = {
          pattern: '',
          placeholder: '_',
          definitions: {
            '#': /[0-9]/,
            '0': /[0-9]/,
            'a': /[A-Za-z]/,
            '*': /[A-Za-z0-9]/
          },
          number: false
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

        // environment strings/bools
        self.env = {
          pasteEvent: self.getPasteEvent(),
          ua: navigator.userAgent,
          iPhone: /iphone/i.test(this.ua)
        };

        // Order of operations when choosing pattern strings:
        // HTML5 'data-mask' attribute > Generic pattern string based on "type" attribute > nothing.
        //
        // if no pattern is provided in settings, use a pre-determined pattern based
        // on element type, or grab the pattern from the element itself.
        self.pattern = self.element.attr('data-mask') || settings.pattern || '';
        if (!self.pattern || self.pattern === '') {
          self.getPatternForType();
        }

        // If a "mode" is defined, special formatting rules may apply to this mask.
        // Otherwise, the standard single-character pattern match will take place.
        self.mode = self.element.attr('data-mask-mode') || undefined;
        if (self.mode) {
          self.setupModeRules();
        }

        // Point all keyboard related events to the handleKeyEvents() method, which knows how to
        // deal with key syphoning and event propogation.
        self.element.on('keydown.mask keypress.mask ' + self.env.pasteEvent, null, function(e) {
          self.handleKeyEvents(self, e);
        });

        // when the element is focused, store its initial value.
        self.element.on('focus.mask', null, function() {
          self.initValue = self.element.val();
        });

        // remove the value when blurred
        self.element.on('blur.mask', null, function() {
          self.initValue = null;
          if (self.mustComplete) {
            self.checkCompletion();
          }
        });

        // Test contents of the input field.  If there are characters, run them
        // against the mask and fill them in as necessary.
        var val = self.element.val();
        if (val.length > 0) {
          self.processStringAgainstMask(val);
        }

      },

      // Builds a fake element and gets the name of the event that will be used for "paste"
      // Used for cross-browser compatability.
      getPasteEvent: function() {
        var el = document.createElement('input'),
            name = 'onpaste';
        el.setAttribute(name, '');
        return ((typeof el[name] === 'function') ? 'paste' : 'input') + '.mask';
      },

      // Gets rid of event firing and bubbling in all browsers.
      killEvent: function(e) {
        if (e) {
          e.returnValue = false;
          if (e.preventDefault) {
            e.preventDefault();
          }
        }
        return false;
      },

      // used for getting the proper keyCode ID number with cross-browser compatability.
      typedCode: function(event) {
        var code = 0;
        if (event === null && window.event) {
          event = window.event;
        }
        if(event !== null) {
          if (event.keyCode) {
            code = event.keyCode;
          } else if (event.which) {
            code = event.which;
          }
        }
        return code;
      },

      // Uses the "type" attribute on an element to determine a default pattern.
      // This is called when "$.mask" is invoked on a field that contains an empty "data-mask" attribute.
      getPatternForType: function() {
        var self = this,
          type = self.element.attr('type');

        // TODO: flesh this out
        switch(type) {
          case 'tel':
            self.pattern = '(###) ###-####';
            break;
          default:
            self.pattern = '**********';
        }
      },

      // Used for defining special rules and flags for use with certain mask types.
      setupModeRules: function() {
        switch(this.mode) {
          case 'number':
            //this.mustComplete = true;
            this.element.css('text-align', 'right');
            break;
          default:
            break;
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
      moveCursor: function(direction, distance) {
        var self = this,
          pos = self.caret();

        direction = self.evaluateDirecton(direction);
        distance = distance || 1;

        switch(direction) {
          case 'next':
            self.caret(pos.begin + distance);
            break;
          case 'prev':
            self.caret(pos.begin - distance);
            break;
          default:
            break;
        }
      },

      // Get the direction in which to position the cursor (if necessary)
      // defaults to 'current', which will not move the cursor.
      evaluateDirecton: function(direction) {
        if (!direction) {
          return 'current';
        }
        var directions = ['current', 'next', 'prev'],
          i = $.inArray(direction, directions);
        return directions[i];
      },

      // If the mask isn't completed to the end, erase the contents of the input field
      // Used on Blur if the "mustComplete" flag is set
      checkCompletion: function() {
        var inputLength = this.element.val().length,
          maskLength = this.pattern.length;

        if (maskLength !== inputLength) {
          this.element.val('');
        }
      },

      // The catch-all event for handling keyboard events within this input field. Grabs information about the keys
      // being pressed, event type, matching pattern characters, and determines what to do with them.
      handleKeyEvents: function(self, e) {
        var evt = e || window.event,
          eventType = evt.originalEvent.type,
          key = self.typedCode(evt),
          typedChar = String.fromCharCode(key),
          patternChar = self.getCharacter();

        // set the original value if it doesn't exist.
        if (!self.initValue) {
          self.initValue = self.element.val();
        }

        if (eventType === 'keydown') {
          // backspace || delete
          if (key === 8 || key === 46 || (self.env.iPhone && key === 127)) {
            self.handleBackspace(evt);
          } else if (key === 13) { // enter
            self.element.trigger('blur', evt);
          } else if (key === 27) { // escape
            self.handleEscape(evt);
          } else if (36 < key && key < 41) { // arrow keys (in Firefox)
            return;
          } else if (evt.shiftKey && 36 < key && key < 41) { // arrow keys AND shift key (for moving the cursor)
            return;
          }
        }

        if (eventType === 'keypress') {
          // Ignore all of these keys or combinations containing these keys
          if (evt.ctrlKey || evt.altKey || evt.metaKey || key < 32) {
            return;
          // Need to additionally check for arrow key combinations here because some browsers
          // Will fire keydown and keypress events for arrow keys.
          } else if (evt.shiftKey && 36 < key && key < 41) {
            return;
          } else if (36 < key && key < 41) {
            return;
          }
          if (self.mode === 'number') {
            self.processNumberMask(typedChar, patternChar, evt);
          } else {
            self.processMask(typedChar, patternChar, evt);
          }
        }

        if (eventType === 'paste') {
          self.handlePaste(evt);
        }

        if (eventType === 'input') {
          // TODO: Handle Input Event
        }
      },

      // When using Backspace, correctly remove the intended text content and place the caret
      // in the correct place.
      handleBackspace: function(e) {
        var val = this.element.val();
        if (0 < val.length) {
          var pos = this.caret(),
            dCaret = pos.end - pos.begin,
            trueCaretPosBegin = dCaret > 0 ? pos.begin : pos.begin - 1,
            selectedText = val.slice(trueCaretPosBegin, pos.end);

          val = this.deleteAtIndex(val, selectedText, trueCaretPosBegin);
          this.element.val(val);
          this.caret(trueCaretPosBegin);
        }
        return this.killEvent(e);
      },

      // When escaping from a modified field, place the initial value of the field
      // back in place of the discarded edits.
      handleEscape: function(e) {
        var self = this;
        self.element.val(self.initValue);
        self.caret(0, self.initValue.length);
        self.initValue = null;
        return self.killEvent(e);
      },

      // Intercepts the Paste event, modifies the contents of the clipboard to fit within the size
      // and character limits of the mask, and writes the result to the input field.
      handlePaste: function(e) {
        var paste = e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData ?
          e.originalEvent.clipboardData.getData('text/plain') : // Standard
          window.clipboardData && window.clipboardData.getData ?
          window.clipboardData.getData('Text') : // MS
          false;

        if (paste) {
          // cut down the total size of the paste input to only be as long as the pattern allows.
          var maxPasteInput = paste.substring(0, this.pattern.length);
          this.processStringAgainstMask(maxPasteInput, e);
        }
        this.killEvent(e);
      },

      // Attempts to match the character provided from a pattern against the array of
      // pattern matching characters ("definitions"). If the character is not in the array,
      // it is considered "literal", and will be placed into the input field as part of the mask.
      isCharacterLiteral: function(patternChar) {
        return $.inArray(patternChar, Object.keys(settings.definitions)) === -1;
      },

      // Tests the character provided against the current langauge's decimal selector
      // TODO: Add globalization support for the decimal selector
      isCharacterDecimal: function(patternChar) {
        return patternChar === '.';
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
        this.originalPos = null;
        this.currentMaskBeginIndex = null;
        this.buffer = '';
      },

      // Writes the current value of the internal text buffer out to the Input Field.
      // Additionally, resets the Caret to the right position.
      writeInput: function() {
        var val = this.element.val(),
          originalVal = val,
          pos = this.originalPos,
          buffSize = this.buffer.length,
          pattSize = this.pattern.length,
          decimalIndex;

        // insert the buffer's contents
        val = this.insertAtIndex(val, this.buffer, pos.begin);

        // If we're dealing with a number, get the index of the decimal point if it exists.
        // Also check the number of 'integers' in the number.  If the 'integer' portion of the input
        // is complete, always place the decimal point in a fixed position.
        if (this.mode === 'number') {
          decimalIndex = val.indexOf('.');
          var numInputInts = val.split('.')[0].replace(/,/g, '').length,
          numMaskInts = this.pattern.length - this.pattern.split('.')[0].replace(/,/g, '').length;
          if (numInputInts >= numMaskInts) {
            decimalIndex = this.pattern.indexOf('.');
          }
        }

        // strip out the portion of the text that would be selected by the caret
        var selectedText = val.substring(pos.begin + buffSize, pos.end + buffSize);
        val = val.replace(selectedText, '');

        // cut down the total length of the string to make it no larger than the pattern mask
        val = val.substring(0, pattSize);

        // if we're dealing with numbers, figure out commas and adjust caret position accordingly.
        if (this.mode === 'number') {
          // cut any extra leading zeros.
          var valWithoutLeadZeros = val.replace(/^0+(?!\.|$)/, ''),
            numLeadingZeros = val.length - valWithoutLeadZeros.length;
          val = valWithoutLeadZeros;

          // place the decimal point into the right spot if it already existed
          var valHasDecimal = val.length - val.replace(/\./g, '').length > 0;
          if (valHasDecimal && decimalIndex && decimalIndex !== -1) {
            val = val.replace(/\./g, '');
            val = this.insertAtIndex(val, '.', decimalIndex);
          }

          // Reposition all the commas before the decimal point to be in the proper order.
          // Store the values of "added" and "removed" commas.
          var parts = valHasDecimal ? val.split('.') : [val],
            valWithoutCommas = parts[0].replace(/,/g, ''),
            numRemovedCommas = parts[0].length - valWithoutCommas.length,
            reAddTheCommas = valWithoutCommas.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            numAddedCommas = reAddTheCommas.length - valWithoutCommas.length;

          // add the commas back in
          parts[0] = reAddTheCommas;
          val = (parts[1] && parts[1] !== '') ? parts.join('.') : parts[0] + (valHasDecimal ? '.' : '');

          // move the caret position to the correct spot, based on the adjustments we made to commas
          // NOTE: This needs to happen AFTER we figure out the number of commas up to the caret.
          if (numAddedCommas > numRemovedCommas) {
            pos.begin = pos.begin - numLeadingZeros + (numAddedCommas - numRemovedCommas);
          }
          if (numAddedCommas < numRemovedCommas) {
            pos.begin = pos.begin - numLeadingZeros - (numRemovedCommas - numAddedCommas);
          }

          // Get the caret position against the final value.
          // If the next character in the string is the decimal or a comma, move the caret one spot forward
          var commaDecRegex = /(\.|,)/,
            nextChar = val.substring(pos.begin, pos.begin + 1);
          while (pos.begin < val.length && commaDecRegex.test(nextChar)) {
             pos.begin = pos.begin + 1;
             nextChar = val.substring(pos.begin, pos.begin + 1);
          }
        }

        // put it back!
        this.element.val(val);

        // reposition the caret to be in the correct spot (after the content we just added).
        var totalCaretPos = pos.begin + buffSize;
        var actualCaretPos = totalCaretPos >= pattSize ? pattSize : totalCaretPos;
        this.caret(actualCaretPos);
      },

      // Filter the character that was just typed into the mask to determine if it belongs.
      // In some cases, extra characters that belong in the correctly-masked text will be added before
      // The typed character is placed.  If the character doesn't belong, stop the event and reset.
      processMask: function(typedChar, patternChar, e) {
        var self = this;
        self.originalPos = self.caret();
        self.currentMaskBeginIndex = self.currentMaskBeginIndex || self.originalPos.begin;

        // don't do anything if you're at the end of the pattern.  You can't type anymore.
        if (self.currentMaskBeginIndex >= self.pattern.length) {
          self.resetStorage();
          return self.killEvent(e);
        }

        if (self.isCharacterLiteral(patternChar)) {
          // if you typed the exact character that's next in the mask, simply print the write buffer.
          if (typedChar === patternChar) {
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
          if (this.mode === 'number') {
            self.processNumberMask(typedChar, patternChar, e);
          } else {
            self.processMask(typedChar, newPatternChar, e);
          }
        } else {
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

      // Method for processing number masks
      // TODO:  Flesh out content and docs
      processNumberMask: function(typedChar, patternChar, e) {
        var self = this,
          val = self.element.val(),
          maskWithoutInts = self.pattern.replace(/#/g, ''),
          numMaskInts = self.pattern.length - maskWithoutInts.length;

        self.originalPos = self.caret();
        self.currentMaskBeginIndex = self.currentMaskBeginIndex || self.originalPos.begin;

        // don't do anything if you're at the end of the pattern.  You can't type anymore.
        if (self.currentMaskBeginIndex >= self.pattern.length) {
          self.resetStorage();
          return self.killEvent(e);
        }

        // Get the currently typed string up to the beginning of the caret.
        var sliceUpToCaret = val.substring(0, self.originalPos.begin),
          sliceHasDecimal = sliceUpToCaret.length !== sliceUpToCaret.replace(/\./g, '').length,
          inputWithoutDec = val.replace(/\./g, ''),
          valHasDecimal = val.length !== inputWithoutDec.length;

        // Check the character to see if it's a decimal
        if (self.isCharacterDecimal(typedChar)) {
          // Don't allow the decimal to be added if the pattern doesn't contain one.
          var patternHasDecimal = self.pattern.length !== self.pattern.replace(/\./g, '').length;
          if (!patternHasDecimal) {
            self.resetStorage();
            return self.killEvent(e);
          }

          if (valHasDecimal) {
            self.resetStorage();
            return self.killEvent(e);
          }

          // The decimal is OK to add to the string.
          // if the current input is empty or if the caret position is at the beginning, add a leading zero
          if (val.length === 0 || self.originalPos.begin === 0) {
            self.buffer += '0';
          }
          self.buffer += typedChar;
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        // Do a check to see if the character typed matches the mask pattern character.
        // This is done against the mask WITHOUT COMMAS.  The caret's position is adjusted
        // for the difference in position.
        var commasUpToCaret = sliceUpToCaret.length - sliceUpToCaret.replace(/,/g, '').length,
          trueMaskIndex = sliceUpToCaret.length - commasUpToCaret;
        patternChar = self.getCharacter('current', trueMaskIndex);

        // If the new pattern char is the decimal, add it.
        if (self.isCharacterDecimal(patternChar) /*&& !valHasDecimal*/) {
          if (!valHasDecimal) {
            self.buffer += patternChar;
          }
          // Test the next character in the mask to see
          patternChar = self.getCharacter('next', trueMaskIndex);
          var match = self.testCharAgainstRegex(typedChar, patternChar);
          if (match) {
            self.buffer += typedChar;
          }
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        var inputParts = val.split('.'),
          inputWithoutCommas = inputParts[0].replace(/,/g, ''),
          numInputInts = inputWithoutCommas.length;

        // Actually test the typed character against the correct pattern character.
        var match = self.testCharAgainstRegex(typedChar, patternChar);
        if (!match) {
          self.resetStorage();
          return self.killEvent(e);
        }

        // Is the "integer" portion of the mask filled?
        if (numInputInts >= numMaskInts) {
          // Check if the current caret position is past the total number of allowed "decimal" characters.
          // You can't type any more if you are at this point.
          var decimalIndex = val.indexOf('.');
          if (valHasDecimal && self.originalPos.begin > decimalIndex) {
            var decimalInputChars = val.substring(0, self.originalPos.begin).split('.')[1],
              decimalPatternChars = self.pattern.split('.')[1];
            if (decimalInputChars.length >= decimalPatternChars.length) {
              self.resetStorage();
              return self.killEvent(e);
            }
          }
          // Add the decimal if the value doesn't already have it
          self.buffer += !valHasDecimal ? '.' + typedChar : typedChar;
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        // Add the character to the "integer" part of the mask
        // Get the current value of the pre-decimal mask, strip out commas, add them back in the
        // Appropriate spots, and move the caret position appropriately.
        self.buffer += typedChar;
        self.writeInput();
        self.resetStorage();
        return self.killEvent(e);
      },

      // Takes an entire string of characters and runs each character against the processMask()
      // method until it's complete.
      processStringAgainstMask: function(string, originalEvent) {
        var charArray = string.split('');
        for(var i = 0; i < charArray.length; i++) {
          var patternChar = this.getCharacter();
          if (this.mode === 'number') {
            this.processNumberMask(charArray[i], patternChar, originalEvent);
          } else {
            this.processMask(charArray[i], patternChar, originalEvent);
          }
        }
      },

      // Takes a character from the pattern string in Settings, gets the corresponding Regex string
      // from the definitions array in Settings, and tests the character against the Regex.
      testCharAgainstRegex: function(typedChar, patternChar) {
        var regex = settings.definitions[patternChar];
        return !regex ? false : regex.test(typedChar);
      },

      // Returns the character at the current/next/previous cursor position.
      // If no direction is provided, it defaults to the current position.
      // If an optional index is provided, the cursor position will shift to that index value.
      getCharacter: function(direction, maskIndex) {
        var mask = this.mode === 'number' ? this.pattern.replace(/,/g, '') : this.pattern,
          index = maskIndex ? maskIndex : this.caret().begin;
        direction = this.evaluateDirecton(direction);

        switch(direction) {
          case 'next':
            return mask.substring(index + 1, index + 2);
          case 'prev':
            return mask.substring(index - 1, index);
          default: // current
            return mask.substring(index, index + 1);
        }
      },

      destroy: function() {
        this.element.off('keydown.mask keypress.mask keyup.mask focus.mask blur.mask ' + this.env.pasteEvent);
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
