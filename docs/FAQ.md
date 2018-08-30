# Frequently Asked Questions

## My custom validation rule is printing more than once under the field. What gives?

As of 4.8 validation rules should have an id and a type, so you should add these to the rule. For example:

```javascript
$.fn.validation.rules.customRule = {
    check: function (value, field, grid) {
        return false;
    },
    id: 'custom',
    type: 'error',
    message: 'Test Error - Anything you enter will be wrong'
};
```
