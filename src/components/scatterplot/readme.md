---
title: Scatter Plot Chart
description: null
demo:
  embedded:
  - name: Standard Scatter Plot Chart
    slug: example-index
  pages:
  - name: Defaulting a selected plot item
    slug: example-selected
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

A scatter plot (also called a scatterplot, scatter graph, scatter chart, scattergram, or scatter diagram) is a type of plot or mathematical diagram using Cartesian coordinates to display values for typically two variables for a set of data.

See the [line chart api](./line) for more details as some settings are similar.

## Code Example

This example shows how to invoke a scatter chart. The data for the scatter chart should be 2 dimensional. You pass and x and y value which controls the location. You may need to transform your data to use this approach. You should initialize the chart with `type: 'scatterplot'`

```javascript
var dataset = [{
  data: [{
    name: 'January',
    value: {
      x: 5,
      y: 3
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-jan' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-jan' }
   ]
  }, {
    name: 'February',
    value: {
      x: 37,
      y: 5
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-feb' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-feb' }
   ]
  }, {
    name: 'March',
    value: {
      x: 10,
      y: 5.3
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-mar' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-mar' }
   ]
  }, {
    name: 'April',
    value: {
      x: 80,
      y: 6
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-apr' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-apr' }
   ]
  }, {
    name: 'May',
    value: {
      x: 21,
      y: 4.8
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-may' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-may' }
   ]
  }, {
    name: 'June',
    value: {
      x: 72,
      y: 5.2
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-jun' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-jun' }
   ]
  }, {
    name: 'July',
    value: {
      x: 26,
      y: 8
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-jul' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-jul' }
   ]
  }, {
    name: 'August',
    value: {
      x: 71,
      y: 3.9
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-aug' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-aug' }
   ]
  }, {
    name: 'September',
    value: {
      x: 85,
      y: 8
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-sep' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-sep' }
   ]
  }, {
    name: 'October',
    value: {
      x: 52,
      y: 3
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-oct' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-oct' }
   ]
  }, {
    name: 'November',
    value: {
      x: 44,
      y: 5.9
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-nov' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-nov' }
   ]
  }, {
    name: 'December',
    value: {
      x: 110,
      y: 7
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-dec' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-dec' }
   ]
  }],
  name: 'Series 01',
  labels: {
    name: 'Month',
    value: {
      x: 'Revenue',
      y: 'Sold',
      z: 'Market Share'
    }
  },
  valueFormatterString: {
    z: '0.0%'
  },
  attributes: [
   { name: 'id', value: 'scatterplot-series1' },
   { name: 'data-automation-id', value: 'automation-id-scatterplot-series1' }
 ]
},
{
  data: [{
    name: 'January',
    value: {
      x: 9,
      y: 3.2
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-jan' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-jan' }
   ]
  }, {
    name: 'February',
    value: {
      x: 12,
      y: 6.3
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-feb' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-feb' }
   ]
  }, {
    name: 'March',
    value: {
      x: 65,
      y: 4
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-mar' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-mar' }
   ]
  }, {
    name: 'April',
    value: {
      x: 27,
      y: 7
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-apr' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-apr' }
   ]
  }, {
    name: 'May',
    value: {
      x: 29,
      y: 8.5
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-may' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-may' }
   ]
  }, {
    name: 'June',
    value: {
      x: 81,
      y: 3.9
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-jun' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-jun' }
   ]
  }, {
    name: 'July',
    value: {
      x: 33,
      y: 4.1
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-jul' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-jul' }
   ]
  }, {
    name: 'August',
    value: {
      x: 75,
      y: 4
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-aug' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-aug' }
   ]
  }, {
    name: 'September',
    value: {
      x: 39,
      y: 7
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-sep' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-sep' }
   ]
  }, {
    name: 'October',
    value: {
      x: 80,
      y: 2
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-oct' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-oct' }
   ]
  }, {
    name: 'November',
    value: {
      x: 48,
      y: 6.2
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-nov' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-nov' }
   ]
  }, {
    name: 'December',
    value: {
      x: 99,
      y: 4
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s2-dec' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s2-dec' }
   ]
  }],
  name: 'Series 02',
  attributes: [
   { name: 'id', value: 'scatterplot-series2' },
   { name: 'data-automation-id', value: 'automation-id-scatterplot-series2' }
 ]
}];

$('#line-example').chart({type: 'scatterplot', dataset: dataset});
```

To control the tooltip contents and formatting you can also provide data on the first series.

```javascript
name: 'Series 01',
labels: {
  name: 'Series',
  value: {
    x: 'Revenue',
    y: 'Sold'
  }
},
// Use d3 Format - only value will be formated
valueFormatterString: {
  z: '0.0%'
}
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

You can add custom id's/automation id's to the scatterplot chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [{
    name: 'January',
    value: {
      x: 5,
      y: 3
    },
    attributes: [
     { name: 'id', value: 'scatterplot-s1-jan' },
     { name: 'data-automation-id', value: 'automation-id-scatterplot-s1-jan' }
   ]
  }],
  name: 'Series 01',
  attributes: [
   { name: 'id', value: 'scatterplot-series1' },
   { name: 'data-automation-id', value: 'automation-id-scatterplot-series1' }
 ]
}
```

Providing the data this will add an ID added to the line with `-line` appended and symbol with `-symbol` appended. In addition the related legend item will get the same id with `-legend` appended after it.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The scatter chart is a new component.
