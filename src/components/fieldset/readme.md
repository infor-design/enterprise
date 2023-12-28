---
title: Field Set
description: null
demo:
  embedded:
  - name: Default Fieldset Example
    slug: example-index
  pages:
  - name: 50/50 Fieldset Example
    slug: example-50-50
  - name: Example Showing Input Fields
    slug: example-fields
---

A field set uses the standard HTML `<fieldset>` and `<legend>` element and simply adds CSS to style the `<legend>` element text. A `<fieldset>` is not expandable. For that, you can use the [expandable area](./expandablearea) component.

Here is an example showing a few input fields in a `<fieldset>`. Anything can go inside a `<fieldset>` but is usually used for input fields.

```html
<form action="#" method="post">
  <fieldset role="region" aria-labelledby="fieldset-id">
    <legend id="fieldset-id">Company Information</legend>

    <div class="field">
      <label for="example-fs-company-name">Company Name</label>
      <input type="text" id="example-fs-company-name" name="example-fs-company-name">
    </div>

    <div class="field">
      <label for="example-fs-company-type">Company Type</label>
      <input type="password" id="example-fs-company-type" name="example-fs-company-type">
    </div>

    <div class="field">
      <label for="example-fs-company-address">Company Address</label>
      <input type="password" id="example-fs-company-address" name="example-fs-company-address">
    </div>

    <button id="submit" class="btn-primary" type="submit">Submit</button>
  </fieldset>
</form>
```

There are some added classes to style sections to look like `<fieldsets>` in cases you semantically choose not to use a `<fieldset>`. The `fieldset-title` class can be combined with a heading tag, like `<h2>`, to add this visual structure to your page. Then you can add a `<hr class="fieldset-hr">` element at the top of each subsequent section for a divider.

```html
<div class="row">
  <div class="twelve columns">
    <h2 class="fieldset-title">Section One</h2>
    <!-- Content Section One-->

    <hr class="fieldset-hr">
    <h2 class="fieldset-title">Section Two</h1>
    <!-- Content Section Two-->

  </div>
</div>

```

## Accessibility

- `role="region"` Should be added to the fieldset region to convey it to non-sighted users.
- `aria-labelledby` Should be added to the dynamic expandable region, where aria-labelledby points back to the fieldset title.

## Testability

You can add custom id's/automation id's to the fieldset component in the input markup inline. For this reason there is no `attributes` setting like some other components.

## Upgrading from 3.X

- Remove the expand/collapse button
- Remove class `inforFieldSetLabel` and `inforFieldSet`
