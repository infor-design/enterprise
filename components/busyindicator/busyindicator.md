
# Busy Indicator  [Learn More](#)

{{api-details}}

## Configuration Options

1. Busy Form Example [View Example]( ../components/busyindicator/example-index)
2. Busy Input Elements [View Example]( ../components/busyindicator/example-inputs)
3. Non Blocking Busy Indicator [View Example]( ../components/busyindicator/example-non-blocking)
4. Smaller Size [View Example]( ../components/busyindicator/example-small)
5. On the Page Body [View Example]( ../components/busyindicator/example-body)
6. Customize Loading Text [View Example]( ../components/busyindicator/example-custom-loading-text.html)
7. Nested Busy Indicators [View Example]( ../components/busyindicator/example-nested.html)
8. transparent Overlay [View Example]( ../components/busyindicator/example-transparent-overlay.html)
9. Ajax Calls [View Test]( ../components/busyindicator/test-ajax-calls)
10. Block Entire UI [View Test]( ../components/busyindicator/test-ajax-calls)
11. Block Specific Area [View Test]( ../components/busyindicator/test-ajax-calls)
12. In Font-size Zero [View Test]( ../components/busyindicator/test-contained-in-font-size-0)
13. Delay before Display [View Test]( ../components/busyindicator/test-delayed-display.html)

## Code Example

To use the busy indicator place it on a element with class = "busy". Keep in mind it will center itself on that element.
You can provide the options inline in the data-options. This example is using the initializer. If you arent call `$('#busy-form').busyindictor()` to init the plugin.

```html

<form id="busy-form" class="busy" action="#" method="POST" data-options="{ 'displayDelay': 100, 'timeToComplete': 4000 }">
  <div class="field">
    <label for="busy-field-name">Name</label>
    <input type="text" id="busy-field-name" name="busy-field-name" value="" />
  </div>
  <div class="field">
    <label for="busy-field-address">Address</label>
    <input type="text" id="busy-field-address" name="busy-field-address" value="" />
  </div>
  <div class="field">
    <label for="busy-field-cats">Number of Cats</label>
    <input type="text" id="busy-field-cats" name="busy-field-cats" value="" />
  </div>
  <div class="field">
    <button type="submit" class="btn-primary" style="margin-left: 3px">Submit</button>
  </div>
</form>


```

When a task happens that requires the indicator trigger the even on the element.

```javascript

$('#busy-form button[type="submit"]').click(function(e) {
  e.preventDefault();
  $('#busy-form').trigger('start.busyindicator');
});


```

## States and Variations

Elements that contain a Busy Indicator will have the following states:

-   Normal
-   Busy (Active)

## Responsive Guidelines

Busy Indicators that block UI will usually be placed at a "container" or "form" level, and will cover the container/form elements with an overlay. The overlay should stretch to cover the width and height of the container/form.
