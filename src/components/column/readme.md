---
title: Column Chart
description: null
demo:
  embedded:
  - name: Standard Column Chart
    slug: example-index
  pages:
  - name: Column Chart with Legend
    slug: example-legend
  - name: Balance Widget
    slug: example-balance
  - name: Changing Bar Colors
    slug: example-colors
  - name: Changing the Y Domain
    slug: example-domain-change
  - name: Negative Values
    slug: example-negative-value
  - name: Testing Date Values
    slug: test-by-date
  - name: Formatting the Tooltip Values
    slug: test-formatter
---

## Dataset Settings

- name - this value will be on the axis
- shortName - this value will be used if the name wont fit on the axis
- abbrName - this value will be used if the name and shortName wont fit on the axis (fx a phone sized widget)
- tooltip - the custom tooltip. you can pass {{value}} to have the formatted value inserted
- value - the value to use across all lines to domain the axis

## Code Example

This example shows how to invoke a simple column chart with a dataset with a value for each column. You can pass in a tooltip with a custom value, and also pass in three labels that are used at the various break points as will fit (name, showName, abbrName).

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

## Selection Model

- You can initially mark a bar on the chart as selected by passing `selected: true` in the dataset element.

```javascript
{
  name: 'Automotive',
  shortName: 'Auto',
  abbrName: 'A',
  value: 7,
  selected: true
}
```

- You can use the `getSelected` method to get the currently selected line.
- You can use the `setSelected` method to set the current selected line. For this function you can pass in options such as groupIndex, fieldName and fieldValue to find the associated values.

```javascript
let options = {
  groupIndex: 0,
  fieldName: 'name',
  fieldValue: 'Feb'
};
```

## Accessibility

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

You can add custom id's/automation id's to the column chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [{
    name: 'Automotive',
    shortName: 'Auto',
    abbrName: 'A',
    value: 7,
    tooltip: 'Custom Tooltip - {{value}}',
    attributes: [
      { name: 'id', value: 'column-auto' },
      { name: 'data-automation-id', value: 'automation-id-column-auto' }
    ]
  }]
}
```

Providing the data this will add an ID added to each bar with `-bar` appended.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

The bar chart was added in 3.6. From 3.6 the api is mostly compatible.
