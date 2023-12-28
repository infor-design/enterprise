---
title: Context Menu
description: null
demo:
  embedded:
  - name: Context Menu on an Input
    slug: example-index
---

For all API information see the [popup menu](./popupmenu) as this component is used to make a context menu via its option `trigger: 'right-click'`.

## Code Example

The context menu control is also referred to as a popup menu. It can be invoked in several ways:

- as a right click menu; for example, on an input field, grid, or list row
- as a click menu; for example, on a menu or action button
- or manually, on demand, via the API

The structure of the menu is a `<ul>` element with `<li>` elements containing links for each of the rows in the menu. Another `<ul>` element can be added to create a sub-menu. Use only one level of sub-menus for accessibility and usability reasons.

The class `popupmenu` should be added to the `<ul>` elements at the top and sub-menu level. You can create rows as space separators for grouping with the class `separator`. You can create rows as groups with titles with the class `group`.

The popup menu can be linked as a right-click menu item by adding the attribute `data-popupmenu="action-popupmenu"` to any element that should get the menu. This should point to the `id` of the menu.

```html
<div class="field">
  <label for="input-menu">Label</label>
  <input type="text" data-popupmenu="action-popupmenu" value="Right Click Me" id="input-menu">
</div>
<ul id="action-popupmenu" class="popupmenu">
  <li><a href="#" id="cut">Cut</a></li>
  <li><a href="#" id="copy">Copy</a></li>
  <li><a href="#" id="paste">Paste</a></li>
  <li>
    <a href="#" id="paste-special">Paste Special</a>
    <ul class="popupmenu">
      <li><a href="#" id="sub-menu-1">Sub Menu 1</a></li>
      <li><a href="#" id="sub-menu-2">Sub Menu 2</a></li>
    </ul>
  </li>
  <li class="separator"></li>
  <li><a href="#" id="name-project-range">Name and project range</a></li>
  <li><a id='insert-comment' href="#" disabled>Insert comment</a></li>
  <li><a id="insert-note" href="#" disabled>Insert note</a></li>
  <li><a id="clear-notes" href="#">Clear notes</a></li>
  <li class="separator single-selectable-section"></li>
  <li class="heading">Additional Options</li>
  <li class="is-selectable is-checked"><a href="#" id="conditional-fromatting">Conditional formatting</a></li>
  <li class="is-selectable"><a href="#" id="data-validation">Data validation</a></li>
</ul>
```

## Coding Tips

- If necessary, the options can be broken up into categories
- The context menu should not be used as a navigation method
- A right-click menu should never be the only method of performing specific actions as the actions are not easily discoverable by the user

For all additional information, see the [popup menu](./popupmenu) as this component is used to make a context menu via it's option `trigger: 'right-click'`.

## Testability

You can add custom id's/automation id's to the contextmenu component in the input markup inline. For this reason there is no `attributes` setting like some other components.
