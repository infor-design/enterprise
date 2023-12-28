---
title: Dropdown
description: Displays one or more selectable values in a menu that is collapsed by default. A user can select an actionable value. Best used when users do not require a view of all possible values at all times.
demo:
  embedded:
  - name: Default Dropdown Example
    slug: example-index
  pages:
  - name: Ajax Contents on Open
    slug: example-ajax
  - name: Ajax Managed
    slug: example-ajax-managed
  - name: Clearable Dropdown
    slug: example-clearable
  - name: Section / Groups
    slug: example-groups
  - name: Icons
    slug: example-icons
  - name: Disable Search
    slug: example-no-search
  - name: Disable Search filtering
    slug: example-no-search-filtering
  - name: Disable search LSF
    slug: example-no-search-lsf
  - name: Placeholder
    slug: example-placeholder
  - name: Readonly
    slug: example-readonly
  - name: Set value
    slug: example-setvalue
  - name: Tooltips
    slug: example-tooltips
  - name: Updating the Contents
    slug: example-updating
  - name: Validation
    slug: example-validation
  - name: Virtual Scrolling
    slug: example-virtual-scroll
  - name: Widths
    slug: example-widths
  - name: Data Attributes
    slug: example-with-data-attribute
---

To distinguish between single and multi-select situations, use checkboxes in multi-select lists. See the live example for how multiple selections are handled in the field display and the list display. The field height is not dynamic so the height of the field should not be expanded to display multiple selections.

## Code Example

The basic drop down works similar to a standard HTML `<select>` element but because of styling and functionality requirements we use a stylized `<div>` which implements the dropdown behavior and updates in sync with a hidden `<select>` element. This allows the `<select>` element to be serialized with the DOM like normal. The most simple way to use the dropdown is to create markup containing a `field` class (for field and responsive form alignment), a `<label>` and a `<select>`. For accessibility and implementation reasons the `<label>` is required.

Create a `<select>` element with similar markup as below:

```html
<div class="field">
  <label for="states" class="label">States</label>
  <select id="states" name="states" class="dropdown">
    <option value="AL">Alabama</option>
    <option value="CA">California</option>
    <option value="DE">Delaware</option>
    <option value="NY">New York</option>
    <option value="WY">Wyoming</option>
  </select>
</div>
```

The control is initialized through the page initializer with `$('body').initialize('en-US');` or manually with `$('.dropdown').dropdown();`.

## Virtual Scrolling Feature

In order to support cases with 5-15K dropdown items we added virtual scrolling to the dropdown. When this is used the list when open will only show the visible items plus a buffer so that the list can open and work faster for selection. At this time only some basic functionality is supported:

- It works from the options in the select (ajax and some other features not tested)
- Tooltips will work
- Type ahead search will work

One issue is that you should provide a width / maxWidth option when using this feature if all the items will vary greatly in size because all items are not rendered at once. If you don't when scrolling quickly the list may shuffle width and look a bit strange.

```js
$('dropdown-id')
  .append(markup) // Append thousands of options
  .dropdown({ width: 420, maxWidth: 450, virtualScroll: true });
```

## Accessibility

The dropdown list has been coded to act similar to the [aria best practices collapsible dropdown listbox](https://w3c.github.io/aria-practices/examples/listbox/listbox-collapsible.html). With some variations such as not having `aria-selected` as the value is only selected when you press enter. Also when opening the dropdown there is a filter field where you can type to filter.

1. Make sure that there is a `<label>` which matches both the `<input>` and any shadow element `<inputs>`, identifies the field, and is correctly matched using the `<label>` for the `<input>` `id`
1. Uses the following aria tags:
    - The label is copied into the visible field so it is read when you tab to the button along with the value.
    - `aria-haspopup="listbox` Indicates that activating the button displays a listbox.
    - `aria-expanded="true"` Is added when the dropdown opens.
    - `aria-activedescendant="ID_REF"` Is added to the filter input so list values are read.
    - Invisible labels on the filter field instruct the user how to

## Testability

The dropdown can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the dropdown. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `dropdown-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

If setting the id/automation id with a function, the id will be a running total of open dropdown.

## Keyboard Shortcuts

- <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd> moves focus into and out of the dropdown. If the list is open, <kbd>Tab</kbd> will close the list, selecting the current item, and tab to the next focusable element
- <kbd>Alt + Down Arrow</kbd> or <kbd>Down Arrow</kbd> opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable, then <kbd>Spacebar</kbd> may also be used to open the dropdown list
- <kbd>Up</kbd> and <kbd>Down</kbd> arrows moves focus up and down the list. As focus moves inside the dropdown list, the edit field is updated
- <kbd>Enter</kbd> selects the current item on the list, updates the edit field, highlights the selected item in the dropdown list, closes the dropdown list, and returns focus to the input field
- <kbd>Escape</kbd> closes the dropdown list, returns focus to the edit field, and does not change the current selection
- Typing a letter opens the list and filters to the items that start with that letter

## States and Variations

When a Dropdown field is read-only or disabled, the trigger icon is not shown.

## Responsive Guidelines

The dropdown `<input>` should size to the parent container and the `<label>` should remain on the top.

## Upgrading from 3.X

- Include the SVG icons in the page
- Change the markup on the `<select>` to use `class="dropdown"`
- Ensure the `<select>` is attached to a `<label>` with `class="label"` by matchin the `<label for="">` and the `<select id="">`
- Ensure the `<select>` and `<input>` are wrapped in a `<div>` with `class="field"`
- You can remove any calls to `.dropdown()` or `.inforDropDown()` as it will now auto initialize to default options
