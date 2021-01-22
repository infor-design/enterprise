---
title: Typography
description: null
demo:
  embedded:
  - name: Main Example Page
    slug: example-index
---

## Font family

The default font family for the three themes is still for the moment `font-family: Helvetica, Arial`. Future designs will use a new font family  `'Source Sans Pro', Helvetica, Arial`. You can use this now on all three themes as an option.

To enable this font in the components first you need to add this link to the head of your pages.

```html
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600" rel="stylesheet"/>
```

After that you can either:

1. Add the class `font-source-sans` to the HTML tag for example `<html class="font-source-sans>`
2. Or pass it as an option to the `.personalize()` API.

```javascript
$('html').personalize({colors: ['80000'], theme: 'dark', font: 'source-sans'});
```

The sample app can also be run with this font by adding the `?font=source-sans` parameter to any page. For example [Main Page Example](./demo/components/personalize/example-index.html?font=source-sans)

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
