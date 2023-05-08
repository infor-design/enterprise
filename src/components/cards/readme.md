---
title: Cards
description: null
demo:
  embedded:
  - name: Simple Card Example
    slug: example-index
  pages:
  - name: A group action toolbar area
    slug: example-action-menu-button
  - name: Auto Height Cards
    slug: example-auto-size
  - name: Expandable Card
    slug: example-expandable
  - name: Borderless Card
    slug: example-borderless
  - name: Bordered Card on Hover
    slug: example-bordered
  - name: Search and Scrollable Content
    slug: example-search
  - name: Expandable Card
    slug: example-expandable
  - name: Full Page Width Cards
    slug: test-full-width
  - name: Menu Button in the Header
    slug: example-menubutton
  - name: A group action toolbar area
    slug: example-group-action
  - name: 3 Cards per column
    slug: test-three-up
---

## Code Example

Note that either the class `card` or `widget` can be used interchangeably. A card is just a div with `class="card"`. Usually its used in conjunction with home pages or the responsive grid. It can also have a header object and a content area (with scrolling). By adding the classes as noted in the example. Also checkout the homepage examples and homepage component.

Our new code uses a new flex box based widget for the toolbar. Place the title in a section called `widget-header-section title`. And the buttons in a section like `<div class="widget-header-section custom-action">`.

The icon used on cards should be a flipped icon labelled `icon-vertical-ellipsis` (not `icon-more`).

```html
<div class="card">
    <div class="card-header">
    <div class="widget-header-section title">
        <h2 class="widget-title">Tasks</h2>
    </div>
    <div class="widget-header-section more">
        <button class="btn-actions" type="button">
        <span class="audible">Actions</span>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-vertical-ellipsis"></use>
        </svg>
        </button>
        <ul class="popupmenu">
        <li class="is-checked"><a href="#" id="single-selection">Action One</a></li>
        <li><a href="#" id="mixed-selection">Action Two</a></li>
        </ul>
    </div>
    </div>

    <div class="card-content">
    </div>
</div>
```

## Auto Size

Sometimes you might want to use a card in a form outside of the home pages / widget examples. To make it the same size as the content you put in it just add the class `auto-height`.

```html
<div class="card auto-height">
  <div>Content</div>
  <div>Content</div>
  <div>Content</div>
</div>
```

## Borderless Cards

Sometimes you might want cards that look more integrated into the page. To achieve this pass the bordered option into the card

```js
$(this).cards({ bordered: true });
```

## Scrollable Content

You can add a search field to the card content section and it will appear integrated with the header. As you scroll in the content the card component will add an `is-scrolling` class. To avoid a jump put `border-top: 1px solid transparent` in any custom css. But if you use the soho components this will adjust.

```html
<div class="card-content">
    <div class="card-search">
        <label class="audible" for="gridfilter">Search</label>
        <input class="searchfield" placeholder="Search My Widget" name="searchfield" id="gridfilter" data-options="{clearable: true}"/>
    </div>
    <div class="fake-content" style="height: calc(100% - 48px);overflow: auto;border-top: 1px solid transparent">
        <br/><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
</div>
```

## Searchable lists

You can add a search field that operates search typeahead on a list. See the example-search above for a working example.

```html
<div class="card-content">
<div class="listview-search">
    <label class="audible" for="gridfilter">Search</label>
    <input class="searchfield" placeholder="Search My List" name="searchfield" id="gridfilter2"
    data-options="{clearable: true}" />
</div>

<div class="listview" id="search-listview" data-init="false"></div>
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- The header contains a toolbar. Arrow keys should be used between buttons on the toolbar.
- <kbd>Tab</kbd> to each card section

## Responsive Guidelines

- Either fluid based on parent grid, or uses masonry style layout
