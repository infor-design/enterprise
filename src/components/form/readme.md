---
title: Form Functionality
description:
    Displays a set of inputs related to a single data object. A user can select or input values, and submit as a set. Best for entering or editing information for a single object.

    The forms plugins are a set of form related utilities and functionality contained in `forms.js`. This page outlines the functionality contained in that plugin and shows some from related examples for layout from other areas.
demo:
  embedded:
  - name: Form Inputs in the Responsive Grid
    slug: example-inputs
  pages:
  - name: Form Inputs in the Responsive Simplified Grid
    slug: example-inputs-simple
  - name: Form Layouts
    slug: example-forms
  - name: Compact Fields in Forms
    slug: example-compact-mode
  - name: Responsive form
    slug: example-inputs
  - name: Responsive form with bottom alignment
    slug: example-align-field-bottoms
  - name: Header Detail Form
    slug: example-header-detail
---

## Layout Classes

For text/typography specific classes see the classes section on the [typography page]( ./typography)

The following classes can be used for form labels:

- `label` - Used for styling spans like labels or form labels.
- `data-description` - Used for stying data in a label when used next to an input.
- `data` - Used for stying data in a label without an input, if you would like to align the inputs with other fields in the form, you can add the class `field-height` [See Example](./demo/components/form/test-field-size-data-labels?font=source-sans).

The following classes can be used for form and label alignment.

- `form-responsive` - Makes all the fields inside go to width 100% so that the fields will align in a responsive grid. You have the option to use fixed field sizes (default) or responsive forms. This class forces a responsive form, so all fields will size to 100%. [See Example](./demo/components/form/example-inputs?font=source-sans)
- `form-responsive flex-align-bottom` - A responsive form but in some cases may like the labels to wrap and still have the fields align below the labels add the class, this class will do the job.  [See Example](./demo/components/form/example-align-field-bottoms?font=source-sans)
- `field-flex` - Makes all the labels and fields inside go into a side by side layout. Yet still work responsively. This can be used for labels input description situations or to force some labels to sit together , similar to compound fields [See Example](./demo/components/form/example-labels?font=source-sans)
- `label-left` - Used to put a label and data label to the left of each other rather than on top. This may be used on some forms but not with editable inputs. [See Example](./demo/components/form/example-labels?font=source-sans)
- `compound-field` - Used to put several fields next to each other in a row. This may be used for related fields like phone + extension [See Example](./demo/components/form/example-forms?font=source-sans)
- `compound-field` - Used to put several fields next to each other in a row. This may be used for related fields like phone + extension [See Example](./demo/components/form/example-forms?font=source-sans)
- `form-layout-compact` - Used to set the form fields in a more compact mode so more fields can fit in the page. [See Example](./demo/components/form/example-compact-mode?font=source-sans)

### Single Record Edit / Main Detail

We also have a number of detail patterns (tree-detail main-detail ect). Details for these can be found on the [page patterns page]( ./page-patterns)

## Accessibility

### Field Sizes

All input fields are either 300px or 150 px depending on type:

Spinbox: 150
Colorpicker: 150
Datepicker: 150
Timepicker: 150

Input: 300
Password: 300
Lookup: 300
Fileupload: 300
Dropdown/Multiselect: 300

However if using the inputs within a parent with `form-responsive` class all inputs will be responsive size and stretch to the width of the responsive grid.[See Example](./demo/components/form/example-inputs-simple) for more info on variations of labels.

```html
<div class="form-responsive row">
    <div class="two columns">
      <div class="field">
        <label for="field-1">Two Columns</label>
        <input type="text" id="field-1" name="field-1">
      </div>
    ....
```

Labels are always on top of the field but for "data labels" the label may possibly be the left. [See The Labels Example](./demo/components/form/example-labels.html) for more info on variations of labels.

### Labels Positioning

In/After IDS version 4.18.1, changes were made to form labels with a required asterisk `(*)` that provide better identification in screen readers. This involves a breaking change to existing required label elements, since adding additional markup is necessary. The Form component will automatically convert labels to the new, accessibility-friendly method of display if the developer simply adds an `.accessible` CSS class to the `<label>` or `.label-text` element. For more information, see Github issues [#421](https://github.com/infor-design/enterprise/issues/421) and [#2118](https://github.com/infor-design/enterprise/issues/2118).

So the correct markup for an accessible required label is:

```html
   <div class="field">
      <label class="required accessible" for="first-name">First Name</label>
      <input type="text" id="first-name" name="first-name" placeholder="ex: John" data-validate="required"/>
    </div>
```

Labels are always on top of the field but for "data labels" the label may possibly be the left. [See The Labels Example](./demo/components/form/example-labels.html) for more info on variations of labels.

## Testability

- Please refer to the [Application Testability Checklist](/resources/application-testability-checklist) for further details.
