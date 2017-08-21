
# Bubble Chart  [Learn More](#)

## Configuration Options

1. Bubble Chart Example [View Example]( ../components/bubble/example-index)
2. Defaulting a selected bubble [View Example]( ../components/bubble/example-selected)
3. Set animation speed [View Example]( ../components/bubble/example-animation)
4. Example showing Get Selected value [View Example]( ../components/bubble/example-get-selected)
5. Example showing Set Selected value [View Example]( ../components/bubble/example-set-selected)

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

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.


## Keyboard Shortcuts

-   **Tab:** You can tab into the chart area and through the legend values as each has a focus state.
-   **Enter/Space:** Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The bubble chart is a new component.
