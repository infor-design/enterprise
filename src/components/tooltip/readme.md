---
title: Tooltip Component
description: This page describes Tooltip Component .
demo:
  pages:
  - name: Default Tooltip Example
    slug: example-index
  - name: Tooltip with an Icon
    slug: example-icon-in-tooltip
  - name: Functioning URL inside of a Tooltip
    slug: example-url-in-tooltip
  - name: Example of triggering by "focus"
    slug: example-trigger-focus
  - name: Example of triggering with "immediate"
    slug: example-trigger-immediate
  - name: Using the `extraCssClass` setting
    slug: example-extra-css-class
  - name: Demo of the `setContent()` API method
    slug: example-setcontent-api
  - name: Demo of AJAX-powered Tooltip Content
    slug: example-ajax-tooltip
  - name: Using the `keepOpen` setting
    slug: example-keep-open
---

## Important Notes

The [popover]( ./popover) component shares a common API with the tooltip Component.  When a popover component is invoked, any methods and events used by the tooltip will also be available in the popover.

## Behavior Guidelines

For accessibility, the tooltip should be shown when you keyboard onto an element after a short delay

## Code Example

### Simple Tooltips

If using the [initializer]( ./initialize), any elements with a `title` attribute will be picked up and turned into a tooltip when the element becomes hovered (or tapped in a mobile scenario). It may be needed to reinitialize a component or page section which has been added.

```html
<button class="btn" type="button" title="Tooltips Provide Additional Information">
  Tootltip Button
</button>
```

The code above is demoed in the [common tooltip example]( ../components/tooltip/example-index).

### Custom HTML Tooltips

It's also possible to use inline HTML inside of the `title` attribute:

```html
<button class="btn-secondary" type="button" title="<span style='text-align: right; display: inline-block;'><b style='line-height: 1.7em;'>Connected order</b><br>Tooltips Provide <br> <span style="color: #AFDC91;">Additional Information</span>.</span>">
  Custom HTML Tooltip
</button>
```

The code above is demoed in the [HTML tooltip example]( ../components/tooltip/example-html-tooltip).

Another possible method of defining custom tooltips is to create a hidden HTML element that will be referenced by its ID attribute.  When defining your `title` attribute on your trigger element, simply place use ID selector instead of the actual content, and the initializer will pick it up:

```html
<button class="btn-secondary" type="button" title="#tooltip-id">
  <span>Example</span>
</button>

<div id="tooltip-id" class="hidden">
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon">
    <use xlink:href="#icon-compose"/>
  </svg>
  <p>Add Comment</p>
</div>
```

The code above is demoed in the [icons in tooltips example]( ../components/tooltip/example-icon-in-tooltip).

## Accessibility

- `aria-describedby` is added to the related element
- The tooltip content should be physically add to the DOM right after the input field for the case of validation errors. This is so that a screen reader use can down arrow and reread content in case they missed it.
- For accessibility the tooltip should be shown when you keyboard onto an element after a short delay

## States and Variations

- Hidden
- Visible

## Responsive Guidelines

- Will be shown in the direction it fits

## Upgrading from 3.X

- Remove calls to `inforTooltip()` and use `tooltip()` instead. Can use the initializer if possible.
- Specific content may need re-styling.
- close event renamed to hide event
