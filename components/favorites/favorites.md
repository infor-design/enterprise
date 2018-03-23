---
title: Favorites
description: This page describes Favorites.
demo:
  pages:
  - name: Default Favorites Example
    slug: example-index
---

## Code Example

A favorite is a toggle button that is specifically a star. You can set one up using a `<button>` with the class `icon-favorite`. The icon can be `icon-star-filled` or `icon-star-outlined`.

```html
<button type="button" class="btn-icon icon-favorite" title="Favorite">
   <svg class="icon-test icon" focusable="false" aria-hidden="true" role="presentation">
    <use xlink:href="#icon-star-filled"></use>
   </svg>
   <span>Favorite</span>
</button>
```
