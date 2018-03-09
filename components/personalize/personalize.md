---
title: Personalize  
description: This page describes Personalize.
---

## Configuration Options

1. Themes Example [View Example]( ../components/personalize/example-index?colors=800000)
2. Module Tabs [View Example]( ../patterns/module-tabs?colors=800000)
3. Sub Headers/Header [View Example](../patterns/builder?colors=800000)
4. Property Page  [View Example]( ../components/personalize/example-settings-page)

## Code Example

Pass in a primary (header) color to the personalize function. This is the minimum needed. The rest of the colors will be calculated as percents of the source color. (For example sub header is 20%).

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
</script>
<link rel="stylesheet" id="sohoxi-stylesheet" href="../../stylesheets/{{theme}}-theme.css" type="text/css">


```

## Code Tips

- Add the class is-personalizable so that this element will get the personalization color when set.

## Accessibility

- The contrast and actual colors can be a concern for visibility impaired and color blind people. Choose colors that pass contrast guidlines. Future we plan on adding a checker to the settings dialog.
