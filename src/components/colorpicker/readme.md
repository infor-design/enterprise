---
title: Color Picker
description: null
demo:
  embedded:
  - name: Color Picker Example
    slug: example-index
  pages:
  - name: Showing Custom Color Labels
    slug: example-custom-labels
  - name: Showing Label (instead of the hex value)
    slug: example-show-label
  - name: Different Sized Color Pickers
    slug: example-sizes
  - name: Color Picker States
    slug: test-states
  - name: Color Picker on a Modal
    slug: test-modal
  - name: Clear Option on the Color Picker
    slug: test-clearable
---

## Code Example

The color picker consists of an input with `class="colorpicker"`. It can be initialized manually or with the page initializer. Once initialized, it functions similarly to a dropdown except that the list shows a color palette in the popup. A tooltip shows the hex code to be inserted if you hover it on the popup. After selecting, the hex code is inserted. You can also optionally select the label into the field instead of the hex.

```html
<div class="field">
  <label for="background-color">Background Color</label>
  <input class="colorpicker" value="#ffa800" id="background-color" type="text" />
</div>
```

## Behavior Guidelines

- The Color Picker by default supports colors within a pre-configured palette of IDS colors. You can optionally add your own list of colors as specified by the developer.
- There is also an option to allow the ability to clear the color selection. For example, to remove a color or to restore a default color.

## Accessibility

- Currently implemented similarly to aria combobox. This approach needs more testing.

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus into the edit field.
- <kbd>Down Arrow</kbd> opens the color list and moves focus to the selected color. (If nothing is selected, then focus moves to the first color in the list).
- <kbd>Up and Down Arrow</kbd> moves focus up and down the list of colors.
- <kbd>Enter</kbd> selects the color on the list and updates the combo then closes the drop down and returns to the edit field.
- <kbd>Escape key</kbd> closes the list, returns focus to the edit field, and does not change the current selection.

## States and Variations

- Disabled
- Focus
- Dirty
- Error
- Only the color
- Label or Hex
- Not Editable (except with the picker)
- Readonly

## Testability

You can add custom id's/automation id's to the color picker that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes.
For example:

```js
  attributes: { name: 'id', value: args => `background-color` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

For the colorpicker if you set the attributes on the input element with the `id` other components as before. But you can also pass additional attributes in the setting that will get appended to other elements. The id on the element wont change but the one you pass in to the attributes will get the following appended to other elements. So we suggest to set the id in attributes to the same id you set in the input markup. The following items get appended to:

- Trigger button gets `trigger`
- Each color in the picker will get `colorNN` for example `azure80`
- The clear button in the picker in the picker will get `clear` appended

## Responsive Guidelines

- Follows form guidelines or has specific sizes that you can specify

## Upgrading from 3.X

- inforColorPicker class renamed to colorpicker
- Plugin renamed from .inforColorPicker() to .colorpicker()
- Options mode and title are deprecated (these were never actually used)
