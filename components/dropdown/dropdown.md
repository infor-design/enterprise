---
title: Dropdown  
description: This page describes Dropdown.
---

## Configuration Options

1. Default Dropdown Example [View Example]( ../components/dropdown/example-index)
2. Clearable Dropdown [View Example]( ../components/dropdown/example-clearable.html)
3. Updating the Contents [View Example]( ../components/dropdown/example-updating.html)
4. Ajax Contents on Open [View Example]( ../components/dropdown/example-ajax.html)
5. Section / Groups [View Example]( ../components/dropdown/example-groups.html)
6. Disable Search [View Example]( ../components/dropdown/example-no-search.html)
7. States [View Example]( ../components/dropdown/example-states.htm)
8. Validation [View Example]( ../components/dropdown/example-validation.html)
9. Widths [View Example]( ../components/dropdown/example-widths.html)
10. Data Attributes [View Example]( ../components/dropdown/example-with-data-attribute.html)
11. Icons [View Example]( ../components/dropdown/example-icons.html)

## Behavior Guidelines

-   To distinguish between single and multi-select situations, use checkboxes in multi-select lists.
-   The field height is not dynamic; do not expand the height of the field to display multiple selections. See the live example for how multiple selections are handled in the field display and the list display.

## Code Example

The basic drop down works similar to a standard Html select element, because of styling and functionality requirements we use a stylized shadow widget which implements the drop down behavior and updates in sync with a hidden select element. This allows the select element to be serialized with the DOM like normal. The simplest way to use the drop down is to create markup containing: a field (for field and responsive form alignment), a label and a select. For accessibility and implementation reasons the label is required.\
 Create a select element with similar markup:

The control is initialized through the page initializer \$('body').initialize('en-US'); or manually with `$('.dropdown').dropdown();`

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

## Accessibility

The Dropdown list is fairly complex to make accessible. But generally this can be accomplished in three steps:

1.  Make sure the above keyboard shortcuts are used
2.  Make sure that there is a label which matches both the input and any shadow element inputs, and identifies the field and is correctly matched using the label for the input id
3.  Use the following aria tags:
    -   role="combobox" - must be set on the input
    -   aria-expanded - set to true when the list is expanded, set to false when closed
    -   role="listbox" on the open list
    -   role="option" on each list item
    -   aria-activedescendant - associates the input to the active list item. Must be removed if no options are selected.
    -   aria-controls on the input field, containing the ID of the matching Dropdown list.


## Keyboard Shortcuts

-   **Tab** and **Shift-Tab** moves focus into and out of the Dropdown. If the list is open, tab will close the list selection the current item and tab to the next focusable element.
-   **Alt Down Arrow** or **Down Arrow** opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable, then the space bar may also be used to open the Dropdown list (future).
-   **Up and Down Arrow** moves focus up and down the list. As focus moves inside the Dropdown list, the edit field is updated.
-   **Enter** selects the current item on the list, updates the edit field, highlights the selected item in the dropdown list, closes the Dropdown list and returns focus to the input field.
-   **Escape key** closes the Dropdown list, returns focus to the edit field, and does not change the current selection.
-   **Typing a letter (printable character) key** opens the list and filters to the items that start with that printable letter.

## States and Variations

The Dropdown input field uses the same states as the Text Input field, while the list values use the same states as those in the context menu. The trigger icon supports the following states:

-   Normal
-   Focus
-   Hover
-   Active

When a Dropdown field is read-only or disabled, the trigger icon is not shown.

## Responsive Guidelines

The Dropdown container (the input element) should size to the parent container and the label should remain on the top.

## Upgrading from 3.X

-   Include the svg icons in the page
-   Change the markup on the select to use class="dropdown"
-   Ensure the select is attached to a label with class="label" via the label's for to select's id
-   Ensure the select and input are wrapped in a div with class="field"
-   You can remove any calls to .dropdown() or .inforDropDown() as it will now auto initialize to default options

