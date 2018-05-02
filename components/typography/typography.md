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

1. Add the class `font-source-sans` to the HTML tag like `<html class="font-source-sans>`
2. Or pass it in to the `.personalize()` API as the example below shows:

```javascript
$('html').personalize({colors: ['80000'], theme: 'dark', font: 'source-sans'});
```

The sample app can be run with this font by adding the `?font=source-sans` parameter to any page. For example `components/personalize/example-index.html?font=source-sans`

## Typography Related Classes

The following classes can be used for text color:

* `text-default`- Makes the text the normal default color for the theme.
* `text-descriptive ` - Used for descriptive text so a bit lighter.
* `text-muted` - Used for disable/subtle text so even more.
* `text-link` - Style text to look like a link. (Primary Color)

The following classes can be used for text style:

* `text-emphasis` - Style text to show in italics. Often used on timestamps.
* `text-strong ` - Style text to look bold. Often used for group labels or emphasis.
* `text-alert` or `alert-text` - Style text to a red alert. (Alter Color) Used for errors. You should always use an icon with text in order to give meaning to color blind users.
* `text-uppercase` or `uppercase-text` - Force text to uppercase.

The following classes can be used for text size:

* `text-primary` - Used for primary sized text (1.8rem). Used for headings.
* `text-secondary` - Used for primary sized text (1.6rem). Used for subheadings.
* `text-base` - Used for normal/default text (1.4rem).
* `text-small` - Used for normal/default text (1.2rem).
* `larger-heavy-text` -  Shows text slightly larger and emphasized. Used for totals or group labels.
* `data-large` -  Shows text in an even larger size (2.2em) used for count style data labels.
* `xl-text` -  Shows text in an even larger size (5em) used for form counts.

The following classes can be used for errors/warnings

* `alert-text` - Shows text for alerts in ruby/red. Along with an icon.
* `error-text` -  Shows text for error messages in ruby/red.
* `warning-text` -  Shows text for warning messages.
* `good-text` -  Shows text for good /positive affirmation in green/emerald
* `info-text` -  Shows text for information blue/azure

The following classes can be used for text alignment

* `align-text-left` - Set text alignment to left.
* `align-text-right` -  Set text alignment to right.
* `align-text-right` or `center-text` -  Set text alignment to center.

## Usage

For further font, typography, and grammar usage, see the [Typography guidelines](/guidelines/identity/typography).
