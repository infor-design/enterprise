---
title: Breadcrumb
description: Displays the current view and all parent views. A user can navigate between views. Best for presenting hierarchical paths in a system.
demo:
  embedded:
  - name: Default Breadcrumb Example
    slug: example-index
  pages:
  - name: Breadcrumb with current item a link
    slug: example-current-as-link
  - name: Navigation breadcrumbs in header
    slug: example-navigation-breadcrumbs
  - name: Navigation breadcrumb in header (alternate)
    slug: example-navigation-breadcrumbs-alternate
---

## Code Example

This is an example showing a breadcrumb component with four items. The current item should be last and have the `current` class. All items take the hyperlink style via class `hyperlink`. However, based on background element (header or page) the style may adopt and change. The `disabled` class can also be added to prevent links from being clickable.

```html
<nav class="breadcrumb">
  <ol class="breadcrumb-list" aria-label="breadcrumb">
    <li class="breadcrumb-item">
      <a href="#" id="home" data-automation-id="breadrcrumb-home" class="hyperlink">Home</a>
    </li>
    <li class="breadcrumb-item">
      <a href="#" id="second-item" data-automation-id="breadrcrumb-second" class="hyperlink">Second Item</a>
    </li>
    <li class="breadcrumb-item">
      <a href="#" id="third-item" data-automation-id="breadrcrumb-third" class="hyperlink">Third Item</a>
    </li>
    <li class="breadcrumb-item current">
      <a href="#" id="fourth-item" data-automation-id="breadrcrumb-fourth" class="hyperlink">Fourth Item <span class="audible">Current</span></a>
    </li>
  </ol>
</nav>
```

## Breadcrumb Positioning and Variations

The above example just shows an in-page breadcrumb. But usually the breadcrumb would be the top level element in the page. In some cases it is actually in or just below the header. These examples are shown in the [headers section](./demo/components/header/).

Examples:

- [In Header](./demo/components/header/example-breadcrumbs) this variation is used when the breadcrumb acts as the sole top level navigation.
- [Below Header](./demo/components/header/example-breadcrumbs-alternate) this variation is used when the breadcrumb acts as a secondary top level navigation. For example if its part of the page pattern.

## Accessibility

- Add an `aria-label` with the localized term for "breadcrumb"
- `audible` spans may need to be added to indicate levels

## Testability

You can add custom id's/automation id's to breadcrumbs that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes.

When defining breadcrumbs in HTML only, simply add the attributes you'd like to the markup.  The Breadcrumb API will respect these:

```html
<li class="breadcrumb-item">
  <a href="#" id="home" data-automation-id="breadrcrumb-home" class="hyperlink">Home</a>
</li>
```

When defining the breadcrumb API with Javascript, you can pass an `attributes` array that will be applied to a breadcrumb on an individual basis:

```js
$('#my-breadcrumb').breadcrumb({
  breadcrumbs: [
    {
      content: 'Home',
      id: 'breadcrumb-home',
      href: '#',
      attributes: [
        { name: 'data-automation-id', value: 'breadcrumb-home' }
      ]
    },
    ...
  ]
});
```

Please refer to the [Application Testability Checklist](/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus to the link. A second <kbd>tab</kbd> moves focus to the next focusable item.
- <kbd>Space</kbd> or <kbd>Enter</kbd> executes the link.

## Upgrading from 3.X

- "Collapsing Lists" is Deprecated
- Markup has entirely changed, see the updated code example
