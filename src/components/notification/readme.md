---
title: Notification
description: null
demo:
  embedded:
  - name: Showing a notfication banner
    slug: example-index
---

## Code Example

The auto initializer will search for `<ul>` elements with a `paginated` class and add a pager to them. You can add the option `data-options="{'pagesize': 10}"` to set the page size desired. For [listview](./listview) and [datagrid](./datagrid) components, this is built into those components.

```javascript
  $('body').notification({
    type: 'info',
    message: 'DTO rejcted by your manager for Sept 30, 2018.',
    link: '#',
    linkText: 'Click to view'
  });
```

## Accessibility

- TODO: We should add aria-alerts similar to the way toast works.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- This component is comparible to the inforSlideInDialog in 3.X
