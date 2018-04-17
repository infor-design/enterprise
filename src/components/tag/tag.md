---
title: Tag Component 
description: This page describes Tag Component .
---

## Configuration Details

1. [Common Tag Examples]( ../components/tag/example-index)

## Code Example

Tags are simple span elements with the class="tag". They can be mixed in with other elements like lists, grids and search fields. You can optionally add a few classes to add color/status such as error == red, good == green and alert == yellow/orange. Since you should not use color alone to indicate state, this should be either supplemented with off-screen labels or visual labels near the element explaining the state.

```html
<span class="tag">#Tagged</span>
<span class="tag secondary">#Tagged</span>
<span class="tag error"><span class="audible">Error</span>Delayed</span>
<span class="tag good">Open Order</span>
<span class="tag alert"><span class="audible">Alert</span>Help Order</span>
<br><br><br><br>
<a href="#" id="example-clickable" class="tag is-clickable">#Clickable</a>
<a href="#" id="example-dismissable" class="tag is-dismissable">#Dismissable</a>
```

## Accessibility

-   Since you should not use color alone to indicate states, this should be either supplemented with offscreen or visual labels near the element explaining the state

## Keyboard Shortcuts

-   No keyboard support, but can be added to elements with keyboard support

## States and Variations

-   Dismissible
-   Clickable

## Responsive Guidelines

-   Takes responsiveness from the parent container

## Upgrading from 3.X

-   In 3.x badges and tags were used interchangeably. These now have separated usages that should be reconsidered
