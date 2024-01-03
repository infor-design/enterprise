---
title: Images
description: null
demo:
  embedded:
  - name: Image Sizes and Placeholders
    slug: example-index
  pages:
  - name: A Pattern showing a toolbar over a list of Images
    slug: example-image-list
  - name: People Photos and initials
    slug: example-photos
---

The image component is a CSS only component to handle placeholder images, empty images, and the various sizes of images that can appear in an application. Placeholder images can be in sizes `image-lg`, `image-md`, and `image-sm`.

## Code Example

This example shows how to invoke a small sized placeholder image.

```html
<div class="image-sm placeholder">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-insert-image"></use>
  </svg>
  <span class="audible">Placeholder Image</span>
</div>
```

## Accessibility

- For images always use an `alt` tag, which is read by screen readers

## Code Tips

The [example image list pattern](https://latest-enterprise.demo.design.infor.com/components/images/example-image-list.html) is created by using a toolbar above the block grid layout.

## Upgrading from 3.X

- Block grid / Image List partially replaces the carousel in 3.x
