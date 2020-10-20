---
title: Treemap
description: null
demo:
  embedded:
  - name: Treemap Main Example
    slug: example-index
  pages:
  - name: Treemap Nesting Example
    slug: example-nested
  - name: Treemap With Additional Stats Fields
    slug: example-stats
  - name: Treemap With Custom tooltips
    slug: example-tooltips
---

## Code Example

This example shows how to invoke a Treemap with a dataset controlling the values. It also shows how to structure the data. You need to use a children attribute on each node and those will be created within the nodes in the tree so you can nest and group.

Treemaps are used to display hierarchical data. This is useful when space is constrained and you need to see an overview of a large amount of hierarchical data. Treemaps should primarily be used with values that can be aggregated. Treemaps are economical in that they can be used within a limited space and yet display a large number of items simultaneously. When there is a correlation between color and size in the tree structure, you are able to see patterns that would be difficult to spot in other ways, for example, when a certain color is particularly relevant.

Treemaps are not good when there is a big difference in the magnitude of the measure values. Nor is a treemap the right choice when mixing absolute and relative values. Negative values cannot be displayed in treemaps.

```javascript
var treeMapData = {
    name: 'Storage Utilization (78 GB)',
    children: [{
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
}
$('#treemap-chart-example').treemap({dataset: treeMapData});
```

## Accessibility

The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing different contrast colors in the colors option.

## Code Tips

- You can control the size of the treemap by setting the size of the parent element the treemap lives in. This may include possibly using an inset margin in some cases.
- This component does not support drilldown at this time.
- Using the data you can either show a single set or nested set of data (compare the two examples)
- You can set tooltips on the treemap by passing in a text or html string in a `tooltip` field in the data. By default a tooltip will show if the data rectangle is small.

## Keyboard Shortcuts

This chart has no keyboard functionality


## Testability

You can add custom id's/automation id's to the treemap picker that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

For the treemap you can set attributes on the root element, you will get an ID/attributed added to each slice, which will get the `name` value in the data appended.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Responsive Information

As you resize the chart will redraw with in the width of the parent width and height. The nodes in the treemap are sized in proportion.

## Upgrading from 3.X

The treemap was added in 4.6.0
