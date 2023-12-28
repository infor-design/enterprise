---
title: Flex Toolbar
description: Used for building highly-configurable Toolbars for sections of your application.  The Flex Toolbar displays a row of buttons, searchfields, and hyperlinks in different align able sections, along with contextual information about a workflow or process.  The Flex Toolbar can also be responsive, intelligently hiding buttons that can't be shown on-screen, and displaying them in an overflow menu.
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
  - name: Gauntlet (Sandbox)
    slug: test-gauntlet
  - name: Centered Buttonset
    slug: example-centered-content
  - name: Title with Eyebrow Text
    slug: example-eyebrow
  - name: Favor display of the Buttonset side
    slug: example-favor-buttonset
  - name: Favor display of the Title side
    slug: example-favor-title
  - name: Using a Hyperlink inside a Buttonset
    slug: example-header-link
  - name: Contains a "More Actions" button
    slug: example-more-actions-default-behavior
  - name: Contains an AJAX-driven "More Actions" button
    slug: example-more-actions-ajax
  - name: Contains a "More Actions" button with predefined menu items
    slug: example-more-actions-predefined
---

## Code Examples

To build an IDS Flex Toolbar that is similar to a [legacy IDS Toolbar](../toolbar/readme.md):

```html
<div class="flex-toolbar">
  <div class="toolbar-section title">
    <h2>This is the Title</h2>
  </div>
  <div class="toolbar-section buttonset">
    <!-- Insert IDS Buttons here -->
  </div>
  <div class="toolbar-section search">
    <!-- Insert IDS Searchfield here -->
  </div>
  <div class="toolbar-section more">
    <!-- Begin More Actions Button -->
    <button class="btn-actions">
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use href="#icon-more"></use>
      </svg>
      <span class="audible">More Actions</span>
    </button>
    <ul class="popupmenu">
      <li><a href="#">Pre-defined Item #1</a></li>
      <li><a href="#">Pre-defined Item #2</a></li>
      <li><a href="#">Pre-defined Item #3</a></li>
    </ul>
    <!-- End More Actions Button -->
  </div>
</div>
```

### Customize with CSS

The Flex Toolbar was designed to be more customizable with CSS than the legacy toolbar.  Its layout is created by utilizing [CSS's Flexbox display type](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), allowing easy customization with CSS where necessary.  Because of this, it's now possible to create toolbars with multiple `.toolbar-section` container elements, as seen in the example below.

```html
<div class="flex-toolbar">
  <div class="toolbar-section one"></div>
  <div class="toolbar-section two"></div>
  <div class="toolbar-section three"></div>
  <div class="toolbar-section four"></div>
  <div class="toolbar-section five"></div>
</div>
```

These `.toolbar-section` elements can be designed to align their contents to the left, right, or center of the container.  This can be done with IDS's built-in [typography CSS classes](../typography/readme.md), or by writing your own CSS for your own custom sections.

By default a `.toolbar-section` element will take on the Flexbox alignment rules designated by its parent `.flex-toolbar` element.  Since there are no default rules on these sections about how to shrink or grow, the toolbar section will simply take on the size of its contained elements and align to the left by default (or to the right in RTL scenarios).

Using a `.fluid` CSS class adds a property `flex-grow: 1;` to the section, which will cause it to grow if there is space to do so.

#### Backwards compatibility for alignment

To provide compatibility with the legacy Toolbar, you can add `.title` and `.buttonset` CSS classes to your toolbar sections, as seen in the main sample above.  These section types automatically grow with `flex-grow: 1;` to provide similar layout to the legacy Toolbar.

It's also possible to add a `.favor` class to either of these section types, which simulates the legacy toolbar setting `favorButtonset`:

```html
<!-- favorButtonset: true -->
<div class="toolbar-section buttonset favor"></div>

<!-- favorButtonset: false -->
<div class="toolbar-section title favor"></div>
```

You can also simply prevent either section from growing by adding a `.static` CSS class:

```html
<!-- Only takes up the space of its child content -->
<div class="toolbar-section buttonset static"></div>
```

### Title behavior

Some cases call for an "Eyebrow" (or subheader) on a Title section to contain more detailed information.  It's possible to display the Eyebrow in a title like this:

```html
<div class="toolbar-section title">
  <h2 class="page-title">Page Title</h2>
  <span class="section-title">Smaller Subsection Title with Details</span>
</div>
```

### Buttonset Behavior

Currently, the only types of components that can be present inside the buttonset are:

- Standard [IDS Buttons](../button/readme.md)
- [IDS Menu Buttons](../../../app/views/components/button/example-menubutton.html)
- [IDS Hyperlinks](../hyperlinks/readme.md)
- [IDS Colorpickers](../colorpicker/readme.md)

Note that while Searchfield components are supported by the Flex Toolbar, they will not display or function properly if they are placed inside of a Buttonset section.

### Searchfield behavior

The legacy IDS Toolbar had a design that forced an included IDS Searchfield to sit to the left of all buttons in the Buttonset area (or the right in RTL scenarios).

Conversely, the Flex Toolbar allows for a more configurable placement of the Searchfield:

```html
<div class="flex-toolbar">
  <div class="toolbar-section search">
    <div class="searchfield-wrapper">
      <label for="toolbar-searchfield-01" class="audible">Toolbar Search</label>
      <input id="toolbar-searchfield-01" class="searchfield" placeholder="Search..." data-options="{ 'clearable': true, 'collapsible': true }"/>
    </div>

    <div class="toolbar-section title align-text-right">
      <h2>Opposite Searchfield</h2>
    </div>
  </div>
</div>
```

The `.toolbar-section.search` container for the Searchfield facilitates this, as well as an improved Responsive feature that better allows it to take up space on a smaller screen.

### "More Actions" / Overflow menu button behavior

The "More Actions" button is a special Menu Button component that contains additional actions for your workflow/process that cannot be displayed on the Toolbar, either purposefully, or because there are already too many other actions present.

The "More Actions" button has its own `.toolbar-section.more` container:

```html
<div class="toolbar-section more">
  <button class="btn-actions">
    <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
      <use href="#icon-more"></use>
    </svg>
    <span class="audible">More Actions</span>
  </button>
</div>
```

When the area of your page containing the toolbar is resized, or is otherwise too small to contain all actions present on the Toolbar, the "More Actions" button's attached [IDS Popupmenu component](../popupmenu/readme.md) will begin to display these actions as menu items instead of buttons.

Because some of the buttons may not be visible at some breakpoints they can not always be clicked in order to fire a click event. To handle this the flex toolbar will instead omit a `selected` event that will fire when any item in the overflow menu is clicked from the menu or when any toolbar item is clicked. So it my be advisable to always use the `selected` event fire handling when any toolbar item is clicked or selected from the menu. For example:

```js
  $('.flex-toolbar').on('selected.test', function(e, item, secondArg) {
    var text = $(item.element).text().trim();
    var selectedItem;

    if (secondArg) {
      selectedItem = 'Selected Menu Item: ' + $(secondArg).text().trim() + '<br />';
    }

    $('body').toast({
      title: 'Toolbar Item Selected',
      message: '<p>' +
        'text content: "<b>'+ text +'</b>"<br/>' +
        'item type: "<b>'+ item.type +'</b>"' +
        (selectedItem ? '<br />' + selectedItem : '') +
        '</p>'
    });
```

#### Never Display a More Actions button

The legacy IDS Toolbar automatically displays a "More Actions" button when too many items are present with not enough space.

The same behavior will occur when a "More Actions" button is present on the Flex Toolbar.  However, instead of configuring this via Javascript settings, disabling this feature is now done by simply not including a More Actions menu on the Flex Toolbar.  Note that in this configuration, buttons will simply be cut off and unavailable if there are too many to display:

```html
<div class="flex-toolbar">
  <div class="toolbar-section buttonset">
    <!-- [insert 10-15 buttons here] -->
  </div>

  <!-- no "More Actions" button in the HTML -->
</div>
```

#### Always Display a More Actions button

Alternatively, it's possible to always display a "More Actions" button by pre-defining menu items in its attached [Popupmenu](../popupmenu/readme.md). While the Flex Toolbar automatically converts its inline buttons into overflowed menu items if it can't display those buttons, it's more performant and preferable to pre-define "More Actions" menu items instead if these menu items may be overflowed most or all of the time.

```html
<div class="toolbar-section more">
  <button class="btn-actions">
    <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
      <use href="#icon-more"></use>
    </svg>
    <span class="audible">More Actions</span>
  </button>
  <ul class="popupmenu">
    <li><a href="#">Pre-defined Item #1</a></li>
    <li><a href="#">Pre-defined Item #2</a></li>
    <li><a href="#">Pre-defined Item #3</a></li>
  </ul>
</div>
```

## Backwards Compatibility with the IDS Toolbar

The legacy IDS toolbar component's visual design is heavily driven by Javascript and has very specific use cases for its layout.  It's overflow system and resize algorithm were heavily JS-based, which was very heavy on browser repainting.  Additionally it had many problems addressing the layout needs of many consumers of our library.

Flex Toolbar does a lot in the way of fixing the layout and performance issues.  However, not all of the legacy components JS settings have carried over 1-to-1 with the Flex Toolbar.  Some discrepancies are listed below.  Please note that while these settings might not exist on the new component, the configuration necessary to make these customizations exists, and is possibly easier to implement:

### Removal of Javascript-based Resizing

`resizeContainers()` is an internal method in the legacy Toolbar that shouldn't really ever be called directly, except for some very specific cases where resizing needs to happen outside the normal toolbar lifecycle.  Previously, it may have been necessary to interact with this method for specific reasons.  This method no longer exists due to the CSS-based nature of the toolbar layout, so any references to it should be removed.

### Some Javascript API settings are now CSS-driven

The `favorButtonset`, `favorTitle`, and `rightAligned` settings are all now controlled with built-in CSS classes, or can be controlled with user-defined CSS instead.

### Number of Toolbar actions displayed is now more configurable

The `maxVisibleButtons` setting that was present on the previous toolbar no longer exists. Due to the sheer number of cases we couldn't make a configuration for this that worked for everyone, so instead we removed it in favor of user-definable sections and pre-defined menu items.

The Flex Toolbar is different in that it allows for multiple, indeterminate numbers of `buttonset`-style sections, instead of one.  However, it's still possible to limit the number of items shown in any of these sections.  For example, in a case where 10 buttons would be available in a section, but we only want to show three of them, setting a hard CSS max-width on the toolbar section in question that contains space for the first three.  You could also only explicitly create three buttons, and preload the rest of the items as "More Actions" menu list items, since that's where they'll end up anyway.

## Accessibility

- The toolbar automatically appends the WAI-ARIA role "toolbar" to its base element.
- There is only ever one element inside of a toolbar at a time that can receive focus. The Flex Toolbar allows for navigation among all of its buttons with the arrow keys.
- Handles the correct accessible keyboard navigation with left and right arrow (vs tabs)

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus to the first enabled toolbar item.
- Pressing <kbd>Tab</kbd> a second time will either:
    - Move focus out of the toolbar, if `allowTabs: false` is set.
    - Move focus to the next toolbar item, if `allowTabs: true` is set.
- <kbd>Left</kdb>/<kbd>Up</kbd> and <kbd>Right</kbd>/<kbd>Down</kbd> keys navigate among the enabled items in the toolbar.
    - When an Input or Searchfield becomes focused, <kbd>Left</kbd>/<kbd>Right</kbd> will not navigate away from the item.  Instead these buttons will be reassigned their native control of the Input field.
- <kbd>Enter/Return</kbd> will "select" the Toolbar item, if the item is a Button/Hyperlink type. If the item is a Menu Button or Colorpicker, selection will not occur until a sub-item is chosen from these components' menus. Input fields are not selectable.
- Keyboard navigation within open Menu Buttons, Action Buttons, or Colorpickers defers to those components' keyboard handling.

## States and Variations

Each [button](../button/readme.md) or [text input field](../input/readme.md) in the toolbar will inherit the usual states that can be expected for those components.

### Enable/Disable

The Flex Toolbar component can be completely enabled or disabled by using the API-level methods `enable()` or `disable()`.

```js
// Get access to the API
const flexToolbar = $('#my-flex-toolbar');
const flexToolbarAPI = flexToolbar.data('toolbar-flex');
flexToolbarAPI.disabled = true;
```

Additionally, if you have access to a Flex Toolbar Item API, each individual item can be enabled/disabled with a similar API:

```js
// Get reference to a toolbar's items.
// This is an array of "FlexToolbarItem" APIs.
const items = flexToolbarAPI.items;

// Disable item #3
items[3].disabled = true;
```

### Right-To-Left

The Flex Toolbar component will automatically flip the orientation of its various sections horizontally when switched to RTL mode.

If you create custom CSS classes to add to your `.toolbar-section` containers, ensure that you have RTL-specific rules that will also switch things like text alignment, padding location, etc. in the presence of an `html[dir="rtl"]` rule.

## Responsive Guidelines

When there are too many buttons, inputs, or other items present on the toolbar to fit on one line, items that would normally wrap to a second line are hidden. The hidden items will move to an overflow action button.

## Testability

You can add custom id's/automation id's to the Flex Toolbar that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes.
For example:

```js
  attributes: { name: 'id', value: args => `background-color` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [
    { name: 'id', value: 'my-unique-id' },
    { name: 'data-automation-id', value: 'my-unique-id' }
  ]
```

These attributes can be added programmatically using the Flex Toolbar API:

```js
  $('#my-flex-toolbar').toolbarflex({
    attributes: [
      { name: 'data-automation-id', value: 'my-toolbar' }
    ]
  });
```

Setting attributes in this manner labels all the following elements:

- the root level Toolbar element gets an attribute of `my-toolbar`
- all Toolbar Items will get a string that looks like `my-toolbar-${type}-${index}-${extra}`, depending on their composition.

For example, a standard button might appear as:

```html
<button class="btn" data-automation-id="my-toolbar-button-0">
  <span>Text Button</span>
</button>
```

A menu button might look like the following example. Internally, the extraneous "trigger" text is appended to this element because Flex Toolbar is aware that this is a [MenuButton](../../../app/views/components/button/example-menubutton.html), and defers to that component to apply attributes.  The Flex Toolbar concatenates the attribute value internally:

```html
<button class="btn-menu" data-automation-id="my-toolbar-menubutton-1-trigger">
  <span>Menu Button</span>
</button>
<!-- ... -->
<div class="popupmenu-wrapper">
  <ul class="popupmenu" data-automation-id="my-toolbar-menubutton-1-menu">
    <li class="popupmenu-item">
      <a href="#" data-automation-id="my-toolbar-menubutton-1-option-0">Item One</a>
    </li>
    <li class="popupmenu-item">
      <a href="#" data-automation-id="my-toolbar-menubutton-1-option-1">Item Two</a>
    </li>
    <li class="popupmenu-item submenu">
      <a href="#" data-automation-id="my-toolbar-menubutton-1-option-2">Item Three</a>
    </il>
  </ul>
</div>
```

A "More Actions" button -- being a type of Menu Button itself -- will contain similarly-named attributes with different values on it's "overflowed" version of a Flex Toolbar Menu Button:

```html
<button class="btn-actions" data-automation-id="my-toolbar-actionbutton-5-trigger">
  <svg class="icon" role="presentation">
    <use href="#icon-more"></use>
  </svg>
  <span class="audible">More Actions</span>
</button>
<!-- ... -->
<div class="popupmenu-wrapper">
  <ul class="popupmenu" data-automation-id="my-toolbar-actionbutton-5-menu">
    <li class="popupmenu-item">
      <a href="#" data-automation-id="my-toolbar-actionbutton-5-option-0">Text Button</a>
    </li>
    <li class="popupmenu-item submenu">
      <a href="#" data-automation-id="my-toolbar-actionbutton-5-option-1">Menu Button</a>
      <div class="wrapper">
        <ul class="popupmenu">
          <li class="popupmenu-item">
            <a href="#" data-automation-id="my-toolbar-actionbutton-5-option-1-0">Item One</a>
          </li>
          <li class="popupmenu-item">
            <a href="#" data-automation-id="my-toolbar-actionbutton-5-option-1-1">Item Two</a>
          </li>
          <li class="popupmenu-item">
            <a href="#" data-automation-id="my-toolbar-actionbutton-5-option-1-2">Item Three</a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</div>
```

For other component types, such as [Colorpicker](../colorpicker/readme.md), [Searchfield](../searchfield/readme.md), etc., attribute values are similarly passed down.  This provides a way for a developer to simply implement a single ID on the Toolbar API that will be respected for all components the Toolbar contains.

If you only need to test a specific Flex Toolbar Item, and not the entire component (for example, one button out of five), please either set attributes directly on those elements, or use their respective component API's `attributes` setting, if applicable.
