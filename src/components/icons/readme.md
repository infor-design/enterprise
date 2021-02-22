---
title: Icons
description:
demo:
  embedded:
  - name: Basic Icons
    slug: example-index
  pages:
  - name: Extended Icon Set
    slug: example-extended
  - name: Tree Folder Icons
    slug: example-tree
  - name: Empty Widget Icons
    slug: example-empty-widgets
  - name: Grid Filter Drop Down Menu Icons
    slug: example-filter-dropdown
  - name: Infor / SoHo Logos
    slug: example-logos
  - name: Animated Pseudo Elements (Hamburger / Back) / SoHo Logos
    slug: example-pseudo-elements
  - name: Icons Indicating Contents
    slug: example-full-style
  - name: Caret Icons
    slug: example-caret
  - name: Checkmarks
    slug: example-checks
---

## SVG Icons Support

It is required to inline the SVG icons in HTML markup in order to be able to change dimensions and colors with CSS. To achieve this, follow the following steps:

1. Add a `<div>` containing all icons from `components/icons/theme-new-svg.html`. This should be at the top of the page for wider support (Safari needs this at the top).
    - Note that you can also choose to use the Uplift theme icons by copying from the `components/icons/theme-new-svg.html` file.
2. Add markup as per the example below. Note the following important accessibility criteria:
    - `focusable="false"` is added so that the element does not get a tab stop in some browsers
    - `role="presentation"` is added to stop duplicate control feedback when using down arrows while using assistive technology
    - `aria-hidden="true"` causes the icon to be hidden for assistive technologies

```html
// As Icon Button
<button id="calendar" class="btn-icon">
  <svg aria-hidden="true" focusable="false" role="presentation" class="icon">
     <use href="#icon-calendar"></use>
   </svg>
   <span class="audible">Calendar</span>
 </button>

// With Button - Just Icon
<svg aria-hidden="true" focusable="false" role="presentation" class="icon" >
   <use href="#icon-calendar"></use>
</svg>
```

## Accessibility

- When used alone (icon with out text) an audible span should be added for screen readers.
- Tooltips should be shown on icons (but not on icons with text as it is redundant)

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- Icons are usually on buttons, so the usual keyboard shortcuts of <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd> apply. Buttons can also be disabled

## Responsive Guidelines

- At large breakpoints, the toolbar has the option to show both icon and button text or just button text
- At smaller breakpoints just the icon is shown. (This is handled automatically by the toolbar control)

## Upgrading from 3.X

- Icons nows use SVG
- Need to add the SVG document containing all icons at the top of the `<body>`
- SVG elements should be added to the page to replace the `iconButton` classes
