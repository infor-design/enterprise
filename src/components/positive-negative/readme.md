---
title: Positive-Negative Chart
description: null
demo:
  embedded:
  - name: Standard Positive/Negative Chart
    slug: example-index
  pages:
  - name: Example showing color patterns
    slug: example-patterns
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Settings and Configuration

### Dataset Settings

- `name` <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String" target="_blank">String</a> - The name to show on the y axis for the bar
- `value` <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number" target="_blank">Number</a> - The raw data value for the bar.
- `target` <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number" target="_blank">Number</a> - Compare the value over this target
- `tooltip`<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String" target="_blank">String</a>  - The custom tooltip to show.

### Extra Chart Settings

- `formatterString` <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String" target="_blank">String</a> - the d3 formatter string to show

## Code Example

This example shows how to invoke a simple positive-negative chart with a dataset controlling the values.

```javascript
var dataset = [{
  data: [{
      name: 'Jan',
      value: 4000,
      target: 13000
  }, {
      name: 'Feb',
      value: 9000,
      target: 11000
  }, {
      name: 'Mar',
      value: 2000,
      target: 7000
  }, {
      name: 'Apr',
      value: 4000,
      target: 8000
  }, {
      name: 'May',
      value: 2000,
      target: 14000
  }, {
      name: 'Jun',
      value: 4000,
      target: 9000
  }, {
      name: 'Jul',
      value: -8000,
      target: 12000
  }, {
      name: 'AUG',
      value: -6000,
      target: 5000
  }, {
      name: 'SEP',
      value: -1000,
      target: 7000
  }, {
      name: 'OCT',
      value: -12000,
      target: 13000
  }, {
      name: 'NOV',
      value: -7000,
      target: 6000
  }, {
      name: 'DEC',
      value: -3000,
      target: 7000
  }],
  legends: {
    target: 'Revenue',
    positive: 'Profit',
    negative: 'Loss'
  },
  colors: {
    target: 'neutral',
    positive: 'good',
    negative: 'error'
  }
}];

$('#positive-negative-example').chart({
  type: 'column-positive-negative',
  dataset: dataset,
  formatterString: 's'
})
.on('selected', function (e, bar, d, i, selectedBars) {
  console.log(e, bar, d, i, selectedBars);
});

```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

You can add custom id's/automation id's to the positive-negative chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [{
    name: 'Jan',
    value: 4000,
    target: 13000,
    attributes: [
      { name: 'id', value: 'positive-negative-jan' },
      { name: 'data-automation-id', value: 'automation-id-positive-negative-jan' }
    ]
  }],
  legends: {
    target: 'Revenue',
    positive: 'Profit',
    negative: 'Loss'
  },
  colors: {
    target: 'neutral',
    positive: 'good',
    negative: 'error'
  },
  attributes: {
    target: [
      { name: 'id', value: 'positive-negative-revenue' },
      { name: 'data-automation-id', value: 'automation-id-positive-negative-revenue' }
    ],
    positive: [
      { name: 'id', value: 'positive-negative-profit' },
      { name: 'data-automation-id', value: 'automation-id-positive-negative-profit' }
    ],
    negative: [
      { name: 'id', value: 'positive-negative-loss' },
      { name: 'data-automation-id', value: 'automation-id-positive-negative-loss' }
    ]
  }
}
```

Providing the data this will add an ID added to each bar with `-bar` appended, each target-bar with `-target-bar` appended. In addition the related legend item will get the same id with `-legend` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Upgrading from 3.X

- The chart was added in 4.2.5
