---
title: Bar Chart (Grouped)  
description: This page describes Bar Chart (Grouped).
---

## Configuration Options

1. Grouped bar chart example [View Example]( ../components/bar-grouped/example-index)
2. Default a selected Group [View Example]( ../components/bar-grouped/example-selected)
3. Handle Negative Values [View Example]( ../components/bar-grouped/example-negative)
4. Adapts to handle a large number of groups [View Example]( ../components/bar-grouped/test-many-groups)
4. Set animation speed [View Example]( ../components/bar-grouped/example-animation)
6. Example showing Get Selected value [View Example]( ../components/bar-grouped/example-get-selected)
7. Example showing Set Selected value [View Example]( ../components/bar-grouped/example-set-selected)

## Code Example

This example shows how to invoke the grouped bar chart in the charts component. We pass a dataset data points for each bar group we want to show.
```javascript
var dataset = [{
      data: [{
          name: 'Jan',
          value: 12,
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
    }, {
      data: [{
          name: 'Jan',
          value: 32
      }, {
          name: 'Feb',
          value: 31
      }],
      name: 'Component C'
    }];

$('#bar-grouped-example').chart({type: 'bar-grouped', dataset: dataset});
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
{type: 'bar-grouped', dataset: dataset, tooltip: 'Tooltip by attribute'}
```

Or if you have more dynamic requirements you can do this with an ajax callback.

```javascript
$('#bar-grouped-example').chart({type: 'bar-grouped', dataset: dataset,
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

-   The area chart was added in 3.6. From 3.6 the api is compatible.
