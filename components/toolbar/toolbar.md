---
title: Toolbar
description: This page describes Toolbar.
---

## Configuration Options

1. [Common Configuration]( ../components/toolbar/example-index)
2. [Title + All Icon Buttons]( ../components/toolbar/example-all-icon-buttons)
3. [Title + All Text-Only Buttons]( ../components/toolbar/example-all-text-buttons)
4. [No Title + Searchfield + Icon/Text Buttons]( ../components/toolbar/example-no-title-icon-buttons)
5. [No title + Text-Only Buttons]( ../components/toolbar/example-no-title-text-buttons)
6. [Standalone Toolbar Style]( ../components/toolbar/example-standalone-style)
7. [No "More Actions" Button]( ../components/toolbar/example-no-action-button)
8. [`MaxVisibleButtons` Defined as "6" Instead of "3"]( ../components/toolbar/example-more-than-three-buttons)
9. [Additional Examples of `MaxVisibleButtons` Behavior]( ../components/toolbar/example-overflow)
10. [`selected` Event Behavior]( ../components/toolbar/example-selected-event)

## Code Example

```html
  <div class="toolbar">
    <div class="title">
      Toolbar Title
    </div>
    <div class="buttonset">
      <button class="btn" type="button">
        <span>Button #1</span>
      </button>

      <button class="btn" type="button">
        <span>Button #2</span>
      </button>

      <button class="btn" type="button">
        <span>Button #3</span>
      </button>
    </div>
    <div class="more">
      <button class="btn-actions" type="button">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use xlink:href="#icon-more"></use>
        </svg>
        <span class="audible">More Actions</span>
      </button>
      <ul class="popupmenu">
        <li><a href="#">Pre-defined Option #1</a></li>
        <li><a href="#">Pre-defined Option #2</a></li>
      </ul>
    </div>
  </div>
```

## Implementation Tips

- The best way to force items to always exist inside of the "more actions" menu is to create those items inside of a pre-defined "more actions" menu in your application's HTML markup.  While it's possible to create extra buttons inside of the "buttonset" container that sit beyond the `maxVisibleButtons` setting, a change of settings on the Toolbar element can cause those buttons to appear/disappear unexpectedly.

## Accessibility

- The Soho Toolbar automatically appends the WAI-ARIA role "toolbar" to its base element.
- There is only ever one element inside of a Toolbar at a time that can receive focus.  The Soho Toolbar allows for navigation among all of its buttons with the arrow keys.

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus to the first enabled toolbar item
- <kbd>Tab Again</kbd> moves focus out of the toolbar
- <kbd>Left and Right Arrow</kbd> keys navigate among the enabled items in the toolbar.

## States and Variations

Each [Button](https://soho.infor.com/index.php?p=component/buttons) or [Text Input Field](https://soho.infor.com/index.php?p=component/text-input-field) in the Toolbar will inherit the usual states that can be expected for those components.

### Enable/Disable

The Toolbar Component itself can be completely enabled or disabled by using the API-level methods [`enable()`](#enable) or [`disable()`](#disable).

### Right-To-Left

The Toolbar Component will automatically flip the orientation of its title, buttonset, and "more actions" button horizontally when switched to RTL mode.

## Responsive Guidelines

When there are too many buttons, inputs, or other items present on the toolbar to fit on one line, items that would normally wrap to a second line are hidden. The hidden items will move to an overflow [action button.](https://soho.infor.com/index.php?p=component/actions-menu-button)
