# Datepicker  [Learn More](https://soho.infor.com/index.php?p=component/buttons)

{{api-details}}

## Configuration Options

1. Simple Date Picker Example [View Example]( /components/datepicker/example-index)
2. Anniversary Format (Month, Year) [View Example]( /components/datepicker/example-anniversay-format)
3. Date Picker With Time [View Example]( /components/datepicker/example-with-time)
4. Date Picker With Legend [View Example]( /components/datepicker/example-legend)
5. Set Value Api [View Example]( /components/datepicker/example-set-value)
6. Date Picker With Time Custom Format[View Example]( /components/datepicker/example-timeformat.html)
7. Disabling Calendar Days [View Example]( /components/datepicker/example-disabled-dates.html)
8. In a modal [View Example]( /components/datepicker/example-modal.html)
9. Various Sizes [View Example]( /components/datepicker/example-sizes.html)
10. In a Form [View Example]( /components/datepicker/example-form.html)
11. State Api [View Example]( /components/datepicker/example-state-methods.html)
12. Islamic Umalqura Calendar [View Example]( /components/datepicker/example-umalqura.html?locale=ar-SA)

## Code Example

The setup for a datepicker only involves creating and input with the class datepicker. You can optionally set a placeholder to the fields, format. This will get adjusted by the plugin based on the current locale. Remember to always associate a label with the input field.

This plugin works around the Locale plugin which provides data for the calendar, including calendar format for [all supported locales](http://git.infor.com/projects/SOHO/repos/controls/browse/js/cultures).

```html

<div class="field">
  <label for="date-field" class="label">Date Field</label>
  <input id="date-field" class="datepicker" name="date-field" type="text">
</div>


```

## Behavior Guidelines

-   We by rule, always use four-digit date in all locales for short date

## Accessibility

The Date Picker is a very complex control to code accessibly.

-   Always associate labels to the input field
-   Add an aria label to the calendar element
-   Add aria-selected=true to selected day
-   Add instructional information "use down arrow to select" to the input as an audible label
-   Each calendar item should have an audible label to announce the day of week will arrowing through days

## Keyboard Shortcuts

-   **Tab** - like other widgets, the Date Picker widget receives focus to become active by tabbing into it. A second tab will take the user out of the Date Picker widget. Focus is initially placed on today's date when the calendar is opened.
-   **Shift+Tab** reverses the direction of the tab order. Once in the widget, a Shift+Tab will take the user to the previous focusable element in the tab order
-   **Arrow Up and Down** goes to the same day of the week in the previous or next week respectively. If the user advances past the end of the month they continue into the next or previous month as appropriate
-   **Arrow Left and Right** advances one day to the next, also in a continuum. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
-   **Control + Page Up** moves to the same date in the previous year
-   **Control + Page Down** moves to the same date in the next year
-   **Space**  Singleton Mode: acts as a toggle either selecting or deselecting the date Contiguous Mode: Similar to selecting a range of text. Space selects the first date. Shift Arrows add to the selection. Pressing Space again deselects the previous selections and selects the current focused date Non-Contiguous Mode: Space may be used to select multiple non-contiguous dates
-   **Home** moves to the first day of the current month
-   **End** moves to the last day of the current month
-   **Page Up** moves to the same date in the previous month
-   **Page Down** moves to the same date in the next month
-   **Enter Key** submits the form
-   **Escape** in the case of a popup date picker, closes the widget without any action
-   **T** inserts today's date

## States and Variations

-   Selected - Date
-   Hover - Date
-   Focus - Input
-   Disabled

## Responsive Guidelines

-   Follows form guidelines

## Upgrading from 3.X

-   Change inforLabel class to label
-   Change inforDateField to class datepicker
-   Optionally set the placeholder and / or data-mask
-   Use the initializer
-   Wrap the input and label in a class="field" element
