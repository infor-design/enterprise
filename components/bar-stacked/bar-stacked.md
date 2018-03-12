---
title: Bar Chart (Stacked)
description: This page describes Bar Chart (Stacked).
---

## Configuration Options

1. Stacked bar chart example [View Example]( ../components/bar-stacked/example-index)
2. 100% Stacked Bar Chart [View Example]( ../components/bar-stacked/example-stacked-100)
3. Changing Bar Colors [View Example]( ../components/bar-stacked/example-stacked-colors)
4. Formatting Tooltip Data [View Example]( ../components/bar-stacked/example-stacked-formatter-string)
5. Patterns [View Example]( ../components/bar-stacked/example-stacked-patterns)
6. Set animation speed [View Example]( ../components/bar-stacked/example-animation)
7. Defaulting Selected [View Example]( ../components/bar-stacked/example-stacked-selected)
8. Example showing Get Selected value [View Example]( ../components/bar-stacked/example-get-selected)
9. Example showing Set Selected value [View Example]( ../components/bar-stacked/example-set-selected)

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
