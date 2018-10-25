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
  - name: Changing Colors
    slug: example-colors
  - name: Changing the Y Domain
    slug: example-domain-change
  - name: Formatting the Values (Tooltip)
    slug: example-formatter
  - name: Negative Values
    slug: example-negative-value
  - name: Testing Date Values
    slug: test-by-date
  - name: Pattern Colors
    slug: example-patterns
  - name: Selecting a Section Colors
    slug: example-selected
  - name: Set animation speed
    slug: example-animation
  - name: Example showing Get Selected value
    slug: example-get-selected
  - name: Example showing Set Selected value
    slug: example-set-selected
---

## Dataset Settings

- name - this value will be on the axis
- shortName - this value will be used if the name wont fit on the axis
- abbrName - this value will be used if the name and shortName wont fit on the axis (fx a phone sized widget)
- tooltip - the custom tooltip. you can pass {{value}} to have the formatted value inserted
- value - the value to use across all lines to domain the axis

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

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> You can tab into the chart area and through the legend values as each has a focus state.
- <kbd>Enter/Space</kbd> Will select the bar group the corresponds with the focus'd legend item.

## Upgrading from 3.X

The bar chart was added in 3.6. From 3.6 the api is mostly compatible.
