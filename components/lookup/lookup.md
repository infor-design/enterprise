---
title: Lookup  
description: This page describes Lookup.
---

## Configuration Options

1. Default Lookup  [View Example]( ../components/lookup/example-index)
2. Multiselect Lookup  [View Example]( ../components/lookup/example-multiselect)
3. Lookup with Paging  [View Example]( ../components/lookup/example-paging)
4. Lookup with Filter  [View Example]( ../components/lookup/example-filter-row)
5. Editable Lookup [View Example]( ../components/lookup/example-editable)
6. Editable Strict [View Example]( ../components/lookup/example-editable-strict)
7. Custom Toolbar [View Example]( ../components/lookup/example-custom-toolbar)
8. Custom Buttons [View Example]( ../components/lookup/example-custom-buttons)

## Behavior Guidelines

-   To distinguish between single and multi-select situations, use checkboxes in multi-select lists.
-   The height of a multi-select list can grow up to 3 lines to accommodate multiple entries. After this point, scrolling should be available.
-   In some situations (such as when a Lookup is used in a filter row in a table), the field height is fixed (cannot expand to show multiple selections). Include a design approach for multi-select dropdowns in this scenario.

## Code Example

### Lookup Markup

The lookup element is a simple text input field. Always include a matching label for accessibility. To initialize the lookup call the .lookup() plugin.

```html

<div class="field">
  <label for="product-lookup" class="label">Products</label>
  <input id="product-lookup" data-init="false" class="lookup" name="product-lookup" type="text">
</div>


```

### Lookup Example

The field is the field to be returned from the grid. You can also pass reasonable grid options to the lookup (not all features will work by design). The selectable option can be set to either `single` or `multiselect`. This defines the key difference between a Single Select Lookup and a Multi Select Lookup.

```javascript

grid = $('#product-lookup').lookup({
  field: 'productId',
  options: {
    columns: columns,
    dataset: data,
    selectable: 'single', //multiselect or single
    toolbar: {
      results: true,
      rowHeight: false
    }
  }
});


```

## Accessibility

-   This is a very complex control and interaction and is not currently accessible to screen readers.
-   It does work with keyboard however.

## Keyboard Shortcuts

-   **Tab/Shift Tab** moves focus into the field to/from the next focusable item in the tab order.
-   **Down Arrow** opens the dialog
-   **Esc** cancels and closes the open dialog
-   **Tab/Shift Tab** when the dialog is open, tab will move around the tabbable items. Fx from the search to the datagrid
-   **Down/up Arrow** when focus is on the grid in the dialog this moves the focus up and down on the rows
-   **Space** toggle selection on the current row if multi select. If single select the row is selected and inserted
-   **Enter** if focus is on the grid in the lookup if single select the current row will be selected. If multiselect then all the selected rows will be inserted.

## States and Variations

The Lookup field itself uses the same states as the Text Input field, while the values use the same states as those in the context menu. The trigger icon supports the following states:

-   Normal
-   Focus
-   Hover
-   Active

When a Lookup field is read-only or disabled, the field is disabled like other inputs.

## Responsive Guidelines

-   The dialog stretches to 90% at smaller breakpoints

## Upgrading from 3.X

-   inforLookup class changed to 'lookup'
-   Initialization options and api is different
-   Use events rather than call backs
