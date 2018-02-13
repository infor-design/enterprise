
# Blockgrid  [Learn More](#)

## Configuration Options

1. Image Block Grid Example [View Example]( ../components/blockgrid/example-index)
1. Image and Text Block Grid Example [View Example]( ../components/blockgrid/example-text)

## Code Example

This example shows how to place several object (image placeholders) in side a block grid.
The block grid will layout the elements across the parent width and flow to next line if need be.

```html

<div class="row blockgrid l-center">
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff">
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff">
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff">
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff">
  </div>
  <div class="block">
    <img alt="Placeholder Image" src="http://placehold.it/200x200/d8d8d8/ffffff">
  </div>
</div>


```

## Accessibility

-  Note that tab order should be maintained and not changed with tabindex.

## Code Tips

The elements should be the same or very close in size (width/height). Due to constraints the bottom rows if not filled out are not ideally centered at this time.
