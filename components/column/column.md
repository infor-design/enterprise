
# Column Chart  [Learn More](#)

## Configuration Options

1. Column Chart Main Example [View Example]( ../components/column/example-index)
2. Column Chart with Legend [View Example]( ../components/column/example-legend)
3. Balance Widget [View Example]( ../components/column/example-balance)
4. Changing Colors [View Example]( ../components/column/example-colors)
5. Changing the Y Domain [View Example]( ../components/column/example-domain-change)
6. Formatting the Values (Tooltip) [View Example]( ../components/column/example-formatter)
7. Negative Values [View Example]( ../components/column/example-negative-value)
8. Pattern Colors [View Example]( ../components/column/example-patterns)
9. Selecting a Section Colors [View Example]( ../components/column/example-selected)
10. Testing Date Values [View Test]( ../components/column/test-by-date)
11. Example showing get selected value [View Test]( ../components/column/example-get-selected)

## API Details

### Dataset Settings

* name - this value will be on the axis
* shortName - this value will be used if the name wont fit on the axis
* abbrName - this value will be used if the name and shortName wont fit on the axis (fx a phone sized widget)
* tooltip - the custom tooltip. you can pass {{value}} to have the formatted value inserted
* value - the value to use across all lines to domain the axis

## Code Example

This example shows how to invoke a simple column chart with a dataset swith a value for each column. You can pass in a tooltip with a custom value, and also pass in 3 labels that are used at the various break points (L,M, S)

```javascript

var dataset = [{
        data: [{
            name: 'Automotive',
            shortName: 'Auto',
            abbrName: 'A',
            value: 7,
            tooltip: 'Custom Tooltip - {{value}}'
        }, {
            name: 'Distribution',
            shortName: 'Dist',
            abbrName: 'D',
            value: 10
        }, {
            name: 'Equipment',
            shortName: 'Equip',
            abbrName: 'E',
            value: 14
        }, {
            name: 'Fashion',
            shortName: 'Fash',
            abbrName: 'F',
            value: 10
        }, {
            name: 'Food',
            shortName: 'Food',
            abbrName: 'F',
            value: 14
        }, {
            name: 'Healthcare',
            shortName: 'Health',
            abbrName: 'H',
            value: 8
        }, {
            name: 'Other',
            shortName: 'Other',
            abbrName: 'O',
            value: 7
        }]
      }];

$('#column-bar-example').chart({type: 'column', dataset: dataset});


```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.


## Keyboard Shortcuts

-   **Tab:** You can tab into the chart area and through the legend values as each has a focus state.
-   **Enter/Space:** Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The bar chart was added in 3.6. From 3.6 the api is mostly compatible.
