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

You can add custom id's/automation id's to the hierarchy that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
var dataset = [{
  "id": "1",
  "Name": "Jonathan Cargill",
  "Position": "Director",
  "EmploymentType": "FT",
  "Picture": "/images/21.jpg",
  "attributes": [
    { "name": "id", "value": "example1-1-jonathan-cargill" },
    { "name": "data-automation-id", "value": "automation-id-example1-1-jonathan-cargill" }
  ]
  "children": [
    {
      "id": "1_3",
      "Name": "Kaylee Edwards",
      "Position": "Records Manager",
      "EmploymentType": "FT",
      "Picture": "/images/11.jpg",
      "attributes": [
        { "name": "id", "value": "example1-1_3-kaylee-edwards" },
        { "name": "data-automation-id", "value": "automation-id-example1-1_3-kaylee-edwards" }
      ]
    }
  }];
```

Providing the data this will add an ID added to each leaf with `-hierarchy-leaf`, toggle button with `-hierarchy-btn-toggle`, actions button with `-hierarchy-popupmenu-trigger` and action button options with `-hierarchy-popupmenu-option-{index}` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Upgrading from 3.X

- This component was very similar in 3.5, just rename `inforHierarchy` to `hierarchy`
