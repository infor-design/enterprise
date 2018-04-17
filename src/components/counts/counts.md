---
title: Counts
description: This page describes Counts.
demo:
  pages:
  - name: Counts - Of an Instance
    slug: example-instance-count
  - name: Counts - Of an Object
    slug: example-object-count
---

Use the icon types `icon-alert`, `icon-confirm`, `icon-dirty`, `icon-error`, `icon-info`, `icon-pending`, `icon-new`, `icon-in-progress`, `icon-info-field` within the count element. The icon color is set automatically based on the type of alert.

## Code Example

Instance Counts are simple CSS/HTML components with a `count` and `title` element. You can use any of the colors in the [pallette]( ./colors).


```html
<div class="instance-count ">
  <span class="count emerald07">40</span>
  <span class="title">Active Goals</span>
</div>
```

## Accessibility

-   Be careful to select a color that passes [WCAG AA or AAA contrast](http://webaim.org/resources/contrastchecker/) with its background
-   Screen readers can access the information via a virtual keyboard. Make sure to augment the labels with `audible` only spans to add additional context if needed
