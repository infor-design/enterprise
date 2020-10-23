---
title: Bar Chart
description: null
demo:
  embedded:
  - name: Standard Bar Chart
    slug: example-index
  pages:
  - name: Example showing how to set Colors
    slug: example-colors
  - name: Example showing handling longer text
    slug: example-long-text
  - name: Example showing with negative values
    slug: example-negative-value
  - name: Set animation speed and occurrence
    slug: test-animation
  - name: Example showing defaulting a selected value
    slug: test-selected
  - name: Example showing Set Selected value
    slug: test-set-selected
  - name: Example showing empty data set notice
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

If the bar chart has longer text it may not fit nicely since the layout is horizontal. To solve this we have the
ability to reduce the size of the bars for the text to work. And as with other charts you can set various sizes of text that will be used as the chart is shown in a smaller width page size. An example of this would be:

```javascript
    name: 'Requirements Exceeding Net Change',
    value: 373,
    abbrName: 'Req ex Net Change',
    shortName: 'RENC'
```

## Select Model

The bar (and all other charts) have a built in selection model. Meaning that you can activate a selection by clicking a bar or bar group. When you do this the `selected` event will fire and you can use that data to update part of the screen or any other actions you want. You can also call `getSelected` method to get the currently selected elements and the `setSelected` to set the selected elements.

## Testability

You can add custom id's/automation id's to the bar chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

 ```js
{
  data: [{
    name: 'Category A',
    value: 373,
    attributes: [
      { name: 'id', value: 'bar-a' },
      { name: 'data-automation-id', value: 'automation-id-bar-a' }
      ]
  }]
}
```

Providing the data this will add an ID added to each bar with `-bar` appended.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The bar chart was added in 3.6. From 3.6 the api is mostly compatible.
