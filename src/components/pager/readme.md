---
title: Pager
description:  For a given data set, displays feedback about the current subset in a view and all alternate subsets available. A user can navigate between views. Best for presenting digestible portions of large data sets.
demo:
  embedded:
  - name: Paging a List (Ul)
    slug: example-index
  pages:
  - name: Paging on the Listview Component
    slug: example-paging
  - name: Paging on the Datagrid Component
    slug: example-paging
  - name: Paging on the Circle Pager Component
    slug: example-index
  - name: Standalone Pager (Just uses events and settings)
    slug: example-standalone
---

## Code Example

The auto initializer will search for `<ul>` elements with a `paginated` class and add a pager to them. You can add the option `data-options="{'pagesize': 10}"` to set the page size desired. For [listview](./listview) and [datagrid](./datagrid) components, this is built into those components.

```html
    <ul id="listview" class="paginated listview" data-options="{'pagesize': 10}">
      <li>Item One</li>
      <li>Item Two</li>
      <li>Item Three</li>
      <li>Item Four</li>
      <li>Item Five</li>
      <li>Item Six</li>
      <li>Item Seven</li>
      <li>Item Eight</li>
      <li>Item Nine</li>
      <li>Item Ten</li>
      <li>Item Eleven</li>
      <li>Item Twelve</li>
      <li>Item Thirteen</li>
      <li>Item Fourteen</li>
      <li>Item Fifteen</li>
      <li>Item Sixteen</li>
      <li>Item Seventeen</li>
      <li>Item Eighteen</li>
      <li>Item Nineteen</li>
      <li>Item Twenty</li>
      <li>Item Twenty One</li>
      <li>Item Twenty Two</li>
      <li>Item Twenty Three</li>
    </ul>
```

## Accessibility

- Since the buttons are arrows, we add an audible span with text like "next", "previous" so the user will know what these buttons are for
- Icons have `role="presentation" aria-hidden="true" focusable="false"`
- Selected page has `aria-selected = "true"`
- Disabled pages (if exists) have `aria-disabled="true"`
- Pager region has `role="region"` and `aria-label="Pagination"`

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- This did not exist as a standalone component
- Datagrid paging has new options - [see datagrid docs]( ./datagrid)
