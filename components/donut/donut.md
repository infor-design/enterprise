
# Donut Chart  [Learn More](#)

## Configuration Options

1. Donut Chart Main Example [View Example]( ../components/donut/example-index)
2. Showing Slices as Alerts [View Example]( ../components/donut/example-alerts)
3. With a Right Click Menu [View Example]( ../components/donut/example-rightclick)
4. Longer and Zero Labels [View Example]( ../components/donut/example-values)
5. Example showing Get Selected value [View Example]( ../components/donut/example-get-selected)
6. Example showing Set Selected value [View Example]( ../components/donut/example-set-selected)

## API Details

### Settings

-   `redrawOnResize` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**  -  If true chart will not resize / update when resizing the page.
-   `labels` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**  -  An object with options to configure the labels of form `labels : {hideLabels: true}`
- `labels: {hideLabels}` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Do not show labels
- `labels: {isTwoline}` **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - Show the labels on two different lines
- `labels: {contentsTop}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Customize the top of two the labels, can be `'name'|'value'|'percentage'|'name, value'|'name (value)'|'name (percentage)'`. If only one label this setting will be used.
- `labels: {contentsBottom}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Customize the bottom of the two labels, can be `'name'|'value'|'percentage'|'name, value'|'name (value)'|'name (percentage)'`
- `labels: {formatterTop}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Use d3 Format on the top label, see http://koaning.s3-website-us-west-2.amazonaws.com/html/d3format.html
 (percentage)'`
- `labels: {formatterBottom}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Use d3 Format on the top label, see http://koaning.s3-website-us-west-2.amazonaws.com/html/d3format.html
 (percentage)'`
- `labels: {colorTop}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - How to colorize the top label it can be one of `'default'|'color-as-arc'|'#000000'|'black'`
- `labels: {colorBottom}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - How to colorize the bottom label it can be one of `'default'|'color-as-arc'|'#000000'|'black'`
- `labels: {lineColor}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - How to colorize the line links can be one of `'default'|'color-as-arc'|'#000000'|'black'`
- `labels: {lineWidth}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - How many pixels should the line be (default 2)
- `labels: {linehideWhenMoreThanPercentage}` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - If the percentage is less than this (default 10), hide the line.

## Code Example

This example shows how to invoke a dount bar chart with a dataset controlling the values.

```javascript

  var donutData = [{
    data: [{
        name: 'Component A',
        value: 30
    }, {
        name: 'Component B',
        value: 40
    }],
    centerLabel: 'Donut Chart'
  }];

  $('#pie-donut-example').chart({type: 'donut', dataset: donutData}).on('selected', function (e, elem, args) {
    console.log(e, elem, args);
  });


```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. However, you can customize the color by passing higher contrast colors.

## Code Tips

You can control the size of the donut chart by setting the size of the parent element the donut lives in.
This may include possibly using an inset margin in some cases.

See also pie chart

## Keyboard Shortcuts

None

## Upgrading from 3.X

-   The donut chart was added in 3.6. From 3.6 the api is mostly compatible.
