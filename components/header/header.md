---
title: Header  
description: This page describes Header.
---

## Configuration Options

1. Default Header Example [View Example]( ../components/header/example-index)
2. Disabled Buttons On Header [View Example]( ../components/header/example-disabled-buttons)
3. Eyebrow Style (Emphasis on the ID) [View Example]( ../components/header/example-emphasize-id)
4. Eyebrow Style (Default [View Example]( ../components/header/example-eyebrow)
5. No Title Button [View Example]( ../components/header/example-no-title-button)
6. Non Collapsible Search Field [View Example]( ../components/header/example-non-collapsible-searchfield)
7. Record ID [View Example]( ../components/header/example-record-id)
8. Expanded Search Field (Compact) [View Example]( ../components/header/example-searchfield-expanded)
9. Expanded Search Field (Large) [View Example]( ../components/header/example-searchfield-large)

## Code Example

A header element always contains a toolbar. The toolbar is composed of three parts a title area a button area and a more/overflow area.
This is a simple configuration.

```html


<header class="header is-personalizable">
  <div class="toolbar">
    <div class="title">
      <button class="btn-icon application-menu-trigger" type="button">
        <span class="audible">Show navigation</span>
        <span class="icon app-header">
          <span class="one"></span>
          <span class="two"></span>
          <span class="three"></span>
        </span>
      </button>

      <h1>Page Title</h1>
    </div>

    <div class="buttonset">
      <label for="header-searchfield" class="audible">Search</label>
      <input id="header-searchfield" class="searchfield" name="header-searchfield" />
    </div>

    <div class="more">
      <button class="btn-actions" type="button">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-more"></use>
        </svg>
        <span class="audible" data-translate="text">More</span>
      </button>
    </div>

  </div>
</header>


```

## Behavior Guidelines

- Add the class is-personalizable so that this element will get the company personalization color when set.

## Accessibility

- Use button elements for buttonset
- Use invisible Labels for searchfield and icon buttons
- Use html 5 header elements
- Use F1 (or F2 if the layout prescribes) for the title element for correct page structure

## Keyboard Shortcuts

- See toolbar guidlines

## Responsive Guidelines

- See toolbar guidlines

## Upgrading from 3.X

- Replaces Module Header
- Has entirely different structure with no great mapping
