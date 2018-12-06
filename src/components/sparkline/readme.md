---
title: Sparklines
description: null
demo:
  embedded:
  - name: Standard Sparkline Chart
    slug: example-index
  pages:
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Spark Line Chart Types

- `sparkline-dots-n-peak` - Shows dots for each datapoint and highlights the top value as "peak".
- `sparkline-peak` - Shows a continuous line changing at each datapoint and highlights the top value as "peak".
- `sparkline-medianrange-n-peak` - Shows a continuous line changing at each datapoint and highlights the top value as "peak" and adds a median range display.
- `sparkline-minmax` - Shows a continuous line changing at each datapoint and the min and max value.
- `sparkline` - Shows just the line changing at each datapoint.

## Code Example

This example shows how to invoke a simple single line sparkline. Multiple lines can be shown by passing multiple data points.

```javascript
var singleLine = [{
  data: [25, 20, 55, 28, 41, 30, 50, 22, 16, 27],
  name: 'Inventory'
}];

var twoLines = [{
    data: [25, 20, 55, 28, 41, 30, 50, 27, 24, 27],
    name: 'Inventory'
}, {
    data: [40, 30, 40, 16, 50, 17, 15, 39, 15, 18],
    name: 'Demand'
}];

$('#sparkline-chart-example-1').chart({type: 'sparkline-dots-n-peak', dataset: singleLine});
```

## Accessibility

- Alternate information should be available for the screen reader user.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Future

- A datagrid formatter for showing this data in lists

## Keyboard Shortcuts

- None

## Upgrading from 3.X

- This component is new in 4.x
