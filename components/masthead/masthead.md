---
title: Masthead  
description: This page describes Masthead.
---

## Configuration Options

1. Default Masthead Example [View Example]( ../components/masthead/example-index)

## Code Example

The masthead can be added to applications when not running inside mingle to add functionality that mingle would add that you need standalone. When running in mingle, detect and do not show the mast head.

```html
<section class="masthead" role="banner">
  <div class="toolbar no-actions-button" data-options="{maxVisibleButtons: 6}">
    <div class="title">
      <button type="button" class="masthead-icon">
        <svg class="icon icon-logo" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-logo"></use>
        </svg>
         <span class="audible">Go To Home</span>
      </button>
      <h1 class="masthead-appname">Infor Application</h1>
    </div>

    <div class="buttonset">

      <button type="button" class="btn" title="Show User">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-user"></use>
        </svg>
        <span class="audible">User</span>
      </button>

      <button type="button" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-mingle-share"></use>
        </svg>
        <span class="audible">Share</span>
      </button>

      <button type="button" class="btn btn-menu">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-bookmark-filled"></use>
        </svg>
        <span class="audible">Bookmark</span>
      </button>
      <ul class="popupmenu has-icons">
        <li><a href="#">Option 1</a></li>
        <li><a href="#">Option 2</a></li>
      </ul>

      <input class="searchfield" />

      <button type="button" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-expand-app-tray"></use>
        </svg>
        <span class="audible">Expand App Tray</span>
      </button>

    </div>
  </div>
</section>
```

## Accessibility

-  Use the role="banner" landmark role
-  Should use html5 section or nav type.

## Keyboard Shortcuts

-   The header action buttons should function as a toolbar, see toolbar page for guidelines.

## Responsive Guidelines

-   Menu will resize vertically, if buttons do not fit will fold into the more menu like a toolbar.

## Upgrading from 3.X

-   Masthead Replaces the inforTopBanner css. The markup and css is entirely different to support new look and behavior.
