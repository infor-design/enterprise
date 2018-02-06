
# Pie Chart  [Learn More](#)

## Configuration Options

1. Pie Chart Main Example [View Example]( ../components/pie/example-index)
2. Hcm Example [View Example]( ../components/pie/example-hcm)
3. Tooltips [View Example]( ../components/pie/example-tooltip)
4. Donut Chart [View Example]( ../components/donut/example-index)
5. Set animation speed [View Example]( ../components/pie/example-animation)
6. Example showing Get Selected value [View Example]( ../components/pie/example-get-selected)
7. Example showing Set Selected value [View Example]( ../components/pie/example-set-selected)

## API Details

{{api-details}}

## Code Example

This example shows how to invoke a pie bar chart with a dataset controlling the values.

```javascript

  var pieData = [{
      data: [{
          name: 'Component A',
          value: 10.1,
          id: 'A',
          tooltip: 'Component A <b>{{percent}}</b>'
      }, {
          name: 'Component B',
          value: 12.2,
          id: 'B',
          tooltip: 'Component B <b>{{percent}}</b>'
      }, {
          name: 'Component C',
          value: 14.35,
          id: 'C',
          tooltip: 'Component C Is Very Cool<b>{{percent}}</b>'
      }]
    }];

  $('#pie-chart-example').chart({type: 'pie', dataset: pieData});

```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors.

## Code Tips

You can control the size of the donut chart by setting the size of the parent element the pie chart lives in.
This may include possibly using an inset margin in some cases.

See also [Donut Chart Example]( ../components/donut/example-index)

## Keyboard Shortcuts

- None

## Upgrading from 3.X

-   The pie chart and dount chart was added in 3.6; so 3.6 the api is mostly compatible.
