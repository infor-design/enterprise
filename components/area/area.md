
# Area Component Implementation Detail [Learn More](#)

## Configuration Options

1. Area Chart Example [View Example]( /components/area/example-index)
2. Make the Tooltip Formatted (Currency) [View Example]( /components/area/example-formatter)
3. Make a slice selected by default [View Example]( /components/area/example-selected)

## Code Example

This example shows how to invoke the area chart option in the charts component. In this example we pass a dataset with x and y axis values for three lines.

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

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing it next to the name fx..

```javascript

color: '#000000'
name: 'Component C'


```

## Code Tips

The about component example by default adds the current years copyright, and useful browser info. This should be useful info for support situations. Don't make your contents of the modal too overloaded with info. Also About dialogs do not need to be overly prominent in your application (for example as a splash screen). The typical placement is in a top level actions button menu item.

## Keyboard Shortcuts

-   **Tab:** You can tab into the chart area and through the legend values as each has a focus state.
-   **Enter/Space:** Will select the area the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The area chart was added after version 3.X
