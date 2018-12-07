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

## I'm getting errors on windows for all files about line breaks. Why?

The error will be similar to `Expected line breaks to be ‘LF’ but found ‘CRLF’`. The problem is on windows the default is CRLF but all our files are LF. To change this behavior you can run this.

```bash
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```javascript
