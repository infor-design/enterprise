
# Images  [Learn More](#)

## Configuration Options

1. Image Sizes and Placeholders [View Example]( ../components/images/example-index)
2. A Pattern showing a toolbar over a list of Images [View Example]( ../components/images/example-image-list)

## API Details

The image component is a css only component to handle placeholder / empty images. And the various sizes of images that can appear in an application.
Placeholder images can be in sizes image-lg. image-md, image-sm

## Code Example

This example shows how to invoke a small sized placeholder image.

```html

<div class="image-sm placeholder">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use xlink:href="#icon-insert-image"></use>
  </svg>
  <span class="audible">Placeholder Image</span>
</div>


```

## Accessibility

-  For images always use an alt tag, which is read by screen readers.

## Code Tips

The [example image list pattern]( ../components/images/example-image-list) is created by using a toolbar above the block grid layout.

## Upgrading from 3.X

-   Block grid / Image List partially replaces the carousel in 3.x
