---
title: Initialize
description: null
---

## Code Example

A component initialize plugin is included in the sohoxi.js script. This plugin knows how to initialize all components in the parent container you call it against, for example, the body element or some other parent container.

The page initializer will find all elements that need initialization and initialize them with default options. Some controls have options that can be initialized by placing data attributes inline for the control. For example `data-options="{'maxselected': 5}"`. Elements can be skipped from the initializer by adding an attribute `data-init="false"`` to the element in the markup. The plugin accepts a locale with languages as an argument. Once passed in, the current locale will be fetched and all components in the page's needed locale information will be initialized with that locale data.

```javascript
// Init All IDS Enterprise Controls Stuff on Document Ready
$(function() {
  $('body').initialize('en-US');
});

```

## Code Tips

TODO
