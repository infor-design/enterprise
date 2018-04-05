---
title: Bar Chart
description: This page describes Bar Chart.
---

## Configuration Options

1. Bar Chart Main Example [View Example]( ../components/bar/example-index)
2. Another Example with More Elements and Longer Text [View Example]( ../components/bar/example-alignment)
3. Example showing how to set Colors [View Example]( ../components/bar/example-colors)
4. Example showing the formatter [View Example]( ../components/bar/example-formatter)
5. Example showing the option to hide the formatter [View Example]( ../components/bar/example-hide-legend)
6. Example showing an edge case of longer text [View Example]( ../components/bar/example-long-text)
7. Example showing with negative values [View Example]( ../components/bar/example-negative-value)
8. Set animation speed [View Example]( ../components/bar/example-animation)
9. Example showing color patterns [View Example]( ../components/bar/example-patterns)
10. Example showing defaulting a selected value  [View Example]( ../components/bar/example-selected)
11. Example showing Get Selected value [View Example]( ../components/bar/example-get-selected)
12. Example showing Set Selected value [View Example]( ../components/bar/example-set-selected)
13. Example showing empty data set [View Example]( ../components/bar/test-empty)

## Dataset Settings

* `name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - The name to show on the y axis for the bar
* `value` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - The raw data value for the bar.
* `tooltip`**[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**  - The custom tooltip to show.

### Extra Chart Settings

* `formatterString` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - the d3 formatter string to show
* `showLines` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Hide the lines going north south across the x axis
* `useLogScale` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Use a logarithmic scale on the x axis. This can be used for skewed data.

## Code Example

This example shows how to invoke a simple bar chart with a dataset controlling the values.

```javascript
 var dataset = [{
      data: [{
          name: 'Category A',
          value: 373
      }, {
          name: 'Category B',
          value: 372
      }, {
          name: 'Category C',
          value: 236.35
      }],
      name: ''
    }];

  $('#bar-example').chart({type: 'bar', dataset: dataset});

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

-   The bar chart was added in 3.6. From 3.6 the api is mostly compatible.
