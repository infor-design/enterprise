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

See the [line chart api]( ../line) for more details as some settings are similar.

## Code Example

This example shows how to invoke a scatter chart. The data for the scatter chart should be 2 dimensional. You pass and x and y value which controls the location. You may need to transform your data to use this approach. You should initialize the chart with `type: 'scatterplot'`

```javascript
var dataset = [{
  data: [{
    name: 'January',
    value: {
      x: 5,
      y: 3
    }
  }, {
    name: 'February',
    value: {
      x: 37,
      y: 5
    }
  }, {
    name: 'March',
    value: {
      x: 10,
      y: 5.3
    }
  }, {
    name: 'April',
    value: {
      x: 80,
      y: 6
    }
  }, {
    name: 'May',
    value: {
      x: 21,
      y: 4.8
    }
  }, {
    name: 'June',
    value: {
      x: 72,
      y: 5.2
    }
  }, {
    name: 'July',
    value: {
      x: 26,
      y: 8
    }
  }, {
    name: 'August',
    value: {
      x: 71,
      y: 3.9
    }
  }, {
    name: 'September',
    value: {
      x: 85,
      y: 8
    }
  }, {
    name: 'October',
    value: {
      x: 52,
      y: 3
    }
  }, {
    name: 'November',
    value: {
      x: 44,
      y: 5.9
    }
  }, {
    name: 'December',
    value: {
      x: 110,
      y: 7
    }
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
  }
},
{
  data: [{
    name: 'January',
    value: {
      x: 9,
      y: 3.2
    }
  }, {
    name: 'February',
    value: {
      x: 12,
      y: 6.3
    }
  }, {
    name: 'March',
    value: {
      x: 65,
      y: 4
    }
  }, {
    name: 'April',
    value: {
      x: 27,
      y: 7
    }
  }, {
    name: 'May',
    value: {
      x: 29,
      y: 8.5
    }
  }, {
    name: 'June',
    value: {
      x: 81,
      y: 3.9
    }
  }, {
    name: 'July',
    value: {
      x: 33,
      y: 4.1
    }
  }, {
    name: 'August',
    value: {
      x: 75,
      y: 4
    }
  }, {
    name: 'September',
    value: {
      x: 39,
      y: 7
    }
  }, {
    name: 'October',
    value: {
      x: 80,
      y: 2
    }
  }, {
    name: 'November',
    value: {
      x: 48,
      y: 6.2
    }
  }, {
    name: 'December',
    value: {
      x: 99,
      y: 4
    }
  }],
  name: 'Series 02'
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

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The scatter chart is a new component.
