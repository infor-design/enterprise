---
title: Typography
description: null
demo:
  embedded:
  - name: Main Example Page
    slug: example-index
---

## Font family

When using the newest designs (Not Classic Mode) you should use a custom font called [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+3). We use 300,400,600 font-weights, although all 100-900 font weights may appear, the font will scale up and down as needed down. We do not use italics anywhere in the designs as it is difficult to read.

Source Sans Pro supports many of our languages but some languages require [alternate fonts](https://github.com/infor-design/enterprise/blob/main/src/components/typography/_typography-new.scss#L6). Each of this fonts will be used based on the matching locale.

NOTE: It is no longer recommended to use fonts.googleapis to use the fonts.

SSUE: The problems can be:

(a) use of Google Fonts API may violate cross border data transfer restrictions under local privacy laws (e.g. EU’s [GDPR](https://www.cookieyes.com/documentation/google-fonts-and-gdpr/) or China’s PDPL)
(b) if the application needs to run without an internet connection, or
(c) in some countries Google links may be banned or limited (e.g. China).

RECOMMENDED FIX: Given Infor’s global customer base we recommend a unified approach that is compliant in all jurisdictions. For this reason we suggest you serve the files with the application (e.g. download and embed the font library locally). All the needed fonts can be found in the [design system repo](https://github.com/infor-design/design-system/tree/main/fonts). You will need to copy the files into the correct location for your app and serve them and then include the [font-face.css](https://github.com/infor-design/design-system/blob/main/fonts/font-face.css) your app. Update any `url` locations as needed in the font-face.css file.

As an example see our demo app in this [this file](https://github.com/infor-design/enterprise/blob/main/app/views/includes/head.html#L53-L59).

## Typography Related Css Classes

The following classes can be used for text emphasis:

- `text-default`- Makes the text the normal default color for the theme.
- `text-descriptive` - Used for descriptive text so a bit lighter.
- `text-muted` - Used for disable/subtle text so even more.
- `text-link` - Style text to look like a link. (Primary Color)

The following classes can be used for text style:

- `text-emphasis` - Style text to show in italics. Often used on timestamps.
- `text-strong` - Style text to look bold. Often used for group labels or emphasis.
- `text-alert` or `alert-text` - Style text to a red alert. (Alter Color) Used for errors. You should always use an icon with text in order to give meaning to color blind users.
- `text-uppercase` or `uppercase-text` - Force text to uppercase.

The following classes can be used for text size:

- `text-primary` - Used for primary sized text (1.8rem). Used for headings.
- `text-secondary` - Used for primary sized text (1.6rem). Used for subheadings.
- `text-base` - Used for normal/default text (1.4rem).
- `text-small` - Used for normal/default text (1.2rem).
- `larger-heavy-text` - Shows text slightly larger and emphasized. Used for totals or group labels.
- `data-large` - Shows text in an even larger size (2.2em) used for count style data labels.
- `xl-text` - Shows text in an even larger size (5em) used for form counts.

The following classes can be used for errors/warnings

- `alert-text` - Shows text for alerts in ruby/red. Along with an icon.
- `error-text` - Shows text for error messages in ruby/red.
- `warning-text` - Shows text for warning messages.
- `good-text` - Shows text for good /positive affirmation in green/emerald
- `info-text` - Shows text for information blue/azure

The following classes can be used for text alignment

- `align-text-left` - Set text alignment to left.
- `align-text-right` - Set text alignment to right.
- `align-text-right` or `center-text` - Set text alignment to center.

## Usage

### Singular vs. Plural

Aim to use the singular form when referring to a single object and plural when referring to a collection of objects.

For example:

- Navigation (menu) items are in plural form when referring to business objects (Sales Orders or Purchase Orders)
- Headers (page titles, section titles, tab labels) are in plural form when containing a list or collection of objects (parts or orders) and singular form if they display a single business object (a part detail or order detail)

### More details

Find guidance for capitalization, date formats, and other UI copy in [UX Writing](https://design.infor.com/product/ux-writing/introduction).
