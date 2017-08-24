
# Line  [Learn More](#)

## Configuration Options

1. Line Chart Example [View Example]( ../components/line/example-index)
2. Labels on Axis [View Example]( ../components/line/example-axis-labels)
3. Ticks Adjustment (Less ticks than data points) [View Example]( ../components/line/example-axis-ticks)
4. Customize Tooltip [View Example]( ../components/line/example-custom-tooltip)
5. Customize Dot Size [View Example]( ../components/line/example-custom-dots)
6. Set animation speed [View Example]( ../components/line/example-animation)
7. Rotate Bottom Labels [View Example]( ../components/line/test-rotate)
8. Example showing Get Selected value [View Example]( ../components/line/example-get-selected)
9. Example showing Set Selected value [View Example]( ../components/line/example-set-selected)
10. Example showing two line x axis [View Example]( ../components/line/example-two-lines)

## API Details

### Dataset Settings

* `name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - The name to show on the y axis for the line chart
* `value` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - The raw data value.
* `tooltip` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**  - The custom tooltip to show.

### Extra Chart Settings

* `hideDots` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Hide the dots in the line chart
* `axisLabels` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Option to a label to one of the four sides. Example `axisLabels: {left: 'Left axis label', top: 'Top axis label', right: 'Right axis label', bottom: 'Bottom axis label'}` [See Example]( ../components/line/example-axis-labels)
* `dots` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Option to customize the dot behavior. You can set the dot size (radius), the size on hover and stroke or even add a custom class. Example `dots: { radius: 3, radiusOnHover: 4, strokeWidth: 0, class: 'custom-dots'}` [See Example]( ../components/line/example-custom-dots)
* `xAxis` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - A series of options for the xAxis
* `xAxis.rotate` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Rotate the elements on the x axis. Recommend -65 deg but this can be tweaked depending on look.
* `yAxis` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - A series of options for the yAxis
* `xAxis.ticks` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Data to control the number of ticks and y axis format. Options for example `{number: 5, format: ',.1s'}` would show only 5 yaxis points and format the data to show 1K, 1M, 1G ect.. This uses the d3 formatter.
* `xAxis.formatText` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)** A function that passes the text element and a counter. You can return a formatted svg markup element to replace the current element. For example you could use tspans to wrap the strings or color them.

## Code Example

This example shows how to invoke the line chart option in the charts component. In this example we pass a dataset with x and y axis values for three lines.

```javascript

var dataset = [{
  data: [{
      name: 'Jan',
      value: 12
  }, {
      name: 'Feb',
      value: 11
  }, {
      name: 'Mar',
      value: 14
  }, {
      name: 'Apr',
      value: 10
  }, {
      name: 'May',
      value: 14
  }, {
      name: 'Jun',
      value: 8
  }],
  name: 'Component A'
}, {
  data: [{
      name: 'Jan',
      value: 22
  }, {
      name: 'Feb',
      value: 21
  }, {
      name: 'Mar',
      value: 24
  }, {
      name: 'Apr',
      value: 20
  }, {
      name: 'May',
      value: 24
  }, {
      name: 'Jun',
      value: 28
  }],
  name: 'Component B'
}, {
  data: [{
      name: 'Jan',
      value: 32
  }, {
      name: 'Feb',
      value: 31
  }, {
      name: 'Mar',
      value: 34
  }, {
      name: 'Apr',
      value: 30
  }, {
      name: 'May',
      value: 34
  }, {
      name: 'Jun',
      value: 38
  }],
  name: 'Component C'
}];

$('#area-example').chart({type: 'line', dataset: dataset});


```

## Keyboard Shortcuts

-   **Tab:** You can tab into the chart area and through the legend values as each has a focus state.
-   **Enter/Space:** Will select the area the corresponds with the focus'd legend item.

## Upgrading from 3.X

-   The line chart was added after version 3.6
