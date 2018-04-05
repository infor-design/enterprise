---
title: MenuButton Component
description: This page describes MenuButton Component .
demo:
  pages:
  - name: Simple Menu Button
    slug: example-index
  - name: Menu Button Events
    slug: example-events
  - name: Submenus
    slug: example-submenu.htm
  - name: Submenu With Icons
    slug: example-submenu-icons.htm
  - name: RTL
    slug: example-submenu-icons-rtl.html?locale=ar-SA
  - name: Replace Text Content with Selection
    slug: example-replace-text
---

## Code Example

The menu button component is comprised of the [popupmenu]( ./popupmenu) and [button]( ./popupmenu) components.

Once the proper markup is in place calling `$(elem).button()` will correctly initialize a menu button.
If the arrow is missing in the markup it will be added.

The popupmenu markup follows as per the [popupmenu]( ./popupmenu):

```html
<button class="btn-menu">
  <span>Normal Menu</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
    <use xlink:href="#icon-dropdown"></use>
  </svg>
</button>
<ul class="popupmenu">
  <li><a href="#">Menu Option #1</a></li>
  <li><a href="#">Menu Option #2</a></li>
  <li><a href="#">Menu Option #3</a></li>
</ul>
```

## Accessibility and Keyboard Shortcuts

See [popupmenu]( ./popupmenu) for details.
