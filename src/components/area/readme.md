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
      value: 12,
      attributes: [
       { name: 'id', value: 'area-a-jan' },
       { name: 'data-automation-id', value: 'automation-id-area-a-jan' }
     ]
  }, {
      name: 'Feb',
      value: 11,
      attributes: [
       { name: 'id', value: 'area-a-feb' },
       { name: 'data-automation-id', value: 'automation-id-area-a-feb' }
     ]
  }, {
      name: 'Mar',
      value: 14,
      attributes: [
       { name: 'id', value: 'area-a-mar' },
       { name: 'data-automation-id', value: 'automation-id-area-a-mar' }
     ]
  }, {
      name: 'Apr',
      value: 10,
      attributes: [
       { name: 'id', value: 'area-a-apr' },
       { name: 'data-automation-id', value: 'automation-id-area-a-apr' }
     ]
  }, {
      name: 'May',
      value: 14,
      attributes: [
       { name: 'id', value: 'area-a-may' },
       { name: 'data-automation-id', value: 'automation-id-area-a-may' }
     ]
  }, {
      name: 'Jun',
      value: 8,
      attributes: [
       { name: 'id', value: 'area-a-jun' },
       { name: 'data-automation-id', value: 'automation-id-area-a-jun' }
     ]
  }],
  name: 'Component A',
  attributes: [
   { name: 'id', value: 'area-comp-a' },
   { name: 'data-automation-id', value: 'automation-id-area-comp-a' }
 ]
}, {
  data: [{
      name: 'Jan',
      value: 22,
      attributes: [
       { name: 'id', value: 'area-b-jan' },
       { name: 'data-automation-id', value: 'automation-id-area-b-jan' }
     ]
  }, {
      name: 'Feb',
      value: 21,
      attributes: [
       { name: 'id', value: 'area-b-feb' },
       { name: 'data-automation-id', value: 'automation-id-area-b-feb' }
     ]
  }, {
      name: 'Mar',
      value: 24,
      attributes: [
       { name: 'id', value: 'area-b-mar' },
       { name: 'data-automation-id', value: 'automation-id-area-b-mar' }
     ]
  }, {
      name: 'Apr',
      value: 20,
      attributes: [
       { name: 'id', value: 'area-b-apr' },
       { name: 'data-automation-id', value: 'automation-id-area-b-apr' }
     ]
  }, {
      name: 'May',
      value: 24,
      attributes: [
       { name: 'id', value: 'area-b-may' },
       { name: 'data-automation-id', value: 'automation-id-area-b-may' }
     ]
  }, {
      name: 'Jun',
      value: 28,
      attributes: [
       { name: 'id', value: 'area-b-jun' },
       { name: 'data-automation-id', value: 'automation-id-area-b-jun' }
     ]
  }],
  name: 'Component B',
  attributes: [
   { name: 'id', value: 'area-comp-b' },
   { name: 'data-automation-id', value: 'automation-id-area-comp-b' }
 ]
}, {
  data: [{
      name: 'Jan',
      value: 32,
      attributes: [
       { name: 'id', value: 'area-c-jan' },
       { name: 'data-automation-id', value: 'automation-id-area-c-jan' }
     ]
  }, {
      name: 'Feb',
      value: 31,
      attributes: [
       { name: 'id', value: 'area-c-feb' },
       { name: 'data-automation-id', value: 'automation-id-area-c-feb' }
     ]
  }, {
      name: 'Mar',
      value: 34,
      attributes: [
       { name: 'id', value: 'area-c-mar' },
       { name: 'data-automation-id', value: 'automation-id-area-c-mar' }
     ]
  }, {
      name: 'Apr',
      value: 30,
      attributes: [
       { name: 'id', value: 'area-c-apr' },
       { name: 'data-automation-id', value: 'automation-id-area-c-apr' }
     ]
  }, {
      name: 'May',
      value: 34,
      attributes: [
       { name: 'id', value: 'area-c-may' },
       { name: 'data-automation-id', value: 'automation-id-area-c-may' }
     ]
  }, {
      name: 'Jun',
      value: 38,
      attributes: [
       { name: 'id', value: 'area-c-jun' },
       { name: 'data-automation-id', value: 'automation-id-area-c-jun' }
     ]
  }],
  name: 'Component C',
  attributes: [
   { name: 'id', value: 'area-comp-c' },
   { name: 'data-automation-id', value: 'automation-id-area-comp-c' }
 ]
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

You can add custom id's/automation id's to the area chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [{
    name: 'Jan',
    value: 12,
    attributes: [
      { name: 'id', value: 'area-a-jan' },
      { name: 'data-automation-id', value: 'automation-id-area-a-jan' }
    ]
  }],
  name: 'Component A',
  attributes: [
   { name: 'id', value: 'area-comp-a' },
   { name: 'data-automation-id', value: 'automation-id-area-comp-a' }
 ]
}
```

Providing the data this will add an ID added to the area with `-area` appended, line with `-line` appended and dot with `-dot` appended. In addition the related legend item will get the same id with `-legend` appended after it.

 Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the area the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The area chart was added after version 3.X
