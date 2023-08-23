---
title: Link Component
description: Displays either a single link in a widget or a list of links. These could be used in other scenarios but to start with are primary for widget developers.
demo:
  embedded:
  - name: Link (Widgets)
    slug: example-index
  pages:
  - name: Link (Widgets)
    slug: example-index
---
## Code Examples

### Link - Link Boxes

The link components provides a clickable, touchable link for accessing content from a widget. The component built with CSS only and is markup based so does not have a JS component.

- A main container `<div>` tag which can have a unique ID attribute and must have a `link` CSS class. It should also have a tabindex.
- Inside of that, a `<div>` tag with a `status` CSS class. Then inside that an `<svg>` icon of your choosing.
- Adjacent to that `<div>` tag, a second `<div>` tag with a `text` CSS class should contain a title `div` inside it.

```html
<div class="link" tabindex="0">
    <div class="icon-status emerald01" role="presentation">
      <svg class="icon emerald05-color" focusable="false" aria-hidden="true">
        <use href="#icon-success"></use>
      </svg>
    </div>
    <div class="text">
        <div class="title">
            Purchase Order Intake Workbench
        </div>
    </div>
</div>
```

To follow the link add the following JS that insures only one link of 4 in a widget can be selected.

```js
    $('.link').link().selectable().on('click', ()=>console.log('A Link Was Clicked'));
```

### Link - Double Wide Example

To create a link that spans the whole widget (2 or 3 up) add the `dual` class to the link.

```html
<div class="link dual" tabindex="0">
    <div class="icon-status emerald01" role="presentation">
      <svg class="icon emerald05-color" focusable="false" aria-hidden="true">
        <use href="#icon-success"></use>
      </svg>
    </div>
    <div class="text">
    <div class="title">
        Lorem ipsum dolor sit amet. Estuans interius. Ira vehementi. Estuans interius. Ira vehementi
    </div>
    </div>
</div>
```

### Link - Link List Example

To create a list of links in a widget use the following structure consisting of a `link-list` listview component and `list-item` divs.
This will get the correct styles from CSS. To follow the links here use the `href` and optional `target` on the `<a>` anchor tag.

```html
<div class="listview link-list">
    <ul role="presentation">
    <li>
        <div class="link-item">
        <a class="hyperlink hide-focus show-visited force-visited" href="#">
            Categories
        </a>
        </div>
    </li>
    <li>
        <div class="link-item">
        <a class="hyperlink hide-focus" disabled href="#">
            Organization Configuration
        </a>
        </div>
    </li>
    <li>
        <div class="link-item">
        <a class="hyperlink hide-focus" href="#">
            Types
        </a>
        </div>
    </li>
    <li>
        <div class="link-item">
        <a class="hyperlink hide-focus" href="#">
            Organization Configuration
        </a>
        </div>
    </li>
    <li>
        <div class="link-item">
        <a class="hyperlink hide-focus" href="#">
            Appraisal Email Templates
        </a>
        </div>
    </li>
    </ul>
</div>
```

## Testability

You can add custom id to the root of the component.

```html
<div class="link" tabindex="0" id="my-link>
    <div class="icon-status emerald01" role="presentation">
      <svg class="icon emerald05-color" focusable="false" aria-hidden="true">
        <use href="#icon-success"></use>
      </svg>
    </div>
    <div class="text">
        <div class="title">
            Purchase Order Intake Workbench
        </div>
    </div>
</div>
```

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Enter</kbd> causes the link to be executed
- <kbd>Tab</kbd> - Focuses in and out of the link.
- <kbd>Shift + Tab</kbd> Focuses in and out of the link.

NOTE: For tabs to work correctly on macOS you need "full keyboard access" turned on in Accessibility settings. This way the system can tab into any elements. If using Safari on a Mac, you also need to go into Safari's preferences and turn on the "Press Tab to Highlight Each Option" setting. This allows hyperlinks to be focusable by default (without having to press <kbd>Option + Tab</kbd>).

## States and Variations

The link control itself can be either completely active, or completely disabled.

Each individual link has the following states:

- Normal
- Hover
- Focused
- Selected (Active)
- Disabled
