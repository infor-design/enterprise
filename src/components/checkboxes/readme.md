---
title: Checkboxes
description: A user can select one or more values at a time. Best used when all possible options should be clearly visible to a user.
demo:
  embedded:
  - name: Default Checkbox Example
    slug: example-index
  pages:
  - name: Checkbox Groups
    slug: example-checkbox-groups
  - name: Horizontal Checkboxes
    slug: example-horizontal
  - name: Colored Checkboxes for legends
    slug: example-legend-colors
  - name: Checkboxes with Hitboxes
    slug: example-checkboxes-with-hitboxes
---

## Attributes and Classes

If the class `checked` is added the checkbox will show as checked. The class `disabled` will show the checkbox as disabled and have no interaction. `data-trackdirty="true"` will show indication if the value is checked, which requires `trackDirty()` plugin to be called.

## Code Example

The checkbox is a CSS-only control so principals of the `<input type="checkbox">` apply. The label is used to style the checkbox so is required (and is also needed for accessibility as well). The checkbox can have a `disabled` attribute or `checked` attribute and can be set in any way supported in javascript or your framework.

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
  <input type="checkbox" data-trackdirty="true" class="checkbox" id="checkbox3">
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

The checkbox has now a hitbox style. With this feature, the checkbox has more room for tapping/hitting/pressing or clicking for a better experience, especially on the mobile experience. To implement this, you just need to add `hitbox` class together with the `checkbox-label`. The html structure will look like this:

```html
<div class="field">
  <input type="checkbox" class="checkbox" id="starts-nolabel-checked" checked />
  <label for="starts-nolabel-checked" class="checkbox-label hitbox"><span class="audible">Checked</span></label>
</div>

<div class="field">
  <input type="checkbox" class="checkbox" name="checkbox1" id="checkbox1" />
  <label for="checkbox1" class="checkbox-label hitbox">Unchecked</label>
</div>

<div class="field">
  <input type="checkbox" class="checkbox" id="checkbox2" checked="true" />
  <label for="checkbox2" class="checkbox-label hitbox">Checked</label>
</div>

<div class="field">
  <input type="checkbox" data-trackdirty="true" class="checkbox" id="checkbox3" />
  <label for="checkbox3" class="checkbox-label hitbox" checked>Dirty tracking</label>
</div>
```

## Implementation Tips

- The label element is used to style the checkbox while the element is off-screen
- Users should be able to select or deselect an option by clicking either the checkbox itself or anywhere within the associated label

## Accessibility

- Make sure you have matching `for` and `id` values to associate the label with the appropriate form control. Make sure `id`s are unique on each page and only one label can be associated to each unique form element

## Keyboard Shortcuts

- For a two-State checkbox:
    - <kbd>Space Bar</kbd> toggles the selection, checking or unchecking the box.
- For a three-State checkbox:
    - If not checked, <kbd>Space</kbd> checks the checkbox
    - If checked, <kbd>Space</kbd> unchecks the checkbox
    - If partially checked, <kbd>Space</kbd> unchecks the checkbox.

## Upgrading from 3.X

- Wrap the input in an element with the class `field`
- Change class `inforCheckbox` to `checkbox`
- Change class `inforCheckboxLabel` to `checkbox-label`
