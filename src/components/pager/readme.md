---
title: Pager
description:  For a given data set, displays feedback about the current subset in a view and all alternate subsets available. A user can navigate between views. Best for presenting digestible portions of large data sets.
demo:
  embedded:
  - name: Paging a List (Ul)
    slug: example-index
  pages:
  - name: Paging on the Listview Component
    slug: example-listview
  - name: Paging on the Datagrid Component
    slug: example-datagrid
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

You can add custom id's/automation id's to the pager that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

```js
  attributes: { name: 'id', value: args => `pager-id` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

For the pager if you set the attributes on the root message, you will get an ID added to the root of the message dialog. Also the following elements will get the same id with the following appended:

- First page button gets `btn-first`
- Previous page button gets `btn-prev`
- Next page button gets `btn-next`
- Last page button gets `btn-last`
- Pagesize selector button gets `btn-pagesize`
- Each option in the page size select menu gets `pagesize-opt-<n>` for example `pagesize-opt-50`
- The input selector button gets `pagesize-inpu`

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- This did not exist as a standalone component
- Datagrid paging has new options - [see datagrid docs]( ./datagrid)
