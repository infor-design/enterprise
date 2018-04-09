---
title: Dropdown
description: This page describes Dropdown.
demo:
  pages:
  - name: Default Dropdown Example
    slug: example-index
  - name: Clearable Dropdown
    slug: example-clearable.html
  - name: Updating the Contents
    slug: example-updating.html
  - name: Ajax Contents on Open
    slug: example-ajax.html
  - name: Section / Groups
    slug: example-groups.html
  - name: Disable Search
    slug: example-no-search.html
  - name: States
    slug: example-states.htm
  - name: Validation
    slug: example-validation.html
  - name: Widths
    slug: example-widths.html
  - name: Data Attributes
    slug: example-with-data-attribute.html
  - name: Icons
    slug: example-icons.html
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

## Accessibility

The dropdown list is fairly complex to make accessible but generally this can be accomplished in three steps:

1.  Make sure the correct keyboard shortcuts are used
2.  Make sure that there is a `<label>` which matches both the `<input>` and any shadow element `<inputs>`, identifies the field, and is correctly matched using the `<label>` for the `<input>` `id`
3.  Use the following aria tags:
    -   `role="combobox"` on the `<input>`
    -   `aria-expanded` set to `true` when the list is expanded and set to `false` when closed
    -   `role="listbox"` on the open list
    -   `role="option"` on each list item
    -   `aria-activedescendant` to associate the `<input>` to the active list item. It must be removed if no options are selected
    -   `aria-controls` on the input field, containing the ID of the matching dropdown list


## Keyboard Shortcuts

-   <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd> moves focus into and out of the dropdown. If the list is open, <kbd>Tab</kbd> will close the list, selecting the current item, and tab to the next focusable element
-   <kbd>Alt + Down Arrow</kbd> or <kbd>Down Arrow</kbd> opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable, then <kbd>Spacebar</kbd> may also be used to open the dropdown list
-   <kbd>Up</kbd> and <kbd>Down</kbd> arrows moves focus up and down the list. As focus moves inside the dropdown list, the edit field is updated
-   <kbd>Enter</kbd> selects the current item on the list, updates the edit field, highlights the selected item in the dropdown list, closes the dropdown list, and returns focus to the input field
-   <kbd>Escape</kbd> closes the dropdown list, returns focus to the edit field, and does not change the current selection
-   Typing a letter opens the list and filters to the items that start with that letter

## States and Variations

When a Dropdown field is read-only or disabled, the trigger icon is not shown.

## Responsive Guidelines

The dropdown `<input>` should size to the parent container and the `<label>` should remain on the top.

## Upgrading from 3.X

-   Include the SVG icons in the page
-   Change the markup on the `<select>` to use `class="dropdown"`
-   Ensure the `<select>` is attached to a `<label>` with `class="label"` by matchin the `<label for="">` and the `<select id="">`
-   Ensure the `<select>` and `<input>` are wrapped in a `<div>` with `class="field"`
-   You can remove any calls to `.dropdown()` or `.inforDropDown()` as it will now auto initialize to default options

