/**
 * @jest-environment jsdom
 */
import { Calendar } from '../../../src/components/calendar/calendar';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

Soho.Locale = Locale;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/da-DK.js');

require('../../../src/components/datepicker/datepicker.jquery.js');
require('../../../src/components/calendar/calendar-toolbar.jquery.js');
require('../../../src/components/accordion/accordion.jquery.js');
require('../../../src/components/listview/listview.jquery.js');
require('../../../src/components/monthview/monthview.jquery.js');

const calendarHTML = `<div class="calendar" data-init="false">
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

<ul id="calendar-actions-menu" class="popupmenu">
  <li><a href="#" data-action="delete-event"><span data-translate="text">DeleteEvent</span></a></li>
  <li><a href="#" data-action="show-event"><span data-translate="text">ShowEvent</span></a></li>
</ul>`;

const events = require('../../../app/data/events');
const eventTypes = require('../../../app/data/event-types');

let calendarEl;
let calendarObj;
let baseTime;

const settings = {
  eventTypes,
  events,
  month: 10,
  year: 2018,
  day: 10
};

describe('Calendar API', () => {
  beforeEach(() => {
    calendarEl = null;
    calendarObj = null;
    document.body.insertAdjacentHTML('afterbegin', calendarHTML);
    calendarEl = document.body.querySelector('.calendar');

    Locale.set('en-US');
    Soho.Locale.set('en-US');

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2018-10-10'));
    calendarObj = new Calendar(calendarEl, settings);
  });

  afterEach(() => {
    calendarObj?.destroy();
    cleanup();
  });

  it('should render calendar', () => {
    expect(calendarObj).toBeTruthy();
    expect(document.body.querySelector('.monthview-table')).toBeTruthy();
    expect(document.body.querySelectorAll('.monthview-table td').length).toEqual(42);
  });

  it('should render header', () => {
    expect(calendarObj).toBeTruthy();
    expect(document.body.querySelector('.monthview-header .next')).toBeTruthy();
    expect(document.body.querySelector('.monthview-header .prev')).toBeTruthy();
  });

  it('should optionaly not render view changer', () => {
    calendarObj.destroy();
    settings.showViewChanger = false;
    calendarObj = new Calendar(calendarEl, settings);

    expect(document.body.querySelector('#calendar-view-changer')).toBeFalsy();
  });

  it('should be able to destroy', () => {
    calendarObj.destroy();

    expect($(calendarEl).data('calendar')).toBeFalsy();
  });

  it.skip('Should render based on locale setting', () => {
    calendarObj.destroy();
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 2);

    const newSettings = {
      locale: 'da-DK',
      month: 2,
      year: 2019,
      eventTypes,
      events: [{
        id: '15',
        subject: 'Days Off',
        starts: start.toISOString(),
        ends: end.toISOString(),
        type: 'dto',
        isAllDay: true
      }]
    };

    calendarObj = new Calendar(calendarEl, newSettings);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('marts 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('man');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('søn');
  });

  it.skip('Should render upcoming dates', () => {
    calendarObj?.destroy();
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 2);

    const newSettings = {
      eventTypes,
      events: [{
        id: '15',
        subject: 'Days Off',
        starts: start.toISOString(),
        ends: end.toISOString(),
        type: 'dto',
        isAllDay: true
      }]
    };

    calendarObj = new Calendar(calendarEl, newSettings);
    const compareDate = `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.toLocaleDateString('en-US', { year: 'numeric' })}`;

    expect(document.querySelector('.calendar-upcoming-date').innerText).toEqual(compareDate);
  });

  it('should handle adding events', () => {
    const startsDate = new Date(baseTime);
    startsDate.setHours(0, 0, 0, 0);
    const endsDate = new Date(baseTime);
    endsDate.setHours(23, 59, 59, 999);

    expect(document.querySelectorAll('.calendar-event').length).toEqual(26);
    const newEvent = {
      id: (settings.events.length + 1).toString(),
      subject: 'New Random Event',
      comments: 'New Random Event Details',
      starts: Locale.formatDate(startsDate, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' }),
      ends: Locale.formatDate(endsDate, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' }),
      type: 'team',
      isAllDay: true
    };
    calendarObj.addEvent(newEvent);

    expect(document.querySelectorAll('.calendar-event').length).toEqual(28);
  });

  it('should handle adding events off the month', () => {
    expect(document.querySelectorAll('.calendar-event').length).toEqual(26);

    const newEvent = {
      subject: 'Discretionary Time Off',
      shortSubject: 'DTO',
      comments: 'Personal time',
      location: 'Canada Office',
      status: 'Approved',
      starts: '2018-11-24T10:00:00.000',
      ends: '2018-11-24T14:00:00.999',
      type: 'dto',
      isAllDay: false
    };
    calendarObj.addEvent(newEvent);

    expect(document.querySelectorAll('.calendar-event').length).toEqual(27);
  });

  it('should handle adding events in iso format', () => {
    const newEvent = {
      id: '6',
      subject: 'Discretionary Time Off',
      shortSubject: 'DTO',
      comments: 'Personal time',
      location: 'Canada Office',
      status: 'Approved',
      starts: '2018-11-10T10:00:00.000',
      ends: '2018-11-10T14:00:00.999',
      type: 'dto',
      isAllDay: false
    };
    calendarObj.addEvent(newEvent);

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(28);
  });

  it('should handle clearing events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);

    calendarObj.clearEvents();

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(0);
  });

  it('should handle deleting events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);

    calendarObj.deleteEvent({ id: '13' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(25);

    calendarObj.deleteEvent({ id: '11' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(4);
  });

  it('should handle updating events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);

    calendarObj.updateEvent({ id: '13', subject: 'Updated Subject' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);
    expect(calendarObj.settings.events[12].subject).toEqual('Updated Subject');
    expect(calendarObj.settings.events[12].id).toEqual('13');
  });

  it('should pass data in onRenderMonth', (done) => {
    const renderCallback = (node, response, args) => {
      expect(node.is('div')).toEqual(true);
      expect(args.month).toEqual(10);
      expect(args.year).toEqual(2018);
      response(events, eventTypes);

      expect(document.querySelectorAll('.calendar-event-title').length).toEqual(18);
      expect(calendarObj.settings.events[12].subject).toEqual('Long Weekend');
      expect(calendarObj.settings.events[12].id).toEqual('13');
      done();
    };

    const newSettings = {
      eventTypes,
      events,
      month: 10,
      year: 2018,
      onRenderMonth: renderCallback
    };

    calendarObj.destroy();
    calendarObj = new Calendar(calendarEl, newSettings);
  });

  it('should update when calling updated and passing settings in ', () => {
    const updatedSettings = {
      month: 5,
      year: 2019,
      // locale: 'da-DK',
      events,
      eventTypes
    };
    calendarObj.updated(updatedSettings);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Jun 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('Sat');
    expect(document.querySelectorAll('.calendar-event').length).toEqual(11);
  });

  it.skip('Should update locale when passing settings in ', () => {
    const updatedSettings = {
      month: 5,
      year: 2019,
      locale: 'da-DK',
      events,
      eventTypes
    };
    calendarObj.updated(updatedSettings);

    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('man');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('søn');
    expect(document.querySelectorAll('.calendar-event').length).toEqual(3);
    expect(Locale.currentLocale.name).toEqual('en-US');
  });

  it('should update when calling updated and setting setting ', () => {
    Locale.set('en-US');
    calendarObj.destroy();
    calendarObj = new Calendar(calendarEl, { month: 1, year: 2019 });
    calendarObj.settings.month = 5;
    calendarObj.settings.year = 2019;
    calendarObj.settings.events = events;
    calendarObj.settings.eventTypes = eventTypes;
    calendarObj.updated();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Jun 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('Sat');
    expect(document.querySelectorAll('.day-container .calendar-event').length).toEqual(3);
  });
});
