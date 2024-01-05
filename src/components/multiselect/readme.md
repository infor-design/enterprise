---
title: Multi-Select
description:
demo:
  embedded:
  - name: Multiselect
    slug: example-index
  pages:
  - name: Clear All
    slug: example-clear-all
  - name: Ajax
    slug: example-ajax
  - name: States
    slug: example-states
---

The MultiSelect Component allows selecting multiple items from a list. Multiselect inherits from dropdown so please refer to [dropdown](./dropdown) for more API details and events.

## Code Example

The basic drop down works similar to a standard HTML `<select>` element but because of styling and functionality requirements we use a stylized `<div>` which implements the dropdown behavior and updates in sync with a hidden `<select>` element. This allows the `<select>` element to be serialized with the DOM like normal. The most simple way to use the dropdown is to create markup containing a `field` class (for field and responsive form alignment), a `<label>` and a `<select>`. For accessibility and implementation reasons the `<label>` is required.

Create a select element with similar markup:

The control is initialized through the page initializer `$('body').initialize('en-US');` or manually with `$('.multiselect').multiselect()`;

```html
<div class="field">
  <label for="states" class="label">States</label>
  <select multiple id="states" name="states" data-maxselected="3" class="multiselect">
    <option value="AL">Alabama</option>
    <option value="CA">California</option>
    <option value="DE">Delaware</option>
    <option value="NY">New York</option>
    <option value="WY">Wyoming</option>
  </select>
</div>
```

## Behavior Guidelines

- Multi-select dropdowns should have checkboxes, to distinguish them from [single-select drop downs](./dropdown).
- When choosing options from the Multi-Select Dropdown list, the list should remain open.

## Accessibility

The multi-select list is fairly complex to make accessible. But generally this can be accomplished in three steps:

1. Make sure the correct keyboard shortcuts are used
2. Make sure that there is a `<label>` which matches both the `<input>` and any shadow element `<inputs>`, identifies the field, and is correctly matched using the `<label>` for the `<input>` `id`
3. Use the following aria tags:
    - `role="combobox"` on the `<input>`
    - `aria-expanded` set to `true` when the list is expanded and set to `false` when closed
    - `role="listbox"` on the open list
    - `role="option"` on each list item
    - `aria-activedescendant` to associate the `<input>` to the active list item. It must be removed if no options are selected
    - `aria-controls` on the input field, containing the ID of the matching dropdown list

## Testability

You can add custom id's/automation id's to the multiselect component via the dropdown component. For this reason there is no `attributes` setting like some other components.

## Keyboard Shortcuts

- <kbd>Tab</kbd> and <kbd>Shift+Tab</kbd> moves focus into and out of the dropdown. If the list is open, <kbd>Tab</kbd> will close the list, selecting the current item, and move to the next focusable element
- <kbd>Alt + Down Arrow</kbd> or <kbd>Down Arrow</kbd> opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable, then <kbd>Space</kbd> may also be used to open the dropdown list
- <kbd>Up</kbd> and <kbd>Down</kbd> arrows moves focus up and down the list. As focus moves inside the dropdown list, the edit field is updated
- <kbd>Enter</kbd> selects the current item on the list, updates the edit field, highlights the selected item in the dropdown list, closes the dropdown list and returns focus to the input field
- <kbd>Escape</kbd> closes the dropdown list, returns focus to the edit field, and does not change the current selection
- Typing a letter opens the list and filters to the items that start with that letter

## States and Variations

When a Multi-Select Dropdown is read-only or disabled, the trigger icon is not shown.

## Responsive Guidelines

The Multi-Select Dropdown should always be preceded by a label element.

## Upgrading from 3.X

In 3.x there was no separate Multi-Select element.
