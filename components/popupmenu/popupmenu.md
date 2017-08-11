# Popupmenu Component [Learn More](#)

## Configuration Options

1. Popupmenu as a Menu Button [View Example]( ../components/popupmenu/example-menubutton)
2. Popupmenu with multiselect [View Example]( ../components/popupmenu/example-selectable-multiple)
3. Popupmenu with single select [View Example]( ../components/popupmenu/example-selectable)
4. Popupmenu with disabled submenus [View Example]( ../components/popupmenu/example-disabled-submenus)
5. Popupmenu with dicons [View Example]( ../components/popupmenu/example-icons)

{{api-details}}

## Code Example

Popupmenu can be invoked in several ways. As a right click action menu fx on an input field or grid or list row (also known as a [ Context Menu]( ../components/contextmenu)). Via a click action menu for example on a menu or actions button. Or manually `trigger='immediate'` as needed via the popupmenu api.

The structure of the menu is a ul element with li elements containing links for each of the rows in the menu. An other ul element can be added to create a submenu. But try to only one level of submenus for accessibility and usability reasons.

The class popupmenu should be added to the ul elements at the top and submenu level. You can create rows as space separators for grouping with the tag with the class `separator`. You can create rows as groups with titles as well with the class group.

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

-   Make sure to always focus the triggering element when closing
-   Add aria-hidden when menu is in closed/invisible state
-   Uses role = application for correct modality
-   Elements with a popup get aria-haspopup and aria-owns = id
-   li elements get role = presentation for groups and separators
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
