---
title: Pager  
description: This page describes Pager.
---

## Configuration Options

1. Paging a List (Ul) [View Example]( ../components/pager/example-index)
2. Paging on the Listview Component [View Example]( ../components/listview/example-paging)
3. Paging on the Datagrid Component [View Example]( ../components/datagrid/example-paging)
4. Circle Pager Component [View Example]( ../components/circlepager/example-index)

## Code Example

The auto initializer will search for ul elements with a `paginated` class and add a pager to them. You can add the option `data-options="{'pagesize': 10}"` to set the page size desired. For listview and datagrid this is built in to those components.

[Datagrid]( ../components/datagrid)
[Listview]( ../components/listview)
[Circle Pagination]( ../components/circlepager)

```html
    <ul class="paginated listview" data-options="{'pagesize': 10}">
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

-   Since the buttons are arrows, we add an audible span with text like "next", "previous" so the user will now what these buttons are for
-   icons have role="presentation" aria-hidden="true" focusable="false"
-   select page has aria-selected = "true"
-   disabled pages (if there) have aria-disabled="true"

## States and Variations

Pagination

-   Normal
-   Disabled
-   Hover
-   Focus
-   Pressed

Circular Navigation

-   Normal/Active
-   Hover
-   Focus
-   Disabled

## Upgrading from 3.X

-   This did not exist as a standalone component
-   Datagrid paging has new options - [see datagrid docs]( ../components/datagrid)
