---
title: Bar Chart (Grouped)
description: null
demo:
  embedded:
  - name: Standard Grouped Bar Chart
    slug: example-index
  pages:
  - name: Example showing the axis formatter
    slug: example-formatter
  - name: Example showing defaulting a selected value
    slug: test-selected
  - name: Example showing with negative values
    slug: example-negative
  - name: Adapts to handle a several number of groups
    slug: test-many-groups
  - name: Set animation speed
    slug: test-animation
  - name: Example showing Get Selected value
    slug: test-get-selected
  - name: Example showing Set Selected value
    slug: test-set-selected
---

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

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

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

## Select Model

The bar (and all other charts) have a built in selection model. Meaning that you can activate a selection by clicking a bar or bar group. When you do this the `selected` event will fire and you can use that data to update part of the screen or any other actions you want. You can also call `getSelected` method to get the currently selected elements and the `setSelected` to set the selected elements.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The area chart was added in 3.6. From 3.6 the api is compatible.
