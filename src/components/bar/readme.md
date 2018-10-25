---
title: Bar Chart
description: null
demo:
  embedded:
  - name: Standard Bar Chart
    slug: example-index
  pages:
  - name: Example with More Elements and Longer Text
    slug: example-alignment
  - name: Example showing how to set Colors
    slug: example-colors
  - name: Example showing the formatter
    slug: example-formatter
  - name: Example showing the option to hide the formatter
    slug: example-hide-legend
  - name: Example showing an edge case of longer text
    slug: example-long-text
  - name: Example showing with negative values
    slug: example-negative-value
  - name: Set animation speed
    slug: example-animation
  - name: Example showing color patterns
    slug: example-patterns
  - name: Example showing defaulting a selected value
    slug: example-selected
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
  - name: Example showing empty data set
    slug: test-empty
---

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

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The bar chart was added in 3.6. From 3.6 the api is mostly compatible.
