---
title: Timepicker Component 
description: This page describes Timepicker Component .
---

## Configuration Options

1. [Default Example]( ../components/timepicker/example-index)
2. [24-Hour (Military) Time]( ../components/timepicker/example-24-hour)
3. [Rounded Minute Intervals]( ../components/timepicker/example-intervals)
4. [Readonly Timepicker]( ../components/timepicker/example-readonly)
5. [Disabled Timepicker]( ../components/timepicker/example-disabled)
6. [Timepicker with a Seconds Picker]( ../components/timepicker/example-seconds-picker)
6. [Timepicker with Required Validation]( ../components/timepicker/example-with-validation)

## Behavior Guidelines

The Time Picker needs to support both manual time entry (hours, minutes, and, on rare occasions, seconds) as well as some method of selecting from valid entries. Depending on the use case, users may be able to manually enter a time or only select from a restricted set of values.

Different use cases support:

-   Entering an exact, unrestricted time (allowing any time to be entered, such as 11:39). In this use case, users should be allowed to either type the time values or select them.
-   Entering time intervals (e.g., allowing time entry only in specific set intervals, such as 15 or 30 minutes). In this case, you should either prevent users from manually entering the minute values or automatically correct manual entries to the nearest interval.
-   Entering time values only within a specific range of time (such as only enter times within standard business hours). In this case, you should either prevent users from manually entering values or automatically correct manual entries to the nearest valid time.

## Code Example

### Default Example

A time field is created by adding an input field with `type="text"` and a `.timepicker` CSS class. Also make sure to link to a label with an `id` attribute for accessibility.

```html
<div class="field">
  <label for="timepicker-main" class="label">Timepicker</label>
  <input id="timepicker-main" class="timepicker" type="text">
</div>
```

It's also possible to configure the timepicker with a custom time format.  This allows the timepicker to be configured in [Military Time]( ../components/timepicker/example-24-hour), and/or with a [Seconds Picker]( ../components/timepicker/example-seconds-picker) for more accurate time.

```html
<div class="field">
  <label for="timepicker-24hrs" class="label">Time Field (24-hour)</label>
  <input id="timepicker-24hrs" class="timepicker" type="text" data-options='{ "timeFormat": "HH:mm" };' />
</div>
```

In [another configuration]( ../components/timepicker/example-intervals), it's also possible to pass the Timepicker settings that control the intervals of minutes and seconds available for picking, as well as if the Timepicker will allow "off-timing"-intervals to be entered manually with a keyboard.

```html
<div class="field">
  <label for="twentyfour-time-field" class="label">Time Field (24-hour)</label>
  <input id="twentyfour-time-field" class="timepicker" name="twentyfour-time-field" type="text" data-options='{ "minuteInterval": "10", "roundToInterval": "true"}' />
</div>
```
