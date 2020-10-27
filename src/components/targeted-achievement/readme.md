---
title: Targeted Achievement Chart
description: null
demo:
  embedded:
  - name: Main Target to Achievement Example (shows 3 examples)
    slug: example-index
  pages:
  - name: Used as a Datagrid Formatter
    slug: example-datagrid
  - name: When the data is empty.
    slug: example-empty
  - name: Colors for errors/states
    slug: example-error-color
---

## Settings

### Dataset Settings

- name - Applies a name label to the left most section of the chart.
- completed - Gives a label, value, color and format to the completed bar of the chart.
- remaining - (optional) shows a hatched section that shows the remaining bit to a set target
- total - will be used on the top of the chart if applied. The total is used to set the total.

## Code Example

This example shows how to invoke a simple target to achievement chart. A dataset is passed as a setting that has several key data points to form the chart (name, completed, remaining, total).

```javascript
var dataset1 = [{
  data: [{
    name: {text: 'Label A'},
    completed: {text: '50K of 250K', value: 50000, format: '.2s', color: 'primary'},
    remaining: {value: 20000, format: '.2s', text: ' To Target'},
    total: {value: 250000, format: '.2s'},
  }]
}];

var api1 = $('#example-1').chart({dataset: dataset1, type: 'targeted-achievement'}).data('chart');
```

The chart can be updated the same way all components are by using the `updated` method. For example:

```javascript
// Initialize
var api = $('#example-1').chart({ dataset: dataset1, type: 'targeted-achievement' });

// Later on
api.data('chart').updated({ dataset: dataset2 });
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

You can add custom id's/automation id's to the targeted achievement chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
var dataset1 = [{
  data: [{
    name: { text: 'Label A' },
    completed: { text: '50K of 250K', value: 50000, format: '.2s', color: 'primary' },
    remaining: { value: 20000, format: '.2s', text: ' To Target' },
    total: { value: 250000, format: '.2s' },
  }],
  attributes: [
    { name: 'id', value: 'targeted-achievement-example1' },
    { name: 'data-automation-id', value: 'automation-id-targeted-achievement-example1' }
  ]
}];
```

Providing the data this will add an ID added to each name with `-name`, completed-bar with `-completed-bar`, completed-value with `-completed-value`, completed-text with `-completed-text`, remaining-bar with `-remaining-bar`, remaining-value with `-remaining-value`, remaining-text with `-remaining-text`, total-bar with `-total-bar`, total-value with `-total-value`, and percent-text with `-percent-text` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- None

## Upgrading from 3.X

- This is a new element
