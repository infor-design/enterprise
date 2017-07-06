# Field Set  [Learn More](#)

## Configuration Options

1. Default Fieldset Example [View Example]( ../components/fieldset/example-index)
2. 50/50 Fieldset Example [View Example]( ../components/fieldset/example-50-50)

## Code Example


A field set uses the standard html field set and legend element and simply adds css to style the legend element text. A field set is not expandable but you could use an expandable area element as well.

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

## Accessibility

-   Normal rules for content inside apply

## Responsive Guidelines

-   Uses form guidelines

## Upgrading from 3.X

-   Remove expand/collapse button
-   Move div content to field setup body (optional)
-   Remove class inforFieldSetLabel and inforFieldSet
