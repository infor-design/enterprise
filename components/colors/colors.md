---
title: Color Palette
description:
demo:
  pages:
  - name: Full Color Palette
    slug: example-index
  - name: Color Variables (Badges)
    slug: example-color-vars
---

Text color classes can be used to set the color attribute to an alert color in the palette by using the classes `error-text`, `warning-text`, `good-text`, and `info-text`. Background color classes can also be used to set the `background-color` of an element. Every color in the palette has a corresponding class; for example: `azure06` or `emerald01`.

```html
<p class="error-text">Error</p>
<p class="warning-text">Warning</p>
<p class="good-text">Good</p>
<p class="info-text">Info</p>
```

## Accessibility

* Do not use color alone to indicate state. If you use a color then also use an icon or text to explain the meaning in case someone is color blind and unable to discern the meaning of the status based on the color.
