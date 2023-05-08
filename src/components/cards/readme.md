---
title: Cards
description: null
demo:
  embedded:
  - name: Simple Card Example
    slug: example-index
  pages:
  - name: A group action toolbar area
    slug: example-action-menu-button
  - name: Auto Height Cards
    slug: example-auto-size
  - name: Expandable Card
    slug: example-expandable
  - name: Full Page Width Cards
    slug: test-full-width
  - name: Menu Button in the Header
    slug: example-menubutton
  - name: A group action toolbar area
    slug: example-group-action
  - name: 3 Cards per column
    slug: test-three-up
---

## Code Example

Note that either the class `card` or `widget` can be used interchangeably. A card is just a div with `class="card"`. Usually its used in conjunction with home pages or the responsive grid. It can also have a header object and a content area (with scrolling). By adding the classes as noted in the example. Also checkout the homepage examples and homepage component.

```html
<div class="row">
  <div class="one-third column">
    <div class="card">
      <div class="card-header">
          <h2 class="widget-title">Card Title</h2>
          <button class="btn-actions" type="button">
            <span class="audible">Actions</span>
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
              <use href="#icon-vertical-ellipsis"></use>
            </svg>
          </button>
          <ul class="popupmenu">
            <li><a href="#" id="action-item-one">Action One</a></li>
            <li><a href="#" id="action-item-two">Action Two</a></li>
          </ul>

      </div>
      <div class="card-content">

      </div>
    </div>
  </div>
  <div class="two-thirds column">
    <div class="card">
      <div class="card-header">
          <h2 class="widget-title">Card Title</h2>
          <button class="btn-actions" type="button">
            <span class="audible">Actions</span>
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
              <use href="#icon-vertical-ellipsis"></use>
            </svg>
          </button>
          <ul class="popupmenu">
            <li><a href="#" id="action-item-three">Action One</a></li>
            <li><a href="#" id="action-item-four">Action Two</a></li>
          </ul>

      </div>
      <div class="card-content">

      </div>
    </div>
  </div>
</div>
```

## Auto Size

Sometimes you might want to use a card in a form outside of the home pages / widget examples. To make it the same size as the content just add the class `auto-height`.

```html
<div class="card auto-height">
  <div>Content</div>
  <div>Content</div>
  <div>Content</div>
</div>
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- The header contains a toolbar. Arrow keys should be used between buttons on the toolbars
- <kbd>Tab</kbd> to each section

## Responsive Guidelines

- Either fluid based on parent grid, or uses masonry style layout
