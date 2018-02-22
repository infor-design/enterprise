
# Radar Chart  [Learn More](#)

## Configuration Options

1. Radar Chart Main Example [View Example]( ../components/radar/example-index)

## API Details

{{api-details}}

## Code Example

This example shows how to invoke a pie bar chart with a dataset controlling the values.

```javascript

  var radarData = [{
      data: [
			  [ // Resource
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
        ],[ // Position
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
    }];

  $('#radar-chart-example').chart({type: 'radar', dataset: radarData, showAxisLabels: false});


```

## Accessibility

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors.

## Code Tips

You can control the size of the radar chart by setting the size of the parent element the radar chart lives in.
This may include possibly using an inset margin in some cases.

## Keyboard Shortcuts

- None

## Upgrading from 3.X

-   The radar chart was added in 4.4.0
