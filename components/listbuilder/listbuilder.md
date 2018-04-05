---
title: ListBuilder
description: This page describes ListBuilder.
demo:
  pages:
  - name: Default List Builder Example
    slug: example-index
---

## Code Example

The list builder is structured as a `listbuilder` element that contains a [standard toolbar](./toolbar) structure followed by a `listbuilder-content` section that contains a standard [listview]( ./listview).

When initialized with the `$elem.listbuilder()` plugin, you pass in a data set that interacts with the list view template. The toolbar buttons are automatically mapped to add, edit, delete, up, and down functions via the option settings.

```javascript
  <div class="listbuilder" >
    <div class="toolbar formatter-toolbar">
      ...
    </div>
    <div class="listbuilder-content">
      <div class="listview"></div>
    </div>
  </div>
```

## Accessibility / Keyboard Shortcuts

-   [ListView](./listview) guidelines apply as this contains a listview
-   [Toolbar](./toolbar) guidelines apply as this contains a toolbar

## Upgrading from 3.X

- This replaces the list view examples with toolbar. We made this a component with some default functionality
