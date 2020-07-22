---
title: Flex Toolbar
description: Used for building highly-configurable Toolbars for sections of your application.  The Flex Toolbar displays a row of buttons, searchfields, and hyperlinks in different alignable sections, along with contextual information about a workflow or process.  The Flex Toolbar can also be responsive, intelligently hiding buttons that can't be shown on-screen, and displaying them in an overflow menu.
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
  - name: Contains a collapsible Searchfield with responsive behavior
    slug: example-collapsible-searchfield
---

## Code Examples

To build an IDS Flex Toolbar that is similar to a [legacy IDS Toolbar]('./toolbar'):

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

These `.toolbar-section` elements can be designed to align their contents to the left, right, or center of the container.  This can be done with IDS's built-in [typography CSS classes]('./typography'), or by writing your own CSS for your own custom sections.

By default a `.toolbar-section` element will take on the Flexbox alignment rules designated by its parent `.flex-toolbar` element.  Since there are no default rules on these sections about how to shrink or grow, the toolbar section will simply take on the size of its contained elements and align to the left by default (or to the right in RTL scenarios).

Using a `.fluid` CSS class adds a property `flex-grow: 1;` to the section, which will cause it to grow if there is space to do so.

#### Backwards compatibility

To provide compatibility with the legacy Toolbar, you can add `.title` and `.buttonset` CSS classes to your toolbar sections, as seen in the main sample above.  These section types automatically grow with `flex-grow: 1;` to provide similar layout to the legacy Toolbar.

It's also possible to add a `.favor` class to either of these section types, which similates the legacy toolbar setting `favorButtonset`:

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

- Standard [IDS Buttons]('./button')
- [IDS Menu Buttons]('./menubutton')
- [IDS Hyperlinks]('./hyperlinks')
- [IDS Colorpickers]('./colorpicker')

Note that while Searchfield components are supported by the Flex Toolbar, they will not display or function properly if they are placed inside of a Buttonset section.

### Searchfield behavior

The legacy IDS Toolbar had a design that forced an included IDS Searchfield to sit to the left of all buttons in the Buttonset area (or the right in RTL scenarios).

Conversely, the Flex Toolbar allows for more configurable placement of the Searchfield:

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

### "More Actions" menu button behavior

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

When the area of your page containing the toolbar is resized, or is otherwise too small to contain all actions present on the Toolbar, the "More Actions" button's attached [IDS Popupmenu component]('./popupmenu') will begin to display these actions as menu items instead of buttons.

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

Alternatively, it's possible to always display a "More Actions" button by pre-defining menu items in its attached [Popupmenu]('./popupmenu').  While the Flex Toolbar automatically converts its inline buttons into overflowed menu items if it can't display those buttons, it's more performant and preferable to pre-define "More Actions" menu items instead if these menu items may be overflowed most or all of the time.

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

## Accessibility

- The toolbar automatically appends the WAI-ARIA role "toolbar" to its base element.
- There is only ever one element inside of a toolbar at a time that can receive focus. The Flex Toolbar allows for navigation among all of its buttons with the arrow keys.

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

Each [button](./buttons) or [text input field](./input) in the toolbar will inherit the usual states that can be expected for those components.

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

When there are too many buttons, inputs, or other items present on the toolbar to fit on one line, items that would normally wrap to a second line are hidden. The hidden items will move to an overflow [action button.](./menubutton).
