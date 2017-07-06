# Grid  [Learn More](#)

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

## Accessibility

-   No special requirements. But watch for tab order.

## Code Tips

-   Uses form guidelines

## Upgrading from 3.X

-   Did not exist
