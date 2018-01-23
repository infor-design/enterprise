
# Bullet Chart  [Learn More](#)

## Configuration Options

1. Standard Bullet Chart [View Example]( ../components/bullet/example-index)
2. Shows Grouping a Series of Related Bullet Charts [View Example]( ../components/bullet/example-data-group)
3. Shows a Bullet Chart with Positive and Negative Values [View Example]( ../components/bullet/example-negative-positive-value)
4. Shows a bullet with a negative value [View Example]( ../components/bullet/example-negative-value)
5. Set animation speed [View Example]( ../components/bullet/example-animation)

{{api-details}}

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

## Keyboard Shortcuts

Not Applicable

## Upgrading from 3.X

-   This visualization did not exist in 3.X
