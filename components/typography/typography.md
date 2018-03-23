---
title: Typography
description: This page describes Typography .
demo:
  pages:
    - name: Main Example Page
      slug: example-index
---

## Font family

The default font family is still for the moment. `font-family: Helvetica, Arial` However the Infor design
team decided on a new font you can now work with as a preference. `'Source Sans Pro', Helvetica, Arial`

To enable this font in the components first you need to add this link to the head of your pages.

```html
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600" rel="stylesheet"/>
```

After that you can either:

1. Add the class `font-source-sans` to the html tag like `<html class="font-source-sans>`
2. Or pass it in to the personalize API as the example below shows:

```javascript
$('html').personalize({colors: ['80000'], theme: 'dark', font: 'source-sans'});
```

<!--
The sample app can be run with this font by adding the `?font=source-sans` parameter to any page. For example `components/personalize/example-index.html?font=source-sans`
-->

## Usage

For further font, typography, and grammar usage, see the [Typography guidelines](/guidelines/identity/typography).
