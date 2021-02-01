---
title: Virtual Scroller
description: The virtual scroller adds visual dom elements as the user scrolls
demo:
  embedded:
  - name: Main Example
    slug: example-index
---

## Code Example

Virtual scrolling shows up the visible dom elements to the user, as the user scrolls, the next list is displayed. This gives faster experience as the full list is not loaded at one go and only loaded as per the visibility on the screen.

For this to work items must be fixed height. We set the item count and item template and then attach a dataset that will be used to render the templates plus a buffer of elements as we scroll up and down in the list.

## Use Cases

- For a list with thousands of elements that do not all need to be loaded at one time
- For a feed similar to a twitter or facebook feed

## Terminology

- **Template**: The html markup to render for each item
- **Viewport**: The visible scroll area that may not equal all the visible elements
- **Classification**:  How tags are labelled with colors and text
- **Disabled**: Tag can be disabled so it cannot be followed or clicked.

## Features (With Code Examples)

Set up a virtual scroll container and apply properties like height, itemHeight and item-count. Then inside the ids-virtual-scroll element we setup a structure to render where one element is `slot="contents"` this is the place where the item template will be rendered with the calculations.

```html
<div class="virtual-scroll-container" id="virtual-scroll-1" data-init="false">
  <div class="ids-virtual-scroll" tabindex="0">
    <div class="ids-virtual-scroll-viewport">
      <div class="listview disable-hover">
        <ul class="contents" role="listbox">
        </ul>
      </div>
    </div>
  </div>
</div>
```

```js
  var settings = {
    height: 308,
    itemHeight: $('html').attr('class').indexOf('uplift') > -1 ? 53 : 47
  };

  $.getJSON(url, function(data) {
    settings.itemTemplate = function(item) {
      return `<li>${item.productName}</li>`;
    };
    settings.data = data;

    $('#virtual-scroll-1').virtualscroll(settings);
  });
```

## Settings and Attributes

- `itemTemplate` {Function | string} Set the internal element template markup for a single element
- `data` {Array} Attach a dataset that matches the list template and render.
- `scrollTarget` {HTMLElement} Set internal element that will be the scrollable area.
- `scrollTop` {number} Set the scroll top position and scroll down to that location.
- `height` {number} The height in pixels we want the scroll area to be.
- `itemHeight` {number} The height of each item in the list, must be fixed size.
- `itemCount` {number} The number of elements in the dataset. This is also set internally when attaching data.
- `bufferSize' {number} The number of extra elements to render to improve or tweak the scroll experience. This needs more research.

## Keyboard Guidelines

- <kbd>Up/Down Arrow</kbd>: If the scroll area is focused using the arrow keys will activate the scrolling.
- <kbd>Home/End</kbd>: If the scroll area is focused using the arrow keys will scrolling to the start or end of the list

## Responsive Guidelines

- The width is responsive to the parent however the height is set in fixed pixels but may be dynamically adjusted.

## Converting from Previous Versions

New Component for 4.x / 5.x

## Accessibility Guidelines

The use of this component is not recommended for Accessibility since the lack of elements in the page may pose issues for screen reader and other assistive technology. Consider a way to disable this functionality.
