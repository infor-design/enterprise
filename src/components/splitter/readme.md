---
title: Splitter Component
description: null
demo:
  embedded:
  - name: Main Example
    slug: example-index
  pages:
  - name: Splitter Element in Left Pane
    slug: example-splitter-left
  - name: Splitter Element in Right Pane
    slug: example-splitter-right
---

## Code Example

The splitter component is integrated into several page patterns that contain side bars. It will not work presently in every situation but new situations can be requested. In this example it is integrated in a two-column fixed layout. Fixed means the page is 100% so all inner content panes are also set to 100%.

We add the class splitter-container which will cause all elements with content on them to be 100% height. Each inner content pane may be scrollable.

A div with the class of splitter will become the split handle.

```html
<div class="page-container two-column fixed splitter-container">

  <section class="main">
    <div class="content scrollable">
    </div>
  </section>

  <nav class="sidebar scrollable">
    <div class="content">
      <div id="splitter" class="splitter"></div>
    </div>
  </nav>

</div>
```

## Accessibility

- This is a presentation only element

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- This is an open item

## States and Variations

- Normal
- Hover
- Dragging

## Responsive Guidelines

- At smaller breakpoints the vertical splitter will be hidden and the sides will stack at 100%
- Horizontal splitter will also be hidden at smaller breakpoints
