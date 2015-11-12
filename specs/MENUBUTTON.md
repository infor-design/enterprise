Menu Button

Menu Header Buttons appear in any content header (page headers, card headers, list headers, etc.) and are associated with a group of related actions. For Menu Buttons, none of the actions have a higher priority than the others, so there is no default. When users click a Menu Button, the system displays a menu of actions that can be performed and the user then selects the desired action. Actions on a Menu Button are always a two-click process (click to display menu, then click to select action).

![enter image description here](http://git.infor.com/projects/SOHO/repos/controls/browse/specs/images/menubutton-darkui.png)

## Usage Guidlines

Restrict icon usage to very familiar actions. Icons should always be used with a text label, except on mobile displays.

## UI
* All events are now lower case for consistency. For example some events were called beforeOpen this is now beforeopen. Ect.. Try to search your project for any events fx .on('beforeOpen') and rename. Such beforeopen, animateopen , afterstart, animateclosedcomplete, afterreset, animateclosedcomplete, afteropen, afterpaste, beforeclose, animateopencomplete, beforeactivate
* bar-progress type chart was renamed to completion-chart
* List detail has new markup

## States

**disabled** – The button is dimmed to .7 opacity and cannot be pressed

**close** – With focus on the button pressing space or enter will toggle the display of the drop-down menu. Focus remains on the button.

## Themes

**grey** – (image needed)

**dark** – (image needed)

**high contrast** – (image needed)

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

## Features

**Sub Menus** – Can optionally add one level of sub menus (need image)

**Separators** - Used to space out related menu content

**Heading** - Used to add headings to separated menu content groups

## Exceptions

## Animations

Should animate down with a cubic bezier animation http://cubic-bezier.com/#.94,.03,.04,.17 (Example needed).

## Accessibility


