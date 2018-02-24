
# Completion Chart  [Learn More](#)

## Configuration Options

1. Simple Completion Chart Example [View Example]( ../components/completion-chart/example-index)
2. All Completion Chart Examples [View Example]( ../components/completion-chart/example-variations)
3. Range of Colors for Completion Chart [View Example]( ../components/completion-chart/example-colors)

{{api-details}}

Format used the [D3 formatter (v3)](https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format)

## Code Example

A completion chart shows completion over a target value. Usually used to show progress as a percentage. Create a div in which to host the chart. To make one create a div to a given width.

```html

<div id="example-2" class="chart-container"></div>


```

Initialize the Completion Chart out of the charts package with `type: 'completion-target'`.
Pass in objects for the sections such as the text , completed area and remaining bar.

```javascript

var dataset1 = [{
  data: [{
    name: {text: 'Available Credit'},
    completed: {text: 'Spent', value: 50000, format: '$,.0f'},
    remaining: {text: 'Pending', value: 10000, format: '$,.0f'},
    total: {value: 95000, format: '$,.0f'},
  }]
}];

$('#example-1').chart({dataset: dataset1, type: 'completion-target'}).data('chart');


```

## Accessibility

Accessibility work is needed on this component.

- An aria label should be added so that with a screen reader the user can get the jest of the display.
- Color along cannot be used as the sole means of displaying status. So with the colors include a text such as: Error, Good ect.

## Keyboard Shortcuts

- This is a visual only component.

## States and Variations

- None - but a tooltip may be used

## Responsive Guidelines

-   Will size to the parent's withd

## Upgrading from 3.X

-   This did not exist but may be confused with the progress bar in 3.6
