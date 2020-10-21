---
title: Datepicker
description: Displays one or more selectable values in a menu that is collapsed by default. Best for allowing users to select date and time values from a predetermined calendar while ensuring appropriate value formatting.
demo:
  embedded:
  - name: Simple Date Picker Example
    slug: example-index
  pages:
  - name: Anniversary Format (Month, Year)
    slug: example-anniversay-format
  - name: Specify a custom or ISO Format
    slug: example-custom-format
  - name: Disabling Calendar Days
    slug: example-disabled-dates
  - name: Date Picker With Legend
    slug: example-legend
  - name: Selection only Month and Year
    slug: example-month-year-format
  - name: Showing a Picker to Choose Month and Year
    slug: example-month-year-picker
  - name: Date Range Selection
    slug: example-range
  - name: Change Field Widths
    slug: example-sizes
  - name: Date Picker With Time
    slug: example-timeformat
  - name: Islamic Umalqura Calendar
    slug: example-umalqura
  - name: Using Validation
    slug: example-validation
---

The setup for a datepicker involves creating an `<input>` with the class `datepicker`. Remember to always associate a label correctly with the input field. We always use four-digit years in all locales.

This plugin requires the Locale plugin which provides data for the calendar, including calendar format for [all supported locales](./locale).

```html
<div class="field">
  <label for="date-field" class="label">Date Field</label>
  <input id="date-field" class="datepicker" name="date-field" type="text">
</div>
```

## Accessibility

The Date Picker is a complex control to code for accessibility.

- Always associate labels to the input field
- Add an `aria` label to the calendar element
- Add `aria-selected=true` to selected day
- Add instructional information like "Use down arrow to select" to the input as an audible label
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar <a href="http://oaa-accessibility.org/example/15/" target="_blank">example</a>

## Testability

You can add custom id's/automation id's to the datepicker for elements that can be clicked using the `attributes` data attribute. This setting take either an object or an array for setting multiple values such as an automation-id or other attributes.

The value can be a string value or function. The function will give you the datepicker API as a parameter to assist in making things more dynamic (you can use some properties if needed). Note that you should set the input id and data-automation id directly on the input, the rest is generated from the setting.

```html
<div class="field">
  <label for="date-field-normal" class="label">Date Field</label>
  <input id="date-field-normal" data-automation-id="custom-automation-id" class="datepicker" name="date-field" type="text" data-init="false"/>
</div>

<script>
$('#date-field-normal').datepicker({
  attributes: [{ name: 'id', value: 'custom-id' }, { name: 'data-automation-id', value: 'custom-automation-id' } ],
});
</script>
```

Providing the data in this example will append to the following items:

expect(await element(by.id('custom-id-btn-picklist-up')).getAttribute('id')).toEqual('custom-id-btn-picklist-up');
    expect(await element(by.id('custom-id-btn-picklist-down')).getAttribute('id')).toEqual('custom-id-btn-picklist-down');
    expect(await element(by.id('custom-id-btn-picklist-3')).getAttribute('id')).toEqual('custom-id-btn-picklist-3');
    expect(await element(by.id('custom-id-btn-picklist-2018')).getAttribute('id')).toEqual('custom-id-btn-picklist-2018');

- Month Year Picker Button - gets `btn-monthyear` appended
- Cancel Button - gets `btn-cancel` appended
- Select Button - gets `btn-select` appended
- Down a set of years Button - gets `btn-picklist-down` appended
- Up a set of years Button - gets `btn-picklist-up` appended
- Each month in the month/year picker  - gets `btn-picklist-n` appended where n is the zero based month number (0-11)
- Each year in the month/year picker  - gets `btn-picklist-n` appended where n is the four digit year

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> - like other widgets, the Date Picker widget receives focus to become active by tabbing into it. A second <kbd>Tab</kbd> will take the user out of the date picker widget. Focus is initially placed on today's date when the calendar is opened.
- <kbd>Shift + Tab</kbd> reverses the direction of the tab order. Once in the widget, a <kbd>Shift + Tab</kbd> will take the user to the previous focusable element in the tab order
- <kbd>Up</kbd> and <kbd>Down</kbd> goes to the same day of the week in the previous or next week respectively. If the user advances past the end of the month they continue into the next or previous month as appropriate
- <kbd>Left</kbd> Go to the previous day. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
- <kbd>Right</kbd> Advances to the next day. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
- <kbd>Control + Page Up</kbd> moves to the same date in the previous year
- <kbd>Control + Page Down</kbd> moves to the same date in the next year
- <kbd>Space</kbd>, in singleton mode, acts as a toggle either selecting or de-selecting the date. In contiguous mode, it behaves similar to selecting a range of text: <kbd>Space</kbd> selects the first date. <kbd>Shift + Arrows</kbd> add to the selection. Pressing <kbd>Space</kbd> again de-selects the previous selections and selects the current focused date. In non-contiguous mode, <kbd>Space</kbd> may be used to select multiple non-contiguous dates
- <kbd>Home</kbd> moves to the first day of the current month
- <kbd>End</kbd> moves to the last day of the current month
- <kbd>Page Up</kbd> moves to the same date in the previous month
- <kbd>Page Down</kbd> moves to the same date in the next month
- <kbd>Enter</kbd> submits the form
- <kbd>Escape</kbd>, in the case of a popup date picker, closes the widget without any action
- <kbd>T</kbd> inserts today's date
- <kbd>+</kbd> Is used to increment the day in the calendar. This is in addition to the <kbd>Right</kbd>. This works both when in the input field or when the calendar picker is open. If the date pattern contains a `-` in it then this key interferes with typing so this key shortcut is disabled.
- <kbd>-</kbd>  Is used to increment the day in the calendar. This is in addition to the <kbd>Left</kbd>. This works both when in the input field or when the calendar picker is open. If the date pattern contains a `-` in it then this key interferes with typing so this key shortcut is disabled.

## Upgrading from 3.X

- This is a new component for 4.x
