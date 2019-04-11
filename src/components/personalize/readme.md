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
var colors = {
  header: colors[0],
  subheader: colors[1],
  text: colors[2],
  verticalBorder: colors[3],
  horizontalBorder: colors[4],
  inactive: colors[5],
  hover: colors[6]
};

$('html').personalize({colors: colors});
```

For reduction of FOUC (flash of unstyled content) run the personalize logic before inserting the theme stylesheet.

## Personalize Classes

We expose a series of classes that you can use to personalize some items on the page. This is shown in the Use Personalize Classes Example above. The following classes may be used.

- `name` - this value will be on the axis
- `shortName` - this value will be used if the name wont fit on the axis

```html
<script>
  // Call personalize here
  $('html').personalize({colors: colors});
</script>
<link rel="stylesheet" id="sohoxi-stylesheet" href="../../stylesheets/{{theme}}-theme.css" type="text/css">
```

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. Choose colors that pass contrast guidelines.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
