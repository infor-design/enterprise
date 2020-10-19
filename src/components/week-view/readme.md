---
title: WeekView
description: A Full page week and day view shared component.
demo:
  embedded:
  - name: Full Page MonthView Example
    slug: example-index
  pages:
  - name: Showing Just One Day
    slug: example-one-day
  - name: Showing Two Days
    slug: example-two-day
  - name: Showing Two Weeks
    slug: example-two-weeks
  - name: Showing Two Weeks
    slug: test-ajax-events
---

The setup for a WeekView only involves creating a `div` with the class `week-view` and then initializing the plugin. The startDate and endDate control the days shown.
So if you wanted a day only view you would pass exactly one day. The exact time is important. Days start on 0, 0, 0, 0 and end on 59, 59, 59 for example:

```javascript
startDate: new Date(2019, 09, 21, 0, 0, 0, 0),
endDate: new Date(2019, 09, 21, 23, 59, 59, 59),
```

For other configurations see below.

```html
<div class="full-height full-width">
  <div class="week-view" data-init="false">
  </div>
</div>

```

## Event Data

The weekview runs off event data like the calendar, which should be an array of objects. An example of an event is..

```JSON
{
"id": "9",
"subject": "Autumn Foliage Trip",
"comments": "Annual Autumn Foliage Trip",
"status": "Pending",
"icon": "icon-clock",
"starts": "2018-10-22T00:00:00.000",
"ends": "2018-10-24T23:59:59.999",
"type": "dto",
"isAllDay": "false"
}
```

The following data fields are used.

- id - A unique event id
- subject - The event subject, which will be displayed on the event in the calendar
- shortSubject - If the subject is long, the shortSubject will be used to display on the calendar, the longer subject will show in the event details.
- comments - Any additional comments that will be shown in the event details
- status - A text status that will be shown in the event details (with optional icon on the calendar)
- icon - A the name of the icon from the supported icons
- location - A location for the event that will be shown in the event details
- starts - The date/time when the event starts
- ends - The date/time when the event ends
- type - The eventType key, this must have a match in the eventTypes array
- isAllDay - Determines if the event is all day or not

The event types is a seperate data structure that looks like this:

```JSON
{
  "id": "dto",
  "label": "Discretionary Time Off",
  "translationKey": "DiscretionaryTimeOff",
  "color": "azure",
  "checked": true,
  "disabled": false
},
```

The following data fields are used.

- id - A unique eventType id
- label - The label that will show up in the legend
- translationKey - The key that will be looked up in the locale data
- color - The color from the color palette (without the color number)
- checked - If true the event checkbox will appear checked
- disabled - If true the event checkbox will appear disabled from use

## Accessibility

The Weekview is a very complex control we do the following:

- Add an `aria` to the calendar elements
- Add `aria-selected=true` to selected day
- Most of the legend colors should be WCAG compliant
- We use icons and color and text for the status's of the calendar events
- Support keyboard

## Testability

You can add custom id's/automation id's to the weekview for elements that can be clicked using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes.

The attribute can be a string value or function. The function will give you the calendar API as a parameter to assist in making things more dynamic (you can use some properties if needed).

```js
$('.weekview').weekview({
  ...
  attributes: [{ name: 'id', value: 'custom-id' }, { name: 'data-automation-id', value: 'custom-automation-id' } ],
});
```

Providing the data this will add an ID to the top calendar div. In addition the following related items will be set.

- Weekview Container - gets the id appended directly
- Next Day Button - gets `week-view-btn-next` appended
- Previous Day Button - gets `week-view-btn-prev` appended
- Datepicker Input - gets `week-view-datepicker` appended
- Datepicker Trigger - gets `week-view-datepicker-trigger` appended
- Today Button - gets `week-view-today` appended

Note that there is an extra week-view added as this can be on the same page as month-view which will have month-view appended.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Upgrading from 3.X

- This is a new component for 4.x
