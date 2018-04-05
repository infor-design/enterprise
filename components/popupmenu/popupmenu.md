---
title: Popupmenu Component
description: This page describes Popupmenu Component .
demo:
  pages:
  - name: Popupmenu as a Menu Button
    slug: example-menubutton
  - name: Popupmenu with multiselect
    slug: example-selectable-multiple
  - name: Popupmenu with single select
    slug: example-selectable
  - name: Popupmenu with disabled submenus
    slug: example-disabled-submenus
  - name: Popupmenu with icons
    slug: example-icons
---

## Code Example

The structure of the menu is a `<ul>` element with `<li>` elements containing links for each of the rows in the menu. Another `<ul>` element can be added to create a sub-menu. Use only one level of sub-menus for accessibility and usability reasons.

The class `popupmenu` should be added to the `<ul>` elements at the top and sub-menu level. You can create rows as space separators for grouping with the class `separator`. You can create rows as groups with titles with the class `group`.

Here is an example of a menu button using a popupmenu. This is also described on the menu button page as the components are linked.

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

## Accessibility

-   Make sure to always focus the triggering element when closing the popupmenu
-   Add `aria-hidden` when menu is in closed/invisible state
-   Uses `role="application"` for correct modality
-   Elements with a popup get `aria-haspopup` and `aria-owns="id"`
-   `<li>` elements get `role="presentation"` for groups and separators
-   Checked items get `aria-checked`
-   Set `aria-expanded` when open
-   Anchor elements get `role="menuitem"`

## Keyboard Shortcuts

-   <kbd>Shift + F10</kbd> opens the popup menu when it is used as a [Contextual Menu](http://en.wikipedia.org/wiki/Context_menu) and places input focus on the first available menuitem in the Popup Menu
    -   **Note:** The browser's contextual menu pops up if the element with input focus does not have a popup menu attached
-   <kbd>ESC</kbd> causes no menu action and dismisses popup menu. Input focus is returned to the element from which the popup menu was called
-   <kbd>Up</kbd> and <kbd>Down</kbd> arrows moves input focus vertically between each menu item. Input focus wraps from the last to the first menu item on a <kbd>Down</kbd> key press and vice-versa when the <kbd>Up</kbd> key is pressed.
-   <kbd>Right</kbd> and <kbd>Left</kbd> arrows, where applicable, causes a sub-menu to open or close. Causes no action if there is no sub-menu
-   <kbd>Enter</kbd> opens the menu if on an element with actionable link. If open, then <kbd>Enter</kbd> will select the focused menu item


## Responsive Guidelines

Popupmenu should always fit on the screen and scroll inside if necessary.

## Upgrading from 3.X

-   This component is relatively backwards compatible except `inforContextMenu` should be replaced with `popupmenu` in the API call and class name
-   Remove class `divider` as it is deprecated
-   Checkbox construct is simplified
-   Group replaced with heading
