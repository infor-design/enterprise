---
title: Button
description: This page describes Button.
demo:
  pages:
  - name: Form Buttons
    slug: example-index
  - name: 100% Width Button
    slug: example-100-percent
  - name: Button on an `<a>` tag
    slug: example-as-link
  - name: Form Call to Action Button
    slug: example-secondary-border
  - name: Button with Icons
    slug: example-with-icons
  - name: Toggle Buttons
    slug: example-toggle-button
---

## Code Example

A button object should always use a `<button>` element. Also make sure to add `type="button"` or some browsers will treat this as a submit button and refresh the page.

There are four types of buttons, all controlled by class.

-   `btn-primary` - Primary action form button
-   `btn-secondary` - Secondary action form button
-   `btn-tertiary` or `btn` - Normal tertiary button
-   `btn-icon` - Icon only button

All buttons are assumed to include an icon and a text label. An icon can be added by including the SVG icon element and use a span to hold the button text.

```html
<button class="btn-primary" type="button" data-automation-id="page-button-primary">Action</button>

<button class="btn-secondary" type="button">Action</button>

<button type="button" class="btn-tertiary" data-automation-id="page-button-tertiary">
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use xlink:href="#icon-filter"></use>
  </svg>
  <span>Action</span>
</button>

<button type="button" class="btn-icon" disabled data-automation-id="page-button-icon">
  <span>Date</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use xlink:href="#icon-calendar"></use>
  </svg>
</button>

```

## Implementation Tips

- Make sure to add an automation-id or permanently unique id for testing that remains the same across versions.
- Do not use any elements other than button attributes for buttons.
- Press State has a touch effect which requires JS to implement
- Buttons can optionally have tooltips via adding a title attribute

## Accessibility

-   Make sure form buttons have a succinctly descriptive value that indicates its purpose

## Keyboard Shortcuts

-   <kbd>Spacebar</kbd> or <kbd>Enter</kbd> keys execute the action for that button. If the button activation closes the containing entity or launches another entity, then focus moves to the newly-opened entity. If the button activation does not close or dismiss the containing entity, then focus remains on the button. An example might be an "Apply" or "Recalculate" button.

## Responsive Guidelines

-   Buttons can optionally be 100% width of their parent container on mobile breakpoints

## Upgrading from 3.X

-   Change class `inforFormButton default` to `btn-primary`
-   Change class `inforFormButton` to `btn-secondary`
