---
title: Breadcrumb
description: This page describes Breadcrumb.
demo:
  pages:
  - name: Default Breadcrumb Example
    slug: example-index
  - name: Breadcrumb with current item a link
    slug: example-current-as-link
---

## Code Example

This is an example showing a bread crumb pattern with four items. The current item should be last and have the `current` class. All items take the hyperlink style via class `hyperlink`. However, based on background element (header or page) the style may adopt and change. The `disabled` class can be added to prevent links from being clicked, however they can still be focused because the hyperlink element cannot contain a disabled property by valid HTML standards.

This control is entirely HTML and CSS, to update you will need to implement the logic to replace the link elements in the hierarchy.

```html
<nav class="breadcrumb">
  <ol aria-label="breadcrumb">
    <li>
      <a href="#" class="hyperlink hide-focus">Home</a>
    </li>
    <li>
      <a href="#" class="hyperlink hide-focus">Second Item</a>
    </li>
    <li>
      <a href="#" class="hyperlink hide-focus">Third Item</a>
    </li>
    <li class="current">Fourth Item <span class="audible">Current</span></li>
  </ol>
</nav>
```

## Accessibility

-   Add an `aria-label` with the localized term for "breadcrumb"
-   `audible` spans may need to be added to indicate levels

## Keyboard Shortcuts

-   <kbd>Tab</kbd> moves focus to the link. A second <kbd>tab</kbd> moves focus to the next focusable item.
-   <kbd>Space</kbd> or <kbd>Enter</kbd> executes the link.

## Upgrading from 3.X

-   "Collapsing Lists" is Deprecated
-   Markup entirely changed, see updated example
