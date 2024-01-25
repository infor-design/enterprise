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
  - name: People, avatars and initials
    slug: example-avatar
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

This example shows how to create an initials avatar

```html
<div class="avatar azure05">AC</div>
<div class="avatar large azure05">Ac</div>
```

For the avatar class you can use the following classes.

- `round` To make it round, or else it has a small border radius. The top level items in module nav should have the border radius. The guest area and other legacy areas should use the fully round one.
- `none` or `large` To adjust the size to be larger add class `large`. Normal size is used in module nav and the app nav area and other legacy areas should use the `large` one.
- `<colorname><0-9>` To set the background color, the color name is from the colors palette. For example `azure05, emerald05` depending on contrast should avoid 0-4 and use 5-8 range. When in doubt follow the designs.

## Accessibility

- For images always use an `alt` tag, which is read by screen readers

## Code Tips

The [example image list pattern](https://latest-enterprise.demo.design.infor.com/components/images/example-image-list.html) is created by using a toolbar above the block grid layout.

## Upgrading from 3.X

- Block grid / Image List partially replaces the carousel in 3.x
