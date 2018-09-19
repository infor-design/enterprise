---
title: Calendar
description: This page describes Calendar.
demo:
  embedded:
  - name: Full Page Calendar Example
    slug: example-index
---

The setup for a calendar only involves creating a `div` with the class `datepicker`. In that div we add the three sections of the calendar. The first section calendar-events contains an accordion with a filter section and an upcomming events section (functionality to be added soon). The second section is a `div` with `calendar-monthview` this is where the monthview calendar will be rendered. The third section is `div` with `calendar-event-details` this is where the event details will be shown when you click on them.

The first pass of the calendar supports basic single day event rendering, filtering and changing months. We will next add better responsiveness, more views, better keyboard support, adding events and editing events.

```html
<div class="calendar" data-init="false">
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
        <div class="calendar-event-upcoming accordion-content">
          <p>Remix, optimize, "B2B, iterate?" Best-of-breed efficient beta-test; social cutting-edge: rich magnetic tagclouds front-end infomediaries viral authentic incentivize sexy extensible functionalities incentivize. Generate killer authentic grow vertical blogospheres, functionalities ecologies harness, "tag solutions synergies exploit data-driven B2C open-source e-markets optimize create, enhance convergence create." Out-of-the-box strategize best-of-breed back-end, deploy design markets metrics. Content web services enhance leading-edge Cluetrain, deliverables dot-com scalable. User-centric morph, back-end, synthesize mesh, frictionless, exploit next-generation tag portals, e-commerce channels; integrate; recontextualize distributed revolutionize innovative eyeballs.</p>
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
