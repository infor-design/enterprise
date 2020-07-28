---
title: Mask
description: null
demo:
  embedded:
  - name: Main Example
    slug: example-index
  pages:
  - name: Add custom definitions
    slug: example-add-definitions
  - name: Fields with Symbols
    slug: example-fields-with-symbols
  - name: Initialized with Values
    slug: example-initialized-with-values
  - name: Patterns with Guides
    slug: example-patterns-with-guides
  - name: Write Event Example
    slug: example-write-event
  - name: The Number Mask Gauntlet
    slug: test-number-mask-gauntlet
---

## Behavior Guidelines

The Masked Input limits the types of text input that can be included inside of an HTML Input field.  Masking of the input is done as a user is typing text into the input field, and can also be done on an entire string of text (for example, copy/paste or programmatically).  This can be used for several purposes, such as:

- Limiting text in simple patterns, such as credit cards and phone numbers.
- Automatically formatting numbers, dates, and times to the current [Locale](./locale).

### Defining a Mask Pattern

Mask Patterns can be defined as the following:

- [Arrays]('#arrays') of single character strings and regular expressions
- [Functions](#functions), which will analyze the contents of the entire input and return an array.
- [Strings](#strings-legacy-mask-patterns), which can contain a set of pre-defined "matchable" characters that represent areas that will be replaced by a specific type.  These get converted to an array.

#### Arrays

Standard Soho masks can be defined using arrays of both "literal" string characters (not replaced by masking) and "pattern" regular expressions (will be replaced by masking).  Regular expressions should be designed to match a single character.

A field needing to capture a U.S. Phone Number could be masked with a pattern array like this:

```javascript
const phoneNumberPattern = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ];

$('#my-phone-number').mask({
  pattern: phoneNumberPattern
});
```

#### Functions

Mask functions can be passed as the `pattern` setting when being invoked.  Mask functions are dynamic, and are capable of analyzing the raw value passed to the Mask API.  This can be useful if you need to mask a specific section of input differently for several cases.

Mask functions take two arguments.  The first one is a string containing the raw value that will eventually be masked.  The second argument is an object representing the `patternOptions` setting on the Masked Input field.  The second setting should be populated with whatever settings your mask will need to analyze the raw value properly at runtime.  Mask functions should always eventually return an array of string literals and single-character regular expressions, similar to the [array](#arrays) style definition above.

A mask function would be structured like this:

```javascript
function customMaskFunction(rawValue, options) {
  let arr = [];
  // do some analysis on the raw value
  // ...
  return arr;
}
```

When using the mask's `process` setting, `date`, `time`, or `number`, the Masked Input field will automatically configure itself with built-in mask functions that handle these cases.  For example, to format a U.S. shorthand date, a user could define a mask field with the following:

```javascript
$('#my-date-field').mask({
  process: 'date',
  patternOptions: {
    format: 'M/d/yyyy'
  }
});
```

Another Example: If a user wanted to properly format a number as the user types (with currency and the possibility of becoming negative), the mask field could be defined this way:

```javascript
$('#my-number-field').mask({
  process: 'number',
  patternOptions: {
    allowDecimal: true,
    allowNegative: true,
    decimalLimit: 2,
    integerLimit: 7,
    prefix: '$'
  }
});
```

##### Dynamism of a mask function

In the date mask function, detection is done on the incoming date format to figure out how many characters should be represented by the day, month, hours, or seconds.  For example, if a date's month is defined as `MM` and the raw value representing the month contains a single 3 thru 9, the Mask function will understand that a second character is not possible, and will eventually cause the masking process to prepend a zero.  However, if the number is 0 thru 2, the masking function will allow for another character to be typed before it adds a literal `/` to the array.

##### Replacing built-in mask functions

When using any of the processes listed above, it's possible to override the built-in masking functions on each input field, if you desire. Simply add a `pattern` setting in addition to the settings above.

#### Strings (Legacy Mask Patterns)

Legacy Mask Patterns are built in a string-based format.

String-based patterns are built with two different types of characters:

- Pattern Characters - These are characters replaceable by a pre-defined subset of other characters. For example, by default, a `\#` can only be replaced by any numeric character (0 through 9). One pattern character will always match one keyed character.
- Literal Characters - These characters are "literal," meaning that they will only be represented in the text input by itself. When the cursor is placed at a literal character and any key is pressed, the Mask Component will find the next possible pattern character in the string and match the keyboard input against it. If it's a match, the pattern character and all literal characters preceding it will be filled in automatically. It's also possible to individually key in each literal character in the string.

The string-based mask is best used when you need to define simple masks inline with HTML, or if your mask doesn't need to be highly configurable, like a number, date, etc.  Building a pattern mask inline could look like this in HTML:

```html
<input id="my-masked-field" class="new-mask" data-options='{ "pattern": "####-####-####-####" }' />
```

It's also possible to invoke a pattern mask with Javascript directly on an input field:

```javascript
$('#my-masked-field').mask({
  pattern: '####-####-####-####'
});
```

**NOTE** If your project is making use of the Soho Standard `data.options` attribute, the legacy string style is still the best way to define simple mask patterns.  It will be converted to an array, converting any pattern characters found into a corresponding regular expression using the [Legacy Mask Pattern Characters](#available-mask-pattern-characters).  It's not possible to pass arrays or functions directly into the `data-options` attribute, so this remains the best way to handle populating masks through HTML.

##### Legacy Mask Pattern Characters

The following mask pattern characters are available by default:

- `\#` - Replaces any number 0 through 9. In a number mask, represents an integer (full number before the decimal point)
- `x` - Replaces any alphabetic character, capital or lowercase.
- `\`* - Replaces any numeric (0 - 9) or alphabetic character (capital or lowercase).
- `0` - Replaces any numeric (0 - 9) character. Only used in Number Mask to represent a decimal number (placed after the decimal point)
- `a` - Represents the first character in the time period (am/pm). Can be replaced by `a`, `A`, `p`, or `P`.
- `m` - Represents the second character in the time period (am/pm). Can be replaced by `m` or `M`.

##### Creating Custom Pattern Characters

It's possible to create additional pattern characters by extending the Component's "definitions" option. The below example sets up a rule that will allow a pattern character of '=' to only be replaced by lowercase letters between **a** and **e** (See it in action [here]('./test-legacy-custom-definition.html')).

```javascript
// Only allows lowercase "a" through "e".
$('#my-strange-mask').data('mask').settings.definitions['='] = '[abcde]';
```

**NOTE** You should choose custom pattern characters that are not going to clash with the type of input your field will be accepting.

## Keyboard Shortcuts

No specific keyboard shortcuts exist for the Mask Component, but it should be noted that certain keys will not produce a character in the Input field based on the current position of the cursor inside the mask.
