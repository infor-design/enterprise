---
title: Line
description: null
demo:
  embedded:
  - name: Standard Line Chart
    slug: example-index
  pages:
  - name: Labels on Axis
    slug: example-axis-labels
  - name: Ticks Adjustment (Less ticks than data points)
    slug: example-axis-ticks
  - name: Customize Tooltip
    slug: example-custom-tooltip
  - name: Customize Dot Size
    slug: example-custom-dots
  - name: Rotate Bottom Labels
    slug: test-rotate
  - name: Example showing two line x axis
    slug: example-two-lines
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Code Example

This example shows how to invoke the line chart option in the charts component. In this example we pass a dataset with x and y axis values for three lines.

```javascript
var dataset = [{
  data: [{
      name: 'Jan',
      value: 12,
      attributes: [
       { name: 'id', value: 'line-a-jan' },
       { name: 'data-automation-id', value: 'automation-id-line-a-jan' }
     ]
  }, {
      name: 'Feb',
      value: 11,
      attributes: [
       { name: 'id', value: 'line-a-feb' },
       { name: 'data-automation-id', value: 'automation-id-line-a-feb' }
     ]
  }, {
      name: 'Mar',
      value: 14,
      attributes: [
       { name: 'id', value: 'line-a-mar' },
       { name: 'data-automation-id', value: 'automation-id-line-a-mar' }
     ]
  }, {
      name: 'Apr',
      value: 10,
      attributes: [
       { name: 'id', value: 'line-a-apr' },
       { name: 'data-automation-id', value: 'automation-id-line-a-apr' }
     ]
  }, {
      name: 'May',
      value: 14,
      attributes: [
       { name: 'id', value: 'line-a-may' },
       { name: 'data-automation-id', value: 'automation-id-line-a-may' }
     ]
  }, {
      name: 'Jun',
      value: 8,
      attributes: [
       { name: 'id', value: 'line-a-jun' },
       { name: 'data-automation-id', value: 'automation-id-line-a-jun' }
     ]
  }],
  name: 'Component A',
  attributes: [
   { name: 'id', value: 'line-comp-a' },
   { name: 'data-automation-id', value: 'automation-id-line-comp-a' }
 ]
}, {
  data: [{
      name: 'Jan',
      value: 22,
      attributes: [
       { name: 'id', value: 'line-b-jan' },
       { name: 'data-automation-id', value: 'automation-id-line-b-jan' }
     ]
  }, {
      name: 'Feb',
      value: 21,
      attributes: [
       { name: 'id', value: 'line-b-feb' },
       { name: 'data-automation-id', value: 'automation-id-line-b-feb' }
     ]
  }, {
      name: 'Mar',
      value: 24,
      attributes: [
       { name: 'id', value: 'line-b-mar' },
       { name: 'data-automation-id', value: 'automation-id-line-b-mar' }
     ]
  }, {
      name: 'Apr',
      value: 20,
      attributes: [
       { name: 'id', value: 'line-b-apr' },
       { name: 'data-automation-id', value: 'automation-id-line-b-apr' }
     ]
  }, {
      name: 'May',
      value: 24,
      attributes: [
       { name: 'id', value: 'line-b-may' },
       { name: 'data-automation-id', value: 'automation-id-line-b-may' }
     ]
  }, {
      name: 'Jun',
      value: 28,
      attributes: [
       { name: 'id', value: 'line-b-jun' },
       { name: 'data-automation-id', value: 'automation-id-line-b-jun' }
     ]
  }],
  name: 'Component B',
  attributes: [
   { name: 'id', value: 'line-comp-b' },
   { name: 'data-automation-id', value: 'automation-id-line-comp-b' }
 ]
}, {
  data: [{
      name: 'Jan',
      value: 32,
      attributes: [
       { name: 'id', value: 'line-c-jan' },
       { name: 'data-automation-id', value: 'automation-id-line-c-jan' }
     ]
  }, {
      name: 'Feb',
      value: 31,
      attributes: [
       { name: 'id', value: 'line-c-feb' },
       { name: 'data-automation-id', value: 'automation-id-line-c-feb' }
     ]
  }, {
      name: 'Mar',
      value: 34,
      attributes: [
       { name: 'id', value: 'line-c-mar' },
       { name: 'data-automation-id', value: 'automation-id-line-c-mar' }
     ]
  }, {
      name: 'Apr',
      value: 30,
      attributes: [
       { name: 'id', value: 'line-c-apr' },
       { name: 'data-automation-id', value: 'automation-id-line-c-apr' }
     ]
  }, {
      name: 'May',
      value: 34,
      attributes: [
       { name: 'id', value: 'line-c-may' },
       { name: 'data-automation-id', value: 'automation-id-line-c-may' }
     ]
  }, {
      name: 'Jun',
      value: 38,
      attributes: [
       { name: 'id', value: 'line-c-jun' },
       { name: 'data-automation-id', value: 'automation-id-line-c-jun' }
     ]
  }],
  name: 'Component C',
  attributes: [
   { name: 'id', value: 'line-comp-c' },
   { name: 'data-automation-id', value: 'automation-id-line-comp-c' }
 ]
}];

$('#area-example').chart({type: 'line', dataset: dataset});
```

## Testability

You can add custom id's/automation id's to the line chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [{
      name: 'Jan',
      value: 12,
      attributes: [
       { name: 'id', value: 'line-a-jan' },
       { name: 'data-automation-id', value: 'automation-id-line-a-jan' }
     ]
  }],
  name: 'Component A',
  attributes: [
   { name: 'id', value: 'line-comp-a' },
   { name: 'data-automation-id', value: 'automation-id-line-comp-a' }
 ]
}
```

Providing the data this will add an ID added to the line with `-line` appended and dot with `-dot` appended. In addition the related legend item will get the same id with `-legend` appended after it.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the area the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The line chart was added after version 3.6
