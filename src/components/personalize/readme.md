---
title: Personalize
description: null
demo:
  embedded:
  - name: Form Example
    slug: example-index?colors=7025B6
  - name: Use Personalize Classes Example
    slug: example-classes?colors=7025B6
---

## Code Example

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

Only a subset of components support personalization. These are:

- [Module Tabs]( ./tabs-module) - The tabs and sub tabs and states.
- [Accordion]( ./accordion) - The selection states.
- Builder Pattern - The headers and subheaders.
- [Headers and Subheaders]( ./header) - Each gets a contrasting back color and all elements in it are reflected.
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
