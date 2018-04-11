---
title: Switch Component 
description: This page describes Switch Component .
---

The Switch Component is a CSS-only component, and has no specific Javascript API.

## Configuration Options

1. [Main Switch Example]( ../components/switch/example-index)
2. [Alternate Alignment]( ../components/switch/example-alignment)
3. [Two Column Layout]( ../components/switch/example-two-columns)

## Code Example

A Switch element is essentially a specially-styled [checkbox element]( ../components/checkboxes). Create an input element with `type="checkbox"` and `class="switch"`. Also create a label which is linked, and accurately describes the setting of the checkbox. Consider using a checkbox for most form layouts; Switch is primary for settings.

```html
<div class="switch">
  <input type="checkbox" checked id="notifications" name="notifications" class="switch" />
  <label for="notifications">Allow notifications</label>
</div>
```

## Accessibility

- Always include a meaningfully described label thats linked correctly to the input field by the for / id attribute

## Keyboard Shortcuts

- Tab/Shift Tab navigates in and out of the switch
- Space Bar key toggles the selection, checking or unchecking the box.

## States and Variations

- On/Off
- Hover
- Focus
- Disabled
- Read-Only
- Dirty

## Upgrading from 3.X

- The new markup is much simpler...
- Replaced inforSwitchLabelContainer with label
- replace inforSwitchCheckbox with switch
