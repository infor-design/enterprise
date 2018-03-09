---
title: Cards  
description: This page describes Cards.
---

## Configuration Options

1. Simple Card Example [View Example]( ../components/cards/example-index)
2. Expandable Card [View Example]( ../components/cards/example-expandable)
3. Full Page Width Cards [View Example]( ../components/cards/example-full-page)
4. A group action toolbar area [View Example]( ../components/cards/example-group-action)
5. Menu Button in the Header [View Example]( ../components/cards/example-menubutton)
6. Datagrid In a Card (Bad Practice) [View Test]( ../components/cards/test-datagrid)
7. Datagrid With Pager (Bad Practice) [View Test]( ../components/cards/test-paging-datagrid)
8. Toolbar In The Header [View Test]( ../components/cards/test-toolbar-header)
8. 3 Cards per column [View Example]( ../components/cards/example-three-up)

## Code Example

Note that either the class `card` or `widget` can be used interchangeably. A card is just a div with class="card". Usually its used in conjunction with home pages or the responsive grid. It can also have a header object and a content area (with scrolling). By adding the classes as noted in the example. Also checkout the homepage examples and homepage component.

```html

<div class="row">
  <div class="one-third column">
    <div class="card">
      <div class="card-header">
          <h2 class="widget-title">Card Title</h2>
          <button class="btn-actions" type="button">
            <span class="audible">Actions</span>
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
              <use xlink:href="#icon-more"></use>
            </svg>
          </button>
          <ul class="popupmenu">
            <li><a href="#">Action One</a></li>
            <li><a href="#">Action Two</a></li>
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
              <use xlink:href="#icon-more"></use>
            </svg>
          </button>
          <ul class="popupmenu">
            <li><a href="#">Action One</a></li>
            <li><a href="#">Action Two</a></li>
          </ul>

      </div>
      <div class="card-content">

      </div>
    </div>
  </div>
</div>


```

## Keyboard Shortcuts

- The Header contains a toolbar. Arrow keys should be used between buttons on the toolbars.
- Tab to each section.

## Responsive Guidelines

-   Either fluid based on parent grid, or uses masonry style layout: see example
