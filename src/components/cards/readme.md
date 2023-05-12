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

The icon used on cards should use a flipped icon labelled `icon-vertical-ellipsis` (not `icon-more`).

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

## Actions and System Buttons

The overflow button also known as `btn-actions` or the action button. Will be hidden by default if its the only button on a card. Some other buttons like a back button are considered `system buttons`. These buttons are added by the home page dev team and cannot be removed vs buttons added by the widget developers. Think integrated vs normal buttons. These buttons have a hidden look to clean up the form. When on a touch device it can be trigger to hover so we show them on touch only devices. To add a special `system button` to the widget add the `btn-actions` class to any button.

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

## Card with badge

The component represents a card-like element with a badge displaying additional information.

To use the Card with Badge component, you can include the following HTML markup:

```html
<div class="widget-header-section title">
  <h2 class="card-title">Card Title</h2>
  <span class="round info badge">5</span>
</div>
```

The `div` element with the class `widget-header-section` represents the header section of the card. Inside this div, we have a `h2` element with the class `card-title` to display the title of the card. Additionally, we have a `span` element with the classes `round`, `info`, and `badge` to display the badge indicating additional information. In the example above, the badge displays the number 5.

## Card Header with Subtitle

The component represents a card header with a title and a subtitle.

To use the Card Header with Subtitle component, you can include the following HTML markup:

```html
<div class="card-header has-subtitle">
  <div class="widget-header-section title">
    <h2 class="card-title">Birthdays</h2>
    <p class="label font-size-px-14 m-bottom-0">November 2023</p>
  </div>
  <div class="widget-header-section custom-action">
    <!-- Custom action content goes here -->
  </div>
  <div class="widget-header-section more">
    <!-- More actions content goes here -->
  </div>
</div>

```

## Card with back button

The Card with Back Button component provides a way to toggle between two states. The first state, known as the default state, displays the card title, custom action buttons, button actions, and the card content. The second state, known as the back state, displays the back button, detail custom action buttons, and the detail content.

To toggle an element to the second state, you need to click on it while ensuring that the `detailRefId` is populated. This setting acts as a binder, connecting the element to the second view. If you're working with a list, the component is already configured to target the `.is-selected` selector, binding it automatically to the second state.

To use the Card with Back Button component, you can include the following HTML markup

```html
<div class="card bordered" id="back-button-1">
  <div class="card-header has-subtitle">
    <div class="widget-header-section detail-title">
      <h2 class="card-title">November</h2>
    </div>
    <div class="widget-header-section detail-custom-action">
      <button type="button" class="btn-icon" id="star-id">
        <span>Star</span>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-star-outlined"></use>
        </svg>
        <span class="audible">Star</span>
      </button>
      <button type="button" class="btn-icon" id="new-doc-id">
        <span>New Document</span>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-new-document"></use>
        </svg>
        <span class="audible">New Document</span>
      </button>
    </div>
    <div class="widget-header-section title">
      <h2 class="card-title">Birthdays</h2>
      <p class="label font-size-px-14 m-bottom-0">November 2023</p>
    </div>
    <div class="widget-header-section custom-action">
      <button type="button" class="btn-icon" id="search-id">
        <span>Calendar</span>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-calendar"></use>
        </svg>
        <span class="audible">Calendar</span>
      </button>
    </div>
    <div class="widget-header-section more">
      <!-- More actions content goes here -->
    </div>
  </div>
  <div class="card-content">
    <div class="content-main">
      <button id="trigger-btn" type="button" class="btn-secondary">Click to open widget detail view</button>
    </div>
    <div class="content-detail">
      <!-- Detail view content of the card goes here -->
    </div>
  </div>
</div>
```

Remember to include the following divs in the template of the card header: `<div class="widget-header-section detail-title"></div>` and `<div class="widget-header-section detail-custom-action"></div>`. These divs are essential for displaying the title and custom action of the card in the second state.

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

## Cards with padding in the content

You can add padding to the content section of the card. This is useful when you want to add a form or a list to the card. To add padding to the content section, either use the `contentPaddingX` for left and right paddings, and `contentPaddingY` for top and bottom paddings. The other option is to use css utility classes `.padding-x-#` and `.padding-y-#`.

```js
$('#no-header-1').cards({ contentPaddingX: 16, contentPaddingY: 16 });
```

or

```html
<div class="card-content padding-x-16 padding-y-16"></div>
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
