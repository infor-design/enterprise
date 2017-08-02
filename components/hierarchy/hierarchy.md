
# Hierarchy  [Learn More](#)

## Configuration Options

1. Org Chart Example [View Example]( ../components/hierarchy/example-index)

{{api-details}}

## Code Example

This example shows how to invoke the hierarchy component passing in data and legend info for matching.

```javascript

    var legendData = [
      { 'value' : 'FT', 'label' : 'Full Time'     },
      { 'value' : 'PT', 'label' : 'Part Time'     },
      { 'value' : 'C',  'label' : 'Contractor'    },
      { 'value' : 'O',  'label' : 'Open Position' }
    ];

    $('#hierarchy').hierarchy({
      templateId: 'hierarchyChartTemplate',
      legendKey: 'EmploymentType',
      legend: legendData,
      dataset: data
    });


```

## Accessibility

- This component is lacking accessibility at the moment.
- Needs, Keyboard, Aria Added or an Alternate view.


## Keyboard Shortcuts

- None

## Upgrading from 3.X

-  This component was very similar in 3.5, just rename inforHierarchy to hierarchy
