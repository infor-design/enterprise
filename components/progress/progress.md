---
title: Progress Indicator
description: This page describes Progress Indicator.
---

## Configuration Options

1. Default Progress Indicator Example [View Example]( ../components/progress/example-index)

## Code Example

Insert a block element such as a div in the dom with class progess-bar. Set the data-value attribute to set the current progress. Always include a visible label and set aria-labelledby to point to that label.

```html

<label id="pr-label1">Percent complete</label>
<div class="progress">
    <div class="progress-bar" data-value="50" id="progress-bar1" aria-labelledby="pr-label1"></div>
</div>


```

When the markup is established this is set, you can call the updated method or trigger the updated event to animate and notify the control.

```javascript

  $('#upd-progressbar').on('click', function () {
    $('#progress-bar1').attr('data-value', '100').trigger('updated');
  });


```

## Accessibility

-   aria-labelledby should point to the manditory text label
-   role="progressbar" indicates the role of the progress bar
-   aria-valuenow should indicate the current value
-   aria-maxvalue="100" should indicate the max value (100%)

## Keyboard Shortcuts

-   No Keyboard

## Responsive Guidelines

-   Will size to parent container

## Upgrading from 3.X

-   Much simpler API then before.
-   Instead of calling inforProgressIndicator, simply pace the noted structure in the dom.
-   Set the data-value attribute and trigger updated to update.
-   Now required to insert the elements in the dom
