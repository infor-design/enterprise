---
title: Color Picker
description: null
demo:
  embedded:
  - name: Color Picker Example
    slug: example-index
  pages:
  - name: Showing Custom Colors
    slug: example-custom-labels
  - name: Showing Label on Select
    slug: example-show-label
  - name: Different Sized Colorpickers
    slug: example-sizes
---

## Code Example

The color picker is consists of a input with class="colorpicker". It can be initialized manually or with the page initializer. Once initialized it functions similar to a dropdown except that the list is showing color a color pallet in the popup. A tooltip shows the hex code to be inserted. After selecting the hex code is inserted.

```html
<div class="field">
  <label for="background-color">Color Picker</label>
  <input class="colorpicker" value="#ffa800" id="background-color" type="text" />
</div>
```

## Behavior Guidelines

- The Color Picker only supports colors within a pre-configured palette (specified by the developer). Users cannot manually enter values, but can only select from the Color Picker.
- Some use cases require the ability to clear selection (i.e., remove color/restore default color).

## Accessibility

Implemented similar to aria combobox

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus into the edit field.
- <kbd>Down Arrow</kbd> opens the color list and moves focus to the selected color. (If nothing is selected, then focus moves to the first color in the list).
- <kbd>Up and Down Arrow</kbd> moves focus up and down the list of colors.
- <kbd>Enter</kbd> selects the color on the list and updates the combo then closes the drop down and returns to the edit field.
- <kbd>Escape key</kbd> closes the list, returns focus to the edit field, and does not change the current selection.

## States and Variations

- Disabled
- Focus

## Responsive Guidelines

Follows form guidelines

## Upgrading from 3.X

- inforColorPicker class renamed to colorpicker
- Plugin renamed from .inforColorPicker() to .colorpicker()
- Options mode, and title depricated (never used)
