---
title: Calendar
description: A full page calendar component with month and day view integration.
demo:
  embedded:
  - name: Full Page Calendar Example
    slug: example-index
    pages:
    - name: Show only the legend pane
      slug: example-only-calendar-legend
    - name: Show only the Month pane
      slug: example-only-calendar
    - name: Loading events with Ajax
      slug: test-ajax-events
    - name: Loading a specific month and year
      slug: test-specific-month
---

The setup for a calendar only involves creating a `div` with the class `calendar`. In that div we add several sections for the calendar.

- The `calendar-events` section contains an accordion with a filter section and an upcoming events section.
- The `calendar-monthview` section is a `div` with where the monthview calendar will be rendered.
- The `calendar-weekview` will hold the day and week container (if used)
- The `calendar-event-details` is also an accordion where the event details will be shown when you click on a day.
- The `calendar-event-mobile` should be a listview, which is the calendar-event-details section shown at mobile breakpoints as a list instead.

The calendar supports event rendering, for all day and spanning days. It supports locales and rendering specific months and Ajax. Filtering is done with checkboxes in the event legend. You can change months with the arrows or picker on the header.

```html
<div class="calendar" data-init="false">
  <div class="calendar-events">
    <div class="accordion" data-options="{'allowOnePane': false}">
      <div class="accordion-header is-expanded">
        <a href="#"><span data-translate="text">Legend</span></a>
      </div>
      <div class="accordion-pane">
        <div class="calendar-event-types accordion-content">
        </div>
      </div>
      <div class="accordion-header is-expanded">
        <a href="#"><span data-translate="text">UpComing</span></a>
      </div>
      <div class="accordion-pane">
        <div class="calendar-upcoming-events accordion-content">
        </div>
      </div>
    </div>
  </div>
  <div class="calendar-monthview">
  </div>
  <div class="calendar-weekview">
  </div>
  <div class="calendar-event-details accordion" data-init="false" data-options="{'allowOnePane': false}">
  </div>
  <div class="calendar-event-details-mobile listview" data-init="false">
  </div>
</div>
```

## Event Data

The calendar runs off event data, which should be an array of objects. An example of an event is..

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
- color - Normally the color is determined by the eventType color. But you can override this by providing a hex value starting with the `#`. Where possible its recommended to use a color in range 0-1 in the color palette. This has the side effect that the legend wont be correct for this event.
- borderColor - Normally the borderColor on the left is determined by the eventType color. But you can override this by providing a hex value starting with the `#`. Where possible its recommended to use a color in range 9-10 in the color palette or the hex code of the theme alert colors. This has the side effect that the legend wont be correct for this event.

The event types is a separate data structure that looks like this:

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

The Calendar is a very complex control we do the following:

- Add an `aria` to the calendar elements
- Add `aria-selected=true` to selected day
- Most of the legend colors should be WCAG compliant
- We use icons and color and text for the status's of the calendar events
- Support tabing/keyboard

## Keyboard Shortcuts

- <kbd>Tab</kbd> - Tabbing will tab across the header elements and into the monthview
- <kbd>Shift + Tab</kbd> reverses the direction of the tab order.
- <kbd>Up</kbd> and <kbd>Down</kbd> goes to the same day of the week in the previous or next week respectively. If the user advances past the end of the month they continue into the next or previous month as appropriate
- <kbd>Left</kbd> and <kbd>Right</kbd> advances one day to the next, also in a continuum. Visually, focus is moved from day to day and wraps from row to row in a grid of days and weeks
- <kbd>Control + Page Up</kbd> moves to the same date in the previous year
- <kbd>Control + Page Down</kbd> moves to the same date in the next year
- <kbd>Home</kbd> moves to the first day of the current month
- <kbd>End</kbd> moves to the last day of the current month
- <kbd>Page Up</kbd> moves to the same date in the previous month
- <kbd>Page Down</kbd> moves to the same date in the next month

## Testability

You can add custom id's/automation id's to the calendar for elements that can be clicked using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes.

The attribute can be a string value or function. The function will give you the calendar API as a parameter to assist in making things more dynamic (you can use some properties if needed).

```js
$('.calendar').calendar({
  ...
  attributes: [{ name: 'id', value: 'calendar-id' }, { name: 'data-automation-id', value: 'calendar-automation-id' } ],
});
```

Providing the data this will add an ID to the top calendar div. In addition the following related items will be set.

- Monthview Container - gets `monthview` appended
- Weekview Checkboxes - get `weekview` appended
- Legend Checkboxes - each gets `legend-${eventTypeId}` appended
- UpComing events - each gets `upcoming-event-${eventId}` appended
- Next Day Button - gets `btn-next` appended
- Previous Day Button - gets `btn-prev` appended
- Datepicker Input - gets `datepicker` appended
- Datepicker Trigger - gets `datepicker-trigger` appended
- Today Button - gets `today` appended
- Month Page View Changer Dropdown - gets `month-view-changer-month` appended
- Month Page View Changer Dropdown week value - gets `month-view-changer-month-week` appended
- Month Page View Changer Dropdown day value - gets `month-view-changer-month-day` appended
- Month Page View Changer Dropdown month value - gets `month-view-changer-month-month` appended
- Week/Day Page View Changer Dropdown - gets `week-view-changer-month` appended
- Week/Day Page View Changer Dropdown week value - gets `week-view-changer-month-week` appended
- Week/Day Page View Changer Dropdown day value - gets `week-view-changer-month-day` appended
- Week/Day Page View Changer Dropdown month value - gets `week-view-changer-month-month` appended

## Upgrading from 3.X

- This is a new component for 4.x
