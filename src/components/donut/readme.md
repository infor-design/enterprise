---
title: Donut Chart
description: null
demo:
  embedded:
  - name: Standard Donut Chart
    slug: example-index
  pages:
  - name: Showing Slices as Alerts
    slug: example-alerts
  - name: With a Right Click Menu
    slug: example-rightclick
  - name: Longer and Zero Labels
    slug: example-values
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Settings

See the [Pie API](./pie) as this is just a pie setting.

## Code Example

This example shows how to invoke a dount bar chart with a dataset controlling the values.

```javascript
  var donutData = [{
    data: [{
        name: 'Component A',
        value: 30
    }, {
        name: 'Component B',
        value: 40
    }],
    centerLabel: 'Donut Chart'
  }];

  $('#pie-donut-example').chart({type: 'donut', dataset: donutData}).on('selected', function (e, elem, args) {
    console.log(e, elem, args);
  });
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Code Tips

You can control the size of the donut chart by setting the size of the parent element the donut lives in.
This may include possibly using an inset margin in some cases.

See also pie chart

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

None

## Upgrading from 3.X

- The donut chart was added in 3.6. From 3.6 the api is mostly compatible.
