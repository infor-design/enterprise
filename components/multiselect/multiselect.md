---
title: About  
description: This page describes About.
---

## Configuration Options

1. Multiselect [View Example]( ../components/multiselect/example-index)
2. Clear All [View Example]( ../components/multiselect/example-clear-all)
3. Ajax [View Example]( ../components/multiselect/example-ajax)
4. States [View Example]( ../components/multiselect/example-states)

## Code Example

The Multi-select Drop Down works similar to a standard HTML select element using the "multiple" attribute. Because of styling and functionality requirements, we use a stylized shadow widget which implements the drop down behavior and updates in sync with a hidden select element. This allows the select element to be serialized with the DOM like normal. The simplest way to use the drop down is to create markup containing: a field (for field and responsive form alignment), a label and a select. For accessibility and implementation reasons the label is required.

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

-   Multi-Select Dropdowns should have Checkboxes, to distinguish them from [Single-Select Drop Downs](https://soho.infor.com/index.php?p=component/single-select-dropdown).
-   When choosing options from the Multi-Select Dropdown list, the list should remain open.

## Accessibility

The Multi-Select List is fairly complex to make accessible. But generally this can be accomplished in three steps:

1.  Make sure the above keyboard shortcuts are used.
2.  Make sure that there is a label which matches both the input and any shadow element inputs and identifies the field and is correctly matched using the label for to the input id.
3.  Use the following aria tags:
    -   role="combobox" - must be set on the input
    -   aria-expanded - set to true when the list is expanded, set to false when closed
    -   role="listbox" on the open list
    -   role="option" on each list item
    -   aria-activedescendant - associates the input to the active list item. Must be removed if no options are selected
    -   aria-controls on the input field, containing the ID of the matching drop down list


## Keyboard Shortcuts

-   **Tab** and **Shift-Tab** moves focus into and out of the dropdown. If the list is open, tab will close the list selection the current item and tab to the next focusable element.
-   **Alt Down Arrow** or **Down Arrow** opens the dropdown list and moves focus to the selected option. If nothing is selected, then focus moves to the first option in the list. If the combobox is not editable, then the space bar may also be used to open the dropdown list (future).
-   **Up and Down Arrow** moves focus up and down the list. As focus moves inside the dropdown list, the edit field is updated.
-   **Enter** selects the current item on the list, updates the edit field, highlights the selected item in the dropdown list, closes the dropdown list and returns focus to the input field.
-   **Escape key** closes the dropdown list, returns focus to the edit field, and does not change the current selection.
-   **Typing a letter (printable character) key** opens the list and filters to the items that start with that printable letter.

## States and Variations

The Multi-Select Dropdown uses the same states as the Text Input field, while the list values use the same states as those in the context menu. The trigger icon supports the following states:

-   Normal
-   Focus
-   Hover
-   Active

When a Multi-Select Dropdown is read-only or disabled, the trigger icon is not shown.

## Responsive Guidelines

The Multi-Select Dropdown should always be preceded by a label element.

## Upgrading from 3.X

In 3.x there was no separate Multi-Select element.
