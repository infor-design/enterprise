---
title: Completion Chart
description: null
demo:
  embedded:
  - name: Standard Completion Chart Example
    slug: example-index
  pages:
  - name: All Completion Chart Examples
    slug: example-variations
  - name: Range of Colors for Completion Chart
    slug: example-colors
---

## Configuration Options

Format used the <a href="https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format" target="_blank">D3 formatter (v3)</a>

## Code Example

A completion chart shows completion over a target value. Usually used to show progress as a percentage. Create a div in which to host the chart. To make one create a div to a given width.

```html
<div id="example-2" class="chart-container"></div>
```

Initialize the Completion Chart out of the charts package with `type: 'completion-target'`.
Pass in objects for the sections such as the text , completed area and remaining bar.

```javascript
var dataset1 = [{
  data: [{
    name: {text: 'Available Credit'},
    completed: {text: 'Spent', value: 50000, format: '$,.0f'},
    remaining: {text: 'Pending', value: 10000, format: '$,.0f'},
    total: {value: 95000, format: '$,.0f'},
  }]
}];

$('#example-1').chart({dataset: dataset1, type: 'completion-target'}).data('chart');
```

## Accessibility

Accessibility work is needed on this component.

- An aria label should be added so that with a screen reader the user can get the jest of the display.
- Color along cannot be used as the sole means of displaying status. So with the colors include a text such as: Error, Good ect.

## Testability

You can add custom id's/automation id's to the completion chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
var dataset1 = [{
  data: [{
    name: { text: 'Available Credit' },
    completed: { text: 'Spent', value: 50000, format: '$,.0f' },
    remaining: { text: 'Pending', value: 10000, format: '$,.0f' },
    total: { value: 95000, format: '$,.0f' },
  }],
  attributes: [
    { name: 'id', value: 'completion-chart-example1' },
    { name: 'data-automation-id', value: 'automation-id-completion-chart-example1' }
  ]
}];
```

Providing the data this will add an ID added to each name with `-name`, info-value with `-info-value`, info-text with `-info-text`, completed-bar with `-completed-bar`, completed-value with `-completed-value`, completed-text with `-completed-text`, remaining-bar with `-remaining-bar`, remaining-value with `-remaining-value`, remaining-text with `-remaining-text`, targetline-bar with `-targetline-bar`, targetline-value with `-targetline-value`, targetline-text with `-targetline-text`, total-bar with `-total-bar` and total-value with `-total-value` appended after it.

## Keyboard Shortcuts

- This is a visual only component.

## States and Variations

- None - but a tooltip may be used

## Responsive Guidelines

- Will size to the parent's with

## Upgrading from 3.X

- This did not exist but may be confused with the progress bar in 3.6
