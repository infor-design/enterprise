---
title: Hierarchy  
description: This page describes Hierarchy.
---

## Configuration Options

1. Org Chart Example [View Example]( ../components/hierarchy/example-index)
2. Lazy Loading Example [View Example]( ../components/hierarchy/example-lazy-loading)
3. Example Paging [View Example]( ../components/hierarchy/example-paging)
4. Example Single Manager/Subordinate [View Example]( ../components/hierarchy/example-single)

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

Required template HTML markup

```HTML
  <script type="text/html" id="<YOUR_TEMPLATE_ID>">
    <div class="leaf">
      <div class="content">
        ... your content
      </div>
    </div>
  </script>
```

## Accessibility

- This component is lacking accessibility at the moment.
- Needs, Keyboard, Aria Added or an Alternate view.


## Keyboard Shortcuts

- None

## Upgrading from 3.X

-  This component was very similar in 3.5, just rename inforHierarchy to hierarchy
