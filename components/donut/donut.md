---
title: Donut Chart
description: This page describes Donut Chart.
---

## Configuration Options

1. Donut Chart Main Example [View Example]( ../components/donut/example-index)
2. Showing Slices as Alerts [View Example]( ../components/donut/example-alerts)
3. With a Right Click Menu [View Example]( ../components/donut/example-rightclick)
4. Longer and Zero Labels [View Example]( ../components/donut/example-values)
5. Set animation speed [View Example]( ../components/donut/example-animation)
6. Example showing Get Selected value [View Example]( ../components/donut/example-get-selected)
7. Example showing Set Selected value [View Example]( ../components/donut/example-set-selected)

## API Details

### Settings

See the [Pie API]( ../components/pie) as this is just a pie setting.

## Code Example

This example shows how to invoke a dount bar chart with a dataset controlling the values.

```javascript
  var donutData = [{
    data: [{
        name: 'Component A',
        value: 30
    }, {
        name: 'Component B',
        value: 40
    }],
    centerLabel: 'Donut Chart'
  }];

  $('#pie-donut-example').chart({type: 'donut', dataset: donutData}).on('selected', function (e, elem, args) {
    console.log(e, elem, args);
  });
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Code Tips

You can control the size of the donut chart by setting the size of the parent element the donut lives in.
This may include possibly using an inset margin in some cases.

See also pie chart

## Keyboard Shortcuts

None

## Upgrading from 3.X

-   The donut chart was added in 3.6. From 3.6 the api is mostly compatible.
