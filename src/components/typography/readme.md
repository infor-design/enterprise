---
title: Typography
description: null
demo:
  embedded:
  - name: Main Example Page
    slug: example-index
---

## Font family

We have two different versions of IDS designs for the components Soho/Subtle/Classic and Uplift/Vibrant/New.

For: Soho/Subtle/Classic the default font family for the three themes is still for the moment `font-family: Helvetica, Arial` Arial/Helvetica are default system fonts for Mac/PC and do not need anything.

For: Uplift/Vibrant/New we now use a custom font[Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro) `font-family: 'source sans pro', Helvetica, Arial`. We include two font-weights 400, 600 served from google fonts because our design is limited in terms of weights (just normal and bold), for example we dont use italics anywhere in the designs as it is difficult to read. Source Sans Pro supports a lot of languages but not some of these so these are the [fall backs](https://github.com/infor-design/enterprise/blob/main/src/components/typography/_typography.scss#L8)

To use the custom font enable this font in the components first you need to add this link to the head of your pages.

```html
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600" rel="stylesheet"/>
```

If your application needs to run without an internet connection its also possible to download the font locally and server it from your server see [google-webfonts](https://google-webfonts-helper.herokuapp.com/fonts/source-sans-pro?subsets=greek,latin,vietnamese) for details.

## Typography Related Classes

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

## Title Case vs. Sentence Case

Title case follows the standards used in book titles. Always capitalize the first and last word, and capitalize all other words in the text string except for articles (a, an, the) and prepositions (except if they are the first or last word) and coordinating conjunctions (for, and, nor, but, or, yet, and so). Use title case for the following types of text:

- Any type of header (page headers, section headers, list headers, field set headers)
- Buttons
- Tab and accordion labels
- Menu and navigation options (including context menu options and tree components)
- Input field labels

Sentence case uses standard capitalization rules for full sentences. Only capitalize the first letter of the sentence, along with any proper nouns. Use sentence case for the following types of text:

- Radio button labels
- Checkbox labels
- Notification and error and warning messages
- Normal Text
- Instructions

## Singular vs. Plural

As a general rule, use the singular form when referring to a single object, and plural when referring to a collection of objects. For example:

- Navigation (menu options) should be in plural form if referring to business objects (e.g. Sales Orders, Purchase Orders)
- Headers (page titles, section titles, tab labels) should be in plural form when they contain a list or collection of objects (parts, orders) and singular form if they display a single business object (a part detail or order detail)

## Be Concise

Context should be used when choosing label text. For example, if the page title is "Purchase Order 12345", you should generally not prefix labels on the screen with "Purchase", like "Purchase Order Name", "Purchase Order Number", "Purchase Order Description", etc. Instead, use "Name", Description", etc.

In general, "Number" should not be used in labels. Example: use "Advance Ship Notice" rather than "Advance Ship Notice Number". However, "Number" may be appended to a label if it helps differentiate between fields like "Item Number" and "Item Description"

If abbreviations are needed (useful in datagrid headers for example), it is better to abbreviate by removing words, for example removing "Item" since context is known. "Item Number" could become "Number" or "Num", and "Item Description" could become "Description" or "Desc"

When a field can contain one or more items, use the plural. Example: rather than "Group(s)", use "Groups"

## Usage

For further font, typography, and grammar usage, see the [Typography guidelines](/guidelines/identity/typography).

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
