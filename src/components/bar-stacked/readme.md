---
title: Bar Chart (Stacked)
description: null
demo:
  embedded:
  - name: Standard Stacked Bar Chart
    slug: example-index
  pages:
  - name: 100% Stacked Bar Chart
    slug: example-stacked-100
  - name: Colors
    slug: example-stacked-colors
  - name: Patterns
    slug: example-stacked-patterns
  - name: Formatting Tooltip Data
    slug: example-stacked-formatter-string
  - name: Set animation speed
    slug: test-animation
  - name: Example showing defaulting a selected value
    slug: test-stacked-selected
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

## Select Model

The bar (and all other charts) have a built in selection model. Meaning that you can activate a selection by clicking a bar or bar group. When you do this the `selected` event will fire and you can use that data to update part of the screen or any other actions you want. You can also call `getSelected` method to get the currently selected elements and the `setSelected` to set the selected elements.

## Testability

You can add custom id's/automation id's to the bar stacked chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

 ```js
{
  data: [{
    name: '2008',
    value: 123,
    attributes: [
      { name: 'id', value: 'barstacked-s1-2008' },
      { name: 'data-automation-id', value: 'automation-id-barstacked-s1-2008' }
    ]
  }],
  name: 'Series 1',
  attributes: [
    { name: 'id', value: 'barstacked-series1' },
    { name: 'data-automation-id', value: 'automation-id-barstacked-series1' }
  ]
}
```

Providing the data this will add an ID added to each bar. In addition the related legend item will get the same id with `-legend` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The stacked chart was added in 3.6. From 3.6 the api is compatible.
