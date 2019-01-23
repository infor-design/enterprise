---
title: MenuButton Component
description: null
demo:
  embedded:
  - name: Simple Menu Button
    slug: example-index
  pages:
  - name: Submenus
    slug: example-submenu
  - name: Submenu With Icons
    slug: example-submenu-icons
  - name: Replace Text Content with Selection
    slug: example-replace-text
  - name: Menu Button Events
    slug: test-events
  - name: Selectable Menu Items
    slug: example-selectable
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
  <li><a href="#" id="menu-option-1">Menu Option #1</a></li>
  <li><a href="#" id="menu-option-2">Menu Option #2</a></li>
  <li><a href="#" id="menu-option-3">Menu Option #3</a></li>
</ul>
```

## Accessibility and Keyboard Shortcuts

See [popupmenu]( ./popupmenu) for details.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
