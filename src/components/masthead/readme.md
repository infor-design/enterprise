---
title: Masthead
description: null
demo:
  embedded:
  - name: Default Masthead Example
    slug: example-index
  - name: Photos in Masthead
    slug: example-photos
---

## Code Example

The masthead can be added to applications when not running inside mingle to add functionality that mingle would add that you need standalone. When running in mingle, detect and do not show the mast head.

```html
<section class="masthead" role="banner">
  <div class="toolbar no-actions-button" data-options="{maxVisibleButtons: 6}">
    <div class="title">
      <button type="button" id="masthead-icon" class="masthead-icon">
        <svg class="icon icon-logo" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-logo"></use>
        </svg>
         <span class="audible">Go To Home</span>
      </button>
      <h1 class="masthead-appname">Infor Application</h1>
    </div>

    <div class="buttonset">

      <button type="button" id="show-user" class="btn" title="Show User">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-user"></use>
        </svg>
        <span class="audible">User</span>
      </button>

      <button type="button" id="share" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-mingle-share"></use>
        </svg>
        <span class="audible">Share</span>
      </button>

      <button type="button" id="bookmark" class="btn btn-menu">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-bookmark-filled"></use>
        </svg>
        <span class="audible">Bookmark</span>
      </button>
      <ul class="popupmenu has-icons">
        <li><a href="#" id="option-1">Option 1</a></li>
        <li><a href="#" id="option-2">Option 2</a></li>
      </ul>

      <input id="searchfield" class="searchfield" />

      <button type="button" id="btn" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-expand-app-tray"></use>
        </svg>
        <span class="audible">Expand App Tray</span>
      </button>

    </div>
  </div>
</section>
```

## Accessibility

- Use the `role="banner"` Landmark role
- Should use html5 section or nav type

## Keyboard Shortcuts

The header action buttons should function as a toolbar, see [toolbar](./toolbar) page for guidelines.

## Responsive Guidelines

Menu will resize vertically, if buttons do not fit will fold into the "More" menu like a toolbar.

## Upgrading from 3.X

Masthead replaces the `inforTopBanner` CSS. The markup and CSS Is entirely different to support new look and behavior.
