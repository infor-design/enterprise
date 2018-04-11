---
title: Badges
description: This page describes Badges.
demo:
  pages:
  - name: Default Badge Example
    slug: example-index
  - name: Additional Badges
    slug: example-additional-badges
---

The classes `error`, `info`, or `alert` associate the element with a status by color. In addition any of the classes from the color-palette can be used. (See [Colors](./colors) docs for more information).

## Code Example

A badge is a CSS only component that uses a `<span>` with the class `badge`. In addition, the following classes are also supported for specific status types: `error`, `info`, or `alert`. Also the class `round` can be added to make a perfectly round badge, when using 1 or 2 digit numbers.

```html
<span class="round info badge ">5</span>
```

## Accessibility

-   The traffic light colors are accessibility violations for contrast, however, the high contrast theme provides an alternative that passes. In addition, in context text should be used as color alone cannot provide the meaning. 
-   An audible span (`class="audible"`) should always be included for accessibility, it should describe the alert status and/or count value in a meaningful way to a non-visual user.

## Keyboard Shortcuts

Badges do not have tab stops and have no keyboard interaction on their own, but they may be placed in a grid cell or object that has tab focus.
