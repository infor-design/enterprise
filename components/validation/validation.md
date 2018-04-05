---
title: Validation
description: This page describes Validation.
---

## Configuration Options

1. Validation Example [View Example]( ../components/validation/example-index)
2. Disabled Form [View Example]( ../components/validation/example-form-disabled)
3. Multiple Validation Errors on a Field [View Example]( ../components/validation/example-multiple-errors)
4. Legacy Short Fields [View Example]( ../components/validation/example-short-fields)
5. Manually adding an Error [View Example]( ../components/validation/example-standalone-error)
6. Enabling a Button on Valid [View Example]( ../components/validation/example-validation-form)
6. Validating on Form Submit [View Example]( ../components/validation/example-validation-on-submit)

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

## Validation Types

There are four standard validation types, and they can be extended or altered if required, error, alert, confirm, info. The type should be defined on the rule, but error is used if it is not defined.

```javascript
$.fn.validation.rules.customWarningRule = {
  check: function (value) {

    return (value !== '');
  },
  message: 'Warning the value may be incorrect',
  type: 'alert'
};
```

Each type is style differntly and can be defined if the formValidation passes or errors based on the rules result. This is defined via the errorsForm on the validation type.

```javascript
$.fn.validation.ValidationTypes.alert = { type: 'alert', title: 'Alert', errorsForm: false };
```

## Validation Rules

There are a few built in validation rules you can use.

- `required` - Test that the field has a value. This is triggered after entering and exiting a field without adding a value or optionally when submitting a form.
- `date` - Basic test for a valid date. This is triggered after entering and exiting a field without adding a value or optionally when submitting a form.
- `availableDate` - Basic test for a date being withing a range of valid dates. Used internally for date range contraining.
- `email` - Basic test for a valid email address.
- `enableSubmit` - Used on the signing form to check if the submit button can be enabled.
- `passwordReq` - Checks basic password rules. Must be at least 10 characters which contain at least
One lowercase letter. One uppercase letter. One numeric digit and one special character.
- `time` - Checks that the time is valid in the time picker.
- `test` - Used for testing only will only be valid if the input === 1 exactly.

## Accessibility

- On required fields always add an audible label for example

```html
<label class="required" for="email-address-ok">
  Email Address <span class="audible">Required</span>
</label>

```

- Errors will be read audibly by the API using an aria-alert (polite)

## Upgrading from 3.X

- This api is backwards compatible.
