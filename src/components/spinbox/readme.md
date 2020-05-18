---
title: Spinbox Component
description: Displays an editable field. A user can enter numeric data. Best for incremental inputs within a scale where users do not require a view of the lower and upper limits at all times.
demo:
  embedded:
  - name: Main
    slug: example-index
  pages:
  - name: Configured with Range Limits
    slug: example-range-limits
  - name: Configured with Step Intervals of 3
    slug: example-stepped-intervals
  - name: Dirty Tracking
    slug: example-dirty-tracking
  - name: Disabled Spinbox
    slug: example-disabled
  - name: Spinbox with Required Validation
    slug: example-validation
---

## Behavior Guidelines

Using the up and down arrow keys, the user can move through the range of values. Depending on the exact settings, users can also type one of the supported values directly in the field.

## Code Example

A spinbox is created from a standard `type="text"` `<input>` field by adding `class="spinbox"`. The `type="number"` input can not be used as the browser will take over controlling the field if you use this. The initializer will initialize this control using the following attributes:

- `min` - Determines the lowest value this can be set to
- `max` - Determines the highest value this can be set to
- `value` - Denotes current value. This can be serialized with the form as normal
- `step` - Denotes how many steps an increase should take

Touch and mobile keyboard are supported.

```html
<div class="field">
  <label for="stepped-spinbox">Spinbox (init 0, min -99, max 99, step 3)</label>
  <input id="stepped-spinbox" name="stepped-spinbox" type="text" class="spinbox" min="-99" max="99" value="0" step="3"/>
</div>
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Right</kbd> and <kbd>Up</kbd> arrows increase the value
- <kbd>Left</kbd> and <kbd>Down</kbd> arrows decrease the value
- <kbd>Home</kbd> and <kbd>End</kbd> keys move to the maximum or minimum values
- Optional <kbd>Page Up</kbd> and <kbd>Page Down</kbd> incrementally increase or decrease the value
- <kbd>Tab</kbd> moves into and out of the widget

## States and Variations

The spinbox takes the same states as any trigger field. See the Text Box for more information.

## Responsive Guidelines

- Its size is always less than mobile (150px) small size. General form guidelines apply.

## Upgrading from 3.X

- Replaces `inforSpinner`
- Label class `inforLabel` should now be `label`
- Spin Box Class `inforSpinner` should now be `spinbox`
- `type` should be text not number (for mobile support)
