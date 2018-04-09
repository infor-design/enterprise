---
title: Treemap
description: This page describes treemap.
demo:
  pages:
  - name: Treemap Main Example
    slug: example-index
  - name: Treemap Nesting Example
    slug: example-nested
---

## Code Example

This example shows how to invoke a Treemap with a dataset to controlling the values.
It also shows how to structure the data. You need to use a children attribute on each node and those will be created
within the nodes in the tree so you can nest and group.

Treemaps are used to display hierarchical data and are useful when space is constrained and you have a large amount of hierarchical data that you need to get an overview of. Treemaps should primarily be used with values that can be aggregated. Treemaps are economical in that they can be used within a limited space and yet display a large number of items simultaneously. When there is a correlation between color and size in the tree structure, you are able to see patterns that would be difficult to spot in other ways, for example, when a certain color is particularly relevant.

Treemaps are not good when there is a big difference in the magnitude of the measure values. Nor is a treemap the right choice when mixing absolute and relative values. Negative values cannot be displayed in treemaps.

```javascript

  var treeMapData = {
   name: 'Storage Utilization (78 GB)',
   children: [
    {
     name: "by type",
     children: [
      {
       name: "type1",
       children: [
        {name: "JSON", value: 3400}
       ]
      },
      {
       name: "type2",
       children: [
        {name: "PDF", value: 2200}
       ]
      },
      {
       name: "type3",
       children: [
        {name: "BOD", value: 1000}
       ]
      },
      {
       name: "type4",
       children: [
        {name: "TXT", value: 1000}
       ]
      },
      {
       name: "type5",
       children: [
        {name: "CSV", value: 2000}
       ]
      },
      {
       name: "type6",
       children: [
        {name: "Assets", value: 800}
       ]
      },
      {
       name: "type7",
       children: [
        {name: "Others", value: 1700}
       ]
      }
     ]
    }]
  };

  $('#treemap-chart-example').treemap({dataset: treeMapData});

```

## Accessibility

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors in the colors option.

## Code Tips

- You can control the size of the treemap by setting the size of the parent element the treemap lives in.
  This may include possibly using an inset margin in some cases.
- This component does not support drilldown at this time.
- Using the data you can either show a single set or nested set of data (compare the two examples)

## Keyboard Shortcuts

- None

## Accessibility

- Needs further testing

## Testability

- Needs further testing, but you can add a permanent data-automation-id or id to the chart container for scripting purposes.

## Responsive Information

- As you resize the chart will redraw with in the width of the parent width and height. The nodes in the treemap
are sized in proportion.

## Upgrading from 3.X

- The treemap was added in 4.6.0
