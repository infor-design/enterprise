---
title: Bullet Chart
description: null
demo:
  embedded:
  - name: Standard Bullet Chart
    slug: example-index
  pages:
  - name: Shows Grouping a Series of Related Bullet Charts
    slug: example-data-group
  - name: Shows a Bullet Chart with Positive and Negative Values
    slug: example-selected
  - name: Shows a bullet with a negative value
    slug: example-negative-value
  - name: Set animation speed
    slug: example-animation
---

## Code Example

This example shows how to invoke the bullet chart as part of the charts component. We pass a dataset data points for each bar group we want to show.

```javascript
var dataset1 = [{
    data: [
      {'title': 'Revenue','subtitle': 'US$, in thousands','ranges': [150, 225, 300, 400, 600], 'measures': [220,270], 'markers': [250],
        tooltip: ['<b>Poor</b> 150', '<b>Ok</b> 225', '<b>Good</b> 300', '<b>Excellent</b> 400', '<b>Revenue</b> 600']}
    ],
    barColors: ['#C0EDE3', '#8ED1C6', '#69ADA3', '#448D83', '#206B62'],
    lineColors: ['#000000', '#000000', '#000000'],
    markerColors: ['#000000']
  }];

$('#bullet-example1').chart({type: 'bullet', dataset: dataset1});
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

Not Applicable

## Upgrading from 3.X

- This visualization did not exist in 3.X
