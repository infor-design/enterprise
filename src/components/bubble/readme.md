---
title: Bubble Chart
description: null
demo:
  embedded:
  - name: Standard Bubble Chart
    slug: example-index
  pages:
  - name: Defaulting a selected bubble
    slug: test-selected
  - name: Set animation speed
    slug: test-animation
---

## Configuration Options

The bubble chart is a line chart with `isBubble` set. This adds the bubble and the z dimension in the data. This is based on the [line chart api]( ../line) see see that api for some more details.

## Code Example

This example shows how to invoke a bubble chart. The data for the bubble chart should be 3 dimensional. You pass and x and y value and a depth (z) which controls the bubbles size on the x and y axis. You may need to transform your data to use this approach.

```javascript
var dataset = [{
  data: [{
    name: 'January',
    value: {
      x: 5,
      y: 3,
      z: 3
    }
  }, {
    name: 'February',
    value: {
      x: 37,
      y: 5,
      z: 9
    }
  }, {
    name: 'March',
    value: {
      x: 10,
      y: 5.3,
      z: 4
    }
  }, {
    name: 'April',
    value: {
      x: 80,
      y: 6,
      z: 10
    }
  }, {
    name: 'May',
    value: {
      x: 21,
      y: 4.8,
      z: 4
    }
  }, {
    name: 'June',
    value: {
      x: 72,
      y: 5.2,
      z: 4
    }
  }, {
    name: 'July',
    value: {
      x: 26,
      y: 8,
      z: 6
    }
  }, {
    name: 'August',
    value: {
      x: 71,
      y: 3.9,
      z: 8
    }
  }, {
    name: 'September',
    value: {
      x: 85,
      y: 8,
      z: 2
    }
  }, {
    name: 'October',
    value: {
      x: 52,
      y: 3,
      z: 2
    }
  }, {
    name: 'November',
    value: {
      x: 44,
      y: 5.9,
      z: 3
    }
  }, {
    name: 'December',
    value: {
      x: 110,
      y: 7,
      z: 4
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
      y: 3.2,
      z: 3
    }
  }, {
    name: 'February',
    value: {
      x: 12,
      y: 6.3,
      z: 10
    }
  }, {
    name: 'March',
    value: {
      x: 65,
      y: 4,
      z: 10
    }
  }, {
    name: 'April',
    value: {
      x: 27,
      y: 7,
      z: 2
    }
  }, {
    name: 'May',
    value: {
      x: 29,
      y: 8.5,
      z: 4
    }
  }, {
    name: 'June',
    value: {
      x: 81,
      y: 3.9,
      z: 8
    }
  }, {
    name: 'July',
    value: {
      x: 33,
      y: 4.1,
      z: 7
    }
  }, {
    name: 'August',
    value: {
      x: 75,
      y: 4,
      z: 3
    }
  }, {
    name: 'September',
    value: {
      x: 39,
      y: 7,
      z: 4
    }
  }, {
    name: 'October',
    value: {
      x: 80,
      y: 2,
      z: 3
    }
  }, {
    name: 'November',
    value: {
      x: 48,
      y: 6.2,
      z: 2
    }
  }, {
    name: 'December',
    value: {
      x: 99,
      y: 4,
      z: 2
    }
  }],
  name: 'Series 02'
}];

$('#line-example').chart({type: 'bubble', dataset: dataset});
```

## Axis Formatting

- You can customize and round values on the y axis by setting the `formatterString` option. This uses the d3-format syntax which is documented on the [d3-format api page.](https://github.com/d3/d3-format#api-reference). As an example you can use this pattern to round the tooltip values to currency and to two decimals.

```javascript
formatterString: '$,.2f'
```

- To control the tooltip contents and formatting you can also provide data on the first series.

```javascript
name: 'Series 01',
labels: {
name: 'Series',
value: {
  x: 'Revenue',
  y: 'Sold',
  z: 'Market Share'
}
},
// Use d3 Format - only value will be formatted
valueFormatterString: {
    z: '0.0%'
}
```

## Selection Model

- You can initially mark a dot on the chart as selected by passing `selected: true` in the dataset element.

```javascript
{
    name: 'Mar',
    value: 14,
    selected: true
}
```

- You can also use the `getSelected` method to get the current selected line.
- You can also use the `setSelected` method to set the current selected line. For this function you can pass in options such as `groupIndex`, `fieldName` and `fieldValue` to find the associated values.

```javascript
let options = {
    groupIndex: 0,
    fieldName: 'name',
    fieldValue: 'Feb'
};
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The bubble chart is a new component.
