---
title: Stats Component
description: Displays a container with various stats and trends. These could be used in other scenarios but to start with are primary for widget developers.
demo:
  embedded:
  - name: Stats (Widgets)
    slug: example-index
  pages:
  - name: Stats (Widgets)
    slug: example-index
---
## Code Examples

### Stats - Stat Component

The stat components provides a clickable, selectable, touchable link for accessing related content from a widget. The component built with CSS only and is markup based so does not have a JS component.

- A main container `<div>` tag which can have a unique ID attribute and must have a `stat` CSS class. It should also have a tabindex.
- Add the optional `actionable` class if you want the state to be clickable
- Inside of that, a `<div>` tag with a `assessment` CSS class. And a color such as `success` or error. You will need to format the data for different locales (maybe a future setting).
- Also add an optional icon to indicate the trend
- In the `details` div add a main value and optional title and subtitle

```html
<div class="stat actionable" tabindex="0">
    <div class="assessment success">
        <div class="percentage">+28.62%</div>
        <div class="icon-status amber01" role="presentation">
            <svg class="icon amber05-color" focusable="false" aria-hidden="true">
                <use href="#icon-building"></use>
            </svg>
        </div>
    </div>
    <div class="details">
        <div class="value">12</div>
        <div class="title">Main title</div>
        <div class="subtitle">Sub title goes here</div>
    </div>
</div>
```

To make the stats selected add the following JS that insures only one link of 4 in a widget can be selected.

```js
    $('#example-widget-bordered-1 .stat.actionable').selectable().on('click', () => console.log('A Stat Was Clicked'));
```

### Link - Double Wide Example

To create a link that spans the whole widget (2 or 3 up) add the `dual` class to the link.

```html
<div class="stat dual">
    <div class="assessment success">
        <div class="percentage">+28.62%</div>
        <div class="icon-status emerald01" role="presentation">
        <svg class="icon emerald05-color" focusable="false" aria-hidden="true">
            <use href="#icon-success"></use>
        </svg>
        </div>
    </div>
    <div class="details">
        <div class="value success">24.57%
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-up-arrow"></use>
            </svg>
        </div>
        <div class="title">Total revenue</div>
        <div class="subtitle">Q4 2023</div>
    </div>
</div>
```

## Testability

You can add custom id to the root of the component.

```html
<div class="stat dual" tabindex="0" id="my-stat">
  ...
</div>
```

## Keyboard Shortcuts

- <kbd>Enter</kbd> causes the stat to be executed
- <kbd>Tab</kbd> - Focuses in and out of the stat.
- <kbd>Shift + Tab</kbd> Focuses in and out of the stat.

NOTE: For tabbing to work correctly on macOS you need "full keyboard access" turned on in Accessibility settings. This way the system can tab into any elements. If using Safari on a Mac, you also need to go into Safari's preferences and turn on the "Press Tab to Highlight Each Option" setting. This allows hyperlinks to be focusable by default (without having to press <kbd>Option + Tab</kbd>).

## States and Variations

The stat control itself can be either completely actionable or not

Each individual stat has the following states:

- Normal
- Hover
- Focused
- Selected (Actionable)
