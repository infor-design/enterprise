
# Charts Components Implementation Detail [Learn More](#)

All of the charts are documented separately by type. See the respective pages for each chart in addition to this shared API info page. The following charts are currently supported

## Chart Types

1. Default About Example [View Example]( /components/about/example-index)
2. Close Event Demo [View Example]( /components/about/test-close-event)

## Basic Chart Use Cases

1. Using Patterns on Chart Colors [View Example]( /components/charts/example-chart-patterns.html)
2. How to Hide / Show a Chart [View Example]( /components/charts/example-hide-show.html)
3. How to Change Chart Type [View Example]( /components/charts/example-change-type.html	)

## Code Example

All of the charts are initialized via the chart api with an option for each chart. The dataset option accepts a JSON array with slightly different structure depending on chart. This is an example of a donut chart.

```html

  $('#pie-chart-example').chart({
    type: 'donut',
    dataset: pieData
  });


```

## Accessibility

We still have some work to do to make charts accessible. TODO:

- Should be keyboard friendly. Can focus the legend and hit enter to select.
- When keying in to the legend elements it should read the data
- Have a table option to display the data in optional data form.

## Keyboard Shortcuts

-   **Tab:** Tab throught the tabbble elements in the chart.
-   **Enter/Space:** Toggle selection on the element

## Upgrading from 3.X

-   This api is compatable with version 3.6
