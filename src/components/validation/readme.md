---
title: Validation
description: null
demo:
  embedded:
  - name: Main Validation Examples
    slug: example-index
  pages:
  - name: Multiple Validation Errors on a Field
    slug: example-multiple-errors
  - name: Legacy Short Fields
    slug: example-short-fields
  - name: Manually adding an Error
    slug: example-standalone-error
  - name: Enabling a Button on Valid
    slug: example-validation-form
  - name: Validating on Form Submit
    slug: example-validation-on-submit
---

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

## Code Example - Skipping Fields from Validation

Its possible to skip fields that are normally validated from validation. You can do this in one of three ways.

1. Add a class of `disable-validation`  to the input.
1. Add an attribute of `data-disable-validation="true"` to the input.
1. Make the input disabled.

## Validation Types

There are four standard validation types, and they can be extended or altered if required, error, alert, confirm, info. The type should be defined on the rule or duplicate messages may appear.

```javascript
$.fn.validation.rules.customWarningRule = {
  check: function (value) {

    return (value !== '');
  },
  message: 'Warning the value may be incorrect',
  type: 'alert'
};
```

Each type is style differently and can be defined if the formValidation passes or errors based on the rules result. This is defined via the errorsForm on the validation type.

```javascript
$.fn.validation.ValidationTypes.alert = { type: 'alert', title: 'Alert', errorsForm: false };
```

## Built in Validation Rules

There are a few built in validation rules you can use.

- `required` - Test that the field has a value. This is triggered after entering and exiting a field without adding a value or optionally when submitting a form.
- `date` - Basic test for a valid date. This is triggered after entering and exiting a field without adding a value or optionally when submitting a form.
- `availableDate` - Basic test for a date being withing a range of valid dates. Used internally for date range contraining.
- `email` - Basic test for a valid email address.
- `enableSubmit` - Used on the signing form to check if the submit button can be enabled.
- `passwordReq` - Checks basic password rules. Must be at least 10 characters which contain at least one lowercase letter. One uppercase letter. One numeric digit and one special character.
- `time` - Checks that the time is valid in the time picker.
- `test` - Used for testing only will only be valid if the input === 1 exactly.

## Controlling When Validation Fires

You can control on what events your validation rules fire. Note that if you use multiple events the rule will fire multiple times for all the listed events so this may need to be adjusted for async validation.

You can specify either one set of events to trigger on for all rules as:

```html
<input id="email" data-validation-events="blur change">
```

Or you can specify either different events for multiple rules as per as:

```html
<input id="email" data-validation-events="{'required': 'keydown', 'checkGivenNamesCount': 'keydown change blur'}">
```

## Accessibility

- On required fields always add an audible label for example

```html
<label class="required" for="email-address-ok">
  Email Address <span class="audible">Required</span>
</label>
```

- Errors will be read audibly by the API using an aria-alert (polite)

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

This api is (mostly) backwards compatible.
