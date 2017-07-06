
# Context Menu [Learn More](https://soho.infor.com/index.php?p=component/about-dialog)

## Api Details

[See popup menu]( ../components/popupmenu)

## Configuration Options

1. Context Menu on an Input [View Example]( ../components/contextmenu/example-index)

## Code Example

The context menu control is also referred to as a popmenu. It can be invoked in several ways. As a right click menu fx on an input field or grid or list row. As a click menu for example on a menu or actions button. Or manually on demand via the api.

The structure of the menu is a ul element with li elements containing links for each of the rows in the menu. An other ul element can be added to create a submenu. Use only one level of submenus for accessibility and usability reasons.

The class popmenu should be added to the ul elements at the top and submenu level. You can create rows as space separators for grouping with the tag with the class separator. You can create rows as groups with titles as well with the class group.

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

## Accessibility

-   Make sure to always focus the triggering element when closing
-   Add aria-hidden when menu is in closed/invisible state
-   Uses role = application for correct modality
-   Elements with a popup get aria-haspopup and aria-owns = id
-   li elements get role = presentation for groups and seperators
-   Checked items get aria-checked
-   Set aria-expanded when open
-   Can role = menu (usually role menu for popup menu, list box is for dropdown cases.
-   Anchor elements get role = menuitem

## Keyboard Shortcuts

-   **Shift F10**
    -   Posts the Popup Menu Widget When it is used as a [Contextual Menu](http://en.wikipedia.org/wiki/Context_menu)
    -   Place input focus on the first available menuitem in the Popup Menu
    -   **Note:** The Browser's Contextual Menu pops up if the element with input focus does not have a Popup Menu attached
-   **ESC**
    -   Causes no menu action and dismisses Popup Menu
    -   Input focus is returned to the element from which the Popup Menu was called
-   **Up/Down Arrow**
    -   Moves input focus vertically between each menuitem
    -   Input focus wraps from the last to the first menuitem on a Down key press and vice-versa when the Up key is pressed.
-   **Right/Left Arrow**
    -   Where applicable, causes a sub-menu to post or un-post
    -   Causes no action if there is no sub-menu
-   **Enter**
    -   Opens the menu if on an element with click linkage. If open, then enter will select the focused menu item.

## States and Variations

The values within the Context Menu take the following states:

-   Focus
-   Hover
-   Disabled

## Responsive Guidelines

-   Should always fit on the screen and scroll inside if necessary.

## Upgrading from 3.X

-   Is relatively backwards compatible except inforContextMenu should be replaced with popupmenu in the api call and class name
-   Remove class divider it is deprecated
-   Checkbox construct is simplified
-   Group replaced with heading
