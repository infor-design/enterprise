---
title: Switch Component
description: Displays two selectable values. A user can select exactly one value at a time. Best used when offering two values that are binary in the sense that selecting one negates the other.
demo:
  embedded:
  - name: Main Switch Example
    slug: example-index
  pages:
  - name: Alternate Alignment
    slug: example-alignment
  - name: Two Column Layout
    slug: example-two-columns
---

The switch component is a CSS-only component, and has no specific Javascript API.

## Code Example

A switch element is essentially a specially-styled [checkbox element](./checkboxes). Create an `<input>` element with `type="checkbox"` and `class="switch"`. Also create a `<label>` which is linked, and accurately describes the setting of the checkbox. Consider using a checkbox for most form layouts; Switch is primarily for settings.

```html
<div class="switch">
  <input type="checkbox" checked id="notifications" name="notifications" class="switch" />
  <label for="notifications">Allow notifications</label>
</div>
```

## Accessibility

- Always include a meaningfully described label thats linked correctly to the input field by the `for` and `id` attribute

## Keyboard Shortcuts

- <kbd>Tab</kbd> and <kbd>Shift Tab</kbd> navigates in and out of the switch
- <kbd>Space</kbd> toggles the selection, checking or unchecking the box

## States and Variations

- On/Off
- Hover
- Focus
- Disabled
- Read-Only
- Dirty

## Upgrading from 3.X

- Replace `inforSwitchLabelContainer` with `label`
- Replace `inforSwitchCheckbox` with `switch`
