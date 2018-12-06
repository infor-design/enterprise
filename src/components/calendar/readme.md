---
title: Calendar
description: null
demo:
  embedded:
  - name: Full Page Calendar Example
    slug: example-index
    pages:
    - name: Loading events with Ajax
      slug: test-ajax-events
    - name: Loading a specific month and year
      slug: test-specific-month
---

The setup for a calendar only involves creating a `div` with the class `calendar`. In that div we add the three sections of the calendar. The first section calendar-events contains an accordion with a filter section and an upcoming events section (functionality to be added soon). The second section is a `div` with `calendar-monthview` this is where the monthview calendar will be rendered. The third section is `div` with `calendar-event-details` this is where the event details will be shown when you click on them.

The first pass of the calendar added basic single day event rendering, filtering and changing months.
The second pass of the calendar added events that span months, icon support, ajax support, selection and month change events, and a readonly details template.

We will next add better responsiveness, better keyboard support, adding events and editing events.

```html
<div class="calendar">
  <div class="calendar-events">
    <div class="accordion" data-options="{'allowOnePane': false}">
      <div class="accordion-header is-expanded">
        <a href="#"><span>Legend</span></a>
      </div>
      <div class="accordion-pane">
        <div class="calendar-event-types accordion-content">
        </div>
      </div>
      <div class="accordion-header">
        <a href="#"><span>Upcoming Time off</span></a>
      </div>
      <div class="accordion-pane">
        <div class="calendar-upcoming-events accordion-content">
        </div>
      </div>
    </div>
  </div>
  <div class="calendar-monthview">
  </div>
  <div class="calendar-event-details">
  </div>
</div>
```

## Event Data

The calendar runs off events, which are an array of objects. An example of an event is..

```JSON
{
"id": "1",
"subject": "Discretionary Time Off",
"shortSubject": "DTO",
"comments": "",
"location": "Us Office",
"status": "Draft",
"starts": "2018-08-22T09:00:00.000Z",
"ends": "2018-10-22T13:00:00.000Z",
"type": "dto",
"isAllDay": "true"
}
```

The following fields are used.

- id - a unique event id
- subject - the event subject, which will be displayed on the calendar
- shortSubject - if the subject is long, the shortSubject will be used to display on the calendar, the longer subject will show in the event details.
- comments - any additional comments that will be shown in the event details
- location - a location for the event that will be shown in the event details
- status - a text status that will be shown in the event details (with optional icon on the calendar)
- starts - the date/time when the event starts
- starts - the date/time when the event ends
- type - the eventType key, this must have a match in the eventTypes array
- isAllDay - determines if the event is all day or not

## Accessibility

The Calendar is a very complex control to code for accessibility.

- Always associate labels to the input field
- Add an `aria` label to the calendar element
- Add `aria-selected=true` to selected day
- Add instructional information like "Use down arrow to select" to the input as an audible label
- Each calendar item should have an audible label to announce the day of week while arrowing through days
- For comparison, see a similar [example](http://oaa-accessibility.org/example/15/)

## Keyboard Shortcuts

- <kbd>Tab</kbd> - Tab will work to move you across the calendar, from the filter area to the accordion and into the month header.

## Upgrading from 3.X

- This is a new component for 4.x
