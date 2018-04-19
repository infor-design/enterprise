---
title: Circle Pager
description: This page describes Circle Pager.
demo:
  pages:
  - name: Default Circle Pager Example
    slug: example-index
  - name: Circle Pager on a Form
    slug: example-form
  - name: Circle Pager with more than one item per slide
    slug: example-more-slides
  - name: Circle Pager on a Tab Example
    slug: example-tabs
---
## Code Example

Use the below markup to create a circle pager, then call `$(elem).circlepager()` to invoke. The structure of the circle pager is that you have a `<div class="circlepager">` followed by a `slide` container and then one slider per "page". The page content goes in the `slide-content` element.

```html
<div class="circlepager example1">
  <div class="slides">

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br />
        $750.00
        </p>
      </div>
    </div>

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br />
        $750.00
        </p>
      </div>
    </div>

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br />
        $750.00
        </p>
      </div>
    </div>

  </div>
</div>
```

## Accessibility

-   [Carousel](https://www.w3.org/WAI/tutorials/carousels/) guidelines apply.
- We do not auto-move the carousel elements
- User can <kbd>Tab</kbd> to the circles and activate

## Keyboard Shortcuts

-   <kbd>Tab</kbd> to move through the pages
-   <kbd>Enter</kbd> to activate a page

## Upgrading from 3.X

-   Replaces `.inforCarousel()` in a more limited fashion
