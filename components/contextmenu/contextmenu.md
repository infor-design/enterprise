---
title: Context Menu 
description: This page describes Context Menu .
---

## Configuration Options

1. Context Menu on an Input [View Example]( ../components/contextmenu/example-index)

## API Details

For all api information [See the popup menu]( ../components/popupmenu) as this component is used to make a contextmenu via its option `trigger: 'right-click'`.

## Code Example

The context menu control is also referred to as a popupmenu. It can be invoked in several ways. As a right click menu fx on an input field or grid or list row. As a click menu for example on a menu or actions button. Or manually on demand via the api.

The structure of the menu is a ul element with li elements containing links for each of the rows in the menu. An other ul element can be added to create a submenu. Use only one level of submenus for accessibility and usability reasons.

The class popupmenu should be added to the ul elements at the top and submenu level. You can create rows as space separators for grouping with the tag with the class separator. You can create rows as groups with titles as well with the class group.

The popupmenu can be linked as a right click menu item by adding the attribute data-popupmenu="action-popupmenu" to any element that should get the menu, this should point to the id of the menu.

This page focus on the right click popup menu (Context Menu).

```html
<div class="field">
  <label for="input-menu">Label</label>
  <input type="text" data-popupmenu="action-popupmenu" value="Right Click Me" id="input-menu">
</div>
<ul id="action-popupmenu" class="popupmenu">
  <li><a href="#">Cut</a></li>
  <li><a href="#">Copy</a></li>
  <li><a href="#">Paste</a></li>
  <li>
    <a href="#">Paste Special</a>
    <ul class="popupmenu">
      <li><a href="#">Sub Menu 1</a></li>
      <li><a href="#">Sub Menu 2</a></li>
    </ul>
  </li>
  <li class="separator"></li>
  <li><a href="#">Name and project range</a></li>
  <li><a id='x' href="#" disabled>Insert comment</a></li>
  <li><a href="#" disabled>Insert note</a></li>
  <li><a href="#">Clear notes</a></li>
  <li class="separator single-selectable-section"></li>
  <li class="heading">Additional Options</li>
  <li class="is-selectable is-checked"><a href="#">Conditional formatting</a></li>
  <li class="is-selectable"><a href="#">Data validation</a></li>
</ul>
```

## Coding Tips

-   If necessary, the options can be broken up into categories
-   The Context Menu should not be used as a navigation method
-   A shortcut/right-click menu should never be the only method of performing specific actions, as such actions are not easily discoverable by the user

For all additional information [See the popup menu]( ../components/popupmenu) as this component is used to make a contextmenu via its option `trigger: 'right-click'`.
