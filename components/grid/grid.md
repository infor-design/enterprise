---
title: Grid  
description: This page describes Grid.
---

## Configuration Options

1. 12 Column Responsive Grid [View Example]( ../components/grid/example-index)
2. Simplified Responsive Grid [View Example]( ../components/grid/example-simplified)
3. Inputs in the Responsive Grid [View Example]( ../components/form/example-inputs)
4. Inputs in the Responsive Simplified Grid [View Example]( ../components/form/example-inputs-simple)

## Code Example

Soho uses a 12 column grid for most designs. For the 12 column grid define a row element. Then define the columns you want in that row.
They should always add to 12. For example in this example we have a 2 column and 10 column element.

```html


<div class="row">
  <div class="two columns">Content</div>
  <div class="ten columns">Content</div>
</div>


```

The simplified grid handles the basic 1,2,3,4 column layouts in a more semantic way. This example is the same as a six by six grid but uses the classes on-half ect. The following are supported `full, full-width, one-half, one-third, two-thirds, one-fourth, one-fifth`.

You can also add class `one-half-mobile` and at the lowest breakpoint the grid will break down to two column instead of one.

```html


<div class="row">
  <div class="one-half column">
    Content
  </div>

  <div class="one-half column">
    Content
  </div>
</div>


```

## Breakpoints

- Normally two breakpoints are used max width 1280px and then folds to mobile under 767 px
- For some minor tweaks in the application outside the responsive grid we have the following sass Breakpoints

```

$breakpoint-phone: 320px;
$breakpoint-slim: 400px;
$breakpoint-phablet: 610px;
$breakpoint-phone-to-tablet: 767px;
$breakpoint-wide-tablet: 968px;
$breakpoint-tablet-to-desktop: 1280px;
$breakpoint-desktop-to-extralarge: 1600px;


```

## Accessibility

-   No special requirements. But watch that tab order is respected.

## Code Tips

-  Not again that fields inputs can be used within the grid as per this [this example.]( ../components/form/example-inputs)

## Upgrading from 3.X

-   Did not exist
