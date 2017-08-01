
# Sparklines  [Learn More](#)

## Configuration Options

1. Sparklines Main Example [View Example]( ../components/sparkline/example-index)

## API Details

### Dataset Settings

* `data` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - An array of data to structure the sparklines.
* `name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - The name of the data used in the accessibility label and tooltip.

### Spark Line Types

* `sparkline-dots-n-peak` - Shows dots for each datapoint and highlights the top value as "peak".
* `sparkline-peak` - Shows a continuous line changing at each datapoint and highlights the top value as "peak".
* `sparkline-medianrange-n-peak` - Shows a continuous line changing at each datapoint and highlights the top value as "peak" and adds a median range display.
* `sparkline-minmax` - Shows a continuous line changing at each datapoint and the min and max value.
* `sparkline` - Shows just the line changing at each datapoint.

## Code Example

This example shows how to invoke a simple single line sparkline. Multiple lines can be shown by passing multiple data points.

```javascript

var singleLine = [{
  data: [25, 20, 55, 28, 41, 30, 50, 22, 16, 27],
  name: 'Inventory'
}];

var twoLines = [{
    data: [25, 20, 55, 28, 41, 30, 50, 27, 24, 27],
    name: 'Inventory'
}, {
    data: [40, 30, 40, 16, 50, 17, 15, 39, 15, 18],
    name: 'Demand'
}];

$('#sparkline-chart-example-1').chart({type: 'sparkline-dots-n-peak', dataset: singleLine});


```

## Accessibility

- Alternate information should be available for the screen reader user.

## Future

- A datagrid formatter for showing this data in lists


## Keyboard Shortcuts

-  None

## Upgrading from 3.X

-  This component is new in 4.x
