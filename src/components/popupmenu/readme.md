---
title: Popupmenu Component
description: null
demo:
  embedded:
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
  - name: Invoking Popupmenu immediately
    slug: example-trigger-immediate
  - name: Popupmenu with shortcut text
    slug: example-shortcut-text
---

## Code Example

### Basic popup menu on a button

The structure of a popupmenu is a `<ul>` element with `<li>` elements containing links for each of the rows in the menu. Another `<ul>` element can be added to create a sub-menu. Use only one level of sub-menus for accessibility and usability reasons.

The class `popupmenu` should be added to the `<ul>` elements at both the top and sub-menu level. You can create rows as space separators for grouping with the class `separator`. You can create rows as groups with titles with the class `group`.

Here is an example of a menu button using a popupmenu. This is also described on the [menu button](./menubutton) page as the components are linked.

```html
<button id="btn-menu" class="btn-menu">
  <span>Normal Menu</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
    <use href="#icon-dropdown"></use>
  </svg>
</button>
<ul class="popupmenu">
  <li><a href="#" id="menu-option-1">Menu Option #1</a></li>
  <li><a href="#" id="menu-option-2">Menu Option #2</a></li>
  <li><a href="#" id="menu-option-3">Menu Option #3</a></li>
</ul>
```

### Initialization as a context menu

In addition to invoking popupmenus on menu button clicks, menus can also be invoked as a right click menu. This is covered under the [contextmenu example](./contextmenu). The contextmenu is really just the popupmenu using the `rightClick` trigger option. Here is an example invoking the popupmenu on the body / page. The `menu` option refers to the id of the `ul` in the page with the menu items, and the `trigger` option is set to `rightClick`.

```javascript
$('body').popupmenu({
    menu: 'action-popupmenu',
    trigger: 'rightClick'
});
```

### Immediate Invocation

You can also invoke popupmenus in javascript whenever you like, for example on button clicks after some dynamic processing. This is covered on the "Invoking Popupmenu immediately" example above. You invoke the menu on a target jQuery element which is where the menu will appear under. Then assign the `menu` which refers to the id of the `ul` in the page with the menu items, and the `trigger` option is set to `immediate`.

```javascript
target.on('selected', function(args, a) {
    console.log(args, a);
}).popupmenu({
    menu: 'action-popupmenu',
    trigger: 'immediate'
});
```

### Single select items and multi select items in the menu

Its possible to make popup menus selectable. They can be single select (single checkmark) or multiselect (checkboxes on the items).

For single select, just add the class `is-selectable` to the `popupmenu` item. And you can optionally set one of the items as selected by adding the class `is-checked` to that item.

```html
<ul class="popupmenu is-selectable">
    <li><a href="#">Menu Option #1</a></li>
    <li><a href="#">Menu Option #2</a></li>
    <li><a href="#">Menu Option #3</a></li>
    <li class="is-checked"><a href="#">Sub Option #4</a></li>
    <li><a href="#">Menu Option #5</a></li>
    <li><a href="#">Menu Option #6</a></li>
</ul>
```

For multi select, just add the class `is-multiselectable` to the `popupmenu` item. And you can optionally set one or more of the items as selected by adding the class `is-checked` to those items.

```html
  <ul class="popupmenu is-multiselectable">
<li><a href="#">Menu Option #1</a></li>
<li class="is-checked"><a href="#">Sub Option #2</a></li>
<li><a href="#">Menu Option #3</a></li>
<li><a href="#">Menu Option #4</a></li>
<li><a href="#">Menu Option #5</a></li>
<li><a href="#">Menu Option #6</a></li>
</ul><
```

### Detecting menu selections

To know when a menu item is clicked, selected or deselected you use the `selected` event.
This should be attached to the item that is getting the popup menu (target). For example.

```javascript
target.on('selected', function(args, a) {
    console.log(args, a);
}).popupmenu({
    menu: 'action-popupmenu',
    trigger: 'immediate'
});
```

Or it can be attached on the fly in the page.

```html
<div class="field">
  <button id="popupmenu-trigger" class="btn-menu">
    <span>Normal Menu</span>
    <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
      <use href="#icon-dropdown"></use>
    </svg>
  </button>
  <ul class="popupmenu">
    <li><a href="#">Menu Option #1</a></li>
    <li><a href="#">Menu Option #2</a></li>
    <li><a href="#">Menu Option #3</a></li>
  </ul>
</div>

<script>
  $('#popupmenu-trigger').on('selected', function (e, args){
    console.log(e, args);
  });
</script>
```

## Accessibility

- Make sure to always focus the triggering element when closing the popupmenu
- Add `aria-hidden` when menu is in closed/invisible state
- Elements with a popup get `aria-haspopup` and `aria-owns="id"`
- `<li>` elements get `role="presentation"` for groups and separators
- Checked items get `aria-checked`
- Set `aria-expanded` when open
- Anchor elements get `role="menuitem"`

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Shift + F10</kbd> opens the popup menu when it is used as a <a href="http://en.wikipedia.org/wiki/Context_menu" target="_blank">Context Menu</a> and places input focus on the first available menu item in the Popup Menu. Note that the browser's contextual menu pops up if the element with input focus does not have a popup menu attached
- <kbd>ESC</kbd> causes no menu action and dismisses popup menu. Input focus is returned to the element from which the popup menu was called
- <kbd>Up</kbd> and <kbd>Down</kbd> arrows moves input focus vertically between each menu item. Input focus wraps from the last to the first menu item on a <kbd>Down</kbd> key press and vice-versa when the <kbd>Up</kbd> key is pressed.
- <kbd>Right</kbd> and <kbd>Left</kbd> arrows, where applicable, causes a sub-menu to open or close. Causes no action if there is no sub-menu
- <kbd>Enter</kbd> opens the menu if on an element with actionable link. If open, then <kbd>Enter</kbd> will select the focused menu item

## Responsive Guidelines

Popupmenu should always fit on the screen and scroll inside if necessary.

## Upgrading from 3.X

- This component is relatively backwards compatible except `inforContextMenu` should be replaced with `popupmenu` in the API call and class name
- Remove class `divider` as it is deprecated
- Checkbox construct is simplified
- Group replaced with heading
