---
title: Grid
description: null
demo:
  embedded:
  - name: 12 Column Responsive Grid
    slug: example-index
  pages:
  - name: Simplified Responsive Grid
    slug: example-simplified
---

## Code Example

### Standard Grid

Soho uses a 12 column grid for most designs. To setup a new 12 column grid, define a row element using `<div class="row">`. Then define the columns you want in that row. They should always add to 12. For example, below we have a 2 column and 10 column element. This grid is fixed not fluid (like some grids like bootstrap are).

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

## Flex/Responsive Modifiers

We added a few css flex modifiers for different ways to line up labels and act responsively. See [wrapped labels](./demo/components/form/test-wrapped-labels) for an example. Adding the `form-responsive` class to the row or a parent will make all inputs become responsive in the grid rather than their default sizes. Adding the class `flex-align-bottom` to the row will make the bottoms align of the inputs and this will make longer labels line up as the page is resized.

```html
<div class="form-responsive">
    <div class="row flex-align-bottom">
      <div class="three columns">
        <div class="field">
          <label for="font-used">Font to be Used</label>
          <input id="font-used" value="Arial Monospaced">
        </div>
      </div>
```

We have a few exmaples of input fields in the responsive grid. These can be found under the form layout examples. See [Inputs in the Responsive Grid](./demo/components/form/example-inputs) and [Inputs in the Responsive Simplified Grid](./demo/components/form/example-inputs-simple) for examples.

## Other Modifiers

We added an class modifier of `no-indent`, this will removing all margin indents on the grid. This can be used to nest responsive grids without the added gutters. See [the nested grid example](./demo/components/grid/test-nesting) for an example.

In addition we added a few extra class that can be added to the grid `row` element as follows:

- `top-padding` - adds additional top padding for a row (30px) to give some extra spacing
- `bottom-padding` - adds additional bottom padding for a row (30px) to give some extra spacing
- `small-top-padding` - adds a bit of additional top padding for a row (10px)
- `small-bottom-padding` - adds a bit of bottom top padding for a row (10px)
- `extended-bottom-padding` - adds a lot of bottom top padding for a row (45px)
- `no-top-padding` - removes all top padding
- `no-bottom-margin` - removes all bottom margins
- `full-height` - Makes the row have 100% height
- `full-width` - Makes the column have 100% width except when below the responsive breakpoint

## Breakpoints

There are 7 breakpoint sizes you can target to tailor your layout to the specific device size:

- `breakpoint-phone`, `breakpoint-slim`
- `breakpoint-phablet`
- `breakpoint-phone-to-tablet`
- `breakpoint-wide-tablet`
- `breakpoint-tablet-to-desktop`
- `breakpoint-desktop-to-extralarge`

See [`sass/_config.scss`](src/core/_config.scss) and search for "breakpoint sizes".

For guidance on how to use the breakpoints to tailor your layout for different device sizes, see the [Grid & Breakpoints guidelines](https://design.infor.com/guidelines/layout/grid)

## Accessibility

- No special requirements, but do watch that tab order is respected.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
