---
title: Mask
description: This page describes Mask.
demo:
  pages:
  - name: Main Example
    slug: example-index
  - name: Common Mask Patterns
    slug: example-common-patterns
  - name: Fields with Symbols
    slug: example-fields-with-symbols
  - name: The Number Mask Gauntlet
    slug: test-number-mask-gauntlet
---

## Behavior Guidelines

### Mask Patterns

Mask Patterns are comprised of two different types of characters:

- Pattern Characters - These are characters replaceable by a pre-defined subset of other characters. For example, by default, a `\#` can only be replaced by any numeric character (0 through 9). One pattern character will always match one keyed character.
- Literal Characters - These characters are "literal," meaning that they will only be represented in the text input by itself. When the cursor is placed at a literal character and any key is pressed, the Mask Control will find the next possible pattern character in the string and match the keyboard input against it. If it's a match, the pattern character and all literal characters preceding it will be filled in automatically. It's also possible to individually key in each literal character in the string.

### Available Mask Pattern Characters

The following mask pattern characters are available by default:

- `\#` - Replaces any number 0 through 9. In a number mask, represents an integer (full number before the decimal point)
- `x` - Replaces any alphabetic character, capital or lowercase.
- `\` - Replaces any numeric (0 - 9) or alphabetic character (capital or lowercase).
- `0` - Replaces any numeric (0 - 9) character. Only used in Number Mask to represent a decimal number (placed after the decimal point)
- `a` - Represents the first character in the time period (am/pm). Can be replaced by `a`, `A`, `p`, or `P`.
- `m` - Represents the second character in the time period (am/pm). Can be replaced by `m` or `M`.

### Creating New Pattern Characters

It's possible to create additional pattern characters by extending the Control's "definitions" option. The below example sets up a rule that will allow a pattern character of 'd' to only be replaced by lowercase letters between `a` and `e`.

```javascript
$.extend($('#mask').data('mask').settings.definitions, {
  'd' : '[abcde]'
});
```

## Code Example

### Mask

A Mask Control is created simply by adding a "data-mask" attribute to any input field. The "data-mask" attribute contains a pattern that will control the allowed text-entry into the input field.

```html
<input id="mask" data-mask="####-####-####-####" />
```

## Testability

- Please refer to the for further details see the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist)

## Keyboard Shortcuts

No specific keyboard shortcuts exist for the Mask Control, but it should be noted that certain keys will not produce a character in the Input field based on the current position of the cursor inside the mask.
