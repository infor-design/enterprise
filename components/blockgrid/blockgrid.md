---
title: Blockgrid  
description: This page describes Blockgrid.
---

## Configuration Options

1. Blockgrid with images [View Example]( ../components/blockgrid/example-index)
2. Blockgrid with image and text  [View Example]( ../components/blockgrid/example-text)
3. Blockgrid with single selection [View Example]( ../components/blockgrid/example-singleselect)
4. Blockgrid with multiselect select [View Example]( ../components/blockgrid/example-multiselect)
5. Blockgrid with mixed selection select [View Example]( ../components/blockgrid/example-mixed-selection)

## Code Example

This example shows how to place several object (image placeholders) in side a block grid.
The block grid will layout the elements across the parent width and flow to next line if need be.

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

Note that tab order should be maintained and not changed with an explicit tabindex.

## Code Tips

The elements should be the same or very close in size (width/height). Due to constraints the bottom rows are not ideally centered at this time if the counts are not even per row.
