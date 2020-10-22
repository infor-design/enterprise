---
title: Radar Chart
description: A radar chart is a graphical method of displaying multivariate data in the form of a two-dimensional chart of three or more quantitative variables represented on axes starting from the same point.
demo:
  embedded:
  - name: Standard Radar Chart
    slug: example-index
---

## Code Example

This example shows how to invoke a radar chart with a dataset controlling the values.

```javascript
var radarData = [{
    data: [
        [   // Resource
            {name: 'Procedure Assistance', value: 3},
            {name: 'Personnel Training', value: 2},
            {name: 'Patient Support', value: 1},
            {name: 'Patient Care', value: 0},
            {name: 'Paperwork Admin', value: 1},
            {name: 'Equipment Management', value: 3},
            {name: 'Data Analysis', value: 4},
            {name: 'Compliance', value: 4},
            {name: 'Community Support', value: 2},
            {name: 'Assess and Diagnose', value: 4}
        ],
        [   // Position
            {name: 'Procedure Assistance', value: 5},
            {name: 'Personnel Training', value: 4},
            {name: 'Patient Support', value: 3},
            {name: 'Patient Care', value: 5},
            {name: 'Paperwork Admin', value: 3},
            {name: 'Equipment Management', value: 4},
            {name: 'Data Analysis', value: 5},
            {name: 'Compliance', value: 4},
            {name: 'Community Support', value: 5},
            {name: 'Assess and Diagnose', value: 3}
            ]
        ]
    ]
}];

$('#radar-chart-example').chart({type: 'radar', dataset: radarData, showAxisLabels: false});
```

## Accessibility

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors.

## Code Tips

You can control the size of the radar chart by setting the size of the parent element the radar chart lives in.
This may include possibly using an inset margin in some cases.

## Testability

You can add custom id's/automation id's to the radar chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  data: [
    {
      name: 'Battery Life',
      value: 0.22,
      attributes: [
        { name: 'id', value: 'radar-iphone-battery-life' },
        { name: 'data-automation-id', value: 'automation-id-radar-iphone-battery-life' }
      ]
    }
  ],
  name: 'iPhone X',
  id: '1',
  attributes: [
    { name: 'id', value: 'radar-iphone' },
    { name: 'data-automation-id', value: 'automation-id-radar-iphone' }
  ]
}
```

Providing the data this will add an ID added to each area with `-area`, stroke with `-stroke`, circle with `-circle` and invisible-circle with `-invisible-circle` appended. In addition the related legend item will get the same id with `-legend` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- None

## Upgrading from 3.X

- The radar chart was added in 4.4.0
