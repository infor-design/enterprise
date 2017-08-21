
# Column Chart (Stacked)  [Learn More](#)

## Configuration Options

1. Stacked Column Chart Example [View Example]( ../components/column-stacked/example-index)
2. Defaulting Selected Stacks [View Example]( ../components/column-stacked/example-selected)
3. Single Column Chart [View Example]( ../components/column-stacked/example-singular)
3. Set Animation Type [View Example]( ../components/column-stacked/example-animation)
4. Example showing Get Selected value [View Example]( ../components/column-stacked/example-get-selected)
5. Example showing Singular Get Selected value [View Example]( ../components/column-stacked/example-singular-get-selected)
6. Example showing Set Selected value [View Example]( ../components/column-stacked/example-set-selected)
7. Example showing Singular Set Selected value [View Example]( ../components/column-stacked/example-singular-set-selected)

## API Details

### Dataset Settings

* name (data point) - this value will be used to stack/group the similar data points
* name (data set) - this value will be on the axis
* tooltip - the custom tooltip. you can pass {{value}} to have the formatted value inserted
* value - the value to use across all lines to domain the axis
* selected - if true this band will be marked as selected. you may need to set this on each element in the series in the same position.

## Code Example

This example shows how to invoke the grouped bar chart in the charts component. We pass a dataset data points for each bar group we want to show.
```javascript

var dataset = [{
    data: [{
        name: '2008',
        value: 123
    }, {
        name: '2009',
        value: 234
    }, {
        name: '2010',
        value: 345,
    }],
    name: 'Series 1'
}, {
    data: [{
        name: '2008',
        value: 235
    }, {
        name: '2009',
        value: 267
    }, {
        name: '2010',
        value: 573
    }],
    name: 'Series 2'
}];

$('#bar-stacked-example').chart({type: 'bar-stacked', dataset: dataset});


```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

```javascript

color: '#1a1a1a'
name: 'Component C'

```

## Code Tips

You can override the tooltip by passing in a specific tooltip text value.

```javascript

{type: 'bar-stacked', dataset: dataset, tooltip: 'Tooltip by attribute'}


```

Or if you have more dynamic requirements you can do this with an ajax callback.

```javascript

$('#bar-grouped-example').chart({type: 'bar-stacked', dataset: dataset,
  tooltip: function(response) {
    //Ajax Call or async op
    setTimeout(function () {
      response('<strong>Tooltips Provide <br> Interesting Information</strong>');
    }, 400);
  }
});


```

## Keyboard Shortcuts

-   **Tab:** You can tab into the chart area and through the legend values as each has a focus state.
-   **Enter/Space:** Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The stacked chart was added in 3.6. From 3.6 the api is compatible.
