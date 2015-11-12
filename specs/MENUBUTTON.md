# Menu Button

Menu Header Buttons appear in any content header (page headers, card headers, list headers, etc.) and are associated with a group of related actions. For Menu Buttons, none of the actions have a higher priority than the others, so there is no default. When users click a Menu Button, the system displays a menu of actions that can be performed and the user then selects the desired action. Actions on a Menu Button are always a two-click process (click to display menu, then click to select action).

![image here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-darkui.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)


## Usage Guidlines

Restrict icon usage to very familiar actions. Icons should always be used with a text label, except on mobile displays.

## UI Specs

[Spec Doc Here]

Can be an icon only, text or text and icon button. It has an arrow to indicate a popup menu. (Q: Do we need that?)

## Markup

       <button type="button" class="btn-menu">
        <span>Add Item</span>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-dropdown"></use>
        </svg>
      </button>

## CSS

http://git.infor.com/projects/SOHO/repos/controls/browse/sass/controls/_buttons.scss

http://git.infor.com/projects/SOHO/repos/controls/browse/sass/controls/_popupmenu.scss

## States

**disabled** – The button is dimmed to .7 opacity and cannot be pressed

**close** – With focus on the button pressing space or enter will toggle the display of the drop-down menu. Focus remains on the button.

## Themes

**grey**

![enter image description here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-normal.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

**dark**

![image here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-darkui.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

**high contrast**

![enter image description here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-highcontrast.png?at=ad9c7ab8492e24e1ff4d3c98908e7a8a14eef8f3&raw)

## Events

**open** – With focus on the button pressing space or enter will toggle the display of the drop-down menu. Focus remains on the button.

**close** – With focus on the button pressing space or enter will toggle the display of the drop-down menu. Focus remains on the button.

**select** – a selection event would fire when a item is selected from the menu

**click** – a click event would fire when the button is clicked


## Keyboard

**Space or Enter** – With focus on the button pressing space or enter will toggle the display of the drop-down menu. Focus remains on the button.

**Down Arrow** -  With focus on the button and no drop down menu displayed, pressing down arrow will open the drop-down menu and move focus into the menu and onto the first menu item. With focus on the button and the drop-down menu open, pressing down arrow will move focus into the menu onto the first menu item.

**Up and down arrow** – With focus on the drop-down menu, the up and down arrow keys move focus within the menu items, “wrapping” at the top and bottom.

**Escape** – With focus on the drop-down menu, pressing escape closes the menu and returns focus to the button.

**Tab Key** - With focus on the button pressing the tab key will take the user to the next tab focusable item on the page. With focus on the drop-down menu, pressing the tab key will take the user to the next tab focusable item on the page. Note that this may be difficult to achieve on a web page.

## Behaviors

**Positioning Logic** – The following logic should be used..

a) Check if the button will fit more on the top or bottom of the button and place it there
b) if it does not fit vertically from top to bottom

**Submenu Ease of Use** – Logic should be used to prevent the submenu from opening as the user moves the mouse down the list for each row they pass. To do this you need to watch the mouse move, mouse start and hover event. On mouse enter get the x position and store it on next mouse enter check if the x position is down or moving at a 45% angle then use a 300ms timeout to open the menu if the mouse is moving the left direction.

**Right To Left** – Icons and menu direction move to the right side and reverse. The button moves to the opposite side of the toolbar.
[image needed]

## Features

**Sub Menus** – Can optionally add one level of sub menus (need image)

**Separators** - Used to space out related menu content

**Heading** - Used to add headings to separated menu content groups

## Mobile

**Touch** - when a button is touched there is a 300ms delay this should be normalized so the button opens immediately. This applies

**Close out** - when using a screen reader the user cannot click out of the menu to close. For this case we need to add an extra X icon to the control.

## Animations

 - Should animate down with a cubic bezier animation http://cubic-bezier.com/#.94,.03,.04,.17 (Example needed).
 - When the button is clicked a "circular" ball flash across the touch area.

## Accessibility

 - The button element should have aria-haspopup="true" to indicate it has a popup
 - The button element should have aria-controls="id" where the id is the id of the menu element
 - Tooltip is option but not an accessibility feature
 - Make sure the button has an audible label unless it has text to describe it fully (text button)
 - The menu ul element should have role = "menu"
 - The menu ul element should have aria-hidden = "false" while not visible so screen readers do not see its content when not open
 - The menu li element should have role = "presentation"
 - The menu a element should have role = "menuitem"
- The menu a element should have role = "menuitemcheckbox" if it contains a check

## Implementations

 - Core version [link] - This is the most complete implementation
 - React version [link] - This implements only the ui mouse only control
 - Angular version [link] - This is missing submenus and accessibility
 - EXTJS version [link] - This is missing submenus and accessibility
 - GWT version [link] - This implementation is broken

