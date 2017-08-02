# Validation  [Learn More](https://soho.infor.com/index.php?p=component/about-dialog)

### Functions and Utilities

## Configuration Options

1. Validation Example [View Example]( ../components/validation/example-index)
2. Disabled Form [View Example]( ../components/validation/example-form-disabled)
3. Multiple Validation Errors on a Field [View Example]( ../components/validation/example-multiple-errors)
4. Legacy Short Fields [View Example]( ../components/validation/example-short-fields)
5. Manually adding an Error [View Example]( ../components/validation/example-standalone-error)
6. Validating on Form Submit [View Example]( ../components/validation/example-validation-form)

## API Details

## Code Example - Auto

This example shows how to manually link validation automatically on fields. Use the `data-validate` attribute to indicate a space separated list of validation rules to use out of the validation object.

```html

 <div class="field">
  <label class="required" for="email-address-ok">Email Address <span class="audible">Required</span></label>
  <input type="text" id="email-address-ok" name="email-address-ok" data-validate="required customRule" >
</div>


```

## Code Example - Manual

This example shows how to manually invoke an error message on a field. The function is chainable so you can add several errors.

```javascript

$('#username-field')
  .addError({message: 'I have an Error.'})
  .addError({message: 'I have another Error.'});

//Later on
$('#username-field').removeError()


```

## Accessibility

- On required fields always add an audible label for example

```html

<label class="required" for="email-address-ok">
  Email Address <span class="audible">Required</span>
</label>


```html

- Errors will be read audibly by the API using an aria-alert (polite)

## Upgrading from 3.X

- This api is backwards compatible.
