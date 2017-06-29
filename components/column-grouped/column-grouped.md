
# Column Chart (Grouped)  [Learn More](#)

## Configuration Options

1. Example Grouped Column Chart [View Example]( /components/column-grouped/example-index)
2. Default a Selected Group [View Example]( /components/column-grouped/example-selected)
3. Handle Negative Values [View Example]( /components/column-grouped/example-negative-value)

## Code Example

This example shows how to invoke the grouped bar chart in the charts component. We pass a dataset data points for each bar group we want to show.
```javascript

var dataset = [{
  data: [{
      name: 'Jan',
      value: 12
  }, {
      name: 'Feb',
      value: 11
  }],
  name: 'Component A'
}, {
  data: [{
      name: 'Jan',
      value: 22
  }, {
      name: 'Feb',
      value: 21
  }],
  name: 'Component B'
}];

$('#column-grouped-example').chart({type: 'column-grouped', dataset: dataset});


```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.


## Code Tips

- You can override the tooltip by passing in a specific tooltip text value.


## Keyboard Shortcuts

-   **Tab:** You can tab into the chart area and through the legend values as each has a focus state.
-   **Enter/Space:** Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The area chart was added in 3.6. From 3.6 the api is compatible.
