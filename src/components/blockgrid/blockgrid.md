---
title: Blockgrid
description: This page describes Blockgrid.
demo:
  pages:
  - name: Blockgrid with images
    slug: example-index
  - name: Blockgrid with image and text
    slug: example-text
  - name: Blockgrid with single selection
    slug: example-singleselect
  - name: Blockgrid with multiselect select
    slug: example-multiselect
  - name: Blockgrid with mixed selection select
    slug: example-mixed-selection
---

## Code Example

This example shows how to place several objects inside a block grid. The block grid will layout the elements across the parent width and flow to next line if need be.

```html
<div class="row blockgrid l-center">
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff"/>
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff"/>
  </div>
</div>
```

## Accessibility

Note that tab order should be maintained and not changed with an explicit `tabindex`.

## Code Tips

The elements should be the same or very close in size (width/height). Due to constraints the bottom rows are not ideally centered at this time if the counts are not even per row.
