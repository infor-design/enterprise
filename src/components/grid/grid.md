---
title: Grid
description: This page describes Grid.
demo:
  pages:
  - name: 12 Column Responsive Grid
    slug: example-index
  - name: Simplified Responsive Grid
    slug: example-simplified
  - name: Inputs in the Responsive Grid
    slug: example-inputs
  - name: Inputs in the Responsive Simplified Grid
    slug: example-inputs-simple
---

## Code Example

### Standard Grid

Soho uses a 12 column grid for most designs. To setup a new 12 column grid, define a row element using `<div class="row">`. Then define the columns you want in that row. They should always add to 12. For example, below we have a 2 column and 10 column element.

```html
<div class="row">
  <div class="two columns">Content</div>
  <div class="ten columns">Content</div>
</div>
```
### Simplified Grid

The simplified grid handles the basic 1,2,3,4 column layouts in a more semantic way. This example is the same as a six by six grid but uses the classes `one-half`, etc. The following are supported `full`, `full-width`, `one-half`, `one-third`, `two-thirds`, `one-fourth`, `one-fifth`.

You can also add class `one-half-mobile` and at the lowest breakpoint the grid will break down to two columns instead of one.

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

There are 7 breakpoint sizes you can target to tailor your layout to the specific device size:

* `breakpoint-phone`, `breakpoint-slim`
* `breakpoint-phablet`
* `breakpoint-phone-to-tablet`
* `breakpoint-wide-tablet`
* `breakpoint-tablet-to-desktop`
* `breakpoint-desktop-to-extralarge`

See [`sass/_config.scss`](http://git.infor.com/projects/SOHO/repos/controls/browse/sass/_config.scss#857-866) for the specific breakpoint sizes.

For guidance on how to use the breakpoints to tailor your layout for different device sizes, see the [Grid & Breakpoints guidelines](/guidelines/page-structure/grid)

## Accessibility

-   No special requirements, but do watch that tab order is respected.
