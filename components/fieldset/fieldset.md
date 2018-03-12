---
title: Field Set
description: This page describes Field Set.
---

## Configuration Options

1. Default Fieldset Example [View Example]( ../components/fieldset/example-index)
2. 50/50 Fieldset Example [View Example]( ../components/fieldset/example-50-50)
2. Example Showing Input Fields [View Example]( ../components/fieldset/example-fields)

## Code Example

A field set uses the standard html field set and legend element and simply adds css to style the legend element text. A field set is not expandable for that you could use the [expandable area component]( ../components/expandablearea). Here is an example showing a few input fields in a field set. Anything can go inside a field set but its usually something like input fields or data input fields.

```html
<form action="#" method="post">
  <fieldset>
    <legend>Company Information</legend>

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

    <button class="btn-primary" type="submit">Submit</button>
  </fieldset>
</form>
```

## Code Tip

There are some added classes to style sections like field sets for cases you semantically don't require a fieldset. The `fieldset-title` element will make a text header, you should use a H element for this in the structure of your page. Then you can add a `<hr class="fieldset-hr">` element at the top of each subsequent section for a divider. This would be laid out like this example:

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

-   Normal rules for content inside apply

## Responsive Guidelines

-   Uses form guidelines

## Upgrading from 3.X

-   Remove expand/collapse button
-   Move div content to field setup body (optional)
-   Remove class inforFieldSetLabel and inforFieldSet
