---
title: Pie Chart
description: null
demo:
  embedded:
  - name: Standard Pie Chart
    slug: example-index
  pages:
  - name: HCM Example
    slug: example-hcm
  - name: Tooltips
    slug: example-tooltip
  - name: Donut Chart
    slug: example-donut
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Code Example

This example shows how to invoke a pie bar chart with a dataset controlling the values.

```javascript
  var pieData = [{
      data: [{
          name: 'Component A',
          value: 10.1,
          id: 'A',
          attributes: [
            { name: 'id', value: 'item-a' },
            { name: 'data-automation-id', value: 'item-a-automation-id' }
          ],
          tooltip: 'Component A <b>{{percent}}</b>'
      }, {
          name: 'Component B',
          value: 12.2,
          id: 'B',
          attributes: [
            { name: 'id', value: 'item-a' },
            { name: 'data-automation-id', value: 'item-a-automation-id' }
          ],
          tooltip: 'Component B <b>{{percent}}</b>'
      }, {
          name: 'Component C',
          value: 14.35,
          id: 'C',
          attributes: [
            { name: 'id', value: 'item-a' },
            { name: 'data-automation-id', value: 'item-a-automation-id' }
          ],
          tooltip: 'Component C Is Very Cool<b>{{percent}}</b>'
      }]
    }];

  $('#pie-chart-example').chart({type: 'pie', dataset: pieData});

```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors.

## Code Tips

You can control the size of the donut chart by setting the size of the parent element the pie chart lives in.
This may include possibly using an inset margin in some cases.

See also [Donut Chart Example](./demo/components/donut/example-index?font=source-sans).

## Testability

You can add custom id's/automation id's to the pie chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
    name: 'Item E',
    value: 21.6,
    id: 'item-e',
    attributes: [
        { name: 'id', value: 'item-c' },
        { name: 'data-automation-id', value: 'item-e-automation-id' }
    ],
    tooltip: 'Item E <b>{{percent}}</b>'
}
```

Providing the data this will add an ID added to the pie slice. In addition the related legend item will get the same id with `-legend` appended after it.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Longpress</kbd> Show tooltip on touch devices.

## Upgrading from 3.X

- The pie chart and dount chart was added in 3.6; so 3.6 the api is mostly compatible.
