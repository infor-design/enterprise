---
title: Hierarchy
description: null
demo:
  embedded:
  - name: Org Chart Example
    slug: example-index
  pages:
  - name: Lazy Loading Example
    slug: example-lazy-load
  - name: Example Paging
    slug: example-paging
  - name: Example Single Manager/Subordinate
    slug: example-single
---

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

Required template HTML markup:

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

- This component is lacking accessibility
- Needs, Keyboard, Aria Added or an Alternate view

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- This component was very similar in 3.5, just rename `inforHierarchy` to `hierarchy`
