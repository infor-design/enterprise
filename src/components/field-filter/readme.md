---
title: Field Filter
description: Displays an editable field and related formatting options. A user can enter and format alphanumeric data. Best for long-form content that may require formatting and embedded media.
demo:
  embedded:
  - name: Default Field Filter Example
    slug: example-index
  pages:
  - name: Filter Example with Datepicker
    slug: example-datepicker
---

Filter fields can be added to forms that involve searching to add a customizable list of comparison options (greater than, less than equals, etc).
You can use this information in addition to the field value to conduct form based searches.

## Testability

The filter fields can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the filter fields. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `filter-field-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

If setting the id/automation id with a function, the id will be a running total of open filter fields.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
