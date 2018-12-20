---
title: MonthView
description: null
demo:
  embedded:
  - name: Full Page MonthView Example
    slug: example-index
  pages:
  - name: Disabling Weeks/Days
    slug: example-disable-weekends
  - name: Restricting Month Selection
    slug: test-restrict-month-selection
---

The setup for a monthview only involves creating an `<div>` with the class `monthview`. The monthview is also used in [datepicker](./datepicker) popup (isPopup option). The [calendar](./calendar) is also part of the calendar.
This plugin works using Locale plugin which provides data for the calendar, including calendar format for [all supported locales](./locale).

```html
<div class="monthview">
</div>
```

## Accessibility

The monthview is a very complex component to code for accessibility. We take the following approach:

- Add an `aria` label to the calendar element
- Add `aria-selected=true` to selected day
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar <a href="http://oaa-accessibility.org/example/15/" target="_blank">example</a>

## Keyboard Shortcuts

- <kbd>Tab</kbd> - Tabbing will tab across the header elements

Future: arrow keys will work.

## Upgrading from 3.X

- This is a new component for 4.x
