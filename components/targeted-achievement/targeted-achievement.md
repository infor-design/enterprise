
# Targeted Achievement Chart  [Learn More](#)

## Configuration Options

1. Main Target to Achievement Example showing 3 examples [View Example]( ../components/targeted-achievement/example-index)
2. Grid Example, this chart is available as a formatter.  [View Example]( ../components/datagrid/test-targeted-achievement.html)
3. Example showing Percent Text [View Example]( ../components/targeted-achievement/example-percent-text)

## API Details

### Dataset Settings

* name - Applies a name label to the left most section of the chart.
* completed - Gives a label, value, color and format to the completed bar of the chart.
* remaining - (optional) shows a hatched section that shows the remaining bit to a set target
* total - will be used on the top of the chart if applied. The total is used to set the total.
## Code Example

This example shows how to invoke a simple target to achievement chart with a dataset with a value several of the key points of the chart.

```javascript

var dataset1 = [{
  data: [{
    name: {text: 'Label A'},
    completed: {text: '50K of 250K', value: 50000, format: '.2s', color: 'primary'},
    remaining: {value: 20000, format: '.2s', text: ' To Target'},
    total: {value: 250000, format: '.2s'},
  }]
}];

var api1 = $('#example-1').chart({dataset: dataset1, type: 'targeted-achievement'}).data('chart');


```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Keyboard Shortcuts

- None

## Upgrading from 3.X

- This is a new element
