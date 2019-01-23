---
title: Area
description: null
demo:
  embedded:
  - name: Main Example
    slug: example-index
  pages:
  - name: Set animation speed
    slug: test-animation
  - name: Show an empty message when there is no data
    slug: test-empty
---

The area chart is a line chart with the isArea set that adds the fills. See the [line chart api]( ../line) for more details.

## Code Example

This example shows how to invoke the area chart option using the charts component. In this example
we pass a dataset with x and y axis values to make three lines.

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

$('#area-example').chart({type: 'area', dataset: dataset});
```

## Axis Formatting

- You can customize and round values on the y axis by setting the `formatterString` option. This uses the d3-format syntax which is documented on the [d3-format api page.](https://github.com/d3/d3-format#api-reference). As an example you can use this pattern to round the tooltip values to currency with 2 decimals.

```javascript
formatterString: '$,.2f'
```

## Selection Model

- You can initially mark a dot on the chart as selected by passing selected: true in the dataset element.

```javascript
{
  name: 'Mar',
  value: 14,
  selected: true
}
```

- You can use the `getSelected` method to get the currently selected line.
- You can use the `setSelected` method to set the current selected line. For this function you can pass in options such as groupIndex, fieldName and fieldValue to find the associated values.

```javascript
let options = {
    groupIndex: 0,
    fieldName: 'name',
    fieldValue: 'Feb'
};
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

```javascript
color: '#1a1a1a'
name: 'Component C'
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the area the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The area chart was added after version 3.X
