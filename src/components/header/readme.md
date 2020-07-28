---
title: Header
description: Displays identifying information for a given data set. Best for identifying the main object or data set in a given view.
demo:
  embedded:
  - name: Default Header Example
    slug: example-index
  pages:
  - name: Disabled Buttons On Header
    slug: example-disabled-buttons
  - name: Eyebrow Style (Emphasis on the ID)
    slug: example-emphasize-id
  - name: Eyebrow Style (Default)
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
  - name: Header Navigation Breadcrumbs
    slug: example-breadcrumbs
  - name: Header Navigation Breadcrumbs (Alternate)
    slug: example-breadcrumbs-alternate
  - name: Header with Drill Down Button (Back)
    slug: example-drilldown
  - name: Header Navigation with Popup menu
    slug: example-popupmenu
  - name: Header Navigation with Tabs
    slug: example-tabs
  - name: Header Navigation with Tabs (Alternate)
    slug: example-tabs-alternate
  - name: Header with Toolbar Below
    slug: example-toolbar
  - name: Header Navigation with Wizard
    slug: example-wizard
---

## Code Example

A header element always contains a toolbar. The toolbar is composed of three parts: a `title` area, a `<button>` area and an area for more or overflow.

This is a simple configuration.

```html
<header class="header is-personalizable">
  <div class="toolbar">
    <div class="title">
      <button id="application-menu-trigger" class="btn-icon application-menu-trigger" type="button">
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
      <button id="btn-more" class="btn-actions" type="button">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-more"></use>
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

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- Replaces Module Header
- Has entirely different structure with no great mapping
