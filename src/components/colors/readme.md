---
title: Color Palette
description:
demo:
  embedded:
  - name: Full Color Palette
    slug: example-index
---

Text color classes can be used to set the color attribute to an alert color in the palette by using the classes `error-text`, `warning-text`, `good-text`, and `info-text`. Background color classes can also be used to set the `background-color` of an element. Every color in the palette has a corresponding class; for example: `azure06` or `emerald01`.

```html
<p class="error-text">Error</p>
<p class="warning-text">Warning</p>
<p class="good-text">Good</p>
<p class="info-text">Info</p>
```

Background colors can also be set by using the color palette name and appending `-color` to it, this also works for border color with `-border-color`.

```html
<svg class="icon amber05-color amber01 amber01-border-color" focusable="false" aria-hidden="true" role="presentation">
  <use href="#icon-building"></use>
</svg>
```

## Accessibility

- Do not use color alone to indicate state. If you use a color then also use an icon or text to explain the meaning in case someone is color blind and unable to discern the meaning of the status based on the color.
