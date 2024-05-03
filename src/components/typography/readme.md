---
title: Typography
description: null
demo:
  embedded:
  - name: Main Example Page
    slug: example-index
---

## Font family

For the latest theme with previous names (Uplift/Vibrant/New) use a custom font called [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+3). We use 300,400,600 font-weights, although all 100-900 font weights may appear. We do not use italics anywhere in the designs as it is difficult to read.

Source Sans Pro supports a lot of languages but some languages require [fallbacks](https://github.com/infor-design/enterprise/blob/main/src/components/typography/_typography-new.scss#L6) as noted. The correct font will be used if the matching locale is used.

NOTE: It is no longer recommended to use `fonts.googleapis` to use the fonts. The problems can be:

a) Google fonts violates [GDPR](https://www.cookieyes.com/documentation/google-fonts-and-gdpr/)
b) If the application needs to run without an internet connection
c) In some countries google links may be banned

For this reason we suggest you serve the files with the application all the needed fonts can be found in the [design system repo](https://github.com/infor-design/design-system/tree/main/fonts) or [the new design system repo](https://github.com/infor-design/ids-foundation/fonts)

Also if using npm these will be found in `node_modules/ids-identity/dist/fonts`. Generally you will need to copy the files into the correct location for your app and serve them.

Then add a style sheet to your application that points to the fonts you can get this from [this file](https://github.com/infor-design/enterprise/tree/main/app/www/css).

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
