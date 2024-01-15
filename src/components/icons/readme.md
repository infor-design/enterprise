---
title: Icons
description:
demo:
  embedded:
  - name: Basic Icons
    slug: example-index
  pages:
  - name: Empty Widget Icons
    slug: example-empty-widgets
  - name: Status Color Icons
    slug: example-status-colors
---

## SVG Icons Support

It is required to inline the SVG icons in HTML markup in order to be able to change dimensions and colors with CSS. To achieve this, follow the following steps:

1. Add a `<div>` containing all icons from `components/icons/theme-new-default-svg.html`. This should be at the top of the page for wider support (Safari needs this at the top).
    - Note that you can also choose to use the Uplift theme icons by copying from the `components/icons/theme-new-default-svg.html` file.
2. Add markup as per the example below. Note the following important accessibility criteria:
    - `focusable="false"` is added so that the element does not get a tab stop in some browsers
    - `role="presentation"` is added to stop duplicate control feedback when using down arrows while using assistive technology
    - `aria-hidden="true"` causes the icon to be hidden for assistive technologies
3. Note if for some reason the older new icons are needed the file is available at `components/icons/theme-new-default-old.html` but the new ones are preferred for next years releases.

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

// Rounded Icon
<svg class="icon icon-round" focusable="false" aria-hidden="true" role="presentation">
  <use href="#icon-calendar"></use>
</svg>
```

## Status and Alert Icons

It is also possible to use status color icons in some cases for embellishment and to show a status. This would be for a softer
status, something like an embellishment. For error messages and alerts use an alert icon [See alerts component](https://design.infor.com/code/ids-enterprise/latest/alerts). Note that the badges should not be used in place of alerts.

## Accessibility

- When used alone (icon with out text) an audible span should be added for screen readers.
- Tooltips should be shown on icons (but not on icons with text as it is redundant)

## Keyboard Shortcuts

- Icons are usually on buttons, so the usual keyboard shortcuts of <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd> apply. Buttons can also be disabled

## Responsive Guidelines

- At large breakpoints, the toolbar has the option to show both icon and button text or just button text
- At smaller breakpoints just the icon is shown. (This is handled automatically by the toolbar control)

## Upgrading from 3.X

- Icons nows use SVG
- Need to add the SVG document containing all icons at the top of the `<body>`
- SVG elements should be added to the page to replace the `iconButton` classes
