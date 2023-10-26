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
  - name: Enabling a Button on Valid
    slug: example-validation-form
  - name: Example of a Number Range Validator
    slug: test-range-validation
  - name: Example of a Email Validator
    slug: test-email-validation
  - name: Example Different Types of Alerts
    slug: test-alert-types
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

This example shows how to manually invoke an error message on a field. The function is chain able so you can add several errors.

```javascript
$('#username-field')
  .addError({message: 'I have an Error.'})
  .addError({message: 'I have another Error.'});

//Later on
$('#username-field').removeError()
```

## Code Example - Skipping Fields from Validation

It is possible to skip fields that are normally validated. You can do this in one of three ways:

1. Add a class of `disable-validation`  to the input.
1. Add an attribute of `data-disable-validation="true"` to the input.
1. Make the input disabled.

## Validation Types

There are four standard validation types: error, alert, success, and info. These can be extended or altered if required. The type should be defined on the rule or duplicate messages may appear.

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
- `availableDate` - Basic test for a date being within a range of valid dates. Used internally for date range containing.
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

## Form Functions

There a couple useful functions you can use on forms. To use them make sure you have `data-validate-on="submit"` and use the initializer to initialize them. When you do this the normal submit event will be blocked and you should use the `validated` event instead.

```html
<form id="test-form" autocomplete="off" data-validate-on="submit">`
```

Inside the `validated` event you might call `isFormValid` to check the current pass/fail state for the form.

```javascript
var api = $('#form-id').data('validate');

if (api.isFormValid($(this))) {
  // Whole form is valid
} else {
  // Something on the form form is invalid
}
```

You can reset all form changes including dirty and error states with the `resetForm` utility.

```javascript
var form =  $('#form-id');
api = form.data('validate');
api.resetForm(form);

//Or as a jquery plugin
$('#form-id').resetForm();
```

## Accessibility

- On required fields always add an audible label for example:

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
