---
title: HomePage
description: null
demo:
  embedded:
  - name: Example of Empty HomePage Layout
    slug: example-index
  pages:
  - name: Example of HomePage filled with Sample Data
    slug: example-filled
  - name: 4 Column Layout
    slug: example-four-column
  - name: Hero Widget 3 Columns
    slug: example-hero-widget
  - name: Hero Widget 2 Column
    slug: example-widget-two-column
  - name: More Test Layouts (replace a-o in url)
    slug: example-scenario-a
---

## Code Example

The homepage component requires JS for its layout mechanism. Call the `.homepage()` plugin on the prescribed structure. On resize, the plugin will take care that everything is laid out in the best order and use of space it can be. It is possible to toggle viewin 3 or 4 columns depending on how much screen real estate you want to use by adding the `data-columns` attribute with a value of `3` or `4`.

See also the [Cards](../cards/readme.md) documentation for widget structure.

```html
<div class="homepage page-container scrollable" data-columns="3">
  <div class="content">

    <div class="widget triple-width">
    ...
    </div>

    <div class="widget">
    ...
    </div>

    <div class="widget">
    ...
    </div>

  </div>
</div>
```

Use the background settings to add a background image and icon.

```javascript
$('.homepage').homepage({
    background: {
      banner: {
        image: '{{basepath}}/images/background-image.svg',
        icon: {
          image: '{{basepath}}/images/banner-icon.png',
          width: 200
      }
    }
  },
});
```

## Accessibility

- The component respects element tab order which is important between the main containers

## Keyboard Shortcuts

- <kbd>Tab</kbd> Moves between the card sections

## Upgrading from 3.X

- Replaces the Tiles layout and is not compatible
