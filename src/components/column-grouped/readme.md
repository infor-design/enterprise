---
title: Column Chart (Grouped)
description: null
demo:
  embedded:
  - name: Standard Grouped Column Chart
    slug: example-index
  pages:
  - name: Default a Selected Group
    slug: example-selected
  - name: Handle negative values
    slug: example-negative
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Code Example

This example shows how to invoke the grouped bar chart in the charts component. We pass a dataset data points for each bar group we want to show.

```javascript
var dataset = [{
    data: [{
        name: 'Jan',
        value: 12
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
}];

$('#column-grouped-example').chart({type: 'column-grouped', dataset: dataset});
```

## Accessibility

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Code Tips

You can override the tooltip by passing in a specific tooltip text value.

## Testability

You can add custom id's/automation id's to the column grouped chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [{
    name: 'Jan',
    value: 12,
    attributes: [
      { name: 'id', value: 'columngrouped-c1-jan' },
      { name: 'data-automation-id', value: 'automation-id-columngrouped-c1-jan' }
    ]
  }],
  name: 'Component A'
}
```

Providing the data this will add an ID added to each bar with `-bar` appended. In addition the related legend item will get the first group attributes id with `-legend` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd>You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd>Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

- The area chart was added in 3.6. From 3.6 the api is compatible.
