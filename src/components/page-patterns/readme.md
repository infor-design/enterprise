---
title: Page Patterns
description:
    This section explains a number of popular page design detail patterns that are commonly used in applications
demo:
  pages:
  - name: Header / Tab Detail
    slug: example-header-tab
  - name: List / Detail
    slug: example-list-detail
  - name: Tree / Detail
    slug: example-tree-detail
  - name: Header / Detail
    slug: example-header-detail
  - name: Main / Master / Detail
    slug: example-master-detail
  - name: List / Detail
    slug: example-list-detail
  - name: Settings Page (Vertical Tabs / Detail)
    slug: example-settings-page
---

## General Structure

Most of the examples require a unique structure attached to or under the page-container of the page. The structure should make sense with sections (divs) for each of the containers. For example master-detail, tree-detail ect.

```html
<body class="no-scroll">
  ...
  <div class="page-container scrollable">
    <!-- Page Pattern -->
  </div>
</body>
</html>
```

## Page Patterns Explained

- `example-master-detail` - The master/details pattern has a master pane (this example shows a datagrid) and a details pane for content. When an item in the master list is selected, the details pane is updated. [See Example](./demo/components/page-patterns/example-master-detail)

- `example-header-detail` - The header/detail pattern has a focus pane on the top with item (header) details. Then a  details pane for content that shows more details about the header content. [See Example](./demo/components/page-patterns/example-header-detail)

- `example-header-tab` - The header/tab detail pattern has a focus pane on the top with item (header) details. Then a tab for the detail pane that shows tabbed content with more details about the header content. [See Example](./demo/components/page-patterns/example-header-tab)

- `example-list-detail` - The list/detail pattern has a list of items on the left (this example shows a listview) and a details pane for content. When an item in the master listview is selected, the details pane is updated. This pattern is also responsive. On lower breakpoints just the list is shown and you can drill in and back to the list [See Example](./demo/components/page-patterns/example-list-detail)

- `example-tree-detail` - The Tree/Detail pattern has a tree of items on the left and a details pane for content. When an item in the tree is selected, the details pane is updated. See Example](./demo/components/page-patterns/example-tree-detail)

- `example-settings-page` - The Vertical Tab /Detail pattern has a vertical tab on the left of high level navigation items , when they are clicked a section of those details is shown in the detail pane. This is very useful as a an application settings page. [See Example](./demo/components/page-patterns/example-settings-page)

## Testability

- Please refer to the [Application Testability Checklist](/resources/application-testability-checklist) for further details.
