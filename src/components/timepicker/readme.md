---
title: Timepicker Component
description: null
demo:
  embedded:
  - name: Default Example
    slug: example-index
  pages:
  - name: Timepicker with Required Validation
    slug: example-validation
  - name: 24-Hour (Military) Time
    slug: test-24-hour
  - name: Rounded Minute Intervals
    slug: test-intervals
  - name: Timepicker with a Seconds Picker
    slug: test-seconds-picker
---
## Behavior Guidelines

The Time Picker needs to support both manual time entry (hours, minutes, and, on rare occasions, seconds) as well as some method of selecting from valid entries. Depending on the use case, users may be able to manually enter a time or only select from a restricted set of values.

Different use cases support:

- Entering an exact, unrestricted time (allowing any time to be entered, such as 11:39). In this use case, users should be allowed to either type the time values or select them
- Entering time intervals (e.g., allowing time entry only in specific set intervals, such as 15 or 30 minutes). In this case, you should either prevent users from manually entering the minute values or automatically correct manual entries to the nearest interval
- Entering time values only within a specific range of time (such as only enter times within standard business hours). In this case, you should either prevent users from manually entering values or automatically correct manual entries to the nearest valid time

## Code Example

### Default Example

A time field is created by adding an input field with `type="text"` and a `.timepicker` CSS class. Also make sure to link to a label with an `id` attribute for accessibility.

```html
<div class="field">
  <label for="timepicker-main" class="label">Timepicker</label>
  <input id="timepicker-main" class="timepicker" type="text">
</div>
```

It's also possible to configure the timepicker with a custom time format.  This allows the timepicker to be configured in [24-hour/Miliary time](https://latest-enterprise.demo.design.infor.com/components/timepicker/test-24-hour.html) and/or with a [seconds picker](https://latest-enterprise.demo.design.infor.com/components/timepicker/test-seconds-picker.html) for more accurate time.

```html
<div class="field">
  <label for="timepicker-24hrs" class="label">Time Field (24-hour)</label>
  <input id="timepicker-24hrs" class="timepicker" type="text" data-options='{ "timeFormat": "HH:mm" };' />
</div>
```

In [another configuration](https://latest-enterprise.demo.design.infor.com/components/timepicker/test-intervals.html), it's also possible to pass the Timepicker settings that control the intervals of minutes and seconds available for picking, as well as if the timepicker will allow "off-timing"-intervals to be entered manually with a keyboard.

```html
<div class="field">
  <label for="twentyfour-time-field" class="label">Time Field (24-hour)</label>
  <input id="twentyfour-time-field" class="timepicker" name="twentyfour-time-field" type="text" data-options='{ "minuteInterval": "10", "roundToInterval": "true"}' />
</div>
```

## Testability

The timepicker can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the generated timepicker. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `message-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

Providing the data, this will add an ID added to each timepicker trigger with `-trigger`, timepicker hours with `-hours`, timepicker minutes with `-minutes`, timepicker seconds with `-seconds`, timepicker period with `-period`, timepicker button trigger with `-btn`, and the timepicker element appended.
