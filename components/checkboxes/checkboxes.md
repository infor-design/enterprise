---
title: Checkboxes  
description: This page describes Checkboxes.
---

## Configuration Options

1. Default Checkbox Example [View Example]( ../components/checkboxes/example-index)
2. Checkbox Groups [View Example]( ../components/checkboxes/example-checkbox-groups)
2. Horizontal Checkbox Group [View Example]( ../components/checkboxes/example-horizontal)

## API Details

### Attributes and Classes

* checked - If added the checkbox will show as checked
* disabled - If added the checkbox will show as disabled, and have no interaction.
* data-trackdirty="true" - If added the checkbox will show indication if the value is checked (required trackDirty() plugin to be called)

## Code Example

The checkbox is a css only control. So principals of the input type="checkbox" apply. The label is used to style the checkbox so is required (and its also needed for accessibility too). The checkbox can have a disabled attribute or checked attribute and can be set in any way supported in JS or your framework.

```html

<div class="field">
  <input type="checkbox" class="checkbox" id="checkbox1">
  <label for="checkbox1" class="checkbox-label">Unchecked</label>
</div>

<div class="field">
  <input type="checkbox" class="checkbox" id="checkbox2" checked>
  <label for="checkbox2" class="checkbox-label" >Checked</label>
</div>

<div class="field">
  <input type="checkbox" data-trackdirty="true" class="checkbox" id="checkbox3" >
  <label for="checkbox3" class="checkbox-label">Dirty Tracking</label>
</div>

<div class="field">
  <input type="checkbox" class="checkbox" id="checkbox4" disabled>
  <label for="checkbox4" class="checkbox-label" >Disabled and Unchecked</label>
</div>

<div class="field">
  <input type="checkbox" class="checkbox" id="checkbox5" disabled checked>
  <label for="checkbox5" class="checkbox-label">Disabled and Checked</label>
</div>

```

## Implementation Tips

-   The label element is used to style the Checkbox while the element is offscreen.
-   Checkboxes are used when there is a small set of values, generally with a minimum of 3 and maximum of 10 values.
-   Users should be able to select/deselect an option by clicking either the Checkbox itself or anywhere within the associated label.

## Accessibility

-   Make sure you have matching for and id values to associate the label with the appropriate form control. Make sure id's are unique on each page and only one label can be associated to each unique form element.

## Keyboard Shortcuts

-   Two-State Checkbox
    -   **Space Bar** key toggles the selection, checking or unchecking the box.
-   Three-State Checkbox
    -   If not checked, **space** checks the Checkbox
    -   If checked, **space** unchecks the Checkbox
    -   If partially checked, **space** unchecks the Checkbox.

## States and Variations

A Checkbox can take the following states:

-   Selected/Not Selected
-   Hover
-   Focus
-   Disabled (generally, the entire set of values will be disabled)
-   Dirty

By their nature, Checkboxes should not be made not required.

## Responsive Guidelines

-   Follows with responsive form guidelines

## Upgrading from 3.X

-   Wrap the input in a field element
-   Change class inforCheckbox to checkbox
-   Change class inforCheckboxLabel to checkbox-label
