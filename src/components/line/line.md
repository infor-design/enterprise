---
title: Line
description: This page describes Line.
---

## Configuration Options

1. Line Chart Example [View Example]( ../components/line/example-index)
2. Labels on Axis [View Example]( ../components/line/example-axis-labels)
3. Ticks Adjustment (Less ticks than data points) [View Example]( ../components/line/example-axis-ticks)
4. Customize Tooltip [View Example]( ../components/line/example-custom-tooltip)
5. Customize Dot Size [View Example]( ../components/line/example-custom-dots)
6. Set animation speed [View Example]( ../components/line/example-animation)
7. Rotate Bottom Labels [View Example]( ../components/line/test-rotate)
8. Example showing Get Selected value [View Example]( ../components/line/example-get-selected)
9. Example showing Set Selected value [View Example]( ../components/line/example-set-selected)
10. Example showing two line x axis [View Example]( ../components/line/example-two-lines)

## Code Example

This example shows how to invoke the line chart option in the charts component. In this example we pass a dataset with x and y axis values for three lines.

```javascript
var dataset = [{
  data: [{
      name: 'Jan',
      value: 12
  }, {
      name: 'Feb',
      value: 11
  }, {
      name: 'Mar',
      value: 14
  }, {
      name: 'Apr',
      value: 10
  }, {
      name: 'May',
      value: 14
  }, {
      name: 'Jun',
      value: 8
  }],
  name: 'Component A'
}, {
  data: [{
      name: 'Jan',
      value: 22
  }, {
      name: 'Feb',
      value: 21
  }, {
      name: 'Mar',
      value: 24
  }, {
      name: 'Apr',
      value: 20
  }, {
      name: 'May',
      value: 24
  }, {
      name: 'Jun',
      value: 28
  }],
  name: 'Component B'
}, {
  data: [{
      name: 'Jan',
      value: 32
  }, {
      name: 'Feb',
      value: 31
  }, {
      name: 'Mar',
      value: 34
  }, {
      name: 'Apr',
      value: 30
  }, {
      name: 'May',
      value: 34
  }, {
      name: 'Jun',
      value: 38
  }],
  name: 'Component C'
}];

$('#area-example').chart({type: 'line', dataset: dataset});
```

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the area the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The line chart was added after version 3.6
