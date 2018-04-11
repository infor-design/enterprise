---
title: Expandable Area
description: This page describes Expandable Area .
demo:
  pages:
  - name: Default Expandable Area Example
    slug: example-index
  - name: Custom Link Text Demo
    slug: example-custom-text
---

An expandable area is a `<div>` with the `expandable-area` class. Inside that element would be a header with a `title` and a pane. The pane has the class `expandable-pane` and is the area that will hide and show.

An expandable area content pane can be either collapsed or expanded. During initialization, the expandable area's base element `$('.expandable-area')` is checked for the CSS class `is-expanded`. If found, the expandable area content pane will open automatically.

It's possible to keep the area open by default by adding the class `is-expanded` to the `expandable-area`. You can also add a second pane with class `expandable-visible-panel`. This pane will always remain open.

```html
<div class="expandable-area">
  <div class="expandable-header">
    <span class="title">Procurement</span>
  </div>
  <div class="expandable-pane">
    <div class="content">
      Ubiquitous out-of-the-box, scalable; communities disintermediate beta-test, enable utilize markets dynamic infomediaries virtual data-driven synergistic aggregate infrastructures, "cross-platform, feeds bleeding-edge tagclouds." Platforms extend interactive B2C benchmark proactive, embrace e-markets, transition generate peer-to-peer.
    </div>
  </div>
</div>
```

## Keyboard Shortcuts

-   Press <kbd>Tab</kbd> to focus the Expandable Area's link
-   Press <kbd>Enter</kbd> to expand the area or collapse it
-   If the content pane is open, pressing <kbd>Tab</kbd> or <kbd>Shift + Tab</kbd> will focus the next or previous focusable element inside the content pane
-   If the content pane is closed or focus is on the last focusable element inside the content pane, pressing <kbd>Tab</kbd> once more will leave the content pane and focus the next focusable element on the page. <kbd>Shift + Tab</kbd> will do the opposite

## Responsive Guidelines

The Expandable Area will automatically stretch to fill 100% of its parent element's width.

## Upgrading from 3.X

-   Expandable Area and Field Set are separated
