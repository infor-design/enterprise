---
title: Charts 
description: This page describes Charts .
---

All of the charts are documented separately by type. See the respective pages for each chart in addition to this shared API info page. The following charts are currently supported

## Chart Types

1. Area [View Example]( ../components/area)
2. Bar [View Example]( ../components/bar)
3. Bar Grouped [View Example]( ../components/bar-grouped)
4. Bar Stacked [View Example]( ../components/bar-stacked)
5. Bubble [View Example]( ../components/bubble)
6. Column [View Example]( ../components/column)
7. Column Grouped [View Example]( ../components/column-grouped)
8. Completion Chart [View Example]( ../components/completion-chart)
9. Donut [View Example]( ../components/donut)
10. Line [View Example]( ../components/line)
11. Positive Negative [View Example]( ../components/positive-negative)
12. Sparkline [View Example]( ../components/sparkline)
13. Step Chart [View Example]( ../components/step-chart)
14. Targeted Achievement [View Example]( ../components/targeted-achievement)
15. Timeline [View Example]( ../components/timeline)

## Other Chart Use Cases

1. Using Patterns on Chart Colors [View Example]( ../components/charts/example-chart-patterns.html)
2. How to Hide / Show a Chart [View Example]( ../components/charts/example-hide-show.html)
3. How to Change Chart Type [View Example]( ../components/charts/example-change-type.html	)

## Code Example

All of the charts are initialized via the chart api with an option for each chart. The dataset option accepts a JSON array with slightly different structure depending on chart. This is an example of a donut chart.

```html
  $('#pie-chart-example').chart({
    type: 'donut',
    dataset: pieData
  });

```

## Accessibility

We still have some work to do to make charts accessible. Some todo's

- Should be keyboard friendly. Can focus the legend and hit enter to select.
- When keying in to the legend elements it should read the data
- Have a table option to display the data in optional data form.

## Keyboard Shortcuts

-   **Tab:** Tab throughout the tabbable elements in the chart.
-   **Enter/Space:** Toggle selection on the element

## Upgrading from 3.X

-   This api is roughly compatible with version 3.6
