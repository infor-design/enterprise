---
title: Toolbar
description: null
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
  - name: Title + All Icon Buttons
    slug: example-all-icon-buttons
  - name: Title + All Text-Only Buttons
    slug: example-all-text-buttons
  - name: No Title + Searchfield + Icon/Text Buttons
    slug: example-no-title-icon-buttons
  - name: No title + Text-Only Buttons
    slug: example-no-title-text-buttons
  - name: No "More Actions" Button
    slug: example-no-action-button
  - name: "`MaxVisibleButtons` Defined as '6' Instead of '3'"
    slug: example-more-than-three-buttons
  - name: Additional Examples of `MaxVisibleButtons` Behavior
    slug: example-overflow
  - name: "`selected` Event Behavior"
    slug: example-selected-event
---

## Code Example

```html
<div class="toolbar">
    <div class="title">
        Toolbar Title
    </div>
    <div class="buttonset">
        <button id="btn-1" class="btn" type="button">
            <span>Button #1</span>
        </button>

        <button id="btn-2" class="btn" type="button">
            <span>Button #2</span>
        </button>

        <button id="btn-3" class="btn" type="button">
            <span>Button #3</span>
        </button>
    </div>
    <div class="more">
        <button class="btn-actions" type="button">
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-more"></use>
            </svg>
            <span class="audible">More Actions</span>
        </button>
        <ul class="popupmenu">
            <li><a href="#" id="action-item-one">Pre-defined Option #1</a></li>
            <li><a href="#" id="action-item-two">Pre-defined Option #2</a></li>
        </ul>
    </div>
</div>
```

## Implementation Tips

The best way to force items to always exist inside of the "more actions" menu is to create those items inside of a pre-defined "more actions" menu in your application's HTML markup.  While it's possible to create extra buttons inside of the "buttonset" container that sit beyond the `maxVisibleButtons` setting, a change of settings on the toolbar element can cause those buttons to appear/disappear unexpectedly.

If you want to have no action button (button with three dots) visible in the toolbar then add a `no-actions-button` class to the toolbar element.

## Accessibility

- The toolbar automatically appends the WAI-ARIA role "toolbar" to its base element.
- There is only ever one element inside of a toolbar at a time that can receive focus. The toolbar allows for navigation among all of its buttons with the arrow keys

## Testability

You can add custom id's/automation id's to the Toolbar that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes.
For example:

```js
  attributes: { name: 'id', value: args => `background-color` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [
    { name: 'id', value: 'my-unique-id' },
    { name: 'data-automation-id', value: 'my-unique-id' }
  ]
```

These attributes can be added programmatically using the Toolbar API:

```js
  $('#my-toolbar').toolbar({
    attributes: [
      { name: 'data-automation-id', value: 'my-toolbar' }
    ]
  });
```

When passing attributes in this manner, the following elements within the Toolbar are appended with a `data-automation-id` attribute:

- The main toolbar element with `my-toolbar`.
- All toolbar buttons, with `my-toolbar-button-{0}` where `{0}` is the toolbar button's index.
- One exception to the button rule is the More Actions button, which will be `my-toolbar-actionbutton`. The attributes setting is passed into the [Popupmenu API]('./popupmenu#testability') using this suffix.  All action button menu items are labeled at the Popupmenu API level.
- If a [Searchfield]('./searchfield') is present, it will be labeled with `my-toolbar-searchfield`.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus to the first enabled toolbar item
- A second <kbd>Tab</kbd> moves focus out of the toolbar
- <kbd>Left</kdb> and <kbd>Right</kbd> keys navigate among the enabled items in the toolbar

## States and Variations

Each [button](./buttons) or [text input field](./input) in the toolbar will inherit the usual states that can be expected for those components.

### Enable/Disable

The toolbar component itself can be completely enabled or disabled by using the API-level methods `enable()` or `disable()`.

### Right-To-Left

The toolbar component will automatically flip the orientation of its title, buttonset, and "more actions" button horizontally when switched to RTL mode.

## Responsive Guidelines

When there are too many buttons, inputs, or other items present on the toolbar to fit on one line, items that would normally wrap to a second line are hidden. The hidden items will move to an overflow [action button.](./menubutton).
