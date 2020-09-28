---
title: Button
description: Displays an action. A user can interact with a button to initiate a process. Best used for performing discrete operations on a given set of data, or triggering a separate workflow.
demo:
  embedded:
  - name: Form Buttons
    slug: example-index
  pages:
  - name: 100% Width Button
    slug: example-100-percent
  - name: Anchor tags that look like buttons
    slug: example-as-link
  - name: Form Call to Action Button
    slug: example-secondary-border
  - name: Button with Icons
    slug: example-with-icons
  - name: Toggle Buttons
    slug: example-toggle-button
  - name: Disabled Button Tooltip
    slug: example-disabled-button-tooltip
---

## Code Example

A button object should always use a `<button>` element. Also make sure to add `type="button"` or some browsers will treat this as a submit button and refresh the page.

There are four types of buttons, all controlled by class.

- `btn-primary` - Primary action form button
- `btn-secondary` - Secondary action form button
- `btn-tertiary` or `btn` - Normal tertiary button
- `btn-icon` - Icon only button

All buttons are assumed to include an icon and a text label. An icon can be added by including the SVG icon element and use a span to hold the button text.

```html
<button class="btn-primary" type="button" id="page-button-primary">Action</button>

<button class="btn-secondary" type="button" id="page-button-secondary">Action</button>

<button type="button" class="btn-tertiary" id="page-button-tertiary">
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use href="#icon-filter"></use>
  </svg>
  <span>Action</span>
</button>

<button type="button" class="btn-icon" disabled id="page-button-icon">
  <span>Date</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use href="#icon-calendar"></use>
  </svg>
</button>

```

You can also use the button component to make a toggle button. Here is an example of a favorite style icon you can toggle on and off. Adding the class `icon-favorite` will change the icon color to a gold color instead of the usually azure toggle buttons when on.

```html
<button type="button" id="favorite" class="btn-icon icon-toggle" title="Favorite">
   <svg class="icon-test icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-star-filled"></use>
   </svg>
   <span>Favorite</span>
</button>
```

## Implementation Tips

- Make sure to add an automation-id or permanently unique id for testing that remains the same across versions.
- Do not use any elements other than button attributes for buttons.
- Press State has a touch effect which requires JS to implement
- Buttons can optionally have tooltips via adding a title attribute

## Accessibility

- Make sure form buttons have a succinctly descriptive value that indicates its purpose

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Spacebar</kbd> or <kbd>Enter</kbd> keys execute the action for that button. If the button activation closes the containing entity or launches another entity, then focus moves to the newly-opened entity. If the button activation does not close or dismiss the containing entity, then focus remains on the button. An example might be an "Apply" or "Recalculate" button.

## Responsive Guidelines

- Buttons can optionally be 100% width of their parent container on mobile breakpoints

## Upgrading from 3.X

- Change class `inforFormButton default` to `btn-primary`
- Change class `inforFormButton` to `btn-secondary`

## Workaround for title to display as tooltip on disabled buttons

- Disabled elements do not handle events in most browsers. This necessitates the need for an alternate element to handle the `Tooltip.plugin` which adds functionality that strips the title and renders it as a tooltip on the hover event of the element.
- Include `<div title="{{desired title/tooltip}}}">{{button content}}</div>` as child of `<button disabled></button>` to allow hover event to engage tooltip functionality, taking title from inner div and displaying as tooltip.
