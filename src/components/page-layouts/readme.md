---
title: Page Layouts
description:
    This section explains a number of top level page layouts you can use to construct a page in your application. Each example in the usage examples is explained in brief below.
demo:
  pages:
  - name: Scrolling Canvas Scrolling
    slug: example-scrolling-canvas
  - name: Scrolling Contained Three Column
    slug: example-scrolling-contained-three-column
  - name: Scrolling Contained Two Column
    slug: example-scrolling-contained-two-column
  - name: Scrolling Contained
    slug: example-scrolling-contained
  - name: Scrolling Flex
    slug: example-scrolling-flex
  - name: Scrolling Longpage
    slug: example-scrolling-longpage-sticky
  - name: Scrolling Single Column
    slug: example-scrolling-single-column
  - name: Scrolling Single Column
    slug: example-scrolling-three-column
  - name: Scrolling Two Column Left
    slug: example-scrolling-two-column-left
  - name: Scrolling Two Column
    slug: example-scrolling-two-column
  - name: Fixed Three Column
    slug: example-three-column-fixed
  - name: Fixed Two Column
    slug: example-two-column-fixed.html
---

## General Structure

Most of the examples require the a the following structure the body of the page. Common elements include a class `no-scroll` or `scrollable` in the sections you wish to scroll. For example to scroll below the header we would place the class `scrollable` on the `page-container`. And the scrollable area will be there. Also some components like dropdown will close if they are open and you scroll containers with this class. So its preferable to use this structure rather than your own so it can find the scroll classes.

```html
<body class="no-scroll">
  <!-- Skip Link-->
  <a href="#maincontent" class="skip-link" data-translate="text">SkipToMain</a>
  <!-- SVG Block -->
  <div class="svg-icons">...</div>

  <!-- Page Container and contents -->
  <div class="header">...</div>
  <div class="page-container scrollable">

  </div>
  <!-- Page Scripts -->
</body>
</html>
```

### Single Record Edit / Main Detail

We also have a number of detail patterns (tree-detail main-detail ect). Details for these can be found on the [page patterns page]( ./page-patterns)

## Layout Examples

- `example-scrolling-contained-three-column` - This example shows scrolling in three column sections, each sections scrolls independently under the header. [See Example](./demo/components/page-layouts/example-scrolling-contained-three-column)
- `example-scrolling-contained-two-column` - This example shows scrolling in two column sections, each sections scrolls independently under the header. This example could be used for fixed right side content. [See Example](./demo/components/page-layouts/example-scrolling-contained-two-column)
- `example-scrolling-contained` - This example shows scrolling in three page sections. There is a left side pane and a right side pane with a top and bottom section. Each section is seperated by the design system margins and each section changes size as the page changes size.  [See Example](./demo/components/page-layouts/example-scrolling-contained)
- `example-scrolling-flex` - This newer example uses css flexbox to position an optional top and bottom element (think header and footer). Then the middle section scrolls. This is a common and useful layout. [See Example](./demo/components/page-layouts/example-scrolling-flex)
- `example-scrolling-longpage-sticky` - This example shows a sticky header with a long series of page contents that scrolls below the header. [See Example](./demo/components/page-layouts/example-scrolling-longpage-sticky)
- `example-scrolling-single-column` - his example shows scrolling below the header in a body with a single column layout. [See Example](./demo/components/page-layouts/example-scrolling-single-column)
- `example-scrolling-three-column` - This example shows scrolling below the header in a body with a three column layout. [See Example](./demo/components/page-layouts/example-scrolling-single-column)
- `example-scrolling-two-column-left` - This example shows scrolling below the header in a body with a two column layout with the smaller side on the left. [See Example](./demo/components/page-layouts/example-scrolling-two-column-left)
- `example-scrolling-two-column` - This example shows scrolling below the header in a body with a two column layout with the smaller side on the right. [See Example](./demo/components/page-layouts/example-scrolling-two-column)
- `example-three-column-fixed` - This example shows a fixed height page (no scrolling) with the page divided in three sections. [See Example](./demo/components/page-layouts/example-three-column-fixed)
- `example-three-column-fixed` - This example shows a fixed height page (no scrolling) with the page divided in two sections, you can change the size of the right section with some option class combinations by adding a size to the two column sections: `two-column fixed-xl` `two-column fixed-lg` `two-column fixed-md` `two-column fixed-mm` `two-column fixed-sm`. [See Example](./demo/components/page-layouts/example-two-column-fixed)
