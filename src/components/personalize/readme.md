---
title: Personalize
description: null
demo:
  embedded:
  - name: Form Example
    slug: example-index
  - name: Use Personalize Classes Example
    slug: example-classes
---

## Themes

IDS Enterprise has currently 2 themes and 3 theme variations in each theme. The two themes are known as Subtle (formerly Soho) and Vibrant (formerly Uplift). Combined with the 3 variants in each theme there are six options:

1. Subtle (aka Soho) - Light
1. Subtle (aka Soho) - Dark
1. Subtle (aka Soho) - Contrast
1. Vibrant (aka Uplift) - Light
1. Vibrant (aka Uplift) - Dark
1. Vibrant (aka Uplift) - Contrast

The Vibrant Dark and Vibrant Contrast are still considered beta at this time as they may have minor issues. The Vibrant theme has more rich color and deeper depth in elements like cards and lists. It also has a different set of icons. The themes are found either in the npm package or the dist folder if downloading the release directly.

To use each theme you need to:

1. Import the correct style stylesheet which would be one of `theme-soho-contrast.css`, `theme-soho-dark.css`, `theme-soho-light.css`, `theme-uplift-contrast.css`, `theme-uplift-dark.css`, `theme-uplift-light.css` . The files `light-theme.css`, `high-contrast-theme.css` and `dark-theme.css` are there for backwards compatibility and will later be removed. We will later rename these to the new names Subtle and Vibrant.
2. Add the correct SVG Block Element to the top of the page document (`theme-uplift-svg.html` or `theme-uplift-svg.html`). The file `svg.html` is there for backwards compatibility and will later be removed.

It's also possible to get information about the themes from the theme api For info on that see the [theme api]( ./theme)

## Personalization

It is also possible to personalize the colors of a a page or app. This means passing a color in and certain aspects of the page will be colorized according to that theme. We provide the personalize api for this functionality.

The minimum option needed for personalize is a single color which will be the header color. The rest of the colors will be calculated as percents of the source color. For example the sub header is 20% of the main color. Add the class is-personalizable so that certain element will get the personalization color when the api is set. Any page in the sample app that supports personalization can be viewed in a specific color by passing `?color=7025B6` where the color is the hex for the main color.

```javascript
const colors = {
  header: '2578A9',
  subheader: '1d5f8a',
  text: 'ffffff',
  verticalBorder: '133C59',
  horizontalBorder: '134D71',
  inactive: '1d5f8a',
  hover: '133C59'
};

$('html').personalize({colors: colors});
```

For reduction of FOUC (flash of unstyled content) run the personalize logic before inserting the theme stylesheet.

```html
<script>
  // Call personalize here
  $('html').personalize({colors: colors});
</script>
<link rel="stylesheet" id="sohoxi-stylesheet" href="../../stylesheets/theme-{{theme}}.css" type="text/css">
```

## Supported Personalization Components

Only a subset of components support personalization:

- [Headers and Subheaders]( ./header) - Each gets a contrasting back color and all elements in it are reflected.
- [Module Tabs]( ./tabs-module) - The tabs and sub tabs and states.
- [Accordion]( ./accordion) - The selection states.
- Builder Pattern - The headers and subheaders.
- [Hero Widget]( ./homepage) - Gets a contrasting back color.
- [Application Menu]( ./applicationmenu) - Gets contrasting back colors for the sections and all elements in it are reflected.

## Personalize Classes

We expose a series of classes that you can use to personalize some items on the page. This is shown in the Use Personalize Classes Example above. To utilize this add a class `is-personalizable` to the parent object and then use some of the the following classes on different elements.

- `personalize-header` - This will set the back color to the personalization main color, like the header.
- `personalize-subheader` - This will set the back color to personalization secondary back color like the subheaders.
- `personalize-text` - This will set the color of the text element to the personalization text color.
- `personalize-actionable` - This will set the color of the text element to the personalization text color and adds focus and hover states. This can be used on links and buttons (icon or icon + text) in the header.
- `personalize-actionable-disabled` - Adds a disabled style to actionable elements.
- `personalize-horizontal-bottom-border` - Adds a 1px border matching the personalization color to the element on the bottom.
- `personalize-horizontal-bottom-border` - Adds a 1px border matching the personalization color to the element on the top.

## Manual Personalization

It may be necessary to gain control of the timing in which personalized colors/themes/fonts are applied to your application, instead of allowing IDS to automatically set up these items.  If this is necessary, you can configure a property in the `SohoConfig` object to disable automatic initialization:

```js
const SohoConfig = {
  personalize: {
    noInit: true
  }
};
```

Insert this object in a script that runs before IDS is loaded.

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. Choose colors that pass contrast guidelines.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
