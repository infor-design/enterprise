---
title: Bullet Chart
description: null
demo:
  embedded:
  - name: Standard Bullet Chart
    slug: example-index
  pages:
  - name: Shows Grouping a Series of Related Bullet Charts
    slug: example-data-group
  - name: Shows a Bullet Chart with Positive and Negative Values
    slug: test-negative-positive-value
  - name: Shows a bullet with a negative value
    slug: test-negative-value
---

## Code Example

This example shows how to invoke the bullet chart as part of the charts component. We pass a dataset data points for each bar group we want to show.

```javascript
var dataset1 = [{
    data: [
      {'title': 'Revenue','subtitle': 'US$, in thousands','ranges': [150, 225, 300, 400, 600], 'measures': [220,270], 'markers': [250],
        tooltip: ['<b>Poor</b> 150', '<b>Ok</b> 225', '<b>Good</b> 300', '<b>Excellent</b> 400', '<b>Revenue</b> 600']}
    ],
    barColors: ['#C0EDE3', '#8ED1C6', '#69ADA3', '#448D83', '#206B62'],
    lineColors: ['#000000', '#000000', '#000000'],
    markerColors: ['#000000']
  }];

$('#bullet-example1').chart({type: 'bullet', dataset: dataset1});
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Testability

You can add custom id's/automation id's to the bullet chart that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
// Example single
var dataSingleBullet = [{
  data: [
    {'title': 'Revenue','subtitle': 'US$, in thousands','ranges': [150, 225, 300, 400, 600], 'measures': [220,270], 'markers': [250], url: 'http://someplace.com',
      tooltip: ['<b>Poor</b> 150', '<b>Ok</b> 225', '<b>Good</b> 300', '<b>Excellent</b> 400', '<b>Revenue</b> 600']}
  ],
  barColors: [
    palette.turquoise[Soho.theme.new ? '20': '10'].value,
    palette.turquoise[Soho.theme.new ? '30': '30'].value,
    palette.turquoise[Soho.theme.new ? '60': '50'].value,
    palette.turquoise[Soho.theme.new ? '80': '70'].value,
    palette.turquoise[Soho.theme.new ? '100': '90'].value
  ],
  lineColors: ['#000000', '#000000', '#000000'],
  markerColors: ['#000000'],
  attributes: [
    { name: 'id', value: 'bullet-example1' },
    { name: 'data-automation-id', value: 'automation-id-bullet-example1' }
  ]
}];

// Example grouped
var dataGroupedBullet = [{
  data: [
    {
      title: 'Schedule Adherence By Quantity',
      subtitle: '',
      url: '/some-path/some-url-1',
      ranges: [2, 4, 6],
      measures: [2, 2],
      markers: [6, 6]
    }, {
      title: 'Schedule Adherence By Date',
      subtitle: '',
      url: '/some-path/some-url-2',
      ranges: [2, 4, 6],
      measures: [2, 2],
      markers: [6, 6]
    }
  ],
  barColors: [
    palette.emerald['20'].value,
    palette.emerald['40'].value,
    palette.emerald['60'].value
  ],
  lineColors: ['#000000', '#000000', '#000000'],
  markerColors: ['#000000'],
  attributes: [
    { name: 'id', value: 'bullet-group-example1' },
    { name: 'data-automation-id', value: 'automation-id-bullet-group-example1' }
  ]
}];
```

Providing the data this will add an ID added to each range with `-range{index}`, measure with `-measure{index}`, difference with `-difference`, title with `-title`, subtitle with `-subtitle`, marker with `-marker` and if more then one marker `-marker{index}` appended. In addition if data grouped the related items will get the same id with `-group{index}` appended after it.

## Keyboard Shortcuts

Not Applicable

## Upgrading from 3.X

- This visualization did not exist in 3.X
