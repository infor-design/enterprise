---
title: Progress Indicator
description: Displays feedback about how far along a system process is.
demo:
  embedded:
  - name: Default Progress Indicator Example
    slug: example-index
---

## Code Example

Insert a block element such as a `<div>` in the DOM with class `progess-bar`. Set the `data-value` attribute to set the current progress. Always include a visible `<label>` and set `aria-labelledby` to point to that label.

```html
<div class="progress">
  <div class="progress-bar" data-options="{'value': '50'}" id="progress-bar1" data-automation-id="progress-bar1-automation" aria-labelledby="pr-label1"></div>
</div>
```

When the markup is established, you can call the `updated` method or trigger the `updated` event to animate and notify the control.

```javascript
  $('#upd-progressbar').on('click', function () {
    $('#progress-bar1').attr('data-value', '100').trigger('updated');
  });
```

## Accessibility

- `aria-labelledby` should point to the manditory text `<label>`
- `role="progressbar"` indicates the role of the progress bar
- `aria-valuenow` should indicate the current value
- `aria-maxvalue="100"` should indicate the max value (100%)

## Testability

You can add custom id's/automation id's to the progress component in the markup inline. For this reason there is no `attributes` setting like some other components.

## Keyboard Shortcuts

- No Keyboard is used on the progress component

## Responsive Guidelines

- Will size to parent container

## Upgrading from 3.X

- Much simpler API then before.
- Instead of calling `inforProgressIndicator`, simply place the noted structure in the DOM
- Set the `data-value` attribute and trigger `updated` to update
- Now required to insert the elements in the DOM
