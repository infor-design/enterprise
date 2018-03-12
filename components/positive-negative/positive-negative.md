---
title: Positive-Negative Chart
description: This page describes Positive-Negative Chart.
---

## Configuration Options

1. Positive / Negative Example [View Example]( ../components/positive-negative/example-index)
2. Example showing color patterns [View Example]( ../components/positive-negative/example-patterns)
3. Set animation speed [View Example]( ../components/positive-negative/example-animation)
4. Example showing Get Selected value [View Example]( ../components/positive-negative/example-get-selected)
5. Example showing Set Selected value [View Example]( ../components/positive-negative/example-set-selected)

## API Details

### Dataset Settings

* `name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - The name to show on the y axis for the bar
* `value` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - The raw data value for the bar.
* `target` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - Compare the value over this target
* `tooltip`**[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**  - The custom tooltip to show.

### Extra Chart Settings

* `formatterString` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - the d3 formatter string to show

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

## Upgrading from 3.X

-   The chart was added in 4.2.5
