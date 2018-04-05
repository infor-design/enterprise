---
title: Header
description: This page describes Header.
demo:
  pages:
  - name: Default Header Example
    slug: example-index
  - name: Disabled Buttons On Header
    slug: example-disabled-buttons
  - name: Eyebrow Style (Emphasis on the ID)
    slug: example-emphasize-id
  - name: Eyebrow Style (Default
    slug: example-eyebrow
  - name: No Title Button
    slug: example-no-title-button
  - name: Non Collapsible Search Field
    slug: example-non-collapsible-searchfield
  - name: Record ID
    slug: example-record-id
  - name: Expanded Search Field (Compact)
    slug: example-searchfield-expanded
  - name: Expanded Search Field (Large)
    slug: example-searchfield-large
---

## Code Example

A header element always contains a toolbar. The toolbar is composed of three parts: a `title` area, a `<button>` area and an area for more or overflow.

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

Adding the class `is-personalizable` allows this element to get the personalization color if set. For details on keyboard shortcuts and responsive guidelines, see the documentation for [Toolbar](./toolbar).

## Accessibility

- Use button elements for `buttonset`
- Use invisible `<labels>` for searchfield and icon buttons
- Use HTML 5 header elements
- Use F1 (or F2 if the layout prescribes) for the title element for correct page structure

## Upgrading from 3.X

- Replaces Module Header
- Has entirely different structure with no great mapping
