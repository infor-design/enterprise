/* eslint-disable no-continue, no-underscore-dangle, no-restricted-syntax, no-labels */
import { utils } from '../../utils/utils';
import { masks } from './masks';

/**
 * @class MaskAPI
 * @constructor
 * @param {object} [settings] incoming settings
 */
function MaskAPI(settings) {
  this.configure(settings);
  return this;
}

MaskAPI.prototype = {

  /**
   * Configure the API for an incoming mask request.
   * Set up patterns, change locale, basically 'pre-render'
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  configure(settings) {
    if (!this.settings) {
      this.settings = {};
    }

    if (!settings) {
      return this;
    }

    if (settings.locale) {
      // TODO: store references to thousands sep, decimal, currency symbols,
      // etc for the specified locale.
      this.locale = settings.locale;
    }

    // Pre-define a stored Mask pattern.
    // In cases where the mask is a string (Legacy Soho Mask), the string is automatically converted
    // to an array containing regex patterns.
    // In cases where the mask is a function, the function call is stored and called when the mask
    // needs to be processed.
    if (settings.pattern) {
      if (Array.isArray(settings.pattern) || typeof settings.pattern === 'function') {
        this.pattern = settings.pattern;
      } else if (typeof settings.pattern === 'string') {
        const defs = utils.mergeSettings(
          undefined,
          (settings.definitions || {}),
          masks.LEGACY_DEFS
        );
        this.pattern = this._convertPatternFromString(settings.pattern, defs);
      } else {
        // TODO: fail somehow?
      }
    }

    if (settings.patternOptions) {
      this.patternOptions = settings.patternOptions;
    }

    return this;
  },

  /**
   * Process a string against the masking algorithm
   * @param {string} rawValue the original, unmasked value
   * @param {object} [opts] process options
   * @returns {object} containing the processed mask along with some meta-data
   */
  process(rawValue, opts) {
    if (typeof rawValue !== 'string') {
      throw new Error('No string provided');
    }

    let maskObj = {};
    let processResult = {
      originalValue: rawValue,
      caretPos: opts.selection.start,
      maskResult: false
    };

    // Setup the pattern if it's a function.
    if (typeof this.pattern === 'function') {
      if (!opts.patternOptions) {
        opts.patternOptions = {};
      }

      // Merge incoming settings
      const maskOpts = utils.extend({}, this.patternOptions, opts.patternOptions, {
        caretPos: opts.selection.start,
        previousMaskResult: opts.previousMaskResult
      });

      // Get a processed mask pattern from the function.
      // See #4079 for an explanation of the change from just an array to an object with meta-data.
      maskObj = this.pattern(rawValue, maskOpts);
      if (Array.isArray(maskObj)) {
        maskObj = {
          mask: maskObj
        };
      }

      // mask functions can setup caret traps to have some control over how the caret
      // moves. We need to process the mask for any caret traps. `processCaretTraps`
      // will remove the caret traps from the mask and return the indexes of the caret traps.
      const caretTrapInfo = this._processCaretTraps(maskObj.mask);

      // The processed mask is what we're interested in
      maskObj.mask = caretTrapInfo.maskWithoutCaretTraps;
      maskObj.caretTrapIndexes = caretTrapInfo.indexes;

      // And we need to store these indexes because they're needed by `adjustCaretPosition`
      opts.caretTrapIndexes = caretTrapInfo.indexes;
    } else {
      // Use a provided array
      maskObj = {
        mask: this.pattern
      };
    }

    // As a convenience, setting the mask to false will cause it to return without processing.
    if (maskObj.mask === false) {
      return processResult;
    }

    try {
      processResult = this._conformToMask(rawValue, maskObj, opts);
    } catch (e) {
      // console.error('Couldn\'t complete masking process: "'+ e.message +'"');
      return processResult;
    }

    if (opts.patternOptions && opts.patternOptions.delimeter &&
      processResult.conformedValue && processResult.conformedValue !== rawValue) {
      processResult.caretPos = processResult.conformedValue.length;
    }

    // Handle the optional "pipe" cleanup method, if applicable.
    if (typeof opts.pipe === 'function') {
      let pipeResult = {};

      // `pipe` receives the entire `processResult` object and the configurations with which
      // `conformToMask` was called.
      try {
        pipeResult = opts.pipe(processResult, opts);
      } catch (e) {
        // console.error('Couldn\'t complete mask\'s pipe function: "'+ e.message +'"');
        pipeResult = false;
      }

      // `pipeResults` should be an object. But as a convenience, we allow the pipe
      // author to just return `false` to indicate rejection. Or return just a string when there
      // are no piped characters.
      // If the `pipe` returns `false` or a string, the block below turns it into an
      // object that the rest of the code can work with.
      if (pipeResult === false) {
        // If the `pipe` rejects `conformedValue`, we use the `previousConformedValue`,
        // and set `rejected` to `true`.
        processResult.pipeResult = false;
        processResult.pipedValue = opts.previousMaskResult;
      } else if (utils.isString(pipeResult)) {
        processResult.pipeResult = true;
        processResult.pipedValue = pipeResult;
        processResult.pipedCharIndexes = [];
      } else {
        processResult = utils.extend({}, processResult, {
          pipeResult: pipeResult.result,
          pipedValue: pipeResult.value,
          pipedCharIndexes: pipeResult.characterIndexes
        });
      }
    }

    return processResult;
  },

  /**
   * Processes a raw string value against a masking algorithm and removes unfavorable chracters.
   * @private
   * @param {string} rawValue incoming full text string to process.
   * @param {object} maskObj containing the mask to be used for modifying the raw value, along with some meta-data calculated about the mask.
   * @param {object} [settings] incoming settings for mask parsing.
   * @returns {object} containing the conformation result and some meta-data
   */
  _conformToMask(rawValue, maskObj, settings) {
    // Set default settings
    settings = utils.mergeSettings(undefined, settings, masks.DEFAULT_CONFORM_OPTIONS);

    // Setup the placeholder version of the mask
    settings.placeholder = this._convertMaskToPlaceholder(maskObj.mask, settings.placeholderChar);

    // Setup booleans and numbers for various settings (speed)
    let charactersRejected = false;
    const suppressGuide = settings.guide === false && settings.previousMaskResult !== undefined;
    const rawValueLength = rawValue.length;
    const prevMaskResultLength = settings.previousMaskResult.length;
    const maskLength = this.pattern.length;
    const placeholderLength = settings.placeholder.length || 0;
    const placeholderChar = settings.placeholderChar;
    let caretPos = settings.selection.start;
    let resultStr = masks.EMPTY_STRING;

    const editDistance = rawValueLength - prevMaskResultLength;
    const isAddition = editDistance > 0;
    const indexOfFirstChange = caretPos + (isAddition ? -editDistance : 0);
    const indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);

    // If `_conformToMask()` is configured to keep character positions, that is,
    // for mask 111, previous value _2_ and raw value 3_2_, the new conformed value
    // should be 32_, not 3_2 (default behavior). That's in the case of addition.
    // And in the case of deletion, previous value _23, raw value _3, the new conformed
    // string should be __3, not _3_ (default behavior)
    //
    // The next block of logic handles keeping character positions for the case
    // of deletion. (Keeping character positions for the case of addition is further
    // down since it is handled differently.)
    // To do this, we want to compensate for all characters that were deleted
    if (settings.keepCharacterPositions === true && !isAddition) {
      // We will be storing the new placeholder characters in this variable.
      let compensatingPlaceholderChars = masks.EMPTY_STRING;

      // For every character that was deleted from a placeholder position, we add a placeholder char
      for (let i = indexOfFirstChange; i < indexOfLastChange; i++) {
        if (settings.placeholder[i] === placeholderChar) {
          compensatingPlaceholderChars += placeholderChar;
        }
      }

      // Now we trick our algorithm by modifying the raw value to make it contain
      // additional placeholder characters. That way when the we start laying the
      // characters again on the mask, it will keep the non-deleted characters
      // in their positions.
      rawValue = (
        rawValue.slice(0, indexOfFirstChange) +
        compensatingPlaceholderChars +
        rawValue.slice(indexOfFirstChange, rawValueLength)
      );
    }

    // Convert `rawValue` string to an array, and mark characters based on whether
    // they are newly added or have existed in the previous conformed value. Identifying new
    // and old characters is needed for `_conformToMask()` to work if it is configured
    // to keep character positions.
    function markAddedChars(char, j) {
      return {
        char,
        isNew: j >= indexOfFirstChange && j < indexOfLastChange
      };
    }
    const rawValueArr = rawValue.split(masks.EMPTY_STRING).map(markAddedChars);

    // The loop below removes masking characters from user input. For example, for mask
    // `00 (111)`, the placeholder would be `00 (___)`. If user input is `00 (234)`, the loop below
    // would remove all characters but `234` from the `rawValueArr`. The rest of the algorithm
    // then would lay `234` on top of the available placeholder positions in the mask.
    for (let k = rawValueLength - 1; k >= 0; k--) {
      const char = rawValueArr[k];

      if (char !== settings.placeholderChar) {
        const shouldOffset = k >= indexOfFirstChange && prevMaskResultLength === maskLength;

        if (char === settings.placeholder[(shouldOffset) ? k - editDistance : k]) {
          rawValueArr.splice(k, 1);
        }
      }
    }

    // Loop through the placeholder string to find characters that need to be filled.
    placeholderLoop:
    for (let l = 0; l < placeholderLength; l++) {
      const charInPlaceholder = settings.placeholder[l];

      // We see one. Let's find out what we can put in it.
      if (charInPlaceholder === placeholderChar) {
        // But before that, do we actually have any user characters that need a place?
        if (rawValueArr.length > 0) {
          // We will keep chipping away at user input until either we run out of characters
          // or we find at least one character that we can map.
          while (rawValueArr.length > 0) {
            // Let's retrieve the first user character in the queue of characters we have left
            const rawValueChar = rawValueArr.shift();
            const nextChar = rawValue.slice(l, l + 1);

            // If the character we got from the user input is a placeholder character (which happens
            // regularly because user input could be something like (540) 90_-____, which includes
            // a bunch of `_` which are placeholder characters) and we are not in *no guide* mode,
            // then we map this placeholder character to the current spot in the placeholder
            if (rawValueChar.char === placeholderChar && suppressGuide !== true) {
              resultStr += placeholderChar;

              // And we go to find the next placeholder character that needs filling
              continue placeholderLoop;

            // Else if, the character we got from the user input is a known literal member of the
            // mask (not necessarily user-input, and forms part of the formatting), add that and speed the mask
            // up to the next section.
            } else if (
              maskObj.literalRegex &&
              maskObj.literalRegex.test(rawValueChar.char) &&
              nextChar && (nextChar === rawValueChar.char || nextChar === placeholderChar)
            ) {
              if (isAddition && rawValue[l - 1] === rawValueChar.char) {
                caretPos++;
                continue placeholderLoop;
              }

              // Analyze the number of this particular literal in the value,
              // and only add it if we haven't passed the maximum
              const thisLiteralRegex = new RegExp(`(${rawValueChar.char})`, 'g');
              const numberLiteralsPlaceholder = settings.placeholder.match(thisLiteralRegex).length;
              const numberLiteralsRawValue = rawValue.match(thisLiteralRegex).length;
              if (numberLiteralsRawValue <= numberLiteralsPlaceholder) {
                resultStr += rawValueChar.char;
              }

              // Fast forward the loop to the after the next instance of this literal.
              let literalIndex = settings.placeholder.slice(l).indexOf(rawValueChar.char);
              while (literalIndex > 0) {
                l++;
                literalIndex--;
              }

              continue placeholderLoop;
            // Else if, the character we got from the user input is not a placeholder, let's see
            // if the current position in the mask can accept it.
            } else if (maskObj.mask[l].test(rawValueChar.char)) {
              // we map the character differently based on whether we are keeping character
              // positions or not. If any of the conditions below are met, we simply map the
              // raw value character to the placeholder position.
              if (
                settings.keepCharacterPositions !== true ||
                rawValueChar.isNew === false ||
                settings.previousMaskResult === masks.EMPTY_STRING ||
                settings.guide === false ||
                !isAddition
              ) {
                resultStr += rawValueChar.char;
              } else {
                // We enter this block of code if we are trying to keep character positions and
                // none of the conditions above is met. In this case, we need to see if there's
                // an available spot for the raw value character to be mapped to. If we couldn't
                // find a spot, we will discard the character.
                //
                // For example, for mask `1111`, previous conformed value `_2__`, raw value
                // `942_2__`. We can map the `9`, to the first available placeholder position,
                // but then, there are no more spots available for the `4` and `2`. So, we
                // discard them and end up with a conformed value of `92__`.
                const rawValueArrLength = rawValueArr.length;
                let indexOfNextAvailablePlaceholderChar = null;

                // Let's loop through the remaining raw value characters. We are looking for
                // either a suitable spot, ie, a placeholder character or a non-suitable spot,
                // ie, a non-placeholder character that is not new. If we see a suitable spot
                // first, we store its position and exit the loop. If we see a non-suitable spot
                // first, we exit the loop and our `indexOfNextAvailablePlaceholderChar`
                // will stay as `null`.
                for (let x = 0; x < rawValueArrLength; x++) {
                  const charData = rawValueArr[x];

                  if (charData.char !== placeholderChar && charData.isNew === false) {
                    break;
                  }

                  if (charData.char === placeholderChar) {
                    indexOfNextAvailablePlaceholderChar = x;
                    break;
                  }
                }

                // If `indexOfNextAvailablePlaceholderChar` is not `null`, that means the
                // character is not blocked. We can map it. And to keep the character positions,
                // we remove the placeholder character from the remaining characters
                if (indexOfNextAvailablePlaceholderChar !== null) {
                  resultStr += rawValueChar.char;
                  rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1);

                // If `indexOfNextAvailablePlaceholderChar` is `null`, that means the
                // character is blocked. We have to discard it.
                } else {
                  l--;
                }
              }

              // Since we've mapped this placeholder position. We move on to the next one.
              continue placeholderLoop;
            } else {
              charactersRejected = true;
            }
          }
        }

        // We reach this point when we've mapped all the user input characters to placeholder
        // positions in the mask. In *guide* mode, we append the left over characters in the
        // placeholder to the `conformedString`, but in *no guide* mode, we don't wanna do that.
        //
        // That is, for mask `(111)` and user input `2`, we want to return `(2`, not `(2__)`.
        if (suppressGuide === false) {
          resultStr += settings.placeholder.substr(l, placeholderLength);
        }

        // And we break
        break;

      // Else, the charInPlaceholder is not a placeholderChar. That is, we cannot fill it
      // with user input. So as long as it doesn't exist at the rawValue's current index,
      // we just map it to the final output.
      } else {
        resultStr += charInPlaceholder;
      }
    }

    // The following logic is needed to deal with the case of deletion in *no guide* mode.
    //
    // Consider the silly mask `(111) /// 1`. What if user tries to delete the last placeholder
    // position? Something like `(589) /// `. We want to conform that to `(589`. Not `(589) /// `.
    // That's why the logic below finds the last filled placeholder character,
    // and removes everything from that point on.
    if (suppressGuide && isAddition === false) {
      let indexOfLastFilledPlaceholderChar = null;

      // Find the last filled placeholder position and substring from there
      for (let m = 0; m < resultStr.length; m++) {
        if (settings.placeholder[m] === placeholderChar) {
          indexOfLastFilledPlaceholderChar = m;
        }
      }

      if (indexOfLastFilledPlaceholderChar !== null) {
        // We substring from the beginning until the position after the last filled
        // placeholder char.
        resultStr = resultStr.substr(0, indexOfLastFilledPlaceholderChar + 1);
      } else {
        // If we couldn't find `indexOfLastFilledPlaceholderChar` that means the user deleted
        // the first character in the mask. So we return an empty string.
        resultStr = masks.EMPTY_STRING;
      }
    }

    debugger;

    return {
      caretPos,
      caretTrapIndexes: settings.caretTrapIndexes,
      conformedValue: resultStr,
      charactersRejected,
      placeholder: settings.placeholder,
      placeholderChar,
      maskResult: true
    };
  },

  /**
   * Detects Caret Traps inside of a Mask Array and identifies them with a rich object
   * @private
   * @param {array} mask the mask being checked
   * @returns {object} containing a modified Mask array without caret traps, and an array of
   *  indices with locations of the caret traps.
   */
  _processCaretTraps(mask) {
    const indexes = [];
    let indexOfCaretTrap = mask.indexOf(masks.CARET_TRAP);

    while (indexOfCaretTrap !== -1) {
      indexes.push(indexOfCaretTrap);
      mask.splice(indexOfCaretTrap, 1);
      indexOfCaretTrap = mask.indexOf(masks.CARET_TRAP);
    }

    return {
      maskWithoutCaretTraps: mask,
      indexes
    };
  },

  /**
   * Converts an array-based mask into a placeholder string.
   * @private
   * @param {array} mask - contains string "literal" characters and Regex matchers.
   * @param {string} placeholderChar - a character that will be used as the placeholder.
   * @returns {string} representing the placeholder
   */
  _convertMaskToPlaceholder(mask, placeholderChar) {
    if (!Array.isArray(mask)) {
      mask = [];
    }
    if (!placeholderChar) {
      placeholderChar = masks.PLACEHOLDER_CHAR;
    }

    if (mask.indexOf(placeholderChar) !== -1) {
      throw new Error(`${'Placeholder character must not be used as part of the mask. Please specify a character ' +
        'that is not present in your mask as your placeholder character.\n\n' +
        'The placeholder character that was received is:'}${JSON.stringify(placeholderChar)}\n\n` +
        `The mask that was received is: ${JSON.stringify(mask)}`);
    }

    const ret = mask.map(char => ((char instanceof RegExp) ?
      placeholderChar : char)).join(masks.EMPTY_STRING);

    return ret;
  },

  /**
   * Takes an index representing a caret and changes it based on mask modifications
   * @private
   * @param {object} opts information about the caret placement.
   * @returns {number} the index of the text caret.
   */
  adjustCaretPosition(opts) { //eslint-disable-line
    if (opts.caretPos === 0) {
      return 0;
    }

    function nonPlaceholderFilter(char) {
      return char !== nonPlaceholderFilter;
    }

    // Store lengths for faster performance?
    const rawValueLength = opts.rawValue.length;
    const previousConformedValueLength = opts.previousMaskResult.length;
    const placeholderLength = opts.placeholder ? opts.placeholder.length : 0;
    const conformedValueLength = opts.conformedValue ? opts.conformedValue.length : 0;

    // This tells us how long the edit is. If user modified input from `(2__)` to `(243__)`,
    // we know the user in this instance pasted two characters
    const editLength = rawValueLength - previousConformedValueLength;

    // If the edit length is positive, that means the user is adding characters, not deleting.
    const isAddition = editLength > 0;

    // This is the first raw value the user entered that needs to be conformed to mask
    const isFirstRawValue = previousConformedValueLength === 0;

    // A partial multi-character edit happens when the user makes a partial selection in their
    // input and edits that selection. That is going from `(123) 432-4348` to `() 432-4348` by
    // selecting the first 3 digits and pressing backspace.
    //
    // Such cases can also happen when the user presses the backspace while holding down the ALT
    // key.
    const isPartialMultiCharEdit = editLength > 1 && !isAddition && !isFirstRawValue;

    // This algorithm doesn't support all cases of multi-character edits, so we just return
    // the current caret position.
    //
    // This works fine for most cases.
    if (isPartialMultiCharEdit) {
      return opts.caretPos;
    }

    // For a mask like (111), if the `previousConformedValue` is (1__) and user attempts to enter
    // `f` so the `rawValue` becomes (1f__), the new `conformedValue` would be (1__), which is the
    // same as the original `previousConformedValue`. We handle this case differently for caret
    // positioning.
    const possiblyHasRejectedChar = isAddition && (
      opts.previousMaskResult === opts.conformedValue ||
      opts.conformedValue === opts.placeholder
    );

    let startingSearchIndex = 0;
    let trackRightCharacter;
    let targetChar;

    if (possiblyHasRejectedChar) {
      startingSearchIndex = opts.caretPos - editLength;
    } else {
      // At this point in the algorithm, we want to know where the caret is right
      // before the raw input has been conformed, and then see if we can find that
      // same spot in the conformed input.
      //
      // We do that by seeing what character lies immediately before the caret,
      // and then look for that same character in the conformed input and place
      // the caret there.
      //
      // First, we need to normalize the inputs so that letter capitalization between raw input and
      // conformed input wouldn't matter.
      const normalizedConformedValue = opts.conformedValue.toLowerCase();
      const normalizedRawValue = opts.rawValue.toLowerCase();

      // Then we take all characters that come before where the caret currently is.
      const leftHalfChars = normalizedRawValue.substr(0, opts.caretPos).split(masks.EMPTY_STRING);

      // Now we find all the characters in the left half that exist in the conformed
      // input. This step ensures that we don't look for a character that was filtered
      // out or rejected by `conformToMask`.
      const intersection = leftHalfChars.filter(char => normalizedConformedValue.indexOf(char) !== -1); //eslint-disable-line

      // The last character in the intersection is the character we want to
      // look for in the conformed value and the one we want to adjust the caret close to
      targetChar = intersection[intersection.length - 1];

      // Calculate the number of mask characters in the previous placeholder
      // from the start of the string up to the place where the caret is
      const previousLeftMaskChars = opts.previousPlaceholder
        .substr(0, intersection.length)
        .split(masks.EMPTY_STRING)
        .filter(nonPlaceholderFilter)
        .length;

      // Calculate the number of mask characters in the current placeholder
      // from the start of the string up to the place where the caret is
      const leftMaskChars = opts.placeholder
        .substr(0, intersection.length)
        .split(masks.EMPTY_STRING)
        .filter(nonPlaceholderFilter)
        .length;

      // Has the number of mask characters up to the caret changed?
      const masklengthChanged = leftMaskChars !== previousLeftMaskChars;

      // Detect if `targetChar` is a mask character and has moved to the left
      const targetIsMaskMovingLeft = (
        opts.previousPlaceholder[intersection.length - 1] !== undefined &&
        opts.placeholder[intersection.length - 2] !== undefined &&
        opts.previousPlaceholder[intersection.length - 1] !== opts.placeholderChar &&
        opts.previousPlaceholder[intersection.length - 1] !== opts.placeholder[intersection.length - 1] && //eslint-disable-line
        opts.previousPlaceholder[intersection.length - 1] === opts.placeholder[intersection.length - 2] //eslint-disable-line
      );

      // If deleting and the `targetChar` `is a mask character and `masklengthChanged` is true
      // or the mask is moving to the left, we can't use the selected `targetChar` any longer
      // if we are not at the end of the string.
      // In this case, change tracking strategy and track the character to the right of the caret.
      if (
        !isAddition &&
        (masklengthChanged || targetIsMaskMovingLeft) &&
        previousLeftMaskChars > 0 &&
        opts.placeholder.indexOf(targetChar) > -1 &&
        opts.rawValue[opts.caretPos] !== undefined
      ) {
        trackRightCharacter = true;
        targetChar = opts.rawValue[opts.caretPos];
      }

      // It is possible that `targetChar` will appear multiple times in the conformed value.
      // We need to know not to select a character that looks like our target character
      // from the placeholder or the piped characters, so we inspect the piped characters
      // and the placeholder to see if they contain characters that match our target character.

      // If the `conformedValue` got piped, we need to know which characters were piped in so
      // that when we look for our `targetChar`, we don't select a piped char by mistake.
      let pipedChars = [];
      if (opts.indexesOfPipedChars) {
        pipedChars = opts.indexesOfPipedChars.map(index => normalizedConformedValue[index]);
      }

      // We need to know how many times the `targetChar` occurs in the piped characters.
      const countTargetCharInPipedChars = pipedChars.filter(char => char === targetChar).length;

      // We need to know how many times it occurs in the intersection
      const countTargetCharInIntersection = intersection.filter(char => char === targetChar).length;

      // We need to know if the placeholder contains characters that look like
      // our `targetChar`, so we don't select one of those by mistake.
      const countTargetCharInPlaceholder = opts.placeholder
        .substr(0, opts.placeholder.indexOf(opts.placeholderChar))
        .split(masks.EMPTY_STRING)
        // Check if `char` is the same as our `targetChar`, so we account for it
        // but also make sure that both the `rawValue` and placeholder don't have the same
        // character at the same index because if they are equal, that means we are already
        // counting those characters in `countTargetCharInIntersection`
        .filter((char, index) => char === targetChar && opts.rawValue[index] !== char).length;

      // The number of times we need to see occurrences of the `targetChar` before we
      // know it is the one we're looking for is:
      const requiredNumberOfMatches = (
        countTargetCharInPlaceholder +
        countTargetCharInIntersection +
        countTargetCharInPipedChars +
        // The character to the right of the caret isn't included in `intersection`
        // so add one if we are tracking the character to the right
        (trackRightCharacter ? 1 : 0)
      );

      // Now we start looking for the location of the `targetChar`.
      // We keep looping forward and store the index in every iteration. Once we have encountered
      // enough occurrences of the target character, we break out of the loop
      // If are searching for the second `1` in `1214`, `startingSearchIndex` will point at `4`.
      let numberOfEncounteredMatches = 0;
      for (let i = 0; i < conformedValueLength; i++) {
        const conformedValueChar = normalizedConformedValue[i];

        startingSearchIndex = i + 1;

        if (conformedValueChar === targetChar) {
          numberOfEncounteredMatches++;
        }

        if (numberOfEncounteredMatches >= requiredNumberOfMatches) {
          break;
        }
      }
    }

    // At this point, if we simply return `startingSearchIndex` as the adjusted caret position,
    // most cases would be handled. However, we want to fast forward or rewind the caret to the
    // closest placeholder character if it happens to be in a non-editable spot.
    // That's what the next logic is for.
    //
    // In case of addition, we fast forward.
    if (isAddition) {
      // We want to remember the last placeholder character encountered so that if the mask
      // contains more characters after the last placeholder character, we don't forward the caret
      // that far to the right. Instead, we stop it at the last encountered placeholder character.
      let lastPlaceholderChar = startingSearchIndex;

      for (let j = startingSearchIndex; j <= placeholderLength; j++) {
        if (!opts.placeholder) {
          return lastPlaceholderChar;
        }

        if (opts.placeholder[j] === opts.placeholderChar) {
          lastPlaceholderChar = j;
        }

        if (
          // If we're adding, we can position the caret at the next placeholder character.
          opts.placeholder[j] === opts.placeholderChar ||

          // If a caret trap was set by a mask function, we need to stop at the trap.
          opts.caretTrapIndexes.indexOf(j) !== -1 ||

          // This is the end of the placeholder. We cannot move any further.
          // Let's put the caret there.
          j === placeholderLength
        ) {
          return lastPlaceholderChar;
        }
      }
    } else {
      // In case of deletion, we rewind.
      if (trackRightCharacter) { //eslint-disable-line
        // Searching for the character that was to the right of the caret
        // We start at `startingSearchIndex` - 1 because it includes one character
        // extra to the right
        for (let k = startingSearchIndex - 1; k >= 0; k--) {
          // If tracking the character to the right of the cursor, we move to the left until
          // we found the character and then place the caret right before it

          if (
            // `targetChar` should be in `conformedValue`, since it was in `rawValue`, just
            // to the right of the caret
            opts.conformedValue[k] === targetChar ||

            // If a caret trap was set by a mask function, we need to stop at the trap.
            opts.caretTrapIndexes.indexOf(k) !== -1 ||

            // This is the beginning of the placeholder. We cannot move any further.
            // Let's put the caret there.
            k === 0
          ) {
            return k;
          }
        }
      } else {
        // Searching for the first placeholder or caret trap to the left

        for (let l = startingSearchIndex; l >= 0; l--) {
          // If we're deleting, we stop the caret right before the placeholder character.
          // For example, for mask `(111) 11`, current conformed input `(456) 86`. If user
          // modifies input to `(456 86`. That is, they deleted the `)`, we place the caret
          // right after the first `6`

          if (
            // If we're deleting, we can position the caret right before the placeholder character
            opts.placeholder[l - 1] === opts.placeholderChar ||

            // If a caret trap was set by a mask function, we need to stop at the trap.
            opts.caretTrapIndexes.indexOf(l) !== -1 ||

            // This is the beginning of the placeholder. We cannot move any further.
            // Let's put the caret there.
            l === 0
          ) {
            return l;
          }
        }
      }
    }
  },

  /**
   * Converts the legacy Soho Mask pattern format from a string into an array.
   * If character is a defined pattern matcher, the corresponding item at the
   * array index is converted to its regex form.
   * @private
   * @param {string} pattern a legacy Soho Mask Pattern
   * @param {object} [defs] mask conversion definitions
   * @returns {array} contains string "literal" characters and Regex matchers
   */
  _convertPatternFromString(pattern, defs) {
    const arr = [];
    const legacyKeys = Object.keys(defs);

    function getRegex(char) {
      const idx = legacyKeys.indexOf(char);

      if (idx > -1) {
        char = defs[legacyKeys[idx]];
      }
      return char;
    }

    for (let i = 0; i < pattern.length; i++) {
      arr.push(getRegex(pattern[i]));
    }

    // TODO: Attach an object here that contains an analysis of the original mask
    // that can be used to configure the new API accordingly.

    return arr;
  }

};

export { MaskAPI };
