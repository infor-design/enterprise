---
title: Personalize
description: null
demo:
  embedded:
  - name: Themes Example
    slug: example-index?colors=800000
---

## Code Example

You should pass in a primary (header) color to the personalize function. This is the minimum option need. The rest of the colors will be calculated as percents of the source color. For example the sub header is 20% of the main color.

```javascript
var colors = {header: colors[0],
         subheader: colors[1],
         text: colors[2],
         verticalBorder: colors[3],
         horizontalBorder: colors[4],
         inactive: colors[5],
         hover: colors[6]};

$('html').personalize({colors: colors});
```

For reduction of FOUC (flash of unstyled content) run the personalize logic before inserting the theme stylesheet.

```html
<script>
  //Call personalize here
  $('html').personalize({colors: colors});
</script>
<link rel="stylesheet" id="sohoxi-stylesheet" href="../../stylesheets/{{theme}}-theme.css" type="text/css">
```

## Code Tips

- Add the class is-personalizable so that this element will get the personalization color when set.

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. Choose colors that pass contrast guidelines. Future we plan on adding a checker to the settings dialog.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
