---
title: Datepicker
description: This page describes Datepicker.
demo:
  pages:
  - name: Simple Date Picker Example
    slug: example-index
  - name: Anniversary Format (Month, Year)
    slug: example-anniversay-format
  - name: Date Picker With Time
    slug: example-with-time
  - name: Date Picker With Legend
    slug: example-legend
  - name: Set Value Api
    slug: example-set-value
  - name: Date Picker With Time Custom Format
    slug: example-timeformat.html
  - name: Disabling Calendar Days
    slug: example-disabled-dates.html
  - name: In a Modal
    slug: example-modal.html
  - name: Various Sizes
    slug: example-sizes.html
  - name: In a Form
    slug: example-form.html
  - name: State Api
    slug: example-state-methods.html
  - name: Islamic Umalqura Calendar
    slug: example-umalqura.html?locale=ar-SA
  - name: Customizing Validation
    slug: example-custom-validation.html
  - name: Month/Year Picker
    slug: example-month-year-picker.html
  - name: Month/Year Only Selection
    slug: example-month-year-format.html
  - name: Range Selection
    slug: example-range.html
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

The Date Picker is a very complex control to code for accessibility.

-   Always associate labels to the input field
-   Add an `aria` label to the calendar element
-   Add `aria-selected=true` to selected day
-   Add instructional information like "Use down arrow to select" to the input as an audible label
-   Each calendar item should have an audible label to announce the day of week while arrowing through days
-   For comparison, see a similar [example](http://oaa-accessibility.org/example/15/)

## Keyboard Shortcuts

-   <kbd>Tab</kbd> - like other widgets, the Date Picker widget receives focus to become active by tabbing into it. A second <kbd>Tab</kbd> will take the user out of the date picker widget. Focus is initially placed on today's date when the calendar is opened.
-   <kbd>Shift + Tab</kbd> reverses the direction of the tab order. Once in the widget, a <kbd>Shift + Tab</kbd> will take the user to the previous focusable element in the tab order
-   <kbd>Up</kbd> and <kbd>Down</kbd> goes to the same day of the week in the previous or next week respectively. If the user advances past the end of the month they continue into the next or previous month as appropriate
-   <kbd>Left</kbd> and <kbd>Right</kbd> advances one day to the next, also in a continuum. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
-   <kbd>Control + Page Up</kbd> moves to the same date in the previous year
-   <kbd>Control + Page Down</kbd> moves to the same date in the next year
-   <kbd>Space</kbd>, in singleton mode, acts as a toggle either selecting or de-selecting the date. In contiguous mode, it behaves similar to selecting a range of text: <kbd>Space</kbd> selects the first date. <kbd>Shift + Arrows</kbd> add to the selection. Pressing <kbd>Space</kbd> again de-selects the previous selections and selects the current focused date. In non-contiguous mode, <kbd>Space</kbd> may be used to select multiple non-contiguous dates
-   <kbd>Home</kbd> moves to the first day of the current month
-   <kbd>End</kbd> moves to the last day of the current month
-   <kbd>Page Up</kbd> moves to the same date in the previous month
-   <kbd>Page Down</kbd> moves to the same date in the next month
-   <kbd>Enter</kbd> submits the form
-   <kbd>Escape</kbd>, in the case of a popup date picker, closes the widget without any action
-   <kbd>T</kbd> inserts today's date

## Upgrading from 3.X

-   Change `inforLabel` class to `label`
-   Change `inforDateField` to class `datepicker`
-   Optionally, set the `placeholder` and `data-mask`
-   Wrap the input and label in a `class="field"` element
