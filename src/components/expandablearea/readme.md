---
title: Expandable Area
description: null
demo:
  embedded:
  - name: Default Expandable Area Example
    slug: example-index
  pages:
  - name: Custom Link Text Demo
    slug: example-custom-text
  - name: Custom Toggle Button Demo
    slug: test-toggle-button
---

An expandable area is a `<div>` with the `expandable-area` class. Inside that element would be a header with a `title` and a pane. The pane has the class `expandable-pane` and is the area that will hide and show.

An expandable area content pane can be either collapsed or expanded. During initialization, the expandable area's base element `$('.expandable-area')` is checked for the CSS class `is-expanded`. If found, the expandable area content pane will open automatically.

It's possible to keep the area open by default by adding the class `is-expanded` to the `expandable-area`. You can also add a second pane with class `expandable-visible-panel`. This pane will always remain open.

```html
<div class="expandable-area">
  <div class="expandable-header">
    <span class="title">Procurement</span>
  </div>
  <div class="expandable-pane">
    <div class="content">
      Ubiquitous out-of-the-box, scalable; communities disintermediate beta-test, enable utilize markets dynamic infomediaries virtual data-driven synergistic aggregate infrastructures, "cross-platform, feeds bleeding-edge tagclouds." Platforms extend interactive B2C benchmark proactive, embrace e-markets, transition generate peer-to-peer.
    </div>
  </div>
</div>
```

## Code Example - Toggle Area

Its possible to assign a custom button that can toggle a specific area using the expandable-area component.  To do this place the class `expandable-area-trigger` on a button inside the expandable area. Also you can optionally specify two icons for open and closed state. Then the element in the expandable-pane will be toggled.

```html
<div class="expandable-area">
  <button type="button" class="btn expandable-area-trigger" id="trigger-btn">
    <span>Employee</span>
    <svg class="icon icon-closed" focusable="false" aria-hidden="true" role="presentation">
      <use href="#icon-caret-down"></use>
    </svg>
    <svg class="icon icon-opened" focusable="false" aria-hidden="true" role="presentation">
      <use href="#icon-caret-up"></use>
    </svg>
  </button>
  <div class="expandable-pane">
    <div class="content">
      <p>
      Eiusmod meh schlitz iPhone small batch esse mumblecore mustache cliche sartorial keffiyeh fixie tattooed pour-over. Tofu poke la croix tote bag unicorn poutine. Meh pork belly sartorial iceland umami chia et. Qui bushwick PBR&B cronut mixtape, celiac food truck distillery magna squid kombucha forage irure. Chambray polaroid cornhole tumblr.
      </p>
    </div>
  </div>
</div>
```

## Accessibility

- `role="button"` Should be added to the link so AT treats the link as if it was a button.
- `role="region"` Should be added to the expandable region to convey it to non-sighted users.
- `aria-labelledby` Should be added to the dynamic expandable region, where aria-labelledby points back to the area title.

## Testability

The expandablearea can have custom id's/automation id's that can be used for scripting. To add them, use the option `attributes` to set an id on the generated expandablearea. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `message-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

Providing the data, this will add an ID added to each expandablearea header with `-header`, expandablearea content with `-content`, expandablearea expander with `-expander`, expandablearea footer with `-footer`, and to the root expandablearea element appended.

## Keyboard Shortcuts

- Press <kbd>Tab</kbd> to focus the Expandable Area's link
- Press <kbd>Enter</kbd> to expand the area or collapse it
- If the content pane is open, pressing <kbd>Tab</kbd> or <kbd>Shift + Tab</kbd> will focus the next or previous focusable element inside the content pane
- If the content pane is closed or focus is on the last focusable element inside the content pane, pressing <kbd>Tab</kbd> once more will leave the content pane and focus the next focusable element on the page. <kbd>Shift + Tab</kbd> will do the opposite

## Responsive Guidelines

The Expandable Area will automatically stretch to fill 100% of its parent element's width.

## Upgrading from 3.X

- Expandable Area and Field Set are separated
