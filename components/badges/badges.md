---
title: Badges  
description: This page describes Badges.
---

## Configuration Options

1. Default Badge Example [View Example]( ../components/badges/example-index)
2. Additional Badges [View Example]( ../components/badges/example-additional-badges)

## Settings

* Icon Types - error, info or alert associate the element with a status by color. In addition any of the classes from the color-pallette can be used.

## Code Example

A badge is a css only component that uses a span with the class badge. It is possible to add one of the classes : error, info or alert to associate the element with a status by color.  An audible span should always be included for accessibility, it should describe the alert status and/or count value in a meaningful way to a non-visual user. Also an class of `round` can be added to make a perfectly round badge (this only works for 1 or 2 digit numbers).

```html
<span class="round info badge ">5</span>
```

## Accessibility

-   The traffic light colors are accessibility violations for contrast, however, the high contrast theme provides an alternative that passes. In addition in context text should be used as color alone cannot provide the meaning. 
-   Include an offscreen label even though the element does not get focus; this could be read by the virtual cursor on screen readers (class="audible")

## Keyboard Shortcuts

Badges do not have tab stops and have no keyboard interaction on their own, but they may be placed in a grid cell or object that has tab focus.

## Upgrading from 3.X

-   The color classes have changed. See the Color Palette
