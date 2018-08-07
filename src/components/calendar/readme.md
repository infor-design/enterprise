---
title: Calendar
description: This page describes Calendar.
demo:
  pages:
  - name: Full Page Calendar Example
    slug: example-index
---

The setup for a datepicker only involves creating an `<input>` with the class `datepicker`. You can optionally set a `placeholder`. The placeholder will get adjusted by the plugin based on the current locale. Remember to always associate a label with the input field. Always use four-digit dates in all locales for short date.

This plugin works using Locale plugin which provides data for the calendar, including calendar format for [all supported locales](./locale).

```html
<div class="field">
  <label for="date-field" class="label">Date Field</label>
  <input id="date-field" class="datepicker" name="date-field" type="text">
</div>
```

## Accessibility

The Calendar is a very complex control to code for accessibility.

- Always associate labels to the input field
- Add an `aria` label to the calendar element
- Add `aria-selected=true` to selected day
- Add instructional information like "Use down arrow to select" to the input as an audible label
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar [example](http://oaa-accessibility.org/example/15/)

## Keyboard Shortcuts

- <kbd>Tab</kbd> - like other widgets, the Date Picker widget receives focus to become active by tabbing into it. A second <kbd>Tab</kbd> will take the user out of the date picker widget. Focus is initially placed on today's date when the calendar is opened.

## Upgrading from 3.X

- This is a new component for 4.x
