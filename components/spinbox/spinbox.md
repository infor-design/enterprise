---
title: Spinbox Component 
description: This page describes Spinbox Component .
---

## Configuration Options

1. Main [View Example](../components/spinbox/example-index)
2. Configured with Range Limits [View Example](../components/spinbox/example-range-limits)
3. Configured with Step Intervals of 3 [View Example](../components/spinbox/example-stepped-intervals)
4. Dirty Tracking [View Example](../components/spinbox/example-dirty-tracking)
5. Disabled Spinbox [View Example](../components/spinbox/example-disabled)
5. Spinbox with Required Validation [View Example](../components/spinbox/example-validation)

## Behavior Guidelines

Using the arrows, the user can move through the range of values. Depending on the exact use case, users can also type one of the supported values directly in the field.

## Code Example

A Spinbox is created from a standard type="text" input field by adding the class="spinbox". The initializer will initialize this control using the attributes of a spinbox.

- Attribute min - Determines the lowest value this can be set to
- Attribute max - Determines the highest value this can be set to
- Attribute value - Denotes current value. This can be serialized with the form as normal
- Attribute step - Denotes how many steps an increase should take

Touch and mobile keyboard are supported.

```html
<div class="field">
  <label for="stepped-spinbox">Spinbox (init 0, min -99, max 99, step 3)</label>
  <input id="stepped-spinbox" name="stepped-spinbox" type="text" class="spinbox" min="-99" max="99" value="0" step="3"/>
</div>
```

## Implementation Tips

- Localization for right to left languages may wish to reverse the left and right arrows.

## Accessibility

- Focus should remain on the edit field

## Keyboard Shortcuts

- **Right and Up Arrows** increase the value.
- **Left and Down Arrows** decrease the value.
- **Home and End key** move to the maximum or minimum values
- **Optional Page Up and Page Down** incrementally increase or decrease the value
- **Tab key** moves into and out of the widget

## States and Variations

The Spinner takes the same states as any trigger field. See the Text Box for more information.

## Responsive Guidelines

- Its size is always less than mobile (150px) small size. From guidelines apply

## Upgrading from 3.X

- Replaces inforSpinner
- Label class inforLabel should now be label
- Spin Box Class inforSpinner should now be spinbox
- type should be text not number (for mobile support)
