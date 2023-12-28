---
title: Charts
description: Displays a given data set in a visual way. A user can interpret the data to gain insights. Best for showing data distributions, comparisons, or trends.
---

All of the charts are documented separately by type. See the respective pages for each chart in addition to this shared API info page. The following charts are currently supported

## Chart Types

1. Area [View Example]( ../area)
1. Bar [View Example]( ../bar)
1. Bar Grouped [View Example]( ../bar-grouped)
1. Bar Stacked [View Example]( ../bar-stacked)
1. Bubble [View Example]( ../bubble)
1. Column [View Example]( ../column)
1. Column Grouped [View Example]( ../column-grouped)
1. Completion Chart [View Example]( ../completion-chart)
1. Donut [View Example]( ../donut)
1. Line [View Example]( ../line)
1. Positive Negative [View Example]( ../positive-negative)
1. Sparkline [View Example]( ../sparkline)
1. Step Chart [View Example]( ../stepchart)
1. Targeted Achievement [View Example]( ../targeted-achievement)
1. Timeline [View Example]( ../timeline)

## Code Example

All of the charts are initialized via the chart api with an option for each chart. The dataset option accepts a JSON array with slightly different structure depending on chart. This is an example of a donut chart.

```html
  $('#pie-chart-example').chart({
    type: 'donut',
    dataset: pieData
  });
```

## Accessibility

We still have some work to do to make charts accessible. Some todo's:

- Should be keyboard friendly. Can focus the legend and hit enter to select.
- When keying in to the legend elements it should read the data
- Have a table option to display the data in optional data form.

## Keyboard Shortcuts

- <kbd>Tab</kbd> Tab throughout the tabbable elements in the chart.
- <kbd>Enter/Space</kbd>Toggle selection on the element

## Upgrading from 3.X

- This api is roughly compatible with version 3.6
