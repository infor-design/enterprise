import { Calendar } from '../../../src/components/calendar/calendar';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/da-DK.js');

const calendarHTML = require('../../../app/views/components/calendar/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
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
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', calendarHTML);
    calendarEl = document.body.querySelector('.calendar');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP'], Soho.Locale.languages['ja']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE'], Soho.Locale.languages['sv']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('de-DE', Soho.Locale.cultures['de-DE'], Soho.Locale.languages['de']); //eslint-disable-line
    Locale.addCulture('da-DK', Soho.Locale.cultures['da-DK'], Soho.Locale.languages['da']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    jasmine.clock().install();
    baseTime = new Date(2018, 10, 10);
    jasmine.clock().mockDate(baseTime);
    calendarObj = new Calendar(calendarEl, settings);
  });

  afterEach(() => {
    calendarObj.destroy();
    cleanup();

    jasmine.clock().uninstall();
  });

  it('Should render calendar', () => {
    expect(calendarObj).toEqual(jasmine.any(Object));
    expect(document.body.querySelector('.monthview-table')).toBeTruthy();
    expect(document.body.querySelectorAll('.monthview-table td').length).toEqual(42);
  });

  it('Should render header', () => {
    expect(calendarObj).toEqual(jasmine.any(Object));
    expect(document.body.querySelector('.monthview-header .next')).toBeTruthy();
    expect(document.body.querySelector('.monthview-header .prev')).toBeTruthy();
  });

  it('Should optionaly not render view changer', () => {
    calendarObj.destroy();
    settings.showViewChanger = false;
    calendarObj = new Calendar(calendarEl, settings);

    expect(document.body.querySelector('#calendar-view-changer')).toBeFalsy();
  });

  it('Should be able to destroy', () => {
    calendarObj.destroy();

    expect($(calendarEl).data('calendar')).toBeFalsy();
  });

  it('Should render based on locale setting', () => {
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

  it('Should render upcoming dates', () => {
    calendarObj.destroy();
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

  it('Should handle adding events', () => {
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

  it('Should handle adding events off the month', () => {
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

  it('Should handle adding events in iso format', () => {
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

  it('Should handle clearing events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);

    calendarObj.clearEvents();

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(0);
  });

  it('Should handle deleting events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);

    calendarObj.deleteEvent({ id: '13' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(25);

    calendarObj.deleteEvent({ id: '11' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(4);
  });

  it('Should handle updating events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);

    calendarObj.updateEvent({ id: '13', subject: 'Updated Subject' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(26);
    expect(calendarObj.settings.events[12].subject).toEqual('Updated Subject');
    expect(calendarObj.settings.events[12].id).toEqual('13');
  });

  it('Should pass data in onRenderMonth', (done) => {
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

  it('Should update when calling updated and passing settings in ', () => {
    const updatedSettings = {
      month: 5,
      year: 2019,
      // locale: 'da-DK',
      events,
      eventTypes
    };
    calendarObj.updated(updatedSettings);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('June 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('Sat');
    expect(document.querySelectorAll('.calendar-event').length).toEqual(11);
  });

  it('Should update locale when passing settings in ', () => {
    const updatedSettings = {
      month: 5,
      year: 2019,
      locale: 'da-DK',
      events,
      eventTypes
    };
    calendarObj.updated(updatedSettings);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('juni 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('man');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('søn');
    expect(document.querySelectorAll('.calendar-event').length).toEqual(3);
    expect(Locale.currentLocale.name).toEqual('en-US');
  });

  it('Should update when calling updated and setting setting ', () => {
    calendarObj.destroy();
    calendarObj = new Calendar(calendarEl, { month: 1, year: 2019 });
    calendarObj.settings.month = 5;
    calendarObj.settings.year = 2019;
    calendarObj.settings.events = events;
    calendarObj.settings.eventTypes = eventTypes;
    calendarObj.updated();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('June 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('Sat');
    expect(document.querySelectorAll('.calendar-event').length).toEqual(3);
  });
});
