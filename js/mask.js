/**
* Inline Field Formatter (Mask) Control
* Adds a text-based formatting "mask" to input fields that displays how data should be entered into the field.
* Does not allow text entry that does not match the provided mask.
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

  var DECIMAL_SYMBOL = '.';
  var THOUSANDS_SEPARATOR = ',';

  $.fn.mask = function(options) {

    // Tab Settings and Options
    var pluginName = 'mask',
        defaults = {
          pattern: '',
          placeholder: '_',
          definitions: {
            '#': /[0-9]/,
            '0': /[0-9]/,
            'x': /[\u00C0-\u017Fa-zA-Z]/,
            '*': /[\u00C0-\u017Fa-zA-Z0-9]/,
            '?': /./,
            '~': /[-0-9]/,
            'a': /[APap]/,
            'm': /[Mm]/
          },
          groupComplete: false,
          mode: undefined,
          mustComplete: false,
          negative: false,
          number: false,
          processOnInitialize: true, // If set to false, will not initialially mask the value of the input field.
          thousandsSeparator: false,
          showSymbol: undefined, // can be 'currency', 'percent'
        },
        maskModes = ['group', 'number', 'date', 'time'],
        symbols = ['currency', 'percent'],
        settings = $.extend({}, defaults, options);

    // Plugin Constructor
    function Mask(element) {
      this.settings = $.extend({}, settings);
      this.element = $(element);
      Soho.logTimeStart(pluginName);
      this.init();
      Soho.logTimeEnd(pluginName);
    }

    Mask.prototype = {
      init: function(){
        var self = this;
        self.buffer = '';

        this.element.addClass('is-mask');

        // Order of operations when choosing pattern strings:
        // HTML5 'data-mask' attribute > Generic pattern string based on "type" attribute > nothing.
        //
        // if no pattern is provided in settings, use a pre-determined pattern based
        // on element type, or grab the pattern from the element itself.
        var html5DataMask = this.element.attr('data-mask') || false;
        if (html5DataMask) {
          this.settings.pattern = html5DataMask;
        }

        // If a "mode" is defined, special formatting rules may apply to this mask.
        // Otherwise, the standard single-character pattern match will take place.
        var html5DataMaskMode = this.element.attr('data-mask-mode') || false;
        if (html5DataMaskMode) {
          this.settings.mode = html5DataMaskMode;
        }
        if (this.settings.mode) {
          if ($.inArray(this.settings.mode, maskModes) === -1) {
            this.settings.mode = 'group';
          }
        }

        // If "thousands" is defined, the thousands separator for numbers (comma or decimal, based on
        // localization) will be inserted wherever necessary during typing. Will automatically set to
        // "true" if the localized thousands separator is detected inside the mask.
        var html5DataThousands = this.element.attr('data-thousands') || false;
        if (html5DataThousands) {
          this.settings.thousandsSeparator = (html5DataThousands === 'true');
        }
        this.settings.thousandsSeparator = this.settings.pattern.indexOf(',') !== -1 || this.settings.thousandsSeparator;

        // If "negative" is defined, you can type the negative symbol in front of the number.
        // Will automatically set to "true" if a negative symbol is detected inside the mask.
        this.settings.negative = this.settings.mode === 'number' && this.settings.pattern.indexOf('-') !== -1;

        // If 'mustComplete' is defined, you MUST complete the full mask, or the mask will revert to empty
        // once the field is blurred.
        var html5DataMustComplete = this.element.attr('data-must-complete') || false;
        if (html5DataMustComplete) {
          this.settings.mustComplete = html5DataMustComplete;
        }

        // If 'showCurrency' is defined and the mask mode is 'number', a span will be drawn that will show the
        // localized currency symbol.
        var symbolType = this.settings.showSymbol,
          symbol;

        // Backwards compat with the old "data-show-currency"
        if (symbolType === true) {
          symbolType = 'currency';
        }

        if (symbolType && symbolType !== undefined && symbols.indexOf(symbolType) !== -1 && this.settings.mode === 'number') {
          switch(symbolType) {
            case 'currency':
              symbol = (Locale.currentLocale.data ? Locale.currentLocale.data.currencySign : '$');
              break;
            case 'percent':
              symbol = '%';
              break;
          }

          $('<span class="audible ' + symbolType + '"></span>').text(' ' + symbol).appendTo(self.element.prev('label'));
          this.element.parent('.field')
            .attr('data-currency-symbol', '' + symbol)
            .addClass(symbolType);
        }

        // If we are doing a grouped pattern match (for dates/times/etc), we need to store an object that contains
        // separated pieces of "editable" and "literal" parts that are used for checking validity of mask pieces.
        var modeClassMethod = 'addClass';
        if (self.settings.mode !== 'number') {
          self.maskParts = self.getPatternParts();
          modeClassMethod = 'removeClass';
        }
        this.element[modeClassMethod]('is-number-mask');

        // If 'self.groupComplete' is active, each section of the group pattern match must be full in order for the
        // literals in-between each section to be automatically added (meaning, you can't type a literal to end that
        // group until all characters in that group are entered).  This is used for some group matching and for time.
        var html5DataGroupComplete = self.element.attr('data-group-complete');
        if (html5DataGroupComplete) {
          this.settings.groupComplete = true;
        }
        // Backwards Compat with the old "time" mode
        if (this.settings.mode === 'time') {
          this.settings.mode = 'group';
        }

        // Point all keyboard related events to the handleKeyEvents() method, which knows how to
        // deal with key syphoning and event propogation.
        self.element.on('keypress.mask ' + self.getPasteEvent(), function(e) {
          if (self.element.prop('readonly')) {
            e.preventDefault();
            return false;
          }
          self.handleKeyEvents(self, e);
        });

        // when the element is focused, store its initial value.
        self.element.on('focus.mask', function(e) {
          if (self.element.prop('disabled') || self.element.prop('readonly')) {
            e.preventDefault();
            return false;
          }
          self.initValue = self.element.val();
        });

        // listen for an event called "updated" that can be triggered by other plugins, that forces the mask
        // to completely re-evaluate itself.
        self.element.on('updated.mask', function(e) {
          self.evaluateCurrentContents(undefined, e);
        });

        // remove the value when blurred
        self.element.on('blur.mask', function(e) {
          if (self.element.prop('readonly')) {
            e.preventDefault();
            return false;
          }

          var val = self.element.val();

          if (self.settings.mustComplete) {
            self.checkCompletion();
          }
          if (val && self.initValue !== val) {
            self.element.trigger('change');
          }

          self.initValue = null;
        });

        // Don't continue if the field is hidden -OR- we disallow the masking of contents during initialization.
        if (this.element.is(':hidden') || !this.settings.processOnInitialize) {
          return this;
        }

        // Test contents of the input field.  If there are characters, run them
        // against the mask and fill them in as necessary.
        var val = self.element.val();
        if (val.length > 0) {
          self.element.val('');
          self.processStringAgainstMask(val);
        }

        return this;
      },

      // Builds a fake element and gets the name of the event that will be used for "paste"
      // Used for cross-browser compatability.
      getPasteEvent: function() {
        return window.Soho.env.pasteEvent + '.mask';
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
          maskLength = this.settings.pattern.length;

        if (maskLength !== inputLength) {
          this.element.val('');
        }
      },

      // Evaluates the entire current contents of the input field against its mask.
      // Used when the field is blurred, and after a Backspaced character is removed
      evaluateCurrentContents: function(newValue, e) {
        if (newValue === null || newValue === undefined) {
          newValue = this.element.val();
        }
        if (!e) {
          e = $.Event();
        }

        this.element.val('');

        if (document.activeElement === e.target) {
          this.caret(0);
        }
        this.processStringAgainstMask(newValue, e);
      },

      // The catch-all event for handling keyboard events within this input field. Grabs information about the keys
      // being pressed, event type, matching pattern characters, and determines what to do with them.
      handleKeyEvents: function(self, e) {
        var evt = e || window.event,
          eventType = evt.originalEvent.type,
          key = e.which,
          typedChar = $.actualChar(e);

        // set the original value if it doesn't exist.
        if (!self.initValue) {
          self.initValue = self.element.val();
        }

        if (eventType === 'keypress') {
          // Ignore all of these keys or combinations containing these keys
          if (evt.ctrlKey || evt.metaKey || key < 32) {
            return;
          // Never allow any combinations with the alt key, since on Mac OSX it's used to create special characters
          } else if (evt.altKey) {
            self.killEvent(e);
          }

          if (self.settings.mode === 'number') {
            self.processNumberMask(typedChar, evt);
          } else {
            self.processMask(typedChar, evt);
          }

        }

        if (eventType === 'paste') {
          self.handlePaste(evt);
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
          this.evaluateCurrentContents(val, e);
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

      // Pressing Tab changes field focus, but we run a check on the field beforehand to fix any mask errors.
      // Similar to running on "blur" but prevents issues in IE where focus traps would happen.
      handleTab: function(e) {
        return this.evaluateCurrentContents(undefined, e);
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
          // cut down the total size of the paste input to only be as long as the pattern allows * 2.
          var pasteLimiter = (this.settings.pattern.length * 2) > paste.length ? paste.length : this.settings.pattern.length * 2,
            maxPasteInput = paste.substring(0, pasteLimiter);
          this.processStringAgainstMask(maxPasteInput, e);
        }
        this.element.trigger('afterpaste.mask');
        this.killEvent(e);
      },

      // Attempts to match the character provided from a pattern against the array of
      // pattern matching characters ("definitions"). If the character is not in the array,
      // it is considered "literal", and will be placed into the input field as part of the mask.
      isCharacterLiteral: function(patternChar) {
        return $.inArray(patternChar, Object.keys(this.settings.definitions)) === -1;
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
      replaceAtIndex: function(string, value, indexStart, indexEnd) {
        return string.substr(0, indexStart) + value + string.substr(isNaN(indexEnd) ? (indexStart + value.length) : indexEnd);
      },
      deleteAtIndex: function(string, value, index) {
        return string.substr(0, index) + string.substr(index + value.length);
      },

      getCharacterAtIndex: function(string, index) {
        return string.substr(index, 1);
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
          pos = this.originalPos,
          buffSize = this.buffer.length,
          workingPattern = '' + this.settings.pattern, // copy the pattern, don't reference it
          pattSize = workingPattern.length,
          isNumberMask = (this.settings.mode === 'number'),
          replaceAtIndex = this.replaceAtIndex;

        var DASH_SYMBOL = '-';
        var DASH_REGEX = new RegExp(DASH_REGEX, 'g'); // original: \-\g
        var DECIMAL_REGEX = new RegExp('\\' + DECIMAL_SYMBOL, 'g'); // original: /\./g
        var LEADING_ZERO_REGEX = new RegExp('^0+(?!\\'+ DECIMAL_SYMBOL +'|$)'); // original: /^0+(?!\.|$)/
        var THOUSANDS_SEP_REGEX = new RegExp(THOUSANDS_SEPARATOR, 'g');
        var PUNCTUATION_REGEX = new RegExp('(\\' + DECIMAL_SYMBOL + '|' + THOUSANDS_SEPARATOR + ')', 'g'); // original: /(\.|,)/g

        function moveCaret(amount) {
          pos.begin = pos.begin + amount;
          pos.end = pos.end + amount;
        }

        function stripSelection() {
          var selection = val.substring(pos.begin, pos.end);
          val = replaceAtIndex(val, '', pos.begin, pos.end);
          pos.end = pos.end - selection.length;
        }

        if (!isNumberMask) {
          // strip out the portion of the text that would be selected by the caret
          stripSelection();

          // insert the buffer's contents
          val = this.insertAtIndex(val, this.buffer, pos.begin);
          moveCaret(buffSize);

          // cut down the total length of the string to make it no larger than the pattern mask
          val = val.substring(0, pattSize);

          // put it back!
          this.element.val(val);

          // reposition the caret to be in the correct spot (after the content we just added).
          this.caret(pos.begin >= pattSize ? pattSize : pos.begin);

          // trigger the 'write' event
          this.element.trigger('write.mask');
          return;
        }

        //================================================
        // Handle Number Inputs with a bit more scaffolding

        stripSelection();

        var originalVal = val,
          patternHasDecimal = workingPattern.indexOf(DECIMAL_SYMBOL) > -1,
          currentDecimalIndex = val.indexOf(DECIMAL_SYMBOL),
          decimalInBuffer = this.buffer.indexOf(DECIMAL_SYMBOL) > -1,
          insertBufferBeforeDecimal = true,
          decimalAlreadyExists = false;

        // Are we placing the new content after the decimal?
        insertBufferBeforeDecimal = currentDecimalIndex < pos.begin;

        // Does it already exist?
        decimalAlreadyExists = currentDecimalIndex !== -1;

        val = this.insertAtIndex(val, this.buffer, pos.begin);
        moveCaret(buffSize);

        // If the mask supports negative numbers, but a positive number is present,
        // don't calculate the negative symbol as part of the current pattern.
        // Also, Reduce the size of the buffer to the new maximum (pattern size minus one, representing the newly removed minus)
        if (this.settings.negative && val.indexOf(DASH_SYMBOL) === -1) {
          workingPattern = workingPattern.substring(1);
          pattSize = workingPattern.length;
          val = val.substring(0, pattSize);
        }

        // cut all but the first occurence of the negative symbol and decimal
        val = this.replaceAllButFirst(DASH_REGEX, val, '');
        val = this.replaceAllButFirst(DECIMAL_REGEX, val, '');

        // cut any extra leading zeros.
        var valWithoutLeadZeros = val.replace(LEADING_ZERO_REGEX, ''),
          numLeadingZeros = val.length - valWithoutLeadZeros.length;

        val = valWithoutLeadZeros;
        moveCaret(-(numLeadingZeros));

        var maskParts = workingPattern.replace(THOUSANDS_SEP_REGEX, '').split(DECIMAL_SYMBOL),
          totalLengthMinusSeparators = maskParts[0].length + (maskParts[1] ? maskParts[1].length : 0),
          separatorLength;

        // move the caret backward only the number of punctuation marks that were removed
        // up to the current caret position.
        var currentSliceUpToCaret = val.substring(0, pos.begin),
          commasUpToCaret = currentSliceUpToCaret.length - currentSliceUpToCaret.replace(THOUSANDS_SEP_REGEX, '').length;

        moveCaret(-(commasUpToCaret));

        // strip out the decimal and any commas from the current value
        val = val.replace(PUNCTUATION_REGEX, '');
        separatorLength = originalVal.length - val.length;

        // cut down the total length of the number if it's longer than the total number of integer
        // and decimal places
        if (val.length > totalLengthMinusSeparators) {
          val = val.substring(0, totalLengthMinusSeparators);
        }

        // if the original value had a decimal point, place it back in the right spot
        if (patternHasDecimal) {
          if (decimalAlreadyExists) {
            var inputParts = originalVal.split(DECIMAL_SYMBOL),
              targetDecimalIndex;

            // reposition the decimal in the correct spot based on total number of characters
            // in either part of the mask.
            if (inputParts[1].length < maskParts[1].length) {
              if (inputParts[0].length >= maskParts[0].length) {
                targetDecimalIndex = maskParts[0].length;
              } else {
                targetDecimalIndex = currentDecimalIndex;
              }
            } else if (inputParts[1].length === maskParts[1].length) {
              targetDecimalIndex = (val.length - maskParts[1].length);
            } else {
              targetDecimalIndex = (val.length - maskParts[1].length);
            }

            val = this.insertAtIndex(val, DECIMAL_SYMBOL, targetDecimalIndex);
            if (pos.begin === targetDecimalIndex) {
              moveCaret(1);
            }

          } else {
            // The decimal doesn't already exist in the value string.
            // if the current value has more characters than the "integer" portion of the mask,
            // automatically add the decimal at index of the last pre-decimal pattern character.
            if (val.length > maskParts[0].length || decimalInBuffer) {
              val = this.insertAtIndex(val, DECIMAL_SYMBOL, maskParts[0].length);
              if (pos.begin === maskParts[0].length) {
                moveCaret(1);
              }
            }
          }
        }

        // Only do this part if the thousands separator should be present.
        if (this.settings.thousandsSeparator) {
          // Reposition all the commas before the decimal point to be in the proper order.
          // Store the values of "added" and "removed" commas.
          var valHasDecimal = val.length - val.replace(DECIMAL_REGEX, '').length > 0,
            parts = valHasDecimal ? val.split(DECIMAL_SYMBOL) : [val],
            reAddTheCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

          // add the commas back in
          parts[0] = reAddTheCommas;
          val = valHasDecimal ? parts.join(DECIMAL_SYMBOL) : parts[0] + (valHasDecimal ? DECIMAL_SYMBOL : '');

          currentSliceUpToCaret = reAddTheCommas.substring(0, this.originalPos.begin + separatorLength);
          commasUpToCaret = currentSliceUpToCaret.length - currentSliceUpToCaret.replace(THOUSANDS_SEP_REGEX, '').length;

          if (commasUpToCaret > 0) {
            moveCaret(commasUpToCaret);
          }

          // Manual adjustment for situations where the cursor won't move if you type a number while the
          // cursor sits in the position immediately after a thousands separator.
          if (val.substring(pos.begin - 1, pos.begin) === THOUSANDS_SEPARATOR && val.substr(pos.begin, buffSize) === this.buffer) {
            moveCaret(buffSize);
          }
        }

        // put it back!
        this.element.val(val);

        // reposition the caret to be in the correct spot (after the content we just added).
        this.caret(pos.end >= pattSize ? pattSize : pos.end);

        // trigger the 'write' event
        this.element.trigger('write.mask');
      },

      // Method for processing number masks
      // TODO:  Flesh out content and docs
      processNumberMask: function(typedChar, e) {
        var self = this,
          val = self.element.val(),
          maskWithoutInts = self.settings.pattern.replace(/#/g, ''),
          numMaskInts = self.settings.pattern.length - maskWithoutInts.length,
          match,
          patternChar;

        self.originalPos = self.caret();
        self.currentMaskBeginIndex = self.currentMaskBeginIndex || self.originalPos.begin;

        // don't do anything if you're at the end of the pattern.  You can't type anymore.
        if (self.currentMaskBeginIndex >= self.settings.pattern.length) {
          self.resetStorage();
          return self.killEvent(e);
        }

        // Get the currently typed string up to the beginning of the caret.
        var sliceUpToCaret = val.substring(0, self.originalPos.begin),
          sliceHasDecimal = sliceUpToCaret.length !== sliceUpToCaret.replace(/\./g, '').length,
          inputWithoutDec = val.replace(/\./g, ''),
          valHasDecimal = val.length !== inputWithoutDec.length,
        // Do a check to see if the character typed matches the mask pattern character.
        // This is done against the mask WITHOUT COMMAS.  The caret's position is adjusted
        // for the difference in position.
          commasUpToCaret = sliceUpToCaret.length - sliceUpToCaret.replace(/,/g, '').length,
          trueMaskIndex = sliceUpToCaret.length - commasUpToCaret;
        patternChar = self.getCharacter('current', trueMaskIndex);

        // Is the decimal already in the slice up to the caret?
        // If it is, only work with the "post-decimal" portion of the mask
        if (sliceHasDecimal) {
          var postDecMask = self.settings.pattern.split('.')[1],  // tests all mask characters after the decimal
            postDecSlice = sliceUpToCaret.split('.')[1], // tests only typed characters after the decimal up to the caret
            distanceFromDec = (self.originalPos.begin - 1) - sliceUpToCaret.indexOf('.');
          patternChar = postDecMask.charAt(distanceFromDec);

          // if there are as many or more characters in the slice as the mask, don't continue.
          // The decimal place maximum has been hit.  Only do this if the "entire" mask isn't selected.
          var selectedChars = val.substring(self.originalPos.begin, self.originalPos.end);
          if (selectedChars.length < val.length && postDecSlice.length >= postDecMask.length) {
            self.resetStorage();
            return self.killEvent(e);
          }

          // Test the correct pattern character against the typed character
          match = self.testCharAgainstRegex(typedChar, patternChar);
          if (!match) {
            self.resetStorage();
            return self.killEvent(e);
          }

          // The character belongs in the post-decimal portion of the mask.  Add it and move on.
          self.buffer += typedChar;
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        // The decimal point is not currently in the portion of the string we're working with.
        var patternHasDecimal = self.settings.pattern.length !== self.settings.pattern.replace(/\./g, '').length;

        // Check the character to see if it's a decimal
        if (self.isCharacterDecimal(typedChar)) {
          // Don't allow the decimal to be added if the pattern doesn't contain one.
          if (!patternHasDecimal) {
            self.resetStorage();
            return self.killEvent(e);
          }
          if (valHasDecimal) {
            var caretSlice = val.substring(self.originalPos.begin, self.originalPos.end),
              caretSliceHasDecimal = caretSlice.length !== caretSlice.replace(/\./g, '').length;
            if (caretSliceHasDecimal) {
              if (caretSlice.length === val.length) {
                self.buffer += '0';
              }
              self.buffer += typedChar;
              self.writeInput();
            }
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

        // If the new pattern char is the decimal, add it.
        if (self.isCharacterDecimal(patternChar)) {
          if (!valHasDecimal) {
            self.buffer += patternChar;
          }
          // Test the next character in the mask to see
          patternChar = self.getCharacter('next', trueMaskIndex);
          match = self.testCharAgainstRegex(typedChar, patternChar);
          if (match) {
            self.buffer += typedChar;
          }
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        // Test to see if the character is the negative symbol
        if (typedChar === '-') {
          if (!self.settings.negative || self.originalPos.begin > 0) {
            self.resetStorage();
            return self.killEvent(e);
          }

          self.buffer += typedChar;
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        var inputParts = val.split('.'),
          inputWithoutCommas = inputParts[0].replace(/,/g, ''),
          inputWithoutOperators = inputWithoutCommas.replace(/-/g, ''),
          numInputInts = inputWithoutOperators.length;

        // Actually test the typed character against the correct pattern character.
        match = self.testCharAgainstRegex(typedChar, patternChar);
        if (!match) {
          if (self.settings.negative && self.testCharAgainstRegex(typedChar, '~')) {
            // Let it go
          } else {
            self.resetStorage();
            return self.killEvent(e);
          }
        }

        // Is the "integer" portion of the mask filled?
        if (numInputInts >= numMaskInts) {
          // Add the decimal if the value doesn't already have it
          self.buffer += !valHasDecimal && patternHasDecimal ? '.' + typedChar : typedChar;
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

      // Processes the pattern string and returns an object that contains that string's sections of matchable patterns
      // and its unmatchable literals.
      getPatternParts: function() {
        var self = this,
          defKeys = Object.keys(this.settings.definitions),
          patternEditableParts = [],
          patternLiteralParts = [],
          patternStartsWithLiteral = false,
          i = 0,
          regexString = '',
          regexObj;

        // Build the string of "editable" matches dynamically from settings,
        // and match it against the incoming pattern to determine each editable group.
        $.each(defKeys, function(i, def) {
          regexString += def;
        });
        regexString = '[' + regexString + ']+';
        regexObj = new RegExp(regexString, 'g');
        patternEditableParts = self.settings.pattern.match(regexObj) || [];

        // check for literal characters at the beginning of the string before the first matchable pattern
        if (patternEditableParts[0] && self.settings.pattern.substring(0, 1) !== patternEditableParts[0].substring(0, 1)) {
          patternLiteralParts.push( self.settings.pattern.substring( 0, self.settings.pattern.indexOf( patternEditableParts[0] )));
          patternStartsWithLiteral = true;
        }

        // set a starting index for our literal checking... may not be 0 if there were literals before the first match
        var prevLiteralEndIndex = (patternLiteralParts && patternLiteralParts[0]) ? (self.settings.pattern.indexOf(patternLiteralParts[0]) + patternLiteralParts[0].length) : 0;

        // get all sets of literal characters in the pattern and store them
        while (i < patternEditableParts.length) {
          // start cutting the string here
          var currLiteralStartIndex = prevLiteralEndIndex + patternEditableParts[i].length,
            // get a fresh cut of the pattern minus the parts we've already dealt with
            nextCut = self.settings.pattern.substring(currLiteralStartIndex, self.settings.pattern.length),
            cutChars = self.settings.pattern.length - nextCut.length,
            // finish cutting the string at the end of the next piece of editable pattern OR the end of the pattern
            currLiteralEndIndex = cutChars + (patternEditableParts[i+1] ? nextCut.indexOf(patternEditableParts[i+1]) : nextCut.length),
            // should contain the next literal
            currLiteral = self.settings.pattern.substring(currLiteralStartIndex, currLiteralEndIndex);
          if (currLiteral !== '') {
            patternLiteralParts.push(currLiteral);
          }
          prevLiteralEndIndex = currLiteralEndIndex;
          i++;
        }

        // build an array that contains one of each character in the literals sections for testing
        var allLiterals = '';
        for (var a = 0; a < patternLiteralParts.length; a++) {
          allLiterals += patternLiteralParts[a];
        }
        var containedLiterals = self.removeDuplicates(allLiterals);

        var allEditables = '';
        for (var b = 0; b < patternEditableParts.length; b++) {
          allEditables += patternEditableParts[b];
        }
        var containedEditables = self.removeDuplicates(allEditables);

        return {
          editable: patternEditableParts,
          literal: patternLiteralParts,
          allLiterals: allLiterals,
          allEditables: allEditables,
          containedLiterals: containedLiterals,
          containedEditables: containedEditables,
          startsWithLiteral: patternStartsWithLiteral
        };
      },

      // Processes the current input value against the pre-processed mask, and returns an array containing the values
      // inside of each editable piece of the group pattern.
      analyzeInput: function(inputSlice) {
        var self = this,
          val = inputSlice !== undefined ? inputSlice : self.element.val(),
          currentMaskPartIsLiteral = false,
          editables = self.maskParts.editable,
          literals = self.maskParts.literal,
          totalMaskParts = editables.length + literals.length,
          editableParts = [],
          literalParts = [],
          valFromLastIndex = '',
          allEditables = '',
          allLiterals = '',
          nextLiteralIndex = 0,
          nextEditableIndex = 0,
          editablePart = '',
          literalPart = '',
          valIndex = 0,
          editableCount = 0,
          literalCount = 0,
          i = 0,
          a = 0;

        // More literals than editables means that there is a literal pattern BEFORE the first editable pattern.
        if (self.maskParts.startsWithLiteral) {
          currentMaskPartIsLiteral = true;
        }

        // Loop through all parts, and retrieve the values inside the editable parts.
        for (i; i < totalMaskParts; i++) {
          if (currentMaskPartIsLiteral) {
            valFromLastIndex = val.substring(valIndex, val.length);
            nextEditableIndex = valIndex + valFromLastIndex.length;
            literalPart = '';

            // find next literal character and grab its index.
            for (a = 0; a < valFromLastIndex.length; a++) {
              if ($.inArray(valFromLastIndex[a], self.maskParts.containedLiterals) === -1) {
                nextEditableIndex = valIndex + a;
                break;
              }
            }

            literalPart = val.substring(valIndex, nextEditableIndex);
            if (literalPart.length > 0) {
              literalParts.push(literalPart);
            }

            allLiterals += literalPart;
            valIndex = valIndex + literalPart.length;
            currentMaskPartIsLiteral = false;
            literalCount++;
          } else {
            valFromLastIndex = val.substring(valIndex, val.length);
            nextLiteralIndex = valIndex + valFromLastIndex.length;
            editablePart = '';

            // find next literal character and grab its index.
            for (a = 0; a < valFromLastIndex.length; a++) {
              if ($.inArray(valFromLastIndex[a], self.maskParts.containedLiterals) !== -1) {
                nextLiteralIndex = valIndex + a;
                break;
              }
            }

            editablePart = val.substring(valIndex, nextLiteralIndex);
            if (editablePart.length > 0) {
              editableParts.push(editablePart);
            }

            allEditables += editablePart;
            valIndex = valIndex + editablePart.length;
            currentMaskPartIsLiteral = true;
            editableCount++;
          }
        }

        // make sure there is at least one empty entry in the array.
        if (editableParts.length === 0) {
          editableParts.push('');
        }

        return {
          editables: editableParts,
          allEditables: allEditables,
          literals: literalParts,
          allLiterals: allLiterals
        };
      },

      // Returns a reconstructed pattern based on the parts dissected from the getPatternParts() method.
      // Used for testing and sanity-checking.
      buildPatternFromParts: function() {
        var parts = this.getPatternParts(),
          pattern = '',
          literalCount = 0,
          editableCount = 0;

        // there is a literal BEFORE and AFTER the first match.
        if (parts.startsWithLiteral) {
          pattern += parts.literal[0];
          literalCount++;
        }
        // there are no literals BEFORE the first match, but there is a literal AFTER the last match.
        if (parts.literal === parts.editable) {}
        while (editableCount < parts.editable.length) {
          pattern += parts.editable[editableCount];
          if (parts.literal[literalCount]) {
            pattern += parts.literal[literalCount];
          }
          editableCount++;
          literalCount++;
        }

        return pattern;
      },

      // takes a string of character literals and returns an array containing each unique literal found.
      removeDuplicates: function(string) {
        var unique = [];
        for (var i = 0; i < string.length; i++) {
          if ($.inArray(string[i], unique) === -1) {
            unique.push(string[i]);
          }
        }
        return unique;
      },

      processMask: function(typedChar, e) {
        var self = this,
          maskEditables = self.maskParts.editable,
          maskLiterals = self.maskParts.literal,
          match,
          i = 0;

        self.originalPos = self.caret();
        self.currentMaskBeginIndex = self.currentMaskBeginIndex || self.originalPos.begin;

        var val = self.element.val().substring(0, self.originalPos.begin),
          input = self.analyzeInput(val);

        // If the input is full, don't continue.
        if (self.originalPos.begin === self.originalPos.end && input.allEditables.length >= self.maskParts.allEditables.length) {
          self.resetStorage();
          return self.killEvent(e);
        }

        // don't continue at all if the character typed isn't a valid editable or literal in this pattern
        for (var b = 0; b < self.maskParts.containedEditables.length; b++) {
          match = self.testCharAgainstRegex(typedChar, self.maskParts.containedEditables[b]);
          if (match) {
            break;
          }
        }
        if (!match && $.inArray(typedChar, self.maskParts.containedLiterals) === -1) {
          self.resetStorage();
          return self.killEvent(e);
        }

        // "i" increments the literal section checks by one.  This is necessary if you have a literal pattern group
        // starting the pattern.
        i = 0;
        if (self.maskParts.startsWithLiteral) {
          i = i + 1;
        }


        // Fail out if we try to type too many characters
        var currentSection = (input.editables.length - 1) > 0 ? input.editables.length - 1 : 0;
        if (input.editables[currentSection].length > maskEditables[currentSection].length) {
          self.resetStorage();
          return self.killEvent(e);
        }

        // Constant boolean for checking on literals (used by the two checks below)
        var typedLiteralsAreValid = (maskLiterals[currentSection+i] !== undefined) &&
          $.inArray(typedChar, self.maskParts.containedLiterals) !== -1 &&
          !(input.literals[currentSection+i]);

        // If the character typed is a literal, allow it to go through if there is still a section of unmatched literals
        // and there has been at least one editable character entered in this section.  This only works if the flag
        // 'self.settings.groupComplete' is set to 'false' (generally used for dates).
        if (typedLiteralsAreValid &&
          !self.settings.groupComplete &&
          input.editables[currentSection].length > 0) {

          self.checkSectionForLiterals(e, typedChar, maskLiterals[currentSection+i]);
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        // If 'self.settings.groupComplete' is true, but all characters for this particular group have already been entered,
        // Allow a typed literal character to pass
        if (typedLiteralsAreValid &&
          self.settings.groupComplete &&
          input.editables[currentSection].length === maskEditables[currentSection].length) {

          self.checkSectionForLiterals(e, typedChar, maskLiterals[currentSection+i]);
          self.writeInput();
          self.resetStorage();
          return self.killEvent(e);
        }

        // If the "literals" are shifted forward due to the mask beginning with a literal pattern instead of an
        // editable pattern, automatically append that literal character at this point, since it hasn't been typed
        if (i > 0 && currentSection === 0 && !(input.literals[0])) {
          self.buffer += maskLiterals[0];
          if ($.inArray(typedChar, self.maskParts.containedLiterals) !== -1) {
            self.writeInput();
            self.resetStorage();
            return self.killEvent(e);
          }
        }

        // Define the section, as well as the correct pattern character to match against.
        var section = input.editables[currentSection] || '',
          currVal,
          patternChar,
          remainder;

        if (section.length < maskEditables[currentSection].length) {

          patternChar = maskEditables[currentSection].substring(input.editables[currentSection].length, (input.editables[currentSection].length + 1));

          // If we're typing inside of an existing literal pattern, this editable pattern has been pre-maturely completed
          // already, and we need to complete this literal pattern, while checking the match against the next editable group
          if (input.literals[currentSection+i] && maskLiterals[currentSection+i] !== input.literals[currentSection+i]) {
            currVal = self.element.val();
            remainder = currVal.substring(self.originalPos.begin, currVal.length);
            val = val.substring(0, (val.length - input.literals[currentSection+i].length));
            self.caret(self.originalPos.begin - input.literals[currentSection+i].length);
            self.originalPos = self.caret();
            self.element.val(val + remainder);
            self.buffer += maskLiterals[currentSection+i];
            patternChar = maskEditables[currentSection+1].substring(0, 1);
          }

          match = self.testCharAgainstRegex(typedChar, patternChar);

          // Simply add the character if its a match
          if ($.inArray(typedChar, self.maskParts.containedLiterals) === -1 && match) {
            self.buffer += typedChar;
            self.writeInput();
          }
        } else if (section.length === maskEditables[currentSection].length) {
          // Check that conditions are right for the next set of literal characters to be added
          if (maskEditables[currentSection+1] &&
              maskLiterals[currentSection+i]) {

            // check to make sure that the existing literals in the set are correctly formed,
            // and fix them if they aren't.
            if (input.literals[currentSection+i] && maskLiterals[currentSection+i] !== input.literals[currentSection+i]) {
              currVal = self.element.val();
              remainder = currVal.substring(self.originalPos.begin, currVal.length);
              val = val.substring(0, (val.length - input.literals[currentSection+i].length));
              self.caret(self.originalPos.begin - input.literals[currentSection+i].length);
              self.originalPos = self.caret();
              self.element.val(val + remainder);
              self.buffer += maskLiterals[currentSection+i];
            }

            // add the mask literals to the beginning of the buffer if they are not already there
            if (!input.literals[currentSection+i]) {
              self.buffer += maskLiterals[currentSection+i];
            }

            patternChar = maskEditables[currentSection+1].substring(0, 1);
            match = self.testCharAgainstRegex(typedChar, patternChar);

            // add the typed character if it's valid
            if ($.inArray(typedChar, self.maskParts.containedLiterals) === -1 && match) {
              self.buffer += typedChar;
            }
          } else {
            // We've technically completed the pattern, but the pattern may be shorter if each group isn't
            // 'complete'.  This section checks to see if we have leftover characters at the end of the input
            // and removes them.
            currVal = self.element.val();
            remainder = currVal.substring(self.originalPos.begin, currVal.length);

            if (remainder.length > 0) {
              self.element.val(currVal.substring(0, self.originalPos.begin));
            }
          }

          if (self.buffer.length > 0) {
            self.writeInput();
          }
        }

        self.resetStorage();
        return self.killEvent(e);
      },

      checkSectionForLiterals: function(e, typedChar, section) {
        for (var a = 0; a < section.length; a++) {
          if (typedChar === section[a]) {
            this.buffer += section;
            break;
          }
        }
      },

      // Takes an entire string of characters and runs each character against the processMask()
      // method until it's complete.
      processStringAgainstMask: function(string, originalEvent) {
        if (this.element.is(':hidden')) {
          return this;
        }

        switch(this.settings.mode) {
          case 'number':
            var regex = /[^0-9.-]/g;
            if (!this.settings.negative) {
              regex = /[^0-9.]/g;
            }
            string = string.replace(regex,'');
            if (!this.originalPos) {
              this.originalPos = this.caret();
            }
            this.buffer = string;
            this.writeInput();
            this.resetStorage();
            break;
          default:
            var charArray = string.split('');
            for(var i = 0; i < charArray.length; i++) {
              var patternChar = this.getCharacter();
              this.processMask(charArray[i], patternChar, originalEvent);
            }
            break;
        }

        return this;
      },

      // Takes a character from the pattern string in Settings, gets the corresponding Regex string
      // from the definitions array in Settings, and tests the character against the Regex.
      testCharAgainstRegex: function(typedChar, patternChar) {
        var regex = this.settings.definitions[patternChar];
        return !regex ? false : regex.test(typedChar);
      },

      // Replaces all but the first occurence of a regex with nothing.
      replaceAllButFirst: function(regex, textString, replacement) {
        if (!replacement) {
          replacement = '';
        }
        var count = 0;
        textString = textString.replace(regex, function(match) {
          if (count > 0) {
            return replacement;
          }
          return match;
        });
        return textString;
      },

      // Returns the character at the current/next/previous cursor position.
      // If no direction is provided, it defaults to the current position.
      // If an optional index is provided, the cursor position will shift to that index value.
      getCharacter: function(direction, maskIndex) {
        var mask = this.settings.mode === 'number' ? this.settings.pattern.replace(/,/g, '') : this.settings.pattern,
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

      updated: function() {
        return this
          .teardown()
          .init();
      },

      teardown: function() {
        if (this.settings.showCurrency) {
          this.element.parent('.field').removeClass('currency').attr('data-currency-symbol', '');
          this.element.prev('label').find('.currency').remove();
        }
        this.element.off('updated.mask keydown.mask keypress.mask keyup.mask focus.mask blur.mask ' + this.getPasteEvent());

        this.element.removeClass('is-mask').removeClass('is-number-mask');

        return this;
      },

      destroy: function() {
        this.teardown();
        $.removeData(this.element[0], pluginName);

        return this;
      }
    };

    // Keep the Chaining while Initializing the Control (Only Once)
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (instance) {
        instance.settings = $.extend({}, instance.settings, options);
        instance.updated();
      } else {
        instance = $.data(this, pluginName, new Mask(this, settings));
      }
    });
  };

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
